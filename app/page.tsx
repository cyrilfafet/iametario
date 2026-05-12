"use client";
import { useState } from "react";
import Footer from "@/components/Footer";

const cards = [
  { label: "PERFORM", desc: "Réserve une date",              href: "/perform",  color: "#3B82F6" },
  { label: "CREATE",  desc: "Commande un montage audio",     href: "/creation", color: "#818cf8" },
  { label: "TEACH",   desc: "Apprends à devenir DJ résident",href: "/teaching", color: "#a78bfa" },
];

function Card({ label, desc, href, color }: typeof cards[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      className="border border-zinc-200 rounded-2xl px-6 py-8 text-left transition-colors"
      style={{ borderColor: hovered ? color : "" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-3 transition-colors"
        style={{ color: hovered ? color : "#a1a1aa" }}
      >
        {label}
      </p>
      <p className="text-sm text-zinc-600 leading-relaxed">{desc}</p>
    </a>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/perform"  className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="transition-colors" style={{ color: "" }} onMouseEnter={e => (e.currentTarget.style.color = "#818cf8")} onMouseLeave={e => (e.currentTarget.style.color = "")}>CREATE</a>
          <a href="/teaching" className="transition-colors" style={{ color: "" }} onMouseEnter={e => (e.currentTarget.style.color = "#a78bfa")} onMouseLeave={e => (e.currentTarget.style.color = "")}>TEACH</a>
          <a href="/contact"  className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b border-zinc-100 text-sm text-zinc-500">
          <a href="/perform"  className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="hover:text-indigo-400 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-violet-400 transition-colors">TEACH</a>
          <a href="/contact"  className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <img src="/Logo _V1_black.png" alt="E-Tario" className="h-8 md:h-10 mb-6" />
        <p className="text-zinc-500 text-base md:text-lg tracking-wide">
          DJ professionnel · Créateur audio · Formateur
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          {cards.map(card => <Card key={card.label} {...card} />)}
        </div>
      </div>

      <Footer />
    </main>
  );
}
