import { turso } from "@/lib/turso";
import { InValue } from "@libsql/client";
import { NextResponse } from "next/server";

const ALLOWED_COLUMNS = new Set(["name", "count", "color", "percentage", "type", "imageUrl"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const sets: string[] = [];
  const args: InValue[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_COLUMNS.has(key)) continue;
    sets.push(`${key} = ?`);
    args.push(value as InValue);
  }
  if (sets.length === 0) return NextResponse.json({ ok: false }, { status: 400 });
  args.push(params.id);

  await turso.execute({
    sql: `UPDATE beers SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await turso.execute({ sql: "DELETE FROM beers WHERE id = ?", args: [params.id] });
  return NextResponse.json({ ok: true });
}
