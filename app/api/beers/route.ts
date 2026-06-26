import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await turso.execute("SELECT * FROM beers ORDER BY name");
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const { name, count, color, percentage, type, imageUrl } = await req.json();
  const id = crypto.randomUUID();
  await turso.execute({
    sql: "INSERT INTO beers (id, name, count, color, percentage, type, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [id, name, count ?? 0, color ?? null, percentage ?? 0, type, imageUrl ?? ""],
  });
  return NextResponse.json({ id }, { status: 201 });
}
