import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
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
    const { code, nom, email, options, creneau_id, creneau_id_1, creneau_id_2, promo_id, musique, parrain } = session.metadata || {};

    if (creneau_id) {
      // Paiement coaching — confirmer la réservation
      const { follow_up } = session.metadata || {};
      const allIds = follow_up === "1"
        ? [creneau_id]
        : [creneau_id, creneau_id_1, creneau_id_2].filter(Boolean);
      await supabaseAdmin
        .from("creneaux")
        .update({ reserve: true, pending: false, stripe_session_id: session.id, pending_expires_at: null })
        .in("id", allIds);

      if (promo_id) {
        const { data: promo } = await supabaseAdmin.from("promo_codes").select("nb_utilisations").eq("id", promo_id).single();
        if (promo) await supabaseAdmin.from("promo_codes").update({ nb_utilisations: promo.nb_utilisations + 1 }).eq("id", promo_id);
      }

      const clientNom = nom || session.customer_details?.name || "";
      const clientEmail = email || session.customer_details?.email;

      if (clientEmail) {
        const { data: slotData } = await supabaseAdmin
          .from("creneaux")
          .select("date, heure_debut")
          .eq("id", creneau_id)
          .single();

        if (slotData) {
          const dateStr = new Date(slotData.date + "T12:00:00").toLocaleDateString("fr-FR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          });
          const startH = parseInt((slotData.heure_debut as string).slice(0, 2));
          const heure = `${startH}h`;
          const heureFin = `${startH + 3}h`;

          const resend = new Resend(process.env.RESEND_API_KEY);
          await Promise.allSettled([
            resend.emails.send({
              from: "E-Tario <contact@iametario.com>",
              to: clientEmail,
              replyTo: "contact@iametario.com",
              subject: "Session FL Studio avec E-Tario · Réservation confirmée",
              html: `
                <h2>C'est confirmé !</h2>
                <p>Bonjour ${clientNom.split(" ")[0]},</p>
                <p>Ta session FL Studio est réservée. Voici tout ce qu'il faut savoir pour qu'on soit prêts le jour J.</p>
                <p>
                  <strong>Date :</strong> ${dateStr}<br/>
                  <strong>Heure :</strong> ${heure} — ${heureFin}<br/>
                  <strong>Durée :</strong> 3 heures<br/>
                  <strong>Plateforme :</strong> Zoom
                </p>
                <h3>À préparer avant la session</h3>
                <ul>
                  <li>Connexion internet stable (fibre ou très bon réseau)</li>
                  <li>Casque ou écouteurs obligatoires</li>
                  <li>FL Studio installé — la version démo gratuite suffit : <a href="https://www.image-line.com/fl-studio/download">https://www.image-line.com/fl-studio/download</a></li>
                  <li>Pack de samples téléchargé à ce lien :</li>
                  <li>Le fichier MP3 du morceau que tu veux remixer</li>
                  <li>Logiciel de visio Zoom installé : <a href="https://zoom.us/download">https://zoom.us/download</a></li>
                </ul>
                <p>Des questions d'ici là ? Réponds directement à ce mail.</p>
                <p>À très vite,<br/>Cyril / E-Tario</p>
              `,
            }),
            resend.emails.send({
              from: "E-Tario <contact@iametario.com>",
              to: "contact@iametario.com",
              subject: `Nouvelle réservation coaching — ${clientNom}`,
              html: `
                <h2>Nouvelle réservation de coaching (paiement confirmé)</h2>
                <p><strong>Client :</strong> ${clientNom}</p>
                <p><strong>Email :</strong> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
                <p><strong>Date :</strong> ${dateStr} de ${heure} à ${heureFin}</p>
                ${musique ? `<p><strong>Musique à remixer :</strong> ${musique}</p>` : ""}
                ${parrain ? `<p><strong>Parrain :</strong> ${parrain}</p>` : ""}
                <p><strong>Stripe session :</strong> ${session.id}</p>
              `,
            }),
          ]);
        }
      }

    } else if (code) {
      // Paiement du solde livraison
      await supabaseAdmin
        .from("livraisons")
        .update({ paiement_solde: true })
        .eq("code", code);

    } else {
      // Acompte création
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
