import { r2, R2_BUCKET } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, id, type } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const filename = type === "preview" ? "preview.mp3" : type === "cover" ? "cover.jpg" : "final.wav";
  const contentType = type === "preview" ? "audio/mpeg" : type === "cover" ? "image/jpeg" : "audio/wav";
  const key = `shop/${id}/${filename}`;

  try {
    const url = await getSignedUrl(
      r2,
      new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
      { expiresIn: 3600 }
    );
    return NextResponse.json({ url, key });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), bucket: R2_BUCKET, account: process.env.R2_ACCOUNT_ID?.slice(0, 8) }, { status: 500 });
  }
}
