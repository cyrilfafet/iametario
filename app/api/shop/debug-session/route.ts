import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ error: "session_id manquant" });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return NextResponse.json({
    payment_status: session.payment_status,
    status: session.status,
    metadata: session.metadata,
    amount_total: session.amount_total,
  });
}
