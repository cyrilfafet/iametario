"use client";
import { useState, useEffect, useRef } from "react";

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
    <div className="border border-zinc-200 rounded-2xl p-4 hover:border-blue-500 transition-colors">
      {/* Ligne principale */}
      <div className="flex items-center gap-4 mb-3">
        {/* Cover */}
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center">
          {cover
            ? <img src={cover} alt={track.titre} className="w-full h-full object-cover" />
            : <span className="text-zinc-300 text-xl">♪</span>
          }
        </div>

        {/* Titre + tags */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate mb-1">{track.titre}</p>
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span key={tag} className="text-xs text-blue-500 border border-blue-500/40 rounded-full px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Prix + achat */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-base font-bold text-zinc-900">{(track.prix / 100).toFixed(0)}€</span>
          <button
            onClick={handleBuy}
            disabled={loadingCheckout}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-50"
          >
            {loadingCheckout ? "…" : "Buy"}
          </button>
        </div>
      </div>

      {/* Ligne player */}
      <div className="flex items-center gap-3">
        {/* Bouton play */}
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-blue-500 transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <span className="w-3 h-3 flex gap-0.5">
              <span className="w-1 h-full bg-zinc-900 rounded-sm" />
              <span className="w-1 h-full bg-zinc-900 rounded-sm" />
            </span>
          ) : (
            <span className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[9px] border-transparent border-l-zinc-900 ml-0.5" />
          )}
        </button>

        {/* Waveform ou fallback range */}
        <div className="flex-1 flex flex-col gap-1">
          {bars.length > 0 ? (
            <div
              className="flex items-end gap-px h-10 cursor-pointer w-full"
              onClick={seekTo}
            >
              {bars.map((h, i) => {
                const played = (i / bars.length) < (progress / 100);
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${played ? "bg-blue-500" : "bg-zinc-200"}`}
                    style={{ height: `${Math.max(8, h * 100)}%` }}
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
                className="w-full h-1 accent-blue-500 cursor-pointer"
              />
            </div>
          )}
          <div className="flex justify-between text-xs text-zinc-400">
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
    <main className="min-h-screen text-zinc-900 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
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

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 text-center">
        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">Shop</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-3">Ready to drop.</h1>
        <p className="text-zinc-500 text-base mb-12">High quality WAV files. Instant download after payment.</p>

        {loading ? (
          <p className="text-zinc-400 text-sm animate-pulse text-center py-12">Loading…</p>
        ) : tracks.length === 0 ? (
          <p className="text-zinc-400 text-sm text-center py-12">No audio available yet.</p>
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

      <footer className="border-t border-zinc-100 px-8 py-8 text-center text-zinc-400 text-sm">
        © 2026 E-Tario. All rights reserved.
      </footer>
    </main>
  );
}
