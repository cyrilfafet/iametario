"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

type Client = { nom: string; email: string };

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
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

  const inputClass = "bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors w-full";

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <img src="/Logo_2k26v2.png" alt="E-Tario" className="h-5 mx-auto mb-12" />
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
              className="bg-blue-400 text-black px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors"
            >
              Accéder
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-12">
          <img src="/Logo_2k26v2.png" alt="E-Tario" className="h-5" />
          <span className="text-zinc-600 text-xs uppercase tracking-widest">Back-office</span>
        </div>

        {deliveryUrl ? (
          <div className="flex flex-col gap-6">
            <div className="border border-blue-400 rounded-2xl px-6 py-8 text-center flex flex-col gap-4">
              <p className="text-blue-400 font-semibold">Livraison créée ✓</p>
              {email && <p className="text-zinc-500 text-xs">Mail envoyé à {email}</p>}
              <p className="text-zinc-300 text-sm break-all">{deliveryUrl}</p>
              <button
                onClick={() => { navigator.clipboard.writeText(deliveryUrl); setCopied(true); }}
                className="bg-blue-400 text-black px-6 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors mx-auto"
              >
                {copied ? "Copié ✓" : "Copier le lien"}
              </button>
            </div>
            <button
              onClick={reset}
              className="text-zinc-500 text-sm text-center hover:text-white transition-colors"
            >
              Créer une autre livraison
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Nouvelle livraison</p>

            {/* Dropdown clients */}
            {clients.length > 0 && (
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Client</label>
                <div className="grid gap-2 max-h-40 overflow-y-auto pr-1">
                  {clients.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => selectClient(c)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                        email === c.email
                          ? "border-blue-400 text-white bg-blue-400/10"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      <span className="font-medium">{c.nom}</span>
                      <span className="text-zinc-600 ml-2 text-xs">{c.email}</span>
                    </button>
                  ))}
                </div>
                <p className="text-zinc-700 text-xs mt-2">Ou saisissez manuellement ci-dessous</p>
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

            <p className="text-zinc-600 text-xs uppercase tracking-widest pt-2">Fichiers audio</p>

            <div className="border border-zinc-800 rounded-xl px-5 py-4">
              <label className="text-sm text-zinc-400 block mb-1">Aperçu MP3 <span className="text-zinc-600">(basse qualité / watermarked)</span></label>
              <input type="file" accept=".mp3,audio/mpeg" onChange={e => setPreviewFile(e.target.files?.[0] || null)}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 w-full" />
            </div>
            <div className="border border-zinc-800 rounded-xl px-5 py-4">
              <label className="text-sm text-zinc-400 block mb-1">WAV final <span className="text-zinc-600">(haute qualité — déverrouillé après paiement)</span></label>
              <input type="file" accept=".wav,audio/wav" onChange={e => setWavFile(e.target.files?.[0] || null)}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 w-full" />
            </div>
            <div className="border border-zinc-800 rounded-xl px-5 py-4">
              <label className="text-sm text-zinc-400 block mb-1">MP3 final <span className="text-zinc-600">(standard — déverrouillé après paiement)</span></label>
              <input type="file" accept=".mp3,audio/mpeg" onChange={e => setMp3File(e.target.files?.[0] || null)}
                className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 w-full" />
            </div>

            <button
              onClick={createDelivery}
              disabled={loading || !prenom || !nomProjet || !previewFile || !wavFile || !mp3File}
              className="bg-blue-400 text-black px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? progressLabel || "Chargement…" : "Créer la livraison"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
