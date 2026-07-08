import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type CertificationPayload = {
  slug: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  certificateImageUrl: string;
  description: string;
  sortOrder: number;
};

type SaveRequestBody = {
  password?: string;
  certification?: Partial<CertificationPayload>;
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

    const certification = body.certification;

    if (!certification) {
      return NextResponse.json(
        { error: "Missing certification payload." },
        { status: 400 }
      );
    }

    const {
      slug,
      title,
      issuer,
      issueDate,
      credentialId,
      credentialUrl,
      certificateImageUrl,
      description,
      sortOrder
    } = certification;

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

    if (!isNonEmptyString(issuer)) {
      return NextResponse.json(
        { error: "Missing or invalid field: issuer" },
        { status: 400 }
      );
    }

    if (!isString(issueDate)) {
      return NextResponse.json(
        { error: "Missing or invalid field: issueDate" },
        { status: 400 }
      );
    }

    if (!isString(credentialId)) {
      return NextResponse.json(
        { error: "Missing or invalid field: credentialId" },
        { status: 400 }
      );
    }

    if (!isString(credentialUrl)) {
      return NextResponse.json(
        { error: "Missing or invalid field: credentialUrl" },
        { status: 400 }
      );
    }

    if (!isString(certificateImageUrl)) {
      return NextResponse.json(
        { error: "Missing or invalid field: certificateImageUrl" },
        { status: 400 }
      );
    }

    if (!isNonEmptyString(description)) {
      return NextResponse.json(
        { error: "Missing or invalid field: description" },
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
      .from("certifications")
      .upsert(
        {
          slug: slug.trim(),
          title: title.trim(),
          issuer: issuer.trim(),
          issue_date: issueDate.trim().length > 0 ? issueDate.trim() : null,
          credential_id:
            credentialId.trim().length > 0 ? credentialId.trim() : null,
          credential_url:
            credentialUrl.trim().length > 0 ? credentialUrl.trim() : null,
          certificate_image_url:
            certificateImageUrl.trim().length > 0
              ? certificateImageUrl.trim()
              : null,
          description: description.trim(),
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
      message: "Certification updated successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while updating certification." },
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
        { error: "Missing or invalid certification slug." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase
      .from("certifications")
      .delete()
      .eq("slug", body.slug.trim());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Certification deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting certification." },
      { status: 500 }
    );
  }
}
