import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, id, type } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const filename = type === "preview" ? "preview.mp3" : "final.wav";
  const path = `shop/${id}/${filename}`;

  const { data, error } = await supabaseAdmin.storage
    .from("Livraison")
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ token: data.token, path: data.path });
}
