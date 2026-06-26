import { assertAdmin } from "@/lib/auth";
import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await assertAdmin();
  if (denied) return denied;

  const { id } = await params;
  const { status } = await req.json();
  if (status !== "confirmed" && status !== "rejected") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (status === "confirmed") {
    const order = await turso.execute({ sql: "SELECT beer_id FROM orders WHERE id = ? AND status = 'pending'", args: [id] });
    if (order.rows.length === 0) return NextResponse.json({ error: "Order not found or already resolved" }, { status: 404 });

    await turso.execute({ sql: "UPDATE beers SET count = MAX(0, count - 1) WHERE id = ?", args: [order.rows[0].beer_id] });
  }

  await turso.execute({
    sql: "UPDATE orders SET status = ?, resolved_at = datetime('now') WHERE id = ?",
    args: [status, id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await turso.execute({ sql: "DELETE FROM orders WHERE id = ? AND status = 'pending'", args: [id] });
  return NextResponse.json({ ok: true });
}
