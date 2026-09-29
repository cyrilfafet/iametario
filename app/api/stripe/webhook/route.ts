import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, supabase } from "@/lib/clients";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Signature manquante", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      await req.text(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return new NextResponse("Signature invalide", { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const s = event.data.object as Stripe.Checkout.Session;
    const invoiceId = s.metadata?.invoice_id;
    if (invoiceId && s.payment_status === "paid") {
      await supabase()
        .from("invoices")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", invoiceId)
        .eq("status", "unpaid");
    }
  }
  return NextResponse.json({ received: true });
}
