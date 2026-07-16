import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const { data } = await supabaseAdmin
    .from("promo_codes")
    .select("id, code, reduction, nb_utilisations, max_utilisations")
    .eq("code", code.toUpperCase().trim())
    .eq("actif", true)
    .single();

  if (!data) return NextResponse.json({ valid: false });

  if (data.max_utilisations !== null && data.nb_utilisations >= data.max_utilisations) {
    return NextResponse.json({ valid: false, message: "Code expiré" });
  }

  return NextResponse.json({ valid: true, reduction: data.reduction, code: data.code });
}
