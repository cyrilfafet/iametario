"use client";

import { useCallback, useEffect, useState } from "react";

type Client = {
  id: string;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string | null;
  email: string | null;
};
type Result = { number: string; total: number; pdfUrl: string; payUrl: string };

const field: React.CSSProperties = {
  width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6, fontSize: 15, boxSizing: "border-box",
};
const label: React.CSSProperties = { display: "block", fontSize: 13, color: "#555", margin: "14px 0 4px" };
const NEW = "";

export default function NewInvoice() {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState(NEW);

  // Champs client contrôlés pour pouvoir être pré-remplis par le menu.
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [postal, setPostal] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const loadClients = useCallback(async (t: string) => {
    if (!t) return;
    const res = await fetch("/api/clients", { headers: { "x-admin-token": t } });
    if (!res.ok) {
      setClients([]);
      setError(res.status === 401 ? "Mot de passe admin incorrect." : "Impossible de charger les clients.");
      return;
    }
    setError(null);
    setClients((await res.json()).clients);
    try { sessionStorage.setItem("adminToken", t); } catch {}
  }, []);

  useEffect(() => {
    try {
      const t = sessionStorage.getItem("adminToken");
      if (t) { setToken(t); loadClients(t); }
    } catch {}
  }, [loadClients]);

  function pick(id: string) {
    setSelected(id);
    const c = clients.find((x) => x.id === id);
    setName(c?.name ?? "");
    setStreet(c?.address ?? "");
    setPostal(c?.postal_code ?? "");
    setCity(c?.city ?? "");
    setPhone(c?.phone ?? "");
    setEmail(c?.email ?? "");
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-token": token },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error ?? "Erreur");
    setResult(json);
    loadClients(token); // un nouveau client apparaît dans la liste
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main style={{ maxWidth: 560, margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Nouvelle facture</h1>
      <form onSubmit={submit}>
        <label style={label}>Mot de passe admin</label>
        <input
          style={field}
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onBlur={() => loadClients(token)}
          required
        />

        <label style={label}>Client enregistré</label>
        <select style={field} value={selected} onChange={(e) => pick(e.target.value)}>
          <option value={NEW}>+ Nouveau client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.city}
            </option>
          ))}
        </select>

        <label style={label}>Nom de l'établissement</label>
        <input style={field} name="clientName" value={name} onChange={(e) => setName(e.target.value)} required />
        <label style={label}>Adresse</label>
        <input style={field} name="clientStreet" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="9, Place St-Jean de Maizel" required />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Code postal</label>
            <input style={field} name="clientPostalCode" value={postal} onChange={(e) => setPostal(e.target.value)} required />
          </div>
          <div style={{ flex: 2 }}>
            <label style={label}>Ville</label>
            <input style={field} name="clientCity" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
        </div>
        <label style={label}>Téléphone (optionnel)</label>
        <input style={field} name="clientPhone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label style={label}>Email (optionnel, pré-remplit le paiement)</label>
        <input style={field} name="clientEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label style={label}>Désignation</label>
        <input style={field} name="label" placeholder="DJ SET 11/09/26" required />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Quantité</label>
            <input style={field} name="quantity" type="number" step="any" defaultValue={1} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Prix unitaire (€)</label>
            <input style={field} name="unitPrice" type="number" step="0.01" required />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Déplacement</label>
            <input style={field} name="travel" type="number" step="0.01" defaultValue={0} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Hébergement</label>
            <input style={field} name="lodging" type="number" step="0.01" defaultValue={0} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Restauration</label>
            <input style={field} name="meals" type="number" step="0.01" defaultValue={0} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={label}>Acompte déjà versé (€)</label>
            <input style={field} name="deposit" type="number" step="0.01" defaultValue={0} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={label}>Date d'émission</label>
            <input style={field} name="issuedAt" type="date" defaultValue={today} />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          style={{ marginTop: 24, width: "100%", padding: 14, background: "#111", color: "#fff", border: 0, borderRadius: 8, fontSize: 16, cursor: "pointer" }}
        >
          {busy ? "Création…" : "Créer la facture"}
        </button>
      </form>

      {error && <p style={{ color: "#b00020", marginTop: 16 }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 24, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <p style={{ marginTop: 0 }}>
            Facture <b>n°{result.number}</b> créée ({result.total.toFixed(2)} €).
          </p>
          <p><a href={result.pdfUrl} target="_blank" rel="noreferrer">Ouvrir le PDF</a></p>
          <p style={{ marginBottom: 4 }}>Lien de paiement à envoyer au client :</p>
          <input style={field} readOnly value={result.payUrl} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
    </main>
  );
}
