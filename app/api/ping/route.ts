import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  await supabaseAdmin.from("livraisons").select("code").limit(1);
  return NextResponse.json({ ok: true });
}
