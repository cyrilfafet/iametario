import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { password, code, prenom, nom_projet, message, solde, email } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fichier_preview_url = `${base}/storage/v1/object/public/Livraison/${code}/preview.mp3`;
  const fichier_wav_url = `${base}/storage/v1/object/public/Livraison/${code}/final.wav`;
  const fichier_mp3_url = `${base}/storage/v1/object/public/Livraison/${code}/final.mp3`;

  const { error } = await supabaseAdmin
    .from("livraisons")
    .insert({
      code,
      prenom,
      nom_projet,
      message,
      email: email || null,
      fichier_preview_url,
      fichier_wav_url,
      fichier_mp3_url,
      solde: solde ?? 0,
      paiement_solde: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Envoi du mail au client si email fourni
  if (email) {
    const deliveryUrl = `https://www.iametario.com/livraison/${code}`;
    const soldeLine = solde > 0
      ? `<p>Un solde de <strong>${solde} €</strong> sera à régler pour télécharger les fichiers finaux.</p>`
      : "";

    try {
      await resend.emails.send({
        from: "E-Tario <contact@iametario.com>",
        to: email,
        subject: `Ta livraison est prête — ${nom_projet}`,
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: auto; color: #111;">
            <h2 style="margin-bottom: 4px;">Bonjour ${prenom} 👋</h2>
            <p style="color: #555;">Ton projet <strong>${nom_projet}</strong> est prêt.</p>
            ${message ? `<p style="color: #555;">${message}</p>` : ""}
            ${soldeLine}
            <a href="${deliveryUrl}" style="display:inline-block; margin-top: 20px; background:#0074d4; color:#fff; padding:14px 28px; border-radius:10px; text-decoration:none; font-weight:600;">
              Accéder à ma livraison
            </a>
            <p style="margin-top: 32px; font-size: 12px; color: #999;">Ce lien est personnel et privé, ne le partagez pas.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Erreur envoi mail :", mailError);
      // On ne bloque pas la création si le mail échoue
    }
  }

  return NextResponse.json({ success: true });
}
