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
  const extension = fileName.split(".").pop()?.toLowerCase() || "bin";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "gallery-media"}.${extension}`;
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

function getMediaType(fileType: string): "image" | "video" | null {
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

    const formData = await request.formData();

    const password = formData.get("password");
    const groupSlug = formData.get("groupSlug");
    const file = formData.get("file");

    if (typeof password !== "string" || password !== config.adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized admin request." },
        { status: 401 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing gallery media file." },
        { status: 400 }
      );
    }

    const mediaType = getMediaType(file.type);

    if (!mediaType) {
      return NextResponse.json(
        { error: "Unsupported media type. Use JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV." },
        { status: 400 }
      );
    }

    const maxSize = mediaType === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
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

    const safeGroupSlug =
      typeof groupSlug === "string" && groupSlug.trim()
        ? groupSlug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 80)
        : "gallery";

    const supabase = createAdminSupabaseClient(
      config.supabaseUrl,
      config.serviceRoleKey
    );

    const safeFileName = sanitizeFileName(file.name);
    const uniquePart = `${Date.now()}-${crypto.randomUUID()}`;
    const mediaFolder = mediaType === "video" ? "videos" : "images";
    const storagePath = `${safeGroupSlug}/${mediaFolder}/${uniquePart}-${safeFileName}`;

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
      message: "Gallery media uploaded successfully.",
      path: storagePath,
      publicUrl: data.publicUrl,
      mediaType
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while uploading gallery media." },
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
        { error: "Missing gallery media storage path or public URL." },
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
      message: "Gallery media deleted successfully."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while deleting gallery media." },
      { status: 500 }
    );
  }
}
