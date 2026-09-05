import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const password = req.headers.get("x-admin-password")?.trim() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD?.trim() ?? "";

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is missing on server" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    let firstDifferentPosition = -1;

    const maxLength = Math.max(password.length, adminPassword.length);

    for (let i = 0; i < maxLength; i++) {
      if (password[i] !== adminPassword[i]) {
        firstDifferentPosition = i + 1;
        break;
      }
    }

    return NextResponse.json(
      {
        error: "Unauthorized",
        inputLength: password.length,
        serverLength: adminPassword.length,
        firstDifferentPosition,
      },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
