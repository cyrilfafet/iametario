import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const success = password === process.env.ADMIN_PASSWORD;
  return NextResponse.json({ success }, { status: success ? 200 : 401 });
}
