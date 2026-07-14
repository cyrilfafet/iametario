"use client";
import { useState } from "react";
import Footer from "@/components/Footer";

type Pillar = {
  id: number;
  label: string;
  label2?: string;
  color: string;
  description: string;
  path: string;
  tx: number;
  ty: number;
};

const pillars: Pillar[] = [
  {
    id: 0,
    label: "Mixer",
    color: "#60a5fa",
    description: "Les bases du mixage jusqu'au set complet. Vidéo explicative + vidéo exercice par chapitre.",
    path: "M 100 100 L 100 6 A 94 94 0 0 1 181.41 147 Z",
    tx: 152, ty: 72,
  },
  {
    id: 1,
    label: "Psychologie",
    label2: "& Réseau",
    color: "#818cf8",
    description: "La mentalité pour faire danser, évoluer dans le milieu et décrocher une résidence. Comment entrer en contact et être crédible auprès des pros.",
    path: "M 100 100 L 181.41 147 A 94 94 0 0 1 18.59 147 Z",
    tx: 100, ty: 158,
  },
  {
    id: 2,
    label: "Produire",
    label2: "ton son",
    color: "#a78bfa",
    description: "Crée tes propres remix de A à Z. Les bases pour devenir producteur.",
    path: "M 100 100 L 18.59 147 A 94 94 0 0 1 100 6 Z",
    tx: 48, ty: 72,
  },
];

