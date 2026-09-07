import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const VALID_GRADES = ["Elite", "Advanced", "Medium", "Regular"];

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

function verifyFormToken(token: string, ip: string) {
  try {
    const parts = token.split(".");

    if (parts.length !== 4) {
      return false;
    }

    const [tokenIpEncoded, timestampText, nonce, signature] = parts;

    const tokenIp = Buffer.from(tokenIpEncoded, "base64url").toString("utf8");
    const timestamp = Number(timestampText);

    if (!tokenIp || !Number.isFinite(timestamp) || !nonce || !signature) {
      return false;
    }

    if (tokenIp !== ip) {
      return false;
    }

    const age = Date.now() - timestamp;

    // Must spend at least 2 seconds on the form.
    if (age < 2000) {
      return false;
    }

    // Token expires after 30 minutes.
    if (age > 30 * 60 * 1000) {
      return false;
    }

    const payload = `${tokenIpEncoded}.${timestampText}.${nonce}`;
    const expectedSignature = signTokenPayload(payload);

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(signature, "hex");

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

function isAllowedBrowserRequest(req: Request) {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const secFetchSite = req.headers.get("sec-fetch-site");

  const allowedHosts = new Set([
    "www.198migration.com",
    "198migration.com",
  ]);

  if (secFetchSite && secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return false;
  }

  if (origin) {
    try {
      const host = new URL(origin).hostname;
      if (!allowedHosts.has(host)) {
        return false;
      }
    } catch {
      return false;
    }
  } else if (referer) {
    try {
      const host = new URL(referer).hostname;
      if (!allowedHosts.has(host)) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") ?? "";

    console.log("APPLICATION REQUEST IP:", ip);

    // Request log
    const { data: logData, error: logError } = await supabaseAdmin
      .from("application_request_logs")
      .insert({
        ip_address: ip,
        user_agent: userAgent.slice(0, 500),
        request_path: "/api/apply",
      })
      .select("id, ip_address")
      .single();

    if (logError) {
      console.error("REQUEST LOG INSERT FAILED:", {
        message: logError.message,
        details: logError.details,
        hint: logError.hint,
        code: logError.code,
      });
    } else {
      console.log("REQUEST LOG SAVED:", logData);
    }

    // Basic browser-origin check
    if (!isAllowedBrowserRequest(req)) {
      console.log("REQUEST ORIGIN BLOCKED:", ip);

      return NextResponse.json(
        { error: "Invalid request." },
        { status: 403 }
      );
    }

    // Rate Limit: same IP, max 10 requests per 10 minutes
    const { data: rateAllowed, error: rateError } = await supabaseAdmin.rpc(
      "check_application_rate_limit",
      {
        p_key: `application:${ip}`,
        p_limit: 10,
        p_window_seconds: 600,
      }
    );

    if (rateError) {
      console.error("RATE LIMIT ERROR:", rateError);

      return NextResponse.json(
        { error: "Unable to process request." },
        { status: 500 }
      );
    }

    if (rateAllowed !== true) {
      console.log("RATE LIMITED IP:", ip);

      return NextResponse.json(
        {
          error:
            "Too many applications. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const server =
      typeof body.server === "string" ? body.server.trim() : "";

    const power =
      typeof body.power === "string" ? body.power.trim() : "";

    const alliance =
      typeof body.alliance === "string" ? body.alliance.trim() : "";

    const migrationGrade =
      typeof body.migration_grade === "string"
        ? body.migration_grade.trim()
        : "";

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const t10 = body.t10 === true;

    const formToken =
      typeof body.form_token === "string" ? body.form_token.trim() : "";

    const website =
      typeof body.website === "string" ? body.website.trim() : "";

    // Honeypot: humans never fill this.
    if (website) {
      console.log("HONEYPOT BLOCKED:", {
        ip,
        website: website.slice(0, 100),
      });

      return NextResponse.json(
        { error: "Invalid application." },
        { status: 400 }
      );
    }

    // Signed form token: blocks direct POSTs that did not load the real form.
    if (!formToken || !verifyFormToken(formToken, ip)) {
      console.log("FORM TOKEN BLOCKED:", ip);

      return NextResponse.json(
        { error: "Invalid application." },
        { status: 403 }
      );
    }

    // Name validation
    if (!name || name.length > 40) {
      return NextResponse.json(
        { error: "Invalid name." },
        { status: 400 }
      );
    }

    // Known spam-name format:
    // Apex_522539744 / Titan_650481461 / Frost_684445496
    const spamNamePattern = /^[A-Za-z]+_[0-9]{6,12}$/;

    if (spamNamePattern.test(name)) {
      console.log("SPAM NAME BLOCKED:", {
        ip,
        name,
      });

      return NextResponse.json(
        { error: "Invalid application." },
        { status: 400 }
      );
    }

    // Server range: 194 ~ 256 only
    const serverNumber = Number(server);

    if (
      !/^\d{3}$/.test(server) ||
      !Number.isInteger(serverNumber) ||
      serverNumber < 194 ||
      serverNumber > 256
    ) {
      console.log("INVALID SERVER BLOCKED:", {
        ip,
        server,
      });

      return NextResponse.json(
        { error: "Server must be between 194 and 256." },
        { status: 400 }
      );
    }

    // 1st Army Power
    if (!power || power.length > 30) {
      return NextResponse.json(
        { error: "Invalid power." },
        { status: 400 }
      );
    }

    // Alliance
    if (alliance.length > 30) {
      return NextResponse.json(
        { error: "Invalid alliance." },
        { status: 400 }
      );
    }

    // Migration grade
    if (!VALID_GRADES.includes(migrationGrade)) {
      return NextResponse.json(
        { error: "Invalid migration grade." },
        { status: 400 }
      );
    }

    // Message
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    // Save only validated applications
    const { error: applicationError } = await supabaseAdmin
      .from("applications")
      .insert({
        name,
        server,
        power,
        alliance,
        migration_grade: migrationGrade,
        message,
        t10,
      });

    if (applicationError) {
      console.error("APPLICATION INSERT ERROR:", applicationError);

      return NextResponse.json(
        { error: "Failed to submit application." },
        { status: 500 }
      );
    }

    console.log("APPLICATION SAVED FROM IP:", ip);

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("APPLICATION API ERROR:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
