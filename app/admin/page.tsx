"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

type Client = { nom: string; email: string };
type Livraison = { code: string; prenom: string; nom_projet: string; solde: number; paiement_solde: boolean; created_at: string };
type ShopTrack = { id: string; titre: string; genre: string; prix: number; fichier_preview_url: string; fichier_wav_url: string; stripe_payment_link: string; cover_url: string | null; published: boolean; created_at: string };

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
  const [activeTab, setActiveTab] = useState<"livraisons" | "shop">("livraisons");

  // Shop state
  const [shopTracks, setShopTracks] = useState<ShopTrack[]>([]);
  const [shopTitre, setShopTitre] = useState("");
  const [shopGenre, setShopGenre] = useState("");
  const [shopPrix, setShopPrix] = useState("");
  const [shopPreviewFile, setShopPreviewFile] = useState<File | null>(null);
  const [shopWavFile, setShopWavFile] = useState<File | null>(null);
  const [shopCoverFile, setShopCoverFile] = useState<File | null>(null);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopProgressLabel, setShopProgressLabel] = useState("");
  const [shopSuccess, setShopSuccess] = useState(false);

  // Edit mode
  const [editingTrack, setEditingTrack] = useState<ShopTrack | null>(null);
  const [editTitre, setEditTitre] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editPrix, setEditPrix] = useState("");
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);

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
    fetch(`/api/admin/shop?password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setShopTracks(data); });
  }, [authenticated]);

  const fetchShopTracks = () => {
    fetch(`/api/admin/shop?password=${encodeURIComponent(password)}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setShopTracks(data); });
  };

  const uploadShopFile = async (file: File, id: string, type: "preview" | "wav" | "cover") => {
    setShopProgressLabel(type === "preview" ? "Upload aperçu MP3…" : "Upload WAV final…");
    const urlRes = await fetch("/api/shop/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, id, type }),
    });
    const urlData = await urlRes.json();
    if (!urlRes.ok) throw new Error(`Signed URL ${type} : ${urlData.error}`);
    const { url } = urlData;
    const contentType = type === "preview" ? "audio/mpeg" : type === "cover" ? "image/jpeg" : "audio/wav";
    const uploadRes = await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": contentType } });
    if (!uploadRes.ok) throw new Error(`Upload ${type} échoué : ${uploadRes.status}`);
  };

  const createShopTrack = async () => {
    if (!shopTitre || !shopGenre || !shopPrix || !shopPreviewFile || !shopWavFile) return;
    setShopLoading(true);
    const id = crypto.randomUUID();
    try {
      await uploadShopFile(shopPreviewFile, id, "preview");
      await uploadShopFile(shopWavFile, id, "wav");
      const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
      const fichier_preview_url = `${base}/shop/${id}/preview.mp3`;
      const fichier_wav_url = `${base}/shop/${id}/final.wav`;
      let cover_url: string | null = null;
      if (shopCoverFile) {
        setShopProgressLabel("Upload image…");
        await uploadShopFile(shopCoverFile, id, "cover");
        cover_url = `${base}/shop/${id}/cover.jpg`;
      }
      setShopProgressLabel("Création de la track…");
      const res = await fetch("/api/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, titre: shopTitre, genre: shopGenre, prix: Math.round(parseFloat(shopPrix) * 100), fichier_preview_url, fichier_wav_url, cover_url }),
      });
      if (res.ok) {
        setShopSuccess(true);
        setShopTitre(""); setShopGenre(""); setShopPrix("");
        setShopPreviewFile(null); setShopWavFile(null); setShopCoverFile(null);
        fetchShopTracks();
      } else {
        const err = await res.json();
        alert(`Erreur : ${err.error}`);
      }
    } catch (e: unknown) {
      alert(`Erreur : ${e instanceof Error ? e.message : JSON.stringify(e)}`);
    }
    setShopLoading(false);
    setShopProgressLabel("");
  };

  const startEditing = (track: ShopTrack) => {
    setEditingTrack(track);
    setEditTitre(track.titre);
    setEditGenre(track.genre);
    setEditPrix(track.prix ? String(track.prix / 100) : "");
    setEditCoverFile(null);
  };

  const cancelEditing = () => {
    setEditingTrack(null);
    setEditTitre(""); setEditGenre(""); setEditPrix(""); setEditCoverFile(null);
  };

  const saveEditTrack = async () => {
    if (!editingTrack || !editTitre || !editGenre || !editPrix) return;
    setEditLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
      let cover_url = editingTrack.cover_url;
      if (editCoverFile) {
        await uploadShopFile(editCoverFile, editingTrack.id, "cover");
        cover_url = `${base}/shop/${editingTrack.id}/cover.jpg`;
      }
      const res = await fetch(`/api/shop/${editingTrack.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          titre: editTitre,
          genre: editGenre,
          prix: Math.round(parseFloat(editPrix) * 100),
          cover_url,
        }),
      });
      if (res.ok) {
        cancelEditing();
        fetchShopTracks();
      } else {
        const err = await res.json();
        alert(`Erreur : ${err.error}`);
      }
    } catch (e: unknown) {
      alert(`Erreur : ${e instanceof Error ? e.message : JSON.stringify(e)}`);
    }
    setEditLoading(false);
  };

  const togglePublish = async (track: ShopTrack) => {
    await fetch(`/api/shop/${track.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, published: !track.published }),
    });
    fetchShopTracks();
  };

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
      <main className="min-h-screen text-zinc-900 flex flex-col">
        <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
          <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
          <div className="hidden md:flex gap-8 text-sm text-zinc-500">
            <a href="/" className="hover:text-blue-500 transition-colors">ACCUEIL</a>
            <a href="/services" className="hover:text-blue-500 transition-colors">SERVICES</a>
            <a href="/formations" className="hover:text-blue-500 transition-colors">FORMATIONS</a>
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
            <a href="/" className="hover:text-blue-500 transition-colors">ACCUEIL</a>
            <a href="/services" className="hover:text-blue-500 transition-colors">SERVICES</a>
            <a href="/formations" className="hover:text-blue-500 transition-colors">FORMATIONS</a>
            <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm flex flex-col gap-4">
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
          <a href="/" className="hover:text-blue-500 transition-colors">ACCUEIL</a>
          <a href="/services" className="hover:text-blue-500 transition-colors">SERVICES</a>
          <a href="/formations" className="hover:text-blue-500 transition-colors">FORMATIONS</a>
          
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
          <a href="/" className="hover:text-blue-500 transition-colors">ACCUEIL</a>
          <a href="/services" className="hover:text-blue-500 transition-colors">SERVICES</a>
          <a href="/formations" className="hover:text-blue-500 transition-colors">FORMATIONS</a>
          
          <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 border border-zinc-200 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("livraisons")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors ${activeTab === "livraisons" ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              Livraisons
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-widest uppercase transition-colors ${activeTab === "shop" ? "bg-blue-500 text-white" : "text-zinc-500 hover:text-zinc-900"}`}
            >
              Shop
            </button>
          </div>
          <span className="text-zinc-400 text-xs uppercase tracking-widest">Back-office</span>
        </div>

        {/* Onglet Shop */}
        {activeTab === "shop" && (
          <div className="flex gap-10 items-start">
            {/* Formulaire gauche — ajout ou édition */}
            <div className="flex-1 min-w-0">
              {editingTrack ? (
                /* Mode édition */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-zinc-500 text-xs tracking-widest uppercase">Modifier la track</p>
                    <button onClick={cancelEditing} className="text-zinc-400 text-xs hover:text-zinc-700 transition-colors">Annuler</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Titre" value={editTitre} onChange={e => setEditTitre(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Tag genre" value={editGenre} onChange={e => setEditGenre(e.target.value)} className={inputClass} />
                    <input type="number" placeholder="Prix (€)" value={editPrix} onChange={e => setEditPrix(e.target.value)} min={1} className={inputClass} />
                    <div className="border border-zinc-200 rounded-xl px-5 py-4">
                      <label className="text-sm text-zinc-500 block mb-1">
                        Image cover
                        {editingTrack.cover_url && <span className="text-zinc-400 ml-1">(une image existe déjà — remplacer ?)</span>}
                      </label>
                      {editingTrack.cover_url && !editCoverFile && (
                        <img src={editingTrack.cover_url} alt="cover actuelle" className="w-16 h-16 object-cover rounded-lg mb-2" />
                      )}
                      <input type="file" accept="image/*" onChange={e => setEditCoverFile(e.target.files?.[0] || null)}
                        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                    </div>
                    <button
                      onClick={saveEditTrack}
                      disabled={editLoading || !editTitre || !editGenre || !editPrix}
                      className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {editLoading ? "Enregistrement…" : "Enregistrer"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Mode ajout */
                <div>
                  <p className="text-zinc-500 text-xs tracking-widest uppercase mb-4">Nouvelle track</p>
                  {shopSuccess && <p className="text-blue-500 text-sm mb-4">Track ajoutée ✓</p>}
                  <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Titre" value={shopTitre} onChange={e => setShopTitre(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Tag genre (Hardstyle / Urban / Electro…)" value={shopGenre} onChange={e => setShopGenre(e.target.value)} className={inputClass} />
                    <input type="number" placeholder="Prix (€) — ex: 5" value={shopPrix} onChange={e => setShopPrix(e.target.value)} min={1} className={inputClass} />
                    <div className="border border-zinc-200 rounded-xl px-5 py-4">
                      <label className="text-sm text-zinc-500 block mb-1">Image cover <span className="text-zinc-400">(optionnel)</span></label>
                      <input type="file" accept="image/*" onChange={e => setShopCoverFile(e.target.files?.[0] || null)}
                        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                    </div>
                    <div className="border border-zinc-200 rounded-xl px-5 py-4">
                      <label className="text-sm text-zinc-500 block mb-1">Aperçu MP3 <span className="text-zinc-400">(watermarked — player public)</span></label>
                      <input type="file" accept=".mp3,audio/mpeg" onChange={e => setShopPreviewFile(e.target.files?.[0] || null)}
                        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                    </div>
                    <div className="border border-zinc-200 rounded-xl px-5 py-4">
                      <label className="text-sm text-zinc-500 block mb-1">WAV final <span className="text-zinc-400">(débloqué après achat)</span></label>
                      <input type="file" accept=".wav,audio/wav" onChange={e => setShopWavFile(e.target.files?.[0] || null)}
                        className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300 w-full" />
                    </div>
                    <button
                      onClick={createShopTrack}
                      disabled={shopLoading || !shopTitre || !shopGenre || !shopPrix || !shopPreviewFile || !shopWavFile}
                      className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {shopLoading ? shopProgressLabel || "Chargement…" : "Ajouter la track"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Liste des tracks */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-28">
                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Tracks ({shopTracks.length})</p>
                {shopTracks.length === 0 ? (
                  <p className="text-zinc-400 text-sm">Aucune track.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {shopTracks.map(track => (
                      <div
                        key={track.id}
                        className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${editingTrack?.id === track.id ? "border-blue-300 bg-blue-50" : "border-zinc-100"}`}
                      >
                        {track.cover_url && (
                          <img src={track.cover_url} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-900 truncate">{track.titre}</p>
                          <p className="text-xs text-zinc-400">{track.genre}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => startEditing(track)}
                            className="text-xs px-3 py-1.5 rounded-full font-semibold bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => togglePublish(track)}
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${track.published ? "bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500" : "bg-zinc-100 text-zinc-500 hover:bg-green-50 hover:text-green-600"}`}
                          >
                            {track.published ? "Publié" : "Publier"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "livraisons" && <div className="flex gap-10 items-start">

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

        </div>}

      </div>
    </main>
  );
}
