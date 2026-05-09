"use client";
import { useState } from "react";

export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);
    if (data.success) setSent(true);
    else alert("Erreur lors de l'envoi. Réessayez ou écrivez-moi directement.");
  };

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">

      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/" className="hover:text-blue-500 transition-colors">PERFORM</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          
          <a href="/contact" className="text-blue-500">CONTACT</a>
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
          
          <a href="/contact" className="text-blue-500">CONTACT</a>
        </div>
      )}

      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="w-full max-w-lg">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4 text-center">Contact</p>
          <h1 className="text-4xl font-bold mb-2 text-center">Bonjour.</h1>
          <p className="text-zinc-500 text-center mb-12">Une question, un projet, une collaboration — je vous réponds sous 48h.</p>

          {sent ? (
            <div className="border border-blue-500 rounded-2xl px-8 py-10 text-center">
              <p className="text-blue-500 font-semibold text-lg mb-2">Message reçu ✓</p>
              <p className="text-zinc-500 text-sm">Merci ! Je vous réponds dans les meilleurs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="source" value="contact" />
              <input
                name="nom"
                type="text"
                placeholder="Votre nom"
                required
                className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                name="email"
                type="email"
                placeholder="Votre email"
                required
                className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                name="prestation"
                type="text"
                placeholder="Sujet"
                required
                className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <textarea
                name="description"
                placeholder="Votre message"
                rows={5}
                required
                className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors mt-2 disabled:opacity-50"
              >
                {loading ? "Envoi…" : "Envoyer"}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-100 px-8 py-8 text-center text-zinc-400 text-sm">
        © 2026 E-Tario. Tous droits réservés.
      </footer>

    </main>
  );
}
