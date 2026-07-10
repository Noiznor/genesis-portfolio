import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SiteProfilePayload = {
  ownerName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutBody: string;
  email: string;
  location: string;
  resumePath: string;
  resumePdfUrl?: string;
  resumePdfPath?: string;
  personalGithub: string;
  sphrGithub: string;
  linkedin: string;
};

type RequestBody = {
  password?: string;
  siteProfile?: Partial<SiteProfilePayload>;
};

const requiredFields: Array<keyof SiteProfilePayload> = [
  "ownerName",
  "heroEyebrow",
  "heroTitle",
  "heroSubtitle",
  "heroDescription",
  "aboutTitle",
  "aboutBody",
  "email",
  "location",
  "resumePath",
  "personalGithub",
  "sphrGithub",
  "linkedin"
];

function isValidString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
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

    const profile = body.siteProfile;

    if (!profile) {
      return NextResponse.json(
        { error: "Missing site profile payload." },
        { status: 400 }
      );
    }

    for (const field of requiredFields) {
      if (!isValidString(profile[field])) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    const { error } = await supabase
      .from("site_profile")
      .upsert(
        {
          id: "main",
          owner_name: profile.ownerName!.trim(),
          hero_eyebrow: profile.heroEyebrow!.trim(),
          hero_title: profile.heroTitle!.trim(),
          hero_subtitle: profile.heroSubtitle!.trim(),
          hero_description: profile.heroDescription!.trim(),
          about_title: profile.aboutTitle!.trim(),
          about_body: profile.aboutBody!.trim(),
          email: profile.email!.trim(),
          location: profile.location!.trim(),
          resume_path: profile.resumePath!.trim(),
          resume_pdf_url: profile.resumePdfUrl?.trim() ?? "",
          resume_pdf_path: profile.resumePdfPath?.trim() ?? "",
          personal_github: profile.personalGithub!.trim(),
          sphr_github: profile.sphrGithub!.trim(),
          linkedin: profile.linkedin!.trim()
        },
        {
          onConflict: "id"
        }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Site profile updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating site profile." },
      { status: 500 }
    );
  }
}
