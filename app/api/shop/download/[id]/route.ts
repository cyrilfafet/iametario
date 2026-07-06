import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { r2, R2_BUCKET } from "@/lib/r2";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session manquante" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const validStatus = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!validStatus || session.metadata?.track_id !== id) {
    return NextResponse.json({ error: "Paiement non confirmé" }, { status: 403 });
  }

  const key = `shop/${id}/final.wav`;
  const url = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    { expiresIn: 3600 }
  );

  return NextResponse.json({ url });
}
