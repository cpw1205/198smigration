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
      console.error("Missing Supabase environment variables");

      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const ip = getClientIp(req);
    const userAgent = req.headers.get("user-agent") ?? "";

    console.log("APPLICATION REQUEST IP:", ip);

    // 요청 로그 저장
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

    // Rate Limit
    // 같은 IP에서 10분 동안 최대 10회
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

    // -----------------------------
    // 닉네임 검증
    // -----------------------------
    if (!name || name.length > 40) {
      return NextResponse.json(
        { error: "Invalid name." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 스팸 닉네임 패턴 차단
    // 예:
    // Apex_522539744
    // Titan_650481461
    // Frost_684445496
    // -----------------------------
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

    // -----------------------------
    // 서버 번호 검증
    // 신청 가능 서버: 194 ~ 256
    // -----------------------------
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

    // -----------------------------
    // 1군 전투력 검증
    // -----------------------------
    if (!power || power.length > 30) {
      return NextResponse.json(
        { error: "Invalid power." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 연맹명 검증
    // -----------------------------
    if (alliance.length > 30) {
      return NextResponse.json(
        { error: "Invalid alliance." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 이민 등급 검증
    // -----------------------------
    if (!VALID_GRADES.includes(migrationGrade)) {
      return NextResponse.json(
        { error: "Invalid migration grade." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 자기소개 길이 검증
    // -----------------------------
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 }
      );
    }

    // -----------------------------
    // 정상 신청만 DB 저장
    // -----------------------------
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
