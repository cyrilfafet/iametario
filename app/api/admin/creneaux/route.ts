import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const password = req.nextUrl.searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("creneaux")
    .select("*")
    .order("date", { ascending: true })
    .order("heure_debut", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { password, date, heure_debut } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!date || !heure_debut) return NextResponse.json({ error: "Date et heure requis" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("creneaux")
    .insert({ date, heure_debut, duree_min: 60, disponible: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
