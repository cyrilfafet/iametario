"use client";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";

type Track = {
  id: string;
  titre: string;
  genre: string;
  fichier_preview_url: string;
  prix: number;
};

function useCoverArt(trackId: string) {
  const [cover, setCover] = useState<string | null>(null);
  useEffect(() => {
    if (!trackId) return;
    fetch(`/api/shop/cover/${trackId}`)
      .then(r => r.json())
      .then(data => { if (data.cover) setCover(data.cover); })
      .catch(() => {});
  }, [trackId]);
  return cover;
}

function useWaveform(url: string) {
  const [bars, setBars] = useState<number[]>([]);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => {
        if (cancelled) return null;
        const ctx = new AudioContext();
        return ctx.decodeAudioData(buf);
      })
      .then(audioBuffer => {
        if (!audioBuffer || cancelled) return;
        const data = audioBuffer.getChannelData(0);
        const N = 80;
        const block = Math.floor(data.length / N);
        const result: number[] = [];
        for (let i = 0; i < N; i++) {
          let sum = 0;
          for (let j = 0; j < block; j++) sum += Math.abs(data[i * block + j]);
          result.push(sum / block);
        }
        const max = Math.max(...result, 0.001);
        if (!cancelled) setBars(result.map(v => v / max));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url]);
  return bars;
}

