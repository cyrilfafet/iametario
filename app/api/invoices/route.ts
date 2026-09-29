import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createInvoice } from "@/lib/create-invoice";
import { siteUrl } from "@/lib/clients";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const inv = await createInvoice(await req.json());
    return NextResponse.json({
      id: inv.id,
      number: inv.number,
      total: inv.total,
      pdfUrl: `${siteUrl()}/api/invoices/${inv.id}/pdf`,
      payUrl: `${siteUrl()}/pay/${inv.id}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 400 },
    );
  }
}
