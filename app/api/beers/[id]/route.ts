import { assertAdmin } from "@/lib/auth";
import { turso } from "@/lib/turso";
import { InValue } from "@libsql/client";
import { NextResponse } from "next/server";

const ALLOWED_COLUMNS = new Set(["name", "count", "color", "percentage", "type", "imageUrl", "description", "brewery", "country"]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const sets: string[] = [];
  const args: InValue[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_COLUMNS.has(key)) continue;
    sets.push(`${key} = ?`);
    args.push(value as InValue);
  }
  if (sets.length === 0) return NextResponse.json({ ok: false }, { status: 400 });
  args.push(id);

  await turso.execute({
    sql: `UPDATE beers SET ${sets.join(", ")} WHERE id = ?`,
    args,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await params;
  await turso.execute({ sql: "DELETE FROM beers WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
