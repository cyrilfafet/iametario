import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const formData = await request.formData();
  
  const nom = formData.get("nom") as string;
  const email = formData.get("email") as string;
  const prestation = formData.get("prestation") as string;
  const description = formData.get("description") as string;
  const fichier = formData.get("fichier") as File | null;

  let attachments = [];

  if (fichier && fichier.size > 0) {
    const buffer = await fichier.arrayBuffer();
    attachments = [{
      filename: fichier.name,
      content: Buffer.from(buffer),
    }];
  }

  try {
    await resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: "contact@iametario.com",
      subject: `Nouvelle demande — ${prestation}`,
      html: `
        <h2>Nouvelle demande de création audio</h2>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Prestation :</strong> ${prestation}</p>
        <p><strong>Description :</strong></p>
        <p>${description}</p>
      `,
      attachments,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}