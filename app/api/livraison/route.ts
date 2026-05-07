import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { password, code, prenom, nom_projet, message } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fichier_wav_url = `${base}/storage/v1/object/public/Livraison/${code}/fichier.wav`;
  const fichier_mp3_url = `${base}/storage/v1/object/public/Livraison/${code}/fichier.mp3`;

  const { error } = await supabaseAdmin
    .from("livraisons")
    .insert({ code, prenom, nom_projet, message, fichier_wav_url, fichier_mp3_url });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
