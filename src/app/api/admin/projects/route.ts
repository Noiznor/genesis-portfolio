import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type ProjectPayload = {
  slug: string;
  title: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  overview: string;
  problemSolved: string;
  role: string;
  toolsUsed: string[];
  technicalWork: string[];
  result: string;
  githubUrl: string;
  documentationUrl: string;
  sortOrder: number;
};

type SaveRequestBody = {
  password?: string;
  project?: Partial<ProjectPayload>;
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

    const project = body.project;

    if (!project) {
      return NextResponse.json(
        { error: "Missing project payload." },
        { status: 400 }
      );
    }

    const {
      slug,
      title,
      category,
      description,
      highlights,
      techStack,
      overview,
      problemSolved,
      role,
      toolsUsed,
      technicalWork,
      result,
      githubUrl,
      documentationUrl,
      sortOrder
    } = project;

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

    if (!isNonEmptyString(category)) {
      return NextResponse.json(
        { error: "Missing or invalid field: category" },
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

    if (!isStringArray(techStack)) {
      return NextResponse.json(
        { error: "Missing or invalid field: techStack" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(overview)) {
      return NextResponse.json(
        { error: "Missing or invalid field: overview" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(problemSolved)) {
      return NextResponse.json(
        { error: "Missing or invalid field: problemSolved" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(role)) {
      return NextResponse.json(
        { error: "Missing or invalid field: role" },
        { status: 400 }
      );
    }

    if (!isStringArray(toolsUsed)) {
      return NextResponse.json(
        { error: "Missing or invalid field: toolsUsed" },
        { status: 400 }
      );
    }

    if (!isStringArray(technicalWork)) {
      return NextResponse.json(
        { error: "Missing or invalid field: technicalWork" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(result)) {
      return NextResponse.json(
        { error: "Missing or invalid field: result" },
        { status: 400 }
      );
    }

    if (!isString(githubUrl)) {
      return NextResponse.json(
        { error: "Missing or invalid field: githubUrl" },
        { status: 400 }
      );
    }

    if (!isString(documentationUrl)) {
      return NextResponse.json(
        { error: "Missing or invalid field: documentationUrl" },
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
      .from("projects")
      .upsert(
        {
          slug: slug.trim(),
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          highlights,
          tech_stack: techStack,
          overview: overview.trim(),
          problem_solved: problemSolved.trim(),
          role: role.trim(),
          tools_used: toolsUsed,
          technical_work: technicalWork,
          result: result.trim(),
          github_url: githubUrl.trim(),
          documentation_url:
            documentationUrl.trim().length > 0
              ? documentationUrl.trim()
              : null,
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
      message: "Project updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating project." },
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
        { error: "Missing or invalid project slug." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("slug", body.slug.trim());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Project deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting project." },
      { status: 500 }
    );
  }
}
