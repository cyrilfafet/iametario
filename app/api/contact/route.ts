import { Resend } from "resend";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const formData = await request.formData();

  const source = formData.get("source") as string;
  const nom = formData.get("nom") as string;
  const email = formData.get("email") as string;
  const prestation = formData.get("prestation") as string;
  const description = formData.get("description") as string;
  const fichier = formData.get("fichier") as File | null;

  const isCreation = source === "creation";

  let attachments: { filename: string; content: Buffer }[] = [];
  if (fichier && fichier.size > 0) {
    const buffer = await fichier.arrayBuffer();
    attachments = [{ filename: fichier.name, content: Buffer.from(buffer) }];
  }

  const subject = isCreation
    ? `Demande de montage audio — ${prestation}`
    : `Message de contact — ${prestation}`;

  const html = isCreation
    ? `
        <h2>Nouvelle demande de montage audio</h2>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Prestation :</strong> ${prestation}</p>
        <p><strong>Description :</strong></p>
        <p>${description}</p>
      `
    : `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${prestation}</p>
        <p><strong>Message :</strong></p>
        <p>${description}</p>
      `;

  try {
    await resend.emails.send({
      from: "E-Tario <contact@iametario.com>",
      to: "contact@iametario.com",
      subject,
      html,
      attachments,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}