import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { code, prenom, nom_projet, message } = await req.json();

  try {
    await resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: "contact@iametario.com",
      subject: `Demande de révision — ${nom_projet}`,
      html: `
        <h2>Nouvelle demande de révision</h2>
        <p><strong>Client :</strong> ${prenom}</p>
        <p><strong>Projet :</strong> ${nom_projet}</p>
        <p><strong>Code livraison :</strong> ${code}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