function TrackPlayer({ track, isPlaying, onToggle }: { track: Track; isPlaying: boolean; onToggle: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const cover = useCoverArt(track.id);
  const bars = useWaveform(track.fichier_preview_url);
  const tags = track.genre.split(",").map(g => g.trim()).filter(Boolean);

  const handleBuy = async () => {
    if (track.prix === 0) {
      window.location.href = `/api/shop/free-download/${track.id}`;
      return;
    }
    setLoadingCheckout(true);
    const res = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: track.id }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoadingCheckout(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play();
    else audio.pause();
  }, [isPlaying]);

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = ratio * audio.duration;
      setProgress(ratio * 100);
    }
  };

  return (
    <div
      className="rounded-2xl p-4 transition-all"
      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.18)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,147,106,0.38)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,147,106,0.18)"; }}
    >
      {/* Ligne principale */}
      <div className="flex items-center gap-4 mb-4">
        {/* Cover */}
        <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: "rgba(184,147,106,0.1)", border: "1px solid rgba(184,147,106,0.2)" }}>
          {cover
            ? <img src={cover} alt={track.titre} className="w-full h-full object-cover" />
            : <span style={{ color: "rgba(184,147,106,0.4)", fontSize: 20 }}>♪</span>
          }
        </div>

        {/* Titre + tags */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate mb-1.5" style={{ color: "#F5EFE4" }}>{track.titre}</p>
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span key={tag} className="text-xs rounded-full px-2 py-0.5" style={{ color: "#B8936A", border: "1px solid rgba(184,147,106,0.35)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Prix + achat */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-base font-semibold" style={{ color: "#F5EFE4" }}>
            {track.prix === 0 ? "Free" : `${track.prix % 100 === 0 ? track.prix / 100 : (track.prix / 100).toFixed(2).replace(".", ",")}€`}
          </span>
          <button
            onClick={handleBuy}
            disabled={loadingCheckout}
            className="text-xs font-semibold tracking-widest uppercase transition-all disabled:opacity-50 min-w-[64px] px-4 py-2"
            style={{ backgroundColor: "#B8936A", color: "#0D0B08", borderRadius: 2 }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C9A96E"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#B8936A"; }}
          >
            {loadingCheckout ? "…" : track.prix === 0 ? "Download" : "Buy"}
          </button>
        </div>
      </div>

      {/* Ligne player */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0"
          style={{ border: "1px solid rgba(184,147,106,0.4)" }}
          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#B8936A"; b.style.backgroundColor = "rgba(184,147,106,0.12)"; }}
          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(184,147,106,0.4)"; b.style.backgroundColor = "transparent"; }}
        >
          {isPlaying ? (
            <span className="w-3 h-3 flex gap-0.5">
              <span className="w-1 h-full rounded-sm" style={{ backgroundColor: "#B8936A" }} />
              <span className="w-1 h-full rounded-sm" style={{ backgroundColor: "#B8936A" }} />
            </span>
          ) : (
            <span className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent ml-0.5" style={{ borderLeftColor: "#B8936A" }} />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1">
          {bars.length > 0 ? (
            <div className="flex items-end gap-px h-10 cursor-pointer w-full" onClick={seekTo}>
              {bars.map((h, i) => {
                const played = (i / bars.length) < (progress / 100);
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-full transition-colors"
                    style={{ height: `${Math.max(8, h * 100)}%`, backgroundColor: played ? "#B8936A" : "rgba(184,147,106,0.2)" }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="h-10 flex items-center">
              <input
                type="range" min={0} max={100} value={progress}
                onChange={e => {
                  const audio = audioRef.current;
                  if (!audio) return;
                  const v = Number(e.target.value);
                  audio.currentTime = (v / 100) * audio.duration;
                  setProgress(v);
                }}
                className="w-full h-1 cursor-pointer"
                style={{ accentColor: "#B8936A" }}
              />
            </div>
          )}
          <div className="flex justify-between text-xs" style={{ color: "rgba(245,239,228,0.3)" }}>
            <span>{fmt((progress / 100) * duration)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.fichier_preview_url}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (audio) setProgress((audio.currentTime / audio.duration) * 100);
        }}
        onEnded={() => { setProgress(0); onToggle(); }}
      />
    </div>
  );
}

export default function ShopPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/shop")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setTracks(data); })
      .finally(() => setLoading(false));
  }, []);

  const togglePlay = (id: string) => setPlaying(prev => prev === id ? null : id);

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0D0B08", color: "#F5EFE4" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 sticky top-0 z-50" style={{ backgroundColor: "rgba(13,11,8,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(184,147,106,0.1)" }}>
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-5 invert" /></a>
        <div className="hidden md:flex gap-8 text-xs tracking-widest" style={{ fontFamily: "var(--font-syne)" }}>
          <a href="/" className="transition-colors" style={{ color: "rgba(245,239,228,0.5)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F5EFE4"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,239,228,0.5)"; }}>ACCUEIL</a>
          <a href="/services" className="transition-colors" style={{ color: "rgba(245,239,228,0.5)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F5EFE4"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,239,228,0.5)"; }}>SERVICES</a>
          <a href="/formations" className="transition-colors" style={{ color: "rgba(245,239,228,0.5)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F5EFE4"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,239,228,0.5)"; }}>FORMATIONS</a>
          <a href="/shop" className="font-semibold" style={{ color: "#B8936A" }}>SHOP</a>
          <a href="/contact" className="transition-colors" style={{ color: "rgba(245,239,228,0.5)" }} onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#F5EFE4"; }} onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,239,228,0.5)"; }}>CONTACT</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-5 h-px transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ backgroundColor: "#F5EFE4" }} />
          <span className={`w-5 h-px transition-all ${menuOpen ? "opacity-0" : ""}`} style={{ backgroundColor: "#F5EFE4" }} />
          <span className={`w-5 h-px transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ backgroundColor: "#F5EFE4" }} />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 text-xs tracking-widest" style={{ borderBottom: "1px solid rgba(184,147,106,0.1)", fontFamily: "var(--font-syne)" }}>
          <a href="/" onClick={() => setMenuOpen(false)} style={{ color: "rgba(245,239,228,0.5)" }}>ACCUEIL</a>
          <a href="/services" onClick={() => setMenuOpen(false)} style={{ color: "rgba(245,239,228,0.5)" }}>SERVICES</a>
          <a href="/formations" onClick={() => setMenuOpen(false)} style={{ color: "rgba(245,239,228,0.5)" }}>FORMATIONS</a>
          <a href="/shop" onClick={() => setMenuOpen(false)} className="font-semibold" style={{ color: "#B8936A" }}>SHOP</a>
          <a href="/contact" onClick={() => setMenuOpen(false)} style={{ color: "rgba(245,239,228,0.5)" }}>CONTACT</a>
        </div>
      )}

      {/* Hero */}
      <div className="text-center px-8 pt-20 pb-14">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#B8936A" }}>Shop</p>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontSize: "clamp(2.8rem, 6vw, 4.5rem)", color: "#F5EFE4", lineHeight: 1.1 }}>
          Ready to drop.
        </h1>
        <p className="mt-4 text-sm" style={{ color: "rgba(245,239,228,0.45)" }}>Fichiers WAV haute qualité · Téléchargement instantané</p>
      </div>

      <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(184,147,106,0.3), transparent)" }} />

      {/* Tracks */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl p-4 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.1)" }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ backgroundColor: "rgba(184,147,106,0.08)" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 rounded-full w-2/3" style={{ backgroundColor: "rgba(184,147,106,0.1)" }} />
                    <div className="h-3 rounded-full w-1/3" style={{ backgroundColor: "rgba(184,147,106,0.07)" }} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-4 rounded-full w-10" style={{ backgroundColor: "rgba(184,147,106,0.1)" }} />
                    <div className="h-8 rounded w-16" style={{ backgroundColor: "rgba(184,147,106,0.1)" }} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: "rgba(184,147,106,0.08)" }} />
                  <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: "rgba(184,147,106,0.06)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <p className="text-sm text-center py-16" style={{ color: "rgba(245,239,228,0.3)" }}>Aucun audio disponible pour le moment.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tracks.map(track => (
              <TrackPlayer
                key={track.id}
                track={track}
                isPlaying={playing === track.id}
                onToggle={() => togglePlay(track.id)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
