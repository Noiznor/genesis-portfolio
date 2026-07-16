import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const BUCKET_NAME = "portfolio-gallery";
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const allowedVideoMimeTypes = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime"
]);

type RequestBody = {
  password?: string;
  groupSlug?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
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
  const extension = fileName.split(".").pop()?.toLowerCase() || "bin";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "gallery-media"}.${extension}`;
}

function sanitizeSlug(value: string | undefined) {
  return value && value.trim()
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80)
    : "gallery";
}

function getMediaType(fileType: string) {
  if (allowedImageMimeTypes.has(fileType)) return "image";
  if (allowedVideoMimeTypes.has(fileType)) return "video";
  return null;
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

    const body = (await request.json()) as RequestBody;

    if (!body.password || body.password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (!body.fileName || !body.fileType || typeof body.fileSize !== "number") {
      return NextResponse.json(
        { error: "Missing file metadata." },
        { status: 400 }
      );
    }

    const mediaType = getMediaType(body.fileType);

    if (!mediaType) {
      return NextResponse.json(
        { error: "Unsupported media type. Use JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV." },
        { status: 400 }
      );
    }

    const maxSize = mediaType === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (body.fileSize > maxSize) {
      return NextResponse.json(
        {
          error:
            mediaType === "video"
              ? "Video is too large. Maximum size is 100 MB."
              : "Image is too large. Maximum size is 20 MB."
        },
        { status: 400 }
      );
    }

    const safeGroupSlug = sanitizeSlug(body.groupSlug);
    const safeFileName = sanitizeFileName(body.fileName);
    const uniquePart = `${Date.now()}-${crypto.randomUUID()}`;
    const mediaFolder = mediaType === "video" ? "videos" : "images";
    const storagePath = `${safeGroupSlug}/${mediaFolder}/${uniquePart}-${safeFileName}`;

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(storagePath);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to create signed upload URL." },
        { status: 500 }
      );
    }

    const publicUrl = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath).data.publicUrl;

    return NextResponse.json({
      path: storagePath,
      token: data.token,
      publicUrl,
      mediaType
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while creating gallery upload token." },
      { status: 500 }
    );
  }
}
