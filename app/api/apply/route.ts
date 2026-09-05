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

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
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

    // Name
    if (!name || name.length > 40) {
      return NextResponse.json(
        { error: "Invalid name." },
        { status: 400 }
      );
    }

    // Server number
    if (!/^\d{1,4}$/.test(server)) {
      return NextResponse.json(
        { error: "Invalid server number." },
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

    // Migration Grade
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
