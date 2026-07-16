import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { password, code, reduction, max_utilisations } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!code || !reduction) return NextResponse.json({ error: "Code et réduction requis" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("promo_codes")
    .insert({ code: code.toUpperCase().trim(), reduction: parseInt(reduction), max_utilisations: max_utilisations || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
