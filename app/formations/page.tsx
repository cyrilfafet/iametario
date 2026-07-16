"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

type Creneau = { id: string; date: string; heure_debut: string; duree_min: number };

export default function Formations() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Booking widget
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookingNom, setBookingNom] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetch("/api/creneaux")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCreneaux(data); })
      .catch(() => {});
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !bookingNom || !bookingEmail) return;
    setBookingLoading(true);
    setBookingError("");
    const res = await fetch("/api/creneaux/reserver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, nom: bookingNom, email: bookingEmail, message: bookingMsg }),
    });
    const data = await res.json();
    if (data.success) {
      setBookingDone(true);
    } else {
      setBookingError(data.error === "Créneau non disponible" ? "Ce créneau vient d'être pris. Choisis-en un autre." : "Une erreur est survenue, réessaie.");
      setSelectedId(null);
    }
    setBookingLoading(false);
  };

  // Group slots by date
  const byDate = creneaux.reduce<Record<string, Creneau[]>>((acc, c) => {
    (acc[c.date] ??= []).push(c);
    return acc;
  }, {});

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
        <div className="mb-16">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-5">Formations</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Partager ce que j'ai mis<br className="hidden md:block" /> 10 ans à apprendre.
          </h1>
        </div>

        {/* ── DISPONIBLE MAINTENANT ── */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: "0 0 0 4px #d1fae511" }} />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-500">Disponible maintenant</span>
          </div>

          {/* Coaching card */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden mb-6">
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-zinc-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-violet-400 mb-2">Coaching individuel · Zoom</p>
              <h2 className="text-xl font-bold text-zinc-900 mb-1">FL Studio · Afro House</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                En 3h on crée ensemble ton premier remix Afro House — de zéro, sur FL Studio gratuit. L'Afro House c'est le style le plus en vogue en ce moment. Accessible, efficace, et gratifiant à produire même si t'as jamais ouvert un logiciel de musique. En 3 heures, tu repars avec un vrai morceau créé par toi.
              </p>
            </div>

            {/* Programme */}
            <div className="px-6 py-5 border-b border-zinc-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-5">Le programme</p>
              <div className="flex flex-col gap-0">

                <div className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-400 text-xs font-bold">1</span>
                    </div>
                    <div className="w-px flex-1 bg-zinc-100 mt-1 mb-1" />
                  </div>
                  <div className="pb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-zinc-400 font-mono">30 min</span>
                      <span className="text-sm font-semibold text-zinc-900">Découverte</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">Prise en main de FL Studio — interface, repères visuels, personnalisation. Tu comprends où tu mets les pieds.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-400 text-xs font-bold">2</span>
                    </div>
                    <div className="w-px flex-1 bg-zinc-100 mt-1 mb-1" />
                  </div>
                  <div className="pb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-zinc-400 font-mono">2h</span>
                      <span className="text-sm font-semibold text-zinc-900">On produit ensemble</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">On crée en temps réel le drop de la musique de ton choix. Plugins natifs uniquement, pack de samples fourni. Tu es aux commandes, je te guide à la voix. On couvre le séquenceur, les patterns, le mixer, le BPM, la tonalité, l'équilibre des sons.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-400 text-xs font-bold">3</span>
                    </div>
                    <div className="w-px flex-1 bg-transparent mt-1" />
                  </div>
                  <div className="pb-2">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-zinc-400 font-mono">30 min</span>
                      <span className="text-sm font-semibold text-zinc-900">Exploration libre</span>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed">Tu prends totalement les commandes. Je réponds à tes questions. Le but : que tu repars autonome.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Ce qu'il te faut */}
            <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">Ce qu'il te faut</p>
              <ul className="flex flex-col gap-1.5">
                {["Une connexion stable", "Un casque", "FL Studio version démo (gratuit)"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                    <span className="w-1 h-1 rounded-full bg-zinc-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-zinc-400 mt-3">C'est tout.</p>
            </div>

            {/* Tarif */}
            <div className="px-6 py-5 border-b border-zinc-100">
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Tarif de lancement</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-zinc-900">90€</span>
                  <span className="text-zinc-400 text-sm">/ session</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Pour les 10 premiers — prix définitif : 120€</p>
              </div>
            </div>

            {/* Programme Ambassadeur */}
            <div className="px-6 py-5 border-b border-zinc-100">
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">Programme Ambassadeur</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Tu as suivi le coaching et tu recommandes à un ami ? Si ton filleul complète sa session, tu reçois <span className="text-zinc-900 font-semibold">15€</span> — en virement direct ou en crédit pour une session de suivi.
              </p>
            </div>

            {/* Session de suivi */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-1">Session de suivi</p>
                  <p className="text-sm font-semibold text-zinc-900">1h · 40€</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Réservée aux anciens élèves. Tu bloques sur un projet, tu veux perfectionner un mix ou approfondir un point technique — on se prend une heure pour débloquer.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Widget réservation */}
          <div className="mt-2">
            {bookingDone ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-2xl px-6 py-8 text-center">
                <p className="text-emerald-600 font-semibold mb-1">Réservation confirmée ✓</p>
                <p className="text-zinc-500 text-sm">Un email de confirmation t'a été envoyé. À très vite !</p>
              </div>
            ) : !bookingOpen ? (
              <button
                onClick={() => setBookingOpen(true)}
                className="block w-full text-center bg-violet-500 text-white px-6 py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-violet-600 transition-colors"
              >
                Réserver — 90€
              </button>
            ) : creneaux.length === 0 ? (
              <div className="border border-zinc-200 rounded-2xl px-6 py-6 text-center">
                <p className="text-zinc-500 text-sm mb-4">Aucun créneau disponible pour le moment.</p>
                <a
                  href="mailto:contact@iametario.com?subject=Coaching FL Studio Afro House — Réservation"
                  className="inline-block bg-zinc-900 text-white px-5 py-3 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-zinc-700 transition-colors"
                >
                  Contacter par email
                </a>
              </div>
            ) : (
              <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                {/* Sélection du créneau */}
                <div className="px-5 py-4 border-b border-zinc-100">
                  <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">Choisir un créneau</p>
                  <div className="flex flex-col gap-3">
                    {Object.entries(byDate).map(([date, slots]) => {
                      const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
                      return (
                        <div key={date}>
                          <p className="text-xs text-zinc-400 mb-1.5 capitalize">{dateLabel}</p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(s => {
                              const startH = parseInt(s.heure_debut.slice(0, 2));
                              const label = `${startH}h–${startH + 3}h`;
                              const isSelected = selectedId === s.id;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => setSelectedId(isSelected ? null : s.id)}
                                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                    isSelected
                                      ? "bg-violet-500 text-white"
                                      : "border border-zinc-200 text-zinc-700 hover:border-violet-400 hover:text-violet-600"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Formulaire — s'affiche quand un créneau est sélectionné */}
                {selectedId && (
                  <form onSubmit={handleBook} className="px-5 py-4 flex flex-col gap-3">
                    <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-1">Tes infos</p>
                    <input
                      type="text"
                      placeholder="Ton prénom"
                      value={bookingNom}
                      onChange={e => setBookingNom(e.target.value)}
                      required
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Ton email"
                      value={bookingEmail}
                      onChange={e => setBookingEmail(e.target.value)}
                      required
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                    <textarea
                      placeholder="Un message ? (optionnel)"
                      value={bookingMsg}
                      onChange={e => setBookingMsg(e.target.value)}
                      rows={2}
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors resize-none"
                    />
                    {bookingError && <p className="text-red-400 text-xs">{bookingError}</p>}
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-violet-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-violet-600 transition-colors disabled:opacity-50"
                    >
                      {bookingLoading ? "Réservation…" : "Confirmer — 90€"}
                    </button>
                    <p className="text-zinc-400 text-xs text-center">Le règlement se fait par virement après confirmation.</p>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-zinc-100 my-16" />

        {/* ── BIENTÔT ── */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 rounded-full bg-zinc-300 flex-shrink-0" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Bientôt</span>
          </div>

          {/* DJ Résident card */}
          <div className="border border-zinc-100 rounded-2xl px-6 py-6 mb-8 opacity-70">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-1">Formation complète</p>
                <h2 className="text-xl font-bold text-zinc-900">Formation DJ Résident</h2>
                <p className="text-xs text-zinc-400 mt-1">Technique · Psychologie · Réseau</p>
              </div>
              <span className="text-2xl font-bold text-zinc-300">99€</span>
            </div>
            <p className="text-sm text-zinc-400 mb-4">Disponible septembre 2026. Modules séparés disponibles.</p>
            <div className="flex flex-wrap gap-2">
              {["Apprendre à mixer", "Psychologie & Réseau", "Produire ton son"].map(m => (
                <span key={m} className="text-xs text-zinc-400 border border-zinc-100 rounded-full px-3 py-1">{m}</span>
              ))}
            </div>
          </div>

          {/* Newsletter early bird */}
          {submitted ? (
            <p className="text-violet-400 text-sm text-center">Tu bénéficieras de -10% à la sortie ✓</p>
          ) : (
            <>
              <p className="text-zinc-500 text-sm text-center mb-5">Inscris-toi maintenant et bénéficie de <span className="text-zinc-900 font-semibold">-10%</span> à la sortie.</p>
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
                  className="bg-zinc-900 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-zinc-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "…" : "Me prévenir"}
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
