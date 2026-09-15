import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  const { data: track, error } = await supabaseAdmin
    .from("shop_tracks")
    .select("id, titre, genre, prix")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (error || !track) {
    return NextResponse.json({ error: "Track introuvable" }, { status: 404 });
  }

  const base = process.env.NEXT_PUBLIC_URL || "https://www.iametario.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: track.prix,
          product_data: {
            name: track.titre,
            description: `${track.genre} — Fichier WAV haute qualité`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { track_id: track.id },
    success_url: `${base}/shop/${track.id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/shop`,
  });

  return NextResponse.json({ url: session.url });
}