export default function Teaching() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState<number | null>(null);
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
    <main className="min-h-screen text-zinc-900 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/" className="hover:text-blue-500 transition-colors">ACCUEIL</a>
          <a href="/services" className="hover:text-indigo-400 transition-colors">SERVICES</a>
          <a href="/formations" className="font-medium" style={{ color: "#a78bfa" }}>FORMATIONS</a>
          
          <a href="/shop" className="hover:text-zinc-900 transition-colors">SHOP</a>
          <a href="/contact" className="hover:text-zinc-600 transition-colors">CONTACT</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b border-zinc-100 text-sm text-zinc-500">
          <a href="/" onClick={() => setMenuOpen(false)} className="hover:text-blue-500 transition-colors">ACCUEIL</a>
          <a href="/services" onClick={() => setMenuOpen(false)} className="hover:text-indigo-400 transition-colors">SERVICES</a>
          <a href="/formations" onClick={() => setMenuOpen(false)} className="font-medium" style={{ color: "#a78bfa" }}>FORMATIONS</a>
          <a href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-zinc-900 transition-colors">SHOP</a>
          <a href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-zinc-600 transition-colors">CONTACT</a>
        </div>
      )}

      <div className="flex-1 px-6 py-16 max-w-2xl mx-auto w-full">

        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-3">
            Devenir DJ résident
          </h1>
          <p className="text-zinc-400 text-sm mb-5">Formation disponible en septembre 2026.</p>
          <p className="text-zinc-500 text-base leading-relaxed">
            La plupart te vendent les jets privés et les paillettes, je te propose la stabilité. Une formation complète pour devenir DJ résident : la technique, la mentalité, la créativité.
          </p>
        </div>

        {/* Intro */}
        <div className="text-center mb-20">
          <a href="/" className="inline-block bg-violet-400 text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-violet-500 transition-colors">
            Qui suis-je pour t'apprendre ?
          </a>
        </div>

        {/* Camembert centré */}
        <div className="flex flex-col items-center mb-4">
          <svg viewBox="0 0 200 200" width="300" height="300" className="drop-shadow-md">
            {pillars.map(p => (
              <path
                key={p.id}
                d={p.path}
                fill={p.color}
                stroke="#ffffff"
                strokeWidth="2.5"
                opacity={activePillar === null || activePillar === p.id ? 1 : 0.3}
                className="cursor-pointer transition-opacity duration-200"
                onClick={() => togglePillar(p.id)}
              />
            ))}
            <circle cx="100" cy="100" r="32" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1.5" />
            <text x="100" y="97" textAnchor="middle" fill="#111111" fontSize="7" fontWeight="700" letterSpacing="1.5">DJ</text>
            <text x="100" y="109" textAnchor="middle" fill="#111111" fontSize="7" fontWeight="700" letterSpacing="1.5">RÉSIDENT</text>
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
                <tspan x={p.tx} dy="0">{p.label}</tspan>
                {p.label2 && <tspan x={p.tx} dy="10">{p.label2}</tspan>}
              </text>
            ))}
          </svg>
          <p className="text-zinc-400 text-xs text-center mt-2">Clique sur un pilier pour en savoir plus</p>
        </div>

        {/* Description pilier actif */}
        <div className="min-h-[60px] mb-12">
          {activePillar !== null && (
            <div
              className="border rounded-xl px-5 py-4 transition-all"
              style={{ borderColor: pillars[activePillar].color + "50", background: pillars[activePillar].color + "08" }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: pillars[activePillar].color }}>
                {pillars[activePillar].label}{pillars[activePillar].label2 ? " " + pillars[activePillar].label2 : ""}
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed">
                {pillars[activePillar].description}
              </p>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="border-t border-zinc-200 pt-14 mb-20">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-6 text-center">Tarifs</p>

          {/* Formation complète */}
          <div className="border-2 border-violet-400 rounded-2xl px-6 py-6 mb-6 text-center relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-400 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase">Recommandé</span>
            <p className="text-zinc-900 font-bold text-lg mb-4">Formation complète</p>
            <div className="flex flex-wrap justify-center gap-2 mb-5">
              <div className="rounded-xl px-3 py-2 text-center" style={{ background: "#60a5fa22", border: "1px solid #60a5fa55" }}>
                <p className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#60a5fa" }}>Mixer</p>
              </div>
              <div className="rounded-xl px-3 py-2 text-center" style={{ background: "#a78bfa22", border: "1px solid #a78bfa55" }}>
                <p className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#a78bfa" }}>Produire ton son</p>
              </div>
              <div className="rounded-xl px-3 py-2 text-center relative" style={{ background: "#818cf822", border: "1px solid #818cf855" }}>
                <span className="absolute -top-2.5 right-1 text-xs leading-none">⭐</span>
                <p className="text-[11px] font-semibold whitespace-nowrap" style={{ color: "#818cf8" }}>Psychologie & Réseau</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-zinc-900">169€</p>
          </div>

          {/* Modules séparés */}
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4 text-center">Modules séparés</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-zinc-200 rounded-xl px-4 py-4 text-center">
              <p className="text-zinc-900 font-semibold text-sm mb-1">Apprendre à mixer</p>
              <p className="text-2xl font-bold text-zinc-900">79€</p>
            </div>
            <div className="border border-zinc-200 rounded-xl px-4 py-4 text-center">
              <p className="text-zinc-900 font-semibold text-sm mb-1">Produire ton son</p>
              <p className="text-2xl font-bold text-zinc-900">79€</p>
            </div>
          </div>
          <p className="text-zinc-400 text-xs text-center">
            Le module <span className="text-zinc-500 font-medium">Psychologie & Réseau</span> est uniquement disponible dans la formation complète.
          </p>
        </div>

        {/* Early bird */}
        <div className="border-t border-zinc-200 pt-14 pb-8">
          {submitted ? (
            <p className="text-violet-400 text-sm text-center">Tu bénéficieras de -10% à la sortie ✓</p>
          ) : (
            <>
              <h2 className="text-xl font-bold text-center mb-2">Formation disponible en septembre 2026.</h2>
              <p className="text-zinc-500 text-sm text-center mb-8">Inscris-toi maintenant et bénéficie de <span className="text-zinc-900 font-semibold">-10%</span> à la sortie.</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Ton email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-violet-400 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-violet-500 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "…" : "J'en profite"}
                </button>
              </form>
              <p className="text-zinc-400 text-xs text-center mt-3">Aucun spam. Un seul email à la sortie.</p>
            </>
          )}
        </div>

      </div>
      <Footer />
    </main>
  );
}
