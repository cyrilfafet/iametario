import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data, error } = await supabaseAdmin
    .from("livraisons")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Livraison introuvable" }, { status: 404 });
  }

  return NextResponse.json(data);
}
