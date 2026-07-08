import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

type RequestBody = {
  password?: string;
};

function safeCompare(input: string, secret: string) {
  const inputBuffer = Buffer.from(input);
  const secretBuffer = Buffer.from(secret);

  if (inputBuffer.length !== secretBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, secretBuffer);
}

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD is not configured on the server." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (!body.password || !safeCompare(body.password, adminPassword)) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Password verified."
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error while verifying password." },
      { status: 500 }
    );
  }
}
