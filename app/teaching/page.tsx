"use client";
import { useState } from "react";

type Pillar = {
  id: number;
  label: string;
  color: string;
  description: string;
  path: string;
  tx: number;
  ty: number;
};

const pillars: Pillar[] = [
  {
    id: 0,
    label: "Technique",
    color: "#60a5fa",
    description: "Animer une soirée, de la préparation au set final. Chaque chapitre inclut une vidéo explicative + une vidéo exercice.",
    path: "M 100 100 L 100 6 A 94 94 0 0 1 181.41 147 Z",
    tx: 150, ty: 70,
  },
  {
    id: 1,
    label: "Psychologie",
    color: "#818cf8",
    description: "La mentalité pour faire danser les gens et décrocher une résidence.",
    path: "M 100 100 L 181.41 147 A 94 94 0 0 1 18.59 147 Z",
    tx: 100, ty: 158,
  },
  {
    id: 2,
    label: "Social",
    color: "#a78bfa",
    description: "Comment entrer en contact avec les pros et être pris au sérieux.",
    path: "M 100 100 L 18.59 147 A 94 94 0 0 1 100 6 Z",
    tx: 50, ty: 70,
  },
];

const priceOptions = [
  { value: "<50", label: "Moins de 50€" },
  { value: "50-100", label: "50€ — 100€" },
  { value: "100-150", label: "100€ — 150€" },
  { value: ">150", label: "Plus de 150€" },
];

export default function Teaching() {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePillar = (id: number) => setActivePillar(prev => prev === id ? null : id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/" className="hover:text-blue-400 transition-colors">PERFORM</a>
          <a href="/teaching" className="text-blue-400">TEACH</a>
          <a href="/creation" className="hover:text-blue-400 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      <div className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">

        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-5">
            "Devenir DJ résident ne s'apprend pas qu'aux platines."
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            La formation qui t'apprend la technique, la mentalité et le réseau pour décrocher ta première résidence.
          </p>
        </div>

        {/* Intro */}
        <p className="text-zinc-500 text-sm leading-relaxed text-center max-w-md mx-auto mb-20">
          La plupart des formations DJ t'apprennent à mixer. Celle-ci va plus loin : comment penser comme un professionnel, comment te comporter avec les acteurs du milieu, et comment animer une vraie soirée du début à la fin.
        </p>

        {/* Deux cercles + Pack */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">

          {/* Cercle 1 — DJ Résident */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Formation DJ Résident</p>
            <svg
              viewBox="0 0 200 200"
              width="280"
              height="280"
              className="drop-shadow-md"
            >
              {pillars.map(p => (
                <path
                  key={p.id}
                  d={p.path}
                  fill={p.color}
                  stroke="#000"
                  strokeWidth="2.5"
                  opacity={activePillar === null || activePillar === p.id ? 1 : 0.3}
                  className="cursor-pointer transition-opacity duration-200"
                  onClick={() => togglePillar(p.id)}
                />
              ))}
              {/* Centre */}
              <circle cx="100" cy="100" r="32" fill="#0a0a0a" stroke="#27272a" strokeWidth="1.5" />
              <text x="100" y="97" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="700" letterSpacing="1.5">DJ</text>
              <text x="100" y="109" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="700" letterSpacing="1.5">RÉSIDENT</text>
              {/* Labels sections */}
              {pillars.map(p => (
                <text
                  key={p.id}
                  x={p.tx}
                  y={p.ty}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="7.5"
                  fontWeight="700"
                  className="cursor-pointer select-none pointer-events-none"
                  opacity={activePillar === null || activePillar === p.id ? 1 : 0.3}
                >
                  {p.label}
                </text>
              ))}
            </svg>
          </div>

          {/* Pack connector */}
          <div className="flex md:flex-col items-center gap-2">
            <div className="w-8 h-px md:w-px md:h-8 bg-zinc-700" />
            <div className="border border-zinc-700 rounded-xl px-3 py-2 text-center">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest">Pack</p>
              <p className="text-blue-400 text-xs mt-0.5">Prix réduit</p>
            </div>
            <div className="w-8 h-px md:w-px md:h-8 bg-zinc-700" />
          </div>

          {/* Cercle 2 — Mashup */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-zinc-500 uppercase tracking-widest">Formation Mashup</p>
            <div
              className="w-[280px] h-[280px] rounded-full border border-zinc-700 flex flex-col items-center justify-center text-center px-10 hover:border-zinc-500 transition-colors"
              style={{ background: "radial-gradient(circle at center, #1a1a1a, #0a0a0a)" }}
            >
              <p className="text-white font-bold text-sm mb-2">FL Studio</p>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Crée tes propres mashups de A à Z. Aucun prérequis logiciel.
              </p>
            </div>
          </div>
        </div>

        <p className="text-zinc-700 text-xs text-center mb-6">Clique sur un pilier pour en savoir plus</p>

        {/* Description pilier actif */}
        <div className="min-h-[56px] mb-6">
          {activePillar !== null && (
            <div
              className="border rounded-xl px-5 py-4 transition-all"
              style={{ borderColor: pillars[activePillar].color + "50", background: pillars[activePillar].color + "08" }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: pillars[activePillar].color }}>
                {pillars[activePillar].label}
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {pillars[activePillar].description}
              </p>
            </div>
          )}
        </div>

        {/* Description Mashup */}
        <div className="border border-zinc-800 rounded-xl px-5 py-4 mb-20 text-center">
          <p className="text-zinc-400 text-sm leading-relaxed">
            <span className="text-white font-semibold">Formation Mashup</span> — Crée tes propres mashups de A à Z sur FL Studio.
            Idéal pour te démarquer dès tes premiers sets. S'adresse aux débutants complets, aucun prérequis logiciel.
          </p>
        </div>

        {/* Sondage pricing */}
        <div className="border-t border-zinc-800 pt-14 mb-20">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Sondage</p>
          <h2 className="text-xl font-bold mb-1">La formation est prévue pour septembre 2026.</h2>
          <p className="text-zinc-500 text-sm mb-8">Aide-moi à la calibrer.</p>
          <p className="text-zinc-300 text-sm mb-5">
            Pour une formation complète (technique + psychologie + réseau) pour devenir DJ résident, tu mettrais...
          </p>
          <div className="grid grid-cols-2 gap-3">
            {priceOptions.map(opt => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                  price === opt.value
                    ? "border-blue-400 bg-blue-400/10 text-white"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="price"
                  value={opt.value}
                  checked={price === opt.value}
                  onChange={() => setPrice(opt.value)}
                  className="accent-blue-400"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="border-t border-zinc-800 pt-14 pb-8">
          {submitted ? (
            <p className="text-blue-400 text-sm text-center">Tu seras prévenu en avant-première ✓</p>
          ) : (
            <>
              <p className="text-zinc-300 text-sm text-center mb-6">Je veux être notifié en avant-première</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Ton email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-400 text-black px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "…" : "Me prévenir"}
                </button>
              </form>
              <p className="text-zinc-700 text-xs text-center mt-3">Aucun spam. Un seul email à la sortie.</p>
            </>
          )}
        </div>

      </div>
    </main>
  );
}
