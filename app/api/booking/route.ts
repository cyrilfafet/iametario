import { Resend } from "resend";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { nom, email, type, date, budget, message } = await request.json();

  try {
    await resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: "contact@iametario.com",
      subject: `Demande de booking — ${type} — ${nom}`,
      html: `
        <h2>Nouvelle demande de booking</h2>
        <p><strong>Nom / Structure :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Type d'événement :</strong> ${type}</p>
        <p><strong>Date envisagée :</strong> ${date || "Non précisée"}</p>
        <p><strong>Budget approximatif :</strong> ${budget || "Non précisé"}</p>
        <p><strong>Message :</strong></p>
        <p>${message || "—"}</p>
      `,
    });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
