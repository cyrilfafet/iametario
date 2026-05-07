"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Livraison = {
  code: string;
  prenom: string;
  nom_projet: string;
  message: string;
  fichier_preview_url: string;
  fichier_wav_url: string;
  fichier_mp3_url: string;
  solde: number;
  paiement_solde: boolean;
};

function LivraisonInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = params.code as string;

  const [livraison, setLivraison] = useState<Livraison | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showRevision, setShowRevision] = useState(false);
  const [revisionMsg, setRevisionMsg] = useState("");
  const [revisionSent, setRevisionSent] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setPaymentSuccess(true);
    }
  }, [searchParams]);

  const fetchLivraison = () => {
    fetch(`/api/livraison/${code}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setNotFound(true);
        else setLivraison(data);
      });
  };

  useEffect(() => {
    fetchLivraison();
  }, [code]);

  // Re-fetch after payment success to get updated paiement_solde
  useEffect(() => {
    if (paymentSuccess && livraison && !livraison.paiement_solde) {
      const timer = setTimeout(fetchLivraison, 2000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, livraison]);

  const download = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const sendRevision = async () => {
    if (!livraison || !revisionMsg.trim()) return;
    const res = await fetch("/api/revision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: livraison.code,
        prenom: livraison.prenom,
        nom_projet: livraison.nom_projet,
        message: revisionMsg,
      }),
    });
    const data = await res.json();
    if (data.success) setRevisionSent(true);
  };

  const paySolde = async () => {
    if (!livraison) return;
    setLoadingCheckout(true);
    const res = await fetch("/api/livraison/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: livraison.code }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Erreur lors du paiement");
      setLoadingCheckout(false);
    }
  };

  if (notFound) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-zinc-500">Livraison introuvable.</p>
    </main>
  );

  if (!livraison) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-zinc-600 text-sm animate-pulse">Chargement…</p>
    </main>
  );

  const isUnlocked = livraison.paiement_solde || !livraison.solde;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      <img src="/Logo_2k26v2.png" alt="E-Tario" className="h-5 mb-16" />

      <div className="w-full max-w-lg">
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-3">Livraison privée</p>
        <h1 className="text-3xl font-bold mb-1">Bonjour {livraison.prenom}</h1>
        <p className="text-zinc-400 text-lg mb-10">{livraison.nom_projet}</p>

        {/* Bandeau paiement success */}
        {paymentSuccess && (
          <div className="border border-blue-400 rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-blue-400 text-sm font-semibold">Paiement reçu — vos fichiers sont déverrouillés ✓</p>
          </div>
        )}

        {/* Player aperçu */}
        <div className="border border-zinc-800 rounded-2xl px-6 py-5 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:border-blue-400 transition-colors flex-shrink-0"
            >
              {playing ? (
                <span className="w-3 h-3 flex gap-0.5">
                  <span className="w-1 h-full bg-white rounded-sm" />
                  <span className="w-1 h-full bg-white rounded-sm" />
                </span>
              ) : (
                <span className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent border-l-white ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium">{livraison.nom_projet}</p>
              <p className="text-xs text-zinc-500">Aperçu</p>
            </div>
          </div>
          <input
            type="range" min={0} max={100} value={progress}
            onChange={e => {
              const audio = audioRef.current;
              if (!audio) return;
              const v = Number(e.target.value);
              audio.currentTime = (v / 100) * audio.duration;
              setProgress(v);
            }}
            className="w-full h-1 accent-blue-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            <span>{fmt((progress / 100) * duration)}</span>
            <span>{fmt(duration)}</span>
          </div>
          <audio
            ref={audioRef}
            src={livraison.fichier_preview_url || livraison.fichier_mp3_url}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            onTimeUpdate={() => {
              const audio = audioRef.current;
              if (audio) setProgress((audio.currentTime / audio.duration) * 100);
            }}
            onEnded={() => { setPlaying(false); setProgress(0); }}
          />
        </div>

        {/* Téléchargements */}
        {isUnlocked ? (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              onClick={() => download(livraison.fichier_wav_url, `${livraison.nom_projet}.wav`)}
              className="flex flex-col items-center gap-1 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-300 hover:border-blue-400 hover:text-white transition-colors"
            >
              <span>↓ WAV</span>
              <span className="text-zinc-600 text-xs">Haute qualité</span>
            </button>
            <button
              onClick={() => download(livraison.fichier_mp3_url, `${livraison.nom_projet}.mp3`)}
              className="flex flex-col items-center gap-1 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-300 hover:border-blue-400 hover:text-white transition-colors"
            >
              <span>↓ MP3</span>
              <span className="text-zinc-600 text-xs">Standard</span>
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-3 mb-4 opacity-40 pointer-events-none select-none">
              <div className="flex flex-col items-center gap-1 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-500">
                <span>🔒 WAV</span>
                <span className="text-zinc-700 text-xs">Haute qualité</span>
              </div>
              <div className="flex flex-col items-center gap-1 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-zinc-500">
                <span>🔒 MP3</span>
                <span className="text-zinc-700 text-xs">Standard</span>
              </div>
            </div>
            <div className="border border-zinc-800 rounded-xl px-5 py-4 text-center">
              <p className="text-zinc-400 text-sm mb-1">
                Solde restant : <span className="text-white font-semibold">{livraison.solde} €</span>
              </p>
              <p className="text-zinc-600 text-xs mb-4">Les fichiers finaux seront déverrouillés automatiquement après paiement.</p>
              <button
                onClick={paySolde}
                disabled={loadingCheckout}
                className="bg-blue-400 text-black px-6 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors disabled:opacity-50"
              >
                {loadingCheckout ? "Redirection…" : `Payer ${livraison.solde} €`}
              </button>
            </div>
          </div>
        )}

        {/* Message perso */}
        {livraison.message && (
          <div className="border-l-2 border-blue-400 pl-4 mb-8">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Message</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{livraison.message}</p>
          </div>
        )}

        {/* Révision */}
        <div className="border-t border-zinc-900 pt-6">
          {revisionSent ? (
            <p className="text-blue-400 text-sm text-center">Demande de révision envoyée ✓</p>
          ) : showRevision ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={revisionMsg}
                onChange={e => setRevisionMsg(e.target.value)}
                placeholder="Décrivez les modifications souhaitées…"
                rows={4}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={sendRevision}
                  disabled={!revisionMsg.trim()}
                  className="flex-1 bg-blue-400 text-black px-4 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors disabled:opacity-40"
                >
                  Envoyer
                </button>
                <button
                  onClick={() => setShowRevision(false)}
                  className="px-4 py-3 border border-zinc-800 rounded-xl text-xs text-zinc-500 hover:border-zinc-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowRevision(true)}
              className="w-full border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-400 hover:border-blue-400 hover:text-white transition-colors"
            >
              Demander une révision
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LivraisonPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-600 text-sm animate-pulse">Chargement…</p>
      </main>
    }>
      <LivraisonInner />
    </Suspense>
  );
}
