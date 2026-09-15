import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { nom, email, urgent, voix } = await req.json();

  const options = [
    urgent && "Délai urgent (-4 jours)",
    voix && "Intégration de voix",
  ].filter(Boolean).join(", ");

  const description = options
    ? `Acompte montage audio — ${options}`
    : "Acompte montage audio";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email || undefined,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 3000,
          product_data: {
            name: "Acompte — Montage Audio sur mesure",
            description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { nom: nom || "", email: email || "", options: options || "aucune" },
    success_url: `${process.env.NEXT_PUBLIC_URL || "https://www.iametario.com"}/creation?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://www.iametario.com"}/creation`,
  });

  return NextResponse.json({ url: session.url });
}
