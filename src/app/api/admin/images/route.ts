import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET_NAME = "portfolio-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const allowedFolders = new Set([
  "projects",
  "experiences",
  "certifications"
]);

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
  const extension = fileName.split(".").pop()?.toLowerCase() || "png";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "portfolio-image"}.${extension}`;
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
    const folder = formData.get("folder");
    const file = formData.get("file");

    if (typeof password !== "string" || password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (typeof folder !== "string" || !allowedFolders.has(folder)) {
      return NextResponse.json(
        { error: "Invalid upload folder." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing image file." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPG, PNG, WEBP, or GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image is too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const safeFileName = sanitizeFileName(file.name);
    const uniquePart = `${Date.now()}-${crypto.randomUUID()}`;
    const storagePath = `${folder}/${uniquePart}-${safeFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
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
      message: "Image uploaded successfully.",
      path: storagePath,
      publicUrl: data.publicUrl
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while uploading image." },
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
        { error: "Missing image storage path or public URL." },
        { status: 400 }
      );
    }

    const folder = storagePath.split("/")[0];

    if (!allowedFolders.has(folder)) {
      return NextResponse.json(
        { error: "Invalid image storage folder." },
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
      message: "Image deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting image." },
      { status: 500 }
    );
  }
}
