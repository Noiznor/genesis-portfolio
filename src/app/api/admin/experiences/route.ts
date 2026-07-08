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

type RequestBody = {
  password?: string;
  experience?: Partial<ExperiencePayload>;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!supabaseUrl || !serviceRoleKey || !adminPassword) {
      return NextResponse.json(
        { error: "Server admin environment variables are not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (!body.password || body.password !== adminPassword) {
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

    if (!isNonEmptyStringArray(highlights)) {
      return NextResponse.json(
        { error: "Missing or invalid array field: highlights" },
        { status: 400 }
      );
    }

    if (typeof sortOrder !== "number" || sortOrder < 1) {
      return NextResponse.json(
        { error: "Missing or invalid field: sortOrder" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

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
          highlights: highlights.map((highlight) => highlight.trim()),
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
