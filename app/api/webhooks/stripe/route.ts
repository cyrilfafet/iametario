import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { code, nom, email, options } = session.metadata || {};

    if (code) {
      // Paiement du solde livraison → déverrouiller les téléchargements
      const { error } = await supabaseAdmin
        .from("livraisons")
        .update({ paiement_solde: true })
        .eq("code", code);

      if (error) {
        console.error("Supabase update error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Acompte création → enregistrer le client
      const clientEmail = email || session.customer_details?.email;
      if (clientEmail) {
        await supabaseAdmin
          .from("commandes")
          .insert({
            nom: nom || session.customer_details?.name || "",
            email: clientEmail,
            options: options || "",
          })
          .select();
      }
    }
  }

  return NextResponse.json({ received: true });
}
