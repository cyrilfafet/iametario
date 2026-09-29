import { notFound } from "next/navigation";
import { supabase } from "@/lib/clients";
import { eur2, longDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = { title: "Paiement de facture", robots: { index: false } };

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: inv } = await supabase()
    .from("invoices")
    .select("id, number, issued_at, client_name, label, total, status")
    .eq("id", id)
    .single();
  if (!inv) notFound();

  const paid = inv.status === "paid";

  return (
    <main style={{ maxWidth: 480, margin: "80px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif", color: "#111" }}>
      <h1 style={{ letterSpacing: "0.3em", fontWeight: 500, textAlign: "center", fontSize: 28 }}>E-TARIO</h1>
      <p style={{ textAlign: "center", color: "#666", marginTop: 4 }}>
        Facture n°{inv.number} · {longDate(inv.issued_at)}
      </p>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 20, marginTop: 32 }}>
        <p style={{ margin: 0, color: "#666", fontSize: 14 }}>{inv.client_name}</p>
        <p style={{ margin: "4px 0 16px" }}>{inv.label}</p>
        <p style={{ margin: 0, fontSize: 32, fontWeight: 600 }}>{eur2(Number(inv.total))}</p>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>TVA non applicable - art. 293 B du CGI</p>
      </div>

      {paid ? (
        <p style={{ textAlign: "center", marginTop: 24, fontWeight: 500 }}>Facture réglée. Merci !</p>
      ) : inv.status === "cancelled" ? (
        <p style={{ textAlign: "center", marginTop: 24 }}>Cette facture a été annulée.</p>
      ) : (
        <form method="post" action={`/api/invoices/${inv.id}/checkout`} style={{ marginTop: 24 }}>
          <button
            type="submit"
            style={{ width: "100%", padding: "14px 0", background: "#111", color: "#fff", border: 0, borderRadius: 8, fontSize: 16, cursor: "pointer" }}
          >
            Payer par carte
          </button>
        </form>
      )}

      <p style={{ textAlign: "center", marginTop: 20 }}>
        <a href={`/api/invoices/${inv.id}/pdf`} style={{ color: "#111" }}>
          Télécharger la facture (PDF)
        </a>
      </p>
    </main>
  );
}
