import { NextResponse } from "next/server";
import { supabase } from "@/lib/clients";

export const runtime = "nodejs";

// Le lien contient l'UUID de la facture (non devinable) : c'est ce que reçoit le client.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = supabase();
  const { data: inv } = await db
    .from("invoices")
    .select("pdf_path, number")
    .eq("id", id)
    .single();
  if (!inv?.pdf_path) return new NextResponse("Introuvable", { status: 404 });

  const { data } = await db.storage
    .from("invoices")
    .createSignedUrl(inv.pdf_path, 60, { download: `Facture_${inv.number}.pdf` });
  if (!data) return new NextResponse("Erreur", { status: 500 });
  return NextResponse.redirect(data.signedUrl, 302);
}
