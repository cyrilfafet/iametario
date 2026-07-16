import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { id, nom, email, message } = await req.json();
  if (!id || !nom || !email) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const { data: slot, error: fetchError } = await supabaseAdmin
    .from("creneaux")
    .select("*")
    .eq("id", id)
    .eq("disponible", true)
    .eq("reserve", false)
    .eq("pending", false)
    .single();

  if (fetchError || !slot) return NextResponse.json({ error: "Créneau non disponible" }, { status: 409 });

  const startHour = parseInt((slot.heure_debut as string).slice(0, 2));
  const h1 = `${String(startHour + 1).padStart(2, "0")}:00:00`;
  const h2 = `${String(startHour + 2).padStart(2, "0")}:00:00`;

  const { data: nextSlots, error: nextError } = await supabaseAdmin
    .from("creneaux")
    .select("id")
    .eq("date", slot.date)
    .in("heure_debut", [h1, h2])
    .eq("disponible", true)
    .eq("reserve", false)
    .eq("pending", false);

  if (nextError || !nextSlots || nextSlots.length < 2) {
    return NextResponse.json({ error: "Créneau non disponible" }, { status: 409 });
  }

  const allIds = [slot.id, ...nextSlots.map((s: { id: string }) => s.id)];
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const { error: pendingError } = await supabaseAdmin
    .from("creneaux")
    .update({ pending: true, client_nom: nom, client_email: email, client_message: message || null, pending_expires_at: expiresAt })
    .in("id", allIds);

  if (pendingError) return NextResponse.json({ error: pendingError.message }, { status: 500 });

  const dateStr = new Date(slot.date + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const heure = `${startHour}h`;
  const heureFin = `${startHour + 3}h`;

  const base = process.env.NEXT_PUBLIC_URL || "https://www.iametario.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 9000,
          product_data: {
            name: "Coaching FL Studio · Afro House",
            description: `Session individuelle 3h — ${dateStr} de ${heure} à ${heureFin}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      creneau_id: slot.id,
      creneau_id_1: nextSlots[0].id,
      creneau_id_2: nextSlots[1].id,
      nom,
      email,
      message: message || "",
      date: slot.date,
      heure_debut: slot.heure_debut,
    },
    success_url: `${base}/formations?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/formations?cancelled=1`,
  });

  return NextResponse.json({ url: session.url });
}
