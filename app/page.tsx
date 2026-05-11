"use client";
import { useState } from "react";
import Footer from "@/components/Footer";

const cards = [
  {
    label: "PERFORM",
    desc: "DJ depuis 2014 · 1500+ sets · Résident Baltazar Dijon",
    href: "/perform",
  },
  {
    label: "CREATE",
    desc: "Intros DJ, entrées mariés, montages audio sur mesure",
    href: "/creation",
  },
  {
    label: "TEACH",
    desc: "Formation pour devenir DJ résident · Disponible septembre 2026",
    href: "/teaching",
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/perform" className="hover:text-blue-500 transition-colors">PERFORM</a>
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
          <a href="/perform" className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
      )}

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <img src="/Logo _V1_black.png" alt="E-Tario" className="h-8 md:h-10 mb-6" />
        <p className="text-zinc-500 text-base md:text-lg tracking-wide">
          DJ professionnel · Créateur audio · Formateur
        </p>

        {/* Blocs */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {cards.map(card => (
            <a
              key={card.label}
              href={card.href}
              className="group border border-zinc-200 rounded-2xl px-6 py-8 text-left hover:border-blue-500 transition-colors"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 group-hover:text-blue-500 transition-colors mb-3">
                {card.label}
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">{card.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
