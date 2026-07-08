import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SkillCategoryPayload = {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  sortOrder: number;
};

type RequestBody = {
  password?: string;
  skillCategory?: Partial<SkillCategoryPayload>;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

    if (!isNonEmptyStringArray(skills)) {
      return NextResponse.json(
        { error: "Missing or invalid array field: skills" },
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
      .from("skill_categories")
      .upsert(
        {
          slug: slug.trim(),
          title: title.trim(),
          description: description.trim(),
          skills: skills.map((skill) => skill.trim()),
          sort_order: sortOrder
        },
        {
          onConflict: "slug"
        }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
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
