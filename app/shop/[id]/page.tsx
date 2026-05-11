"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Track = { id: string; titre: string; genre: string };

function ShopDownloadInner() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [track, setTrack] = useState<Track | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setError("Lien invalide."); setLoading(false); return; }

    // Récupère les infos de la track
    fetch("/api/shop")
      .then(r => r.json())
      .then((tracks: Track[]) => {
        const t = tracks.find(t => t.id === id);
        if (t) setTrack(t);
      });

    // Vérifie le paiement et récupère l'URL signée
    fetch(`/api/shop/download/${id}?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.url) setDownloadUrl(data.url);
        else setError("Paiement non confirmé ou lien expiré.");
      })
      .catch(() => setError("Erreur lors de la vérification."))
      .finally(() => setLoading(false));
  }, [id, sessionId]);

  const download = async () => {
    if (!downloadUrl) return;
    setDownloading(true);
    const res = await fetch(downloadUrl);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${track?.titre || "audio"}.wav`;
    a.click();
    URL.revokeObjectURL(a.href);
    setDownloading(false);
  };

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm text-center">
          {loading ? (
            <p className="text-zinc-400 text-sm animate-pulse">Vérification du paiement…</p>
          ) : error ? (
            <>
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <a href="/shop" className="text-blue-500 text-sm hover:underline">← Retour au shop</a>
            </>
          ) : (
            <>
              <p className="text-blue-500 font-semibold text-lg mb-1">Paiement reçu ✓</p>
              {track && <p className="text-zinc-500 text-sm mb-8">{track.titre}</p>}
              <button
                onClick={download}
                disabled={downloading}
                className="bg-blue-500 text-white px-8 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-50 w-full mb-3"
              >
                {downloading ? "Téléchargement…" : "↓ Télécharger le WAV"}
              </button>
              <p className="text-zinc-400 text-xs">Lien valable 1 heure. Téléchargez votre fichier maintenant.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ShopDownloadPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400 text-sm animate-pulse">Chargement…</p>
      </main>
    }>
      <ShopDownloadInner />
    </Suspense>
  );
}
