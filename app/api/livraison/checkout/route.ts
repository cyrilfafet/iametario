import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const { data: livraison, error } = await supabaseAdmin
    .from("livraisons")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !livraison) {
    return NextResponse.json({ error: "Livraison introuvable" }, { status: 404 });
  }

  if (livraison.paiement_solde) {
    return NextResponse.json({ error: "Solde déjà réglé" }, { status: 400 });
  }

  if (!livraison.solde || livraison.solde <= 0) {
    return NextResponse.json({ error: "Aucun solde à régler" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "https://iametario.com";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Solde — ${livraison.nom_projet}`,
            description: `Livraison finale pour ${livraison.prenom}`,
          },
          unit_amount: livraison.solde * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: { code },
    customer_email: livraison.email || undefined,
    success_url: `${origin}/livraison/${code}?payment=success`,
    cancel_url: `${origin}/livraison/${code}`,
  });

  return NextResponse.json({ url: session.url });
}
