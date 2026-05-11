import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const sessionId = new URL(req.url).searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Session manquante" }, { status: 400 });
  }

  // Vérifier le paiement Stripe (no_payment_required pour les tracks à 0€)
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const validStatus = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!validStatus || session.metadata?.track_id !== id) {
    return NextResponse.json({
      error: "Paiement non confirmé",
      debug: {
        payment_status: session.payment_status,
        metadata_track_id: session.metadata?.track_id,
        id_param: id,
        match: session.metadata?.track_id === id,
      }
    }, { status: 403 });
  }

  // Générer une URL signée valable 1h
  const path = `shop/${id}/final.wav`;
  const { data, error } = await supabaseAdmin.storage
    .from("Livraison")
    .createSignedUrl(path, 3600);

  if (error || !data) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  return NextResponse.json({ url: data.signedUrl });
}
