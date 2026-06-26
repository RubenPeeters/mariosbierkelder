import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const beerId = searchParams.get("beerId");

  if (beerId) {
    const [aggResult, reviewsResult] = await Promise.all([
      turso.execute({
        sql: "SELECT ROUND(AVG(score), 1) as avg, COUNT(*) as total FROM ratings WHERE beer_id = ?",
        args: [beerId],
      }),
      turso.execute({
        sql: "SELECT reviewer_name, review_text, score, created_at FROM ratings WHERE beer_id = ? AND review_text IS NOT NULL AND review_text != '' ORDER BY created_at DESC LIMIT 20",
        args: [beerId],
      }),
    ]);
    return NextResponse.json({
      ...aggResult.rows[0],
      reviews: reviewsResult.rows,
    });
  }

  const result = await turso.execute(
    "SELECT beer_id, ROUND(AVG(score), 1) as avg, COUNT(*) as total FROM ratings GROUP BY beer_id"
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const { beerId, score, reviewerName, reviewText, mathAnswer, mathExpected } = await req.json();
  if (!beerId || !score || score < 1 || score > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }
  if (mathAnswer !== mathExpected) {
    return NextResponse.json({ error: "Wrong answer" }, { status: 400 });
  }
  const id = crypto.randomUUID();
  await turso.execute({
    sql: "INSERT INTO ratings (id, beer_id, score, reviewer_name, review_text) VALUES (?, ?, ?, ?, ?)",
    args: [id, beerId, score, reviewerName || null, reviewText || null],
  });
  return NextResponse.json({ id }, { status: 201 });
}
