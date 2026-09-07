import { NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function signTokenPayload(payload: string) {
  return createHmac("sha256", serviceRoleKey)
    .update(payload)
    .digest("hex");
}

export async function GET(req: Request) {
  try {
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const ip = getClientIp(req);
    const timestamp = Date.now().toString();
    const nonce = randomBytes(16).toString("hex");
    const ipEncoded = Buffer.from(ip, "utf8").toString("base64url");

    const payload = `${ipEncoded}.${timestamp}.${nonce}`;
    const signature = signTokenPayload(payload);

    const token = `${payload}.${signature}`;

    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("FORM TOKEN API ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create form token." },
      { status: 500 }
    );
  }
}
