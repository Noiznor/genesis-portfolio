import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET_NAME = "portfolio-documents";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type DeleteRequestBody = {
  password?: string;
  path?: string;
  publicUrl?: string;
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

function sanitizeFileName(fileName: string) {
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "resume"}.pdf`;
}

function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  const rawPath = publicUrl.slice(markerIndex + marker.length);
  const cleanPath = rawPath.split("?")[0];

  try {
    return decodeURIComponent(cleanPath);
  } catch {
    return cleanPath;
  }
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

    const formData = await request.formData();

    const password = formData.get("password");
    const file = formData.get("file");

    if (typeof password !== "string" || password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing resume PDF file." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume PDF is too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const safeFileName = sanitizeFileName(file.name);
    const uniquePart = `${Date.now()}-${crypto.randomUUID()}`;
    const storagePath = `resume/${uniquePart}-${safeFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: "application/pdf",
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    return NextResponse.json({
      message: "Resume uploaded successfully.",
      path: storagePath,
      publicUrl: data.publicUrl
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while uploading resume." },
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

    const storagePath =
      body.path?.trim() ||
      (body.publicUrl ? getStoragePathFromPublicUrl(body.publicUrl) : null);

    if (!storagePath) {
      return NextResponse.json(
        { error: "Missing resume storage path or public URL." },
        { status: 400 }
      );
    }

    if (!storagePath.startsWith("resume/")) {
      return NextResponse.json(
        { error: "Invalid resume storage path." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Resume deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting resume." },
      { status: 500 }
    );
  }
}
