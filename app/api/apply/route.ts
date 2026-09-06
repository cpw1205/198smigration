import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") ?? "";

    // 모든 신청 요청의 IP / User-Agent 기록
    const { error: logError } = await supabaseAdmin
      .from("application_request_logs")
      .insert([
        {
          ip_address: ip,
          user_agent: userAgent.slice(0, 500),
          request_path: "/api/apply",
        },
      ]);

    if (logError) {
      console.error("Request log error:", logError);
    }

    // 기존 Rate Limit
    const { data: rateAllowed, error: rateError } = await supabaseAdmin.rpc(
      "check_application_rate_limit",
      {
        p_key: `application:${ip}`,
        p_limit: 10,
        p_window_seconds: 600,
      }
    );

    if (rateError) {
      console.error("Rate limit error:", rateError);

      return NextResponse.json(
        { error: "Unable to process request." },
        { status: 500 }
      );
    }

    if (rateAllowed !== true) {
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

    if (!name || name.length > 40) {
      return NextResponse.json(
        { error: "Invalid name." },
        { status: 400 }
      );
    }

    if (!/^\d{1,4}$/.test(server)) {
      return NextResponse.json(
        { error: "Invalid server number." },
        { status: 400 }
      );
    }

    if (!power || power.length > 30) {
      return NextResponse.json(
        { error: "Invalid power." },
        { status: 400 }
      );
    }

    if (alliance.length > 30) {
      return NextResponse.json(
        { error: "Invalid alliance." },
        { status: 400 }
      );
    }

    if (!VALID_GRADES.includes(migrationGrade)) {
      return NextResponse.json(
        { error: "Invalid migration grade." },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("applications")
      .insert([
        {
          name,
          server,
          power,
          alliance,
          migration_grade: migrationGrade,
          message,
          t10,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        { error: "Failed to submit application." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Application API error:", error);

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
