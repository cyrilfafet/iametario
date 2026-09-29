import { NextResponse } from "next/server";
import { siteUrl, stripe, supabase } from "@/lib/clients";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = supabase();
  const { data: inv } = await db.from("invoices").select("*").eq("id", id).single();
  if (!inv) return new NextResponse("Introuvable", { status: 404 });
  if (inv.status !== "unpaid") {
    return NextResponse.redirect(`${siteUrl()}/pay/${id}`, 303);
  }

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: inv.client_email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(Number(inv.total) * 100),
          product_data: {
            name: `Facture ${inv.number} - ${inv.label}`,
          },
        },
      },
    ],
    metadata: { invoice_id: inv.id, invoice_number: inv.number },
    payment_intent_data: {
      metadata: { invoice_id: inv.id, invoice_number: inv.number },
    },
    success_url: `${siteUrl()}/pay/${inv.id}?paid=1`,
    cancel_url: `${siteUrl()}/pay/${inv.id}`,
  });

  await db.from("invoices").update({ stripe_session_id: session.id }).eq("id", id);
  return NextResponse.redirect(session.url!, 303);
}
