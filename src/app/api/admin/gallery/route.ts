import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET_NAME = "portfolio-gallery";

type GalleryItemPayload = {
  id?: string;
  imageUrl: string;
  imagePath?: string;
  caption?: string;
};

type GalleryGroupPayload = {
  id: string;
  title: string;
  description: string;
  items: GalleryItemPayload[];
};

type RequestBody = {
  password?: string;
  galleryGroups?: GalleryGroupPayload[];
};

type ExistingGroup = {
  id: string;
  slug: string;
};

type ExistingItem = {
  group_id: string;
  image_path: string | null;
};

function getAdminConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !serviceRoleKey || !adminPassword) {
    return null;
  }

  return {
    supabaseUrl,
    serviceRoleKey,
    adminPassword
  };
}

function createAdminSupabaseClient(supabaseUrl: string, serviceRoleKey: string) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeGroup(group: GalleryGroupPayload, index: number) {
  const fallbackSlug = `gallery-highlight-${index + 1}`;
  const slug = slugify(group.id || group.title || fallbackSlug) || fallbackSlug;

  return {
    slug,
    title: group.title.trim(),
    description: group.description.trim(),
    items: Array.isArray(group.items) ? group.items : []
  };
}

export async function POST(request: Request) {
  try {
    const config = getAdminConfig();

    if (!config) {
      return NextResponse.json(
        { error: "Server admin environment variables are not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (!body.password || body.password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (!Array.isArray(body.galleryGroups)) {
      return NextResponse.json(
        { error: "Missing gallery groups payload." },
        { status: 400 }
      );
    }

    const normalizedGroups = body.galleryGroups.map(normalizeGroup);

    const invalidGroup = normalizedGroups.find((group) => !group.title);

    if (invalidGroup) {
      return NextResponse.json(
        { error: "Each gallery group needs a title." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { data: existingGroupsData, error: existingGroupsError } =
      await supabase.from("gallery_groups").select("id,slug");

    if (existingGroupsError) {
      return NextResponse.json(
        { error: existingGroupsError.message },
        { status: 500 }
      );
    }

    const existingGroups = (existingGroupsData ?? []) as ExistingGroup[];
    const incomingSlugs = new Set(normalizedGroups.map((group) => group.slug));
    const removedGroups = existingGroups.filter(
      (group) => !incomingSlugs.has(group.slug)
    );

    if (removedGroups.length > 0) {
      const removedGroupIds = removedGroups.map((group) => group.id);

      const { data: removedItemsData } = await supabase
        .from("gallery_items")
        .select("group_id,image_path")
        .in("group_id", removedGroupIds);

      const removedPaths = ((removedItemsData ?? []) as ExistingItem[])
        .map((item) => item.image_path)
        .filter((path): path is string => Boolean(path));

      if (removedPaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(removedPaths);
      }

      const { error: deleteGroupsError } = await supabase
        .from("gallery_groups")
        .delete()
        .in("id", removedGroupIds);

      if (deleteGroupsError) {
        return NextResponse.json(
          { error: deleteGroupsError.message },
          { status: 500 }
        );
      }
    }

    const savedGroups: ExistingGroup[] = [];

    for (const [index, group] of normalizedGroups.entries()) {
      const { data: savedGroup, error: groupError } = await supabase
        .from("gallery_groups")
        .upsert(
          {
            slug: group.slug,
            title: group.title,
            description: group.description,
            sort_order: index + 1,
            updated_at: new Date().toISOString()
          },
          { onConflict: "slug" }
        )
        .select("id,slug")
        .single();

      if (groupError || !savedGroup) {
        return NextResponse.json(
          { error: groupError?.message || "Failed to save gallery group." },
          { status: 500 }
        );
      }

      savedGroups.push(savedGroup as ExistingGroup);
    }

    for (const [groupIndex, group] of normalizedGroups.entries()) {
      const savedGroup = savedGroups[groupIndex];

      const { data: existingItemsData } = await supabase
        .from("gallery_items")
        .select("group_id,image_path")
        .eq("group_id", savedGroup.id);

      const incomingPaths = new Set(
        group.items
          .map((item) => item.imagePath?.trim())
          .filter((path): path is string => Boolean(path))
      );

      const deletedItemPaths = ((existingItemsData ?? []) as ExistingItem[])
        .map((item) => item.image_path)
        .filter((path): path is string => Boolean(path))
        .filter((path) => !incomingPaths.has(path));

      if (deletedItemPaths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(deletedItemPaths);
      }

      const { error: deleteItemsError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("group_id", savedGroup.id);

      if (deleteItemsError) {
        return NextResponse.json(
          { error: deleteItemsError.message },
          { status: 500 }
        );
      }

      const validItems = group.items
        .map((item, itemIndex) => ({
          group_id: savedGroup.id,
          image_url: item.imageUrl.trim(),
          image_path: item.imagePath?.trim() || null,
          caption: item.caption?.trim() ?? "",
          sort_order: itemIndex + 1,
          updated_at: new Date().toISOString()
        }))
        .filter((item) => item.image_url.length > 0);

      if (validItems.length > 0) {
        const { error: insertItemsError } = await supabase
          .from("gallery_items")
          .insert(validItems);

        if (insertItemsError) {
          return NextResponse.json(
            { error: insertItemsError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      message: "Gallery saved successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while saving gallery." },
      { status: 500 }
    );
  }
}
