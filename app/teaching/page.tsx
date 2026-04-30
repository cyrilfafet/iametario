"use client";
import { useState } from "react";

export default function Teaching() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      setSent(true);
    }
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

      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <p className="text-zinc-600 text-sm tracking-widest uppercase mb-4">Bientôt disponible</p>
        <h1 className="text-4xl font-bold mb-4">Teach</h1>
        <p className="text-zinc-500 max-w-sm mb-12">
          La formation DJ Résident est en cours de préparation. Laisse ton email pour être prévenu en premier.
        </p>

        {sent ? (
          <p className="text-blue-400 text-sm tracking-widest uppercase">Tu seras prévenu !</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-sm">
            <input
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-400 text-black px-5 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors"
            >
              {loading ? "..." : "OK"}
            </button>
          </form>
        )}

        <a href="/" className="mt-10 text-sm text-zinc-500 hover:text-white transition-colors">← Retour</a>
      </div>
    </main>
  );
}