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

type RequestBody = {
  password?: string;
  project?: Partial<ProjectPayload>;
};

const requiredStringFields: Array<keyof ProjectPayload> = [
  "slug",
  "title",
  "category",
  "description",
  "overview",
  "problemSolved",
  "role",
  "result",
  "githubUrl"
];

const requiredArrayFields: Array<keyof ProjectPayload> = [
  "highlights",
  "techStack",
  "toolsUsed",
  "technicalWork"
];

function isValidString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidStringArray(value: unknown) {
  return (
    Array.isArray(value) &&
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

    const project = body.project;

    if (!project) {
      return NextResponse.json(
        { error: "Missing project payload." },
        { status: 400 }
      );
    }

    for (const field of requiredStringFields) {
      if (!isValidString(project[field])) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    for (const field of requiredArrayFields) {
      if (!isValidStringArray(project[field])) {
        return NextResponse.json(
          { error: `Missing or invalid array field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (typeof project.sortOrder !== "number" || project.sortOrder < 1) {
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

    const documentationUrl =
      typeof project.documentationUrl === "string" &&
      project.documentationUrl.trim().length > 0
        ? project.documentationUrl.trim()
        : null;

    const { error } = await supabase
      .from("projects")
      .upsert(
        {
          slug: project.slug!.trim(),
          title: project.title!.trim(),
          category: project.category!.trim(),
          description: project.description!.trim(),
          highlights: project.highlights!,
          tech_stack: project.techStack!,
          overview: project.overview!.trim(),
          problem_solved: project.problemSolved!.trim(),
          role: project.role!.trim(),
          tools_used: project.toolsUsed!,
          technical_work: project.technicalWork!,
          result: project.result!.trim(),
          github_url: project.githubUrl!.trim(),
          documentation_url: documentationUrl,
          sort_order: project.sortOrder
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
      message: "Project updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating project." },
      { status: 500 }
    );
  }
}
