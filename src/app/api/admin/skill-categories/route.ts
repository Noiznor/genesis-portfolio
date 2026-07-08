import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SkillCategoryPayload = {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  sortOrder: number;
};

type SaveRequestBody = {
  password?: string;
  skillCategory?: Partial<SkillCategoryPayload>;
};

type DeleteRequestBody = {
  password?: string;
  slug?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

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

export async function POST(request: Request) {
  try {
    const config = getAdminConfig();

    if (!config) {
      return NextResponse.json(
        { error: "Server admin environment variables are not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as SaveRequestBody;

    if (!body.password || body.password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    const skillCategory = body.skillCategory;

    if (!skillCategory) {
      return NextResponse.json(
        { error: "Missing skill category payload." },
        { status: 400 }
      );
    }

    const { slug, title, description, skills, sortOrder } = skillCategory;

    if (!isNonEmptyString(slug)) {
      return NextResponse.json(
        { error: "Missing or invalid field: slug" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(title)) {
      return NextResponse.json(
        { error: "Missing or invalid field: title" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(description)) {
      return NextResponse.json(
        { error: "Missing or invalid field: description" },
        { status: 400 }
      );
    }

    if (!isStringArray(skills)) {
      return NextResponse.json(
        { error: "Missing or invalid field: skills" },
        { status: 400 }
      );
    }

    if (typeof sortOrder !== "number" || sortOrder < 1) {
      return NextResponse.json(
        { error: "Missing or invalid field: sortOrder" },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase
      .from("skill_categories")
      .upsert(
        {
          slug: slug.trim(),
          title: title.trim(),
          description: description.trim(),
          skills: skills.map((skill) => skill.trim()).filter(Boolean),
          sort_order: sortOrder
        },
        {
          onConflict: "slug"
        }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Skill category updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating skill category." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const config = getAdminConfig();

    if (!config) {
      return NextResponse.json(
        { error: "Server admin environment variables are not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as DeleteRequestBody;

    if (!body.password || body.password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (!isNonEmptyString(body.slug)) {
      return NextResponse.json(
        { error: "Missing or invalid skill category slug." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase
      .from("skill_categories")
      .delete()
      .eq("slug", body.slug.trim());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Skill category deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting skill category." },
      { status: 500 }
    );
  }
}
