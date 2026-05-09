"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

type Client = { nom: string; email: string };
type Livraison = { code: string; prenom: string; nom_projet: string; solde: number; paiement_solde: boolean; created_at: string };

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [nomProjet, setNomProjet] = useState("");
  const [message, setMessage] = useState("");
  const [solde, setSolde] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [wavFile, setWavFile] = useState<File | null>(null);
  const [mp3File, setMp3File] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");
  const [deliveryUrl, setDeliveryUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const login = async () => {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (!authenticated) return;
    fetch(`/api/admin/clients?password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setClients(data); });
    fetch(`/api/admin/livraisons?password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setLivraisons(data); });
  }, [authenticated]);

  const selectClient = (client: Client) => {
    setEmail(client.email);
    if (!prenom) setPrenom(client.nom.split(" ")[0]);
  };

  const uploadFile = async (file: File, code: string, type: "preview" | "wav" | "mp3") => {
    const labels: Record<string, string> = {
      preview: "Upload aperçu MP3…",
      wav: "Upload WAV final…",
      mp3: "Upload MP3 final…",
    };
    setProgressLabel(labels[type]);
    const urlRes = await fetch("/api/livraison/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, code, type }),
    });
    const { token, path } = await urlRes.json();
    const { error } = await supabase.storage
      .from("Livraison")
      .uploadToSignedUrl(path, token, file, { contentType: file.type || "application/octet-stream" });
    if (error) throw new Error(`Upload ${type} échoué : ${error.message}`);
  };

  const createDelivery = async () => {
    if (!previewFile || !wavFile || !mp3File || !prenom || !nomProjet) return;
    setLoading(true);
    const code = Math.random().toString(36).slice(2, 10);
    try {
      await uploadFile(previewFile, code, "preview");
      await uploadFile(wavFile, code, "wav");
      await uploadFile(mp3File, code, "mp3");
      setProgressLabel("Création de la livraison…");
      const res = await fetch("/api/livraison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          code,
          prenom,
          nom_projet: nomProjet,
          message,
          email: email || null,
          solde: solde ? parseInt(solde) : 0,
        }),
      });
      if (res.ok) {
        setDeliveryUrl(`${window.location.origin}/livraison/${code}`);
      } else {
        const err = await res.json();
        alert(`Erreur : ${err.error}`);
      }
    } catch (e: unknown) {
      alert(`Erreur : ${e instanceof Error ? e.message : JSON.stringify(e)}`);
    }
    setLoading(false);
    setProgressLabel("");
  };

  const reset = () => {
    setDeliveryUrl(""); setPrenom(""); setEmail(""); setNomProjet("");
    setMessage(""); setSolde("");
    setPreviewFile(null); setWavFile(null); setMp3File(null); setCopied(false);
  };

  const inputClass = "bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors w-full";

  if (!authenticated) {
    return (
      <main className="min-h-screen text-zinc-900 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <img src="/Logo _V1_black.png" alt="E-Tario" className="h-5 mx-auto mb-12" />
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => { setPassword(e.target.value); setAuthError(false); }}
              onKeyDown={e => e.key === "Enter" && login()}
              className={`${inputClass} ${authError ? "border-red-500" : ""}`}
            />
            {authError && <p className="text-red-400 text-xs text-center">Mot de passe incorrect</p>}
            <button
              onClick={login}
              className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors"
            >
              Accéder
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-zinc-900">
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6 hover:opacity-70 transition-opacity" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/" className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          
          <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b border-zinc-100 text-sm text-zinc-500">
          <a href="/" className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          
          <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-end mb-12">
          <span className="text-zinc-400 text-xs uppercase tracking-widest">Back-office</span>
        </div>

        <div className="flex gap-10 items-start">

          {/* Colonne principale — formulaire */}
          <div className="flex-1 min-w-0">
            {deliveryUrl ? (
              <div className="flex flex-col gap-6">
                <div className="border border-blue-500 rounded-2xl px-6 py-8 text-center flex flex-col gap-4">
                  <p className="text-blue-500 font-semibold">Livraison créée ✓</p>
                  {email && <p className="text-zinc-500 text-xs">Mail envoyé à {email}</p>}
                  <p className="text-zinc-500 text-sm break-all">{deliveryUrl}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(deliveryUrl); setCopied(true); }}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors mx-auto"
                  >
                    {copied ? "Copié ✓" : "Copier le lien"}
                  </button>
                </div>
                <button
                  onClick={reset}
                  className="text-zinc-500 text-sm text-center hover:text-zinc-900 transition-colors"
                >
                  Créer une autre livraison
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Nouvelle livraison</p>

                {clients.length > 0 && (
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Sélectionner un client</label>
                    <select
                      onChange={e => {
                        const c = clients.find(c => c.email === e.target.value);
                        if (c) selectClient(c);
                      }}
                      defaultValue=""
                      className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors w-full cursor-pointer"
                    >
                      <option value="" disabled className="text-zinc-400">— Choisir un client —</option>
                      {clients.map((c, i) => (
                        <option key={i} value={c.email}>
                          {c.nom} — {c.email}
                        </option>
                      ))}
                    </select>
                    <p className="text-zinc-400 text-xs mt-2">Ou saisissez manuellement ci-dessous</p>
                  </div>
                )}

                <input type="text" placeholder="Prénom du client" value={prenom} onChange={e => setPrenom(e.target.value)} className={inputClass} />
                <input type="email" placeholder="Email du client (pour envoi automatique)" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Nom du projet" value={nomProjet} onChange={e => setNomProjet(e.target.value)} className={inputClass} />
                <textarea
                  placeholder="Message personnalisé (optionnel)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
                <input
                  type="number"
                  placeholder="Solde à régler (€) — laisser vide si tout est payé"
                  value={solde}
                  onChange={e => setSolde(e.target.value)}
                  min={0}
                  className={inputClass}
                />

                <p className="text-zinc-400 text-xs uppercase tracking-widest pt-2">Fichiers audio</p>

                <div className="border border-zinc-200 rounded-xl px-5 py-4">
                  <label className="text-sm text-zinc-500 block mb-1">Aperçu MP3 <span className="text-zinc-400">(basse qualité / watermarked)</span></label>
                  <input type="file" accept=".mp3,audio/mpeg" onChange={e => setPreviewFile(e.target.files?.[0] || null)}
                    className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                </div>
                <div className="border border-zinc-200 rounded-xl px-5 py-4">
                  <label className="text-sm text-zinc-500 block mb-1">WAV final <span className="text-zinc-400">(haute qualité — déverrouillé après paiement)</span></label>
                  <input type="file" accept=".wav,audio/wav" onChange={e => setWavFile(e.target.files?.[0] || null)}
                    className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                </div>
                <div className="border border-zinc-200 rounded-xl px-5 py-4">
                  <label className="text-sm text-zinc-500 block mb-1">MP3 final <span className="text-zinc-400">(standard — déverrouillé après paiement)</span></label>
                  <input type="file" accept=".mp3,audio/mpeg" onChange={e => setMp3File(e.target.files?.[0] || null)}
                    className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                </div>

                <button
                  onClick={createDelivery}
                  disabled={loading || !prenom || !nomProjet || !previewFile || !wavFile || !mp3File}
                  className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? progressLabel || "Chargement…" : "Créer la livraison"}
                </button>
              </div>
            )}
          </div>

          {/* Colonne droite — récap livraisons */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Commandes payées</p>
              {livraisons.length === 0 ? (
                <p className="text-zinc-400 text-sm">Aucune livraison.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {livraisons.map(l => {
                    const date = new Date(l.created_at);
                    const dateStr = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                    return (
                      <a
                        key={l.code}
                        href={`/livraison/${l.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col gap-0.5 border border-zinc-100 rounded-xl px-4 py-3 hover:border-blue-500 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-zinc-900 truncate group-hover:text-blue-500 transition-colors">{l.nom_projet}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">{l.prenom}</span>
                          <span className="text-xs text-zinc-300">{dateStr}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
