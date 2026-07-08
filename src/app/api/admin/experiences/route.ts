import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type ExperiencePayload = {
  slug: string;
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  sortOrder: number;
};

type SaveRequestBody = {
  password?: string;
  experience?: Partial<ExperiencePayload>;
};

type DeleteRequestBody = {
  password?: string;
  slug?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
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

    const experience = body.experience;

    if (!experience) {
      return NextResponse.json(
        { error: "Missing experience payload." },
        { status: 400 }
      );
    }

    const {
      slug,
      title,
      organization,
      location,
      period,
      description,
      highlights,
      sortOrder
    } = experience;

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

    if (!isNonEmptyString(organization)) {
      return NextResponse.json(
        { error: "Missing or invalid field: organization" },
        { status: 400 }
      );
    }

    if (!isString(location)) {
      return NextResponse.json(
        { error: "Missing or invalid field: location" },
        { status: 400 }
      );
    }

    if (!isString(period)) {
      return NextResponse.json(
        { error: "Missing or invalid field: period" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(description)) {
      return NextResponse.json(
        { error: "Missing or invalid field: description" },
        { status: 400 }
      );
    }

    if (!isStringArray(highlights)) {
      return NextResponse.json(
        { error: "Missing or invalid field: highlights" },
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
      .from("experiences")
      .upsert(
        {
          slug: slug.trim(),
          title: title.trim(),
          organization: organization.trim(),
          location: location.trim().length > 0 ? location.trim() : null,
          period: period.trim().length > 0 ? period.trim() : null,
          description: description.trim(),
          highlights: highlights.map((highlight) => highlight.trim()).filter(Boolean),
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
      message: "Experience updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating experience." },
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
        { error: "Missing or invalid experience slug." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase
      .from("experiences")
      .delete()
      .eq("slug", body.slug.trim());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Experience deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting experience." },
      { status: 500 }
    );
  }
}
