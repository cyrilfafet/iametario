import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { password, code, type } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const path = `${code}/${type === "wav" ? "fichier.wav" : "fichier.mp3"}`;
  const { data, error } = await supabaseAdmin.storage
    .from("Livraison")
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path: data.path });
}
