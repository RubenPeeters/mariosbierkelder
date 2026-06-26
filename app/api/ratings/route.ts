import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const beerId = searchParams.get("beerId");

  if (beerId) {
    const result = await turso.execute({
      sql: "SELECT ROUND(AVG(score), 1) as avg, COUNT(*) as total FROM ratings WHERE beer_id = ?",
      args: [beerId],
    });
    return NextResponse.json(result.rows[0]);
  }

  const result = await turso.execute(
    "SELECT beer_id, ROUND(AVG(score), 1) as avg, COUNT(*) as total FROM ratings GROUP BY beer_id"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const { beerId, score } = await req.json();
  if (!beerId || !score || score < 1 || score > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }
  const id = crypto.randomUUID();
  await turso.execute({
    sql: "INSERT INTO ratings (id, beer_id, score) VALUES (?, ?, ?)",
    args: [id, beerId, score],
  });
  return NextResponse.json({ id }, { status: 201 });
}
