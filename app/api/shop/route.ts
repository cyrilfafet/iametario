import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET — tracks publiées (page publique)
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shop_tracks")
    .select("id, titre, genre, fichier_preview_url, prix")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — créer une track (admin)
export async function POST(req: NextRequest) {
  const { password, titre, genre, fichier_preview_url, fichier_wav_url, prix } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("shop_tracks")
    .insert({ titre, genre, fichier_preview_url, fichier_wav_url, prix, published: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
