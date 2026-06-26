import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const sql = status
    ? "SELECT * FROM orders WHERE status = ? AND date(created_at) = date('now') ORDER BY created_at DESC"
    : "SELECT * FROM orders WHERE date(created_at) = date('now') ORDER BY created_at DESC";
  const args = status ? [status] : [];

  const result = await turso.execute({ sql, args });
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const { beerId } = await req.json();

  const beer = await turso.execute({ sql: "SELECT id, name, count FROM beers WHERE id = ?", args: [beerId] });
  if (beer.rows.length === 0) return NextResponse.json({ error: "Beer not found" }, { status: 404 });
  if (Number(beer.rows[0].count) <= 0) return NextResponse.json({ error: "Out of stock" }, { status: 400 });

  const id = crypto.randomUUID();
  await turso.execute({
    sql: "INSERT INTO orders (id, beer_id, beer_name, status) VALUES (?, ?, ?, 'pending')",
    args: [id, beerId, beer.rows[0].name as string],
  });
  return NextResponse.json({ id }, { status: 201 });
}
