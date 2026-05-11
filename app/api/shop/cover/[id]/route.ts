import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import NodeID3 from "node-id3";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: track } = await supabaseAdmin
    .from("shop_tracks")
    .select("fichier_preview_url")
    .eq("id", id)
    .single();

  if (!track?.fichier_preview_url) {
    return NextResponse.json({ cover: null });
  }

  try {
    // Fetch only the first 512 KB — ID3 tags always sit at the start of the file
    const res = await fetch(track.fichier_preview_url, {
      headers: { Range: "bytes=0-524287" },
    });
    if (!res.ok && res.status !== 206) return NextResponse.json({ cover: null });

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tags = NodeID3.read(buffer);
    const image = tags.image;

    if (!image || typeof image === "string") {
      return NextResponse.json({ cover: null });
    }

    const cover = `data:${image.mime};base64,${image.imageBuffer.toString("base64")}`;
    return NextResponse.json({ cover });
  } catch {
    return NextResponse.json({ cover: null });
  }
}
