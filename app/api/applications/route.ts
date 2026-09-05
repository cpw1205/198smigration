import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const password = req.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is missing on server" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: "Unauthorized", envLoaded: true },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
