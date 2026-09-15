import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { r2, R2_BUCKET } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const { data: track, error } = await supabaseAdmin
    .from("shop_tracks")
    .select("prix, nb_telechargements")
    .eq("id", id)
    .single();

  if (error || !track) {
    return NextResponse.json({ error: "Track introuvable" }, { status: 404 });
  }

  if (track.prix !== 0) {
    return NextResponse.json({ error: "Cette track n'est pas gratuite" }, { status: 403 });
  }

  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: `shop/${id}/final.wav` }),
    { expiresIn: 300 }
  );

  await supabaseAdmin
    .from("shop_tracks")
    .update({ nb_telechargements: (track.nb_telechargements ?? 0) + 1 })
    .eq("id", id);

  return NextResponse.redirect(url);
}
