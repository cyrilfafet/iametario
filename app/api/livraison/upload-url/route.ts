import { r2, R2_BUCKET } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password, code, type } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const fileMap: Record<string, string> = {
    wav: "final.wav",
    mp3: "final.mp3",
    preview: "preview.mp3",
  };
  const contentTypeMap: Record<string, string> = {
    wav: "audio/wav",
    mp3: "audio/mpeg",
    preview: "audio/mpeg",
  };

  const filename = fileMap[type] ?? "fichier";
  const contentType = contentTypeMap[type] ?? "application/octet-stream";
  const key = `livraisons/${code}/${filename}`;

  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 3600 }
  );

  return NextResponse.json({ url });
}
