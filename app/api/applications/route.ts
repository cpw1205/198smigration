import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.STORAGE_URL,
});

async function initTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      server TEXT NOT NULL,
      power TEXT NOT NULL,
      alliance TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function POST(req: Request) {
  await initTable();

  const body = await req.json();
  const { name, server, power, alliance, message } = body;

  await pool.query(
    `INSERT INTO applications (name, server, power, alliance, message)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, server, power, alliance, message]
  );

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const password = req.headers.get("x-admin-password");

  if (password !== process."1234") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await initTable();

  const result = await pool.query(
    `SELECT * FROM applications ORDER BY created_at DESC`
  );

  return NextResponse.json(result.rows);
}