"use client";
import { useState } from "react";
import Footer from "@/components/Footer";

const cards = [
  { num: "01", label: "PERFORM", desc: "Réserve une date",               href: "/perform",  color: "#3B82F6" },
  { num: "02", label: "CREATE",  desc: "Commande un montage audio",      href: "/creation", color: "#818cf8" },
  { num: "03", label: "TEACH",   desc: "Apprends à devenir DJ résident", href: "/teaching", color: "#a78bfa" },
];

function Row({ num, label, desc, href, color }: typeof cards[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      className="group flex items-center justify-between px-8 py-7 border-t border-zinc-100 transition-all duration-200 cursor-pointer"
      style={{
        backgroundColor: hovered ? color + "08" : "transparent",
        borderLeftWidth: "3px",
        borderLeftColor: hovered ? color : "transparent",
        borderLeftStyle: "solid",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-8">
        <span
          className="text-xs font-mono transition-colors duration-200 w-6 shrink-0"
          style={{ color: hovered ? color : "#d4d4d8" }}
        >
          {num}
        </span>
        <div>
          <p
            className="text-xl md:text-2xl font-bold tracking-tight transition-colors duration-200"
            style={{ color: hovered ? color : "#18181b" }}
          >
            {label}
          </p>
          <p className="text-sm text-zinc-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <span
        className="text-2xl transition-all duration-200"
        style={{
          color: hovered ? color : "#d4d4d8",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
        }}
      >
        →
      </span>
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
          <a href="/creation" className="hover:text-indigo-400 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-violet-400 transition-colors">TEACH</a>
          <a href="/shop"     className="hover:text-zinc-900 transition-colors">SHOP</a>
          <a href="/contact"  className="hover:text-zinc-600 transition-colors">CONTACT</a>
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
          <a href="/shop"     className="hover:text-zinc-900 transition-colors">SHOP</a>
          <a href="/contact"  className="hover:text-zinc-600 transition-colors">CONTACT</a>
        </div>
      )}

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full px-8 py-16">

        {/* Identity */}
        <div className="mb-16">
          <img src="/Logo _V1_black.png" alt="E-Tario" className="h-10 md:h-14 mb-5" />
          <p className="text-zinc-400 text-sm tracking-widest uppercase">
            DJ professionnel · Créateur audio · Formateur
          </p>
        </div>

        {/* Rows */}
        <div className="border-b border-zinc-100">
          {cards.map(card => <Row key={card.label} {...card} />)}
        </div>

      </div>

      <Footer />
    </main>
  );
}
