import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function assertAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");
  if (session?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
