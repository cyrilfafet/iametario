import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { id, nom, email, message } = await req.json();
  if (!id || !nom || !email) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  // Récupérer le créneau de départ
  const { data: slot, error: fetchError } = await supabaseAdmin
    .from("creneaux")
    .select("*")
    .eq("id", id)
    .eq("disponible", true)
    .eq("reserve", false)
    .single();

  if (fetchError || !slot) return NextResponse.json({ error: "Créneau non disponible" }, { status: 409 });

  // Calculer les 2 heures suivantes
  const startHour = parseInt((slot.heure_debut as string).slice(0, 2));
  const h1 = `${String(startHour + 1).padStart(2, "0")}:00:00`;
  const h2 = `${String(startHour + 2).padStart(2, "0")}:00:00`;

  // Vérifier que les 2 heures suivantes sont toujours libres (race condition proof)
  const { data: nextSlots, error: nextError } = await supabaseAdmin
    .from("creneaux")
    .select("id, heure_debut")
    .eq("date", slot.date)
    .in("heure_debut", [h1, h2])
    .eq("disponible", true)
    .eq("reserve", false);

  if (nextError || !nextSlots || nextSlots.length < 2) {
    return NextResponse.json({ error: "Créneau non disponible" }, { status: 409 });
  }

  // Bloquer les 3 heures
  const allIds = [slot.id, ...nextSlots.map(s => s.id)];
  const { error: updateError } = await supabaseAdmin
    .from("creneaux")
    .update({ reserve: true, client_nom: nom, client_email: email, client_message: message || null })
    .in("id", allIds);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  const dateStr = new Date(slot.date + "T12:00:00").toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const heure = (slot.heure_debut as string).slice(0, 5).replace(":", "h");
  const heureFin = `${String(startHour + 3).padStart(2, "0")}h`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await Promise.allSettled([
    resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: email,
      subject: "Coaching FL Studio · Réservation confirmée",
      html: `
        <h2>C'est confirmé !</h2>
        <p>Bonjour ${nom},</p>
        <p>Ta session de coaching <strong>FL Studio · Afro House</strong> est réservée.</p>
        <p><strong>Date :</strong> ${dateStr}</p>
        <p><strong>Heure :</strong> ${heure} — ${heureFin}</p>
        <p><strong>Durée :</strong> 3 heures</p>
        <p>Je te recontacte quelques jours avant pour te communiquer le lien Zoom et répondre à tes questions.</p>
        <p>À très vite,<br/>E-Tario</p>
      `,
    }),
    resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: "contact@iametario.com",
      subject: `Nouvelle réservation coaching — ${nom}`,
      html: `
        <h2>Nouvelle réservation de coaching</h2>
        <p><strong>Client :</strong> ${nom}</p>
        <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Date :</strong> ${dateStr} de ${heure} à ${heureFin}</p>
        ${message ? `<p><strong>Message :</strong> ${message}</p>` : ""}
      `,
    }),
  ]);

  return NextResponse.json({ success: true });
}
