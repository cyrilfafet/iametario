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
  const [bookingMusique, setBookingMusique] = useState("");
  const [bookingParrain, setBookingParrain] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState<{ code: string; reduction: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [placesRestantes, setPlacesRestantes] = useState<string | null>(null);
  const [parrainageOpen, setParrainageOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [calSelectedDate, setCalSelectedDate] = useState<string | null>(null);

  const localDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const fetchCreneaux = (followUp: boolean) => {
    fetch(`/api/creneaux${followUp ? "?followup=1" : ""}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCreneaux(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchCreneaux(false);
    fetch("/api/config/places_restantes").then(r => r.json()).then(d => { if (d.value) setPlacesRestantes(d.value); }).catch(() => {});
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") setBookingDone(true);
    if (params.get("cancelled") === "1") setPaymentCancelled(true);
  }, []);

  const checkPromo = async (code: string) => {
    if (!code.trim()) { setPromoValid(null); setPromoError(""); return; }
    const res = await fetch(`/api/promo/${encodeURIComponent(code.trim())}`);
    const data = await res.json();
    if (data.valid) { setPromoValid({ code: data.code, reduction: data.reduction }); setPromoError(""); }
    else { setPromoValid(null); setPromoError(data.message || "Code invalide"); }
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !bookingNom || !bookingEmail) return;
    setBookingLoading(true);
    setBookingError("");
    const res = await fetch("/api/creneaux/reserver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, nom: bookingNom, email: bookingEmail, message: bookingMsg, musique: bookingMusique, parrain: bookingParrain, promoCode: promoValid?.code, followUp: isFollowUp }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else if (res.status === 409) {
      setBookingError("Ce créneau vient d'être pris. Choisis-en un autre.");
      setSelectedId(null);
      setBookingLoading(false);
    } else {
      setBookingError("Une erreur est survenue, réessaie.");
      setBookingLoading(false);
    }
  };

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
        <div className="mb-10">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-5">Formations</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
            Partager ce que j'ai mis<br className="hidden md:block" /> 15 ans à apprendre.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-lg">
            Pas de théorie, on pratique dès la première minute.
          </p>
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
              <h2 className="text-xl font-bold text-zinc-900 mb-1">FL Studio · On crée un remix ensemble de A à Z</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                En 3h, on crée ensemble un remix d'un morceau de ton choix — de zéro, sur FL Studio gratuit. L'objectif est simple : que tu aies toutes les bases pour ouvrir la porte sur la production de tes propres mashups, remix, voire titres originaux. Même si tu n'as jamais ouvert un logiciel de musique, je te guide étape par étape pour maîtriser les bases du mixage et de la compo. Et comme c'est le style le plus efficace et accessible du moment, on travaillera sur une esthétique Afro House.
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
                    <p className="text-sm text-zinc-500 leading-relaxed">Tu prends totalement les commandes. Je réponds à tes questions. Le but : que tu repartes autonome.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Ce qu'il te faut */}
            <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50">
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-3">Ce qu'il te faut</p>
              <ul className="flex flex-col gap-1.5">
                {["Une connexion stable", "Un casque", "FL Studio version démo (gratuit)", "Le fichier MP3 de la musique que tu veux remixer"].map(item => (
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
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  ⚡ Offre de lancement
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-zinc-900">90€</span>
                  <span className="text-zinc-400 text-sm">/ session</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Prix définitif : 120€</p>
                {placesRestantes && (
                  <p className="text-xs font-semibold text-orange-500 mt-2">
                    {placesRestantes} place{parseInt(placesRestantes) > 1 ? "s" : ""} restante{parseInt(placesRestantes) > 1 ? "s" : ""} sur 10
                  </p>
                )}
              </div>
            </div>

            {/* Programme Parrainage */}
            <div className="border-b border-zinc-100">
              <button
                type="button"
                onClick={() => setParrainageOpen(o => !o)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-50/60 transition-colors"
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Parrainage</p>
                <span className="text-zinc-400 text-sm">{parrainageOpen ? "−" : "+"}</span>
              </button>
              {parrainageOpen && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Recommandé par un ancien élève ? Indique son prénom à la réservation — il reçoit <span className="text-zinc-900 font-semibold">15€</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Session de suivi */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-1">Session de suivi</p>
                  <p className="text-sm font-semibold text-zinc-900">1h · 40€</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Pour ceux qui ont déjà fait le coaching 3h — on continue là où on s'est arrêtés.</p>
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
              <div>
                {paymentCancelled && (
                  <p className="text-amber-500 text-xs text-center mb-3">Paiement annulé — le créneau a été libéré.</p>
                )}
                <button
                  onClick={() => { setBookingOpen(true); setPaymentCancelled(false); }}
                  className="block w-full text-center bg-violet-500 text-white px-6 py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-violet-600 transition-colors"
                >
                  Réserver une session
                </button>
                <p className="text-zinc-400 text-xs text-center mt-2">Paiement sécurisé · Créneau choisi à l'étape suivante · Annulation gratuite sous 24h</p>
              </div>
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
                {/* Toggle session de suivi */}
                <div className="px-5 py-4 border-b border-zinc-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFollowUp}
                      onChange={e => {
                        const val = e.target.checked;
                        setIsFollowUp(val);
                        setSelectedId(null);
                        fetchCreneaux(val);
                      }}
                      className="mt-0.5 accent-violet-500 flex-shrink-0"
                    />
                    <span className="text-sm text-zinc-600 leading-snug">
                      J'ai déjà suivi le coaching 3h — je réserve une{" "}
                      <span className="font-semibold text-zinc-900">session de suivi · 1h · 40€</span>
                    </span>
                  </label>
                </div>

                {/* Calendrier */}
                {(() => {
                  const year = calMonth.getFullYear();
                  const month = calMonth.getMonth();
                  const availableDates = new Set(creneaux.map(c => c.date));
                  const todayStr = localDate(new Date());
                  const firstDay = new Date(year, month, 1);
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
                  const cells: (number | null)[] = [
                    ...Array(startOffset).fill(null),
                    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                  ];
                  while (cells.length % 7 !== 0) cells.push(null);
                  const monthLabel = new Date(year, month, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
                  const slotsForSelected = calSelectedDate ? creneaux.filter(c => c.date === calSelectedDate) : [];

                  return (
                    <div className="px-5 py-4 border-b border-zinc-100">
                      {/* Header mois */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => { setCalMonth(new Date(year, month - 1, 1)); setCalSelectedDate(null); setSelectedId(null); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors text-sm"
                        >‹</button>
                        <p className="text-sm font-semibold text-zinc-700 capitalize">{monthLabel}</p>
                        <button
                          type="button"
                          onClick={() => { setCalMonth(new Date(year, month + 1, 1)); setCalSelectedDate(null); setSelectedId(null); }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors text-sm"
                        >›</button>
                      </div>

                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 mb-1">
                        {["L","M","M","J","V","S","D"].map((d, i) => (
                          <div key={i} className="text-center text-xs font-medium text-zinc-400 py-1">{d}</div>
                        ))}
                      </div>

                      {/* Grille */}
                      <div className="grid grid-cols-7 gap-y-1">
                        {cells.map((day, i) => {
                          if (!day) return <div key={i} />;
                          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const isAvailable = availableDates.has(dateStr);
                          const isPast = dateStr < todayStr;
                          const isSelected = calSelectedDate === dateStr;
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={!isAvailable || isPast}
                              onClick={() => { setCalSelectedDate(isSelected ? null : dateStr); setSelectedId(null); }}
                              className={`relative mx-auto w-8 h-8 rounded-full text-xs font-medium transition-colors flex items-center justify-center
                                ${isSelected ? "bg-violet-500 text-white" : ""}
                                ${!isSelected && isAvailable && !isPast ? "text-zinc-900 hover:bg-violet-100 hover:text-violet-700 cursor-pointer" : ""}
                                ${!isAvailable || isPast ? "text-zinc-300 cursor-default" : ""}
                              `}
                            >
                              {day}
                              {isAvailable && !isPast && !isSelected && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Créneaux du jour sélectionné */}
                      {calSelectedDate && (
                        <div className="mt-4 pt-4 border-t border-zinc-100">
                          <p className="text-xs text-zinc-400 mb-2.5 capitalize">
                            {new Date(calSelectedDate + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slotsForSelected.map(s => {
                              const startH = parseInt(s.heure_debut.slice(0, 2));
                              const label = isFollowUp ? `${startH}h–${startH + 1}h` : `${startH}h–${startH + 3}h`;
                              const isSelected = selectedId === s.id;
                              return (
                                <button
                                  key={s.id}
                                  type="button"
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
                      )}
                    </div>
                  );
                })()}

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
                    <input
                      type="text"
                      placeholder="Quelle musique souhaites-tu remixer ? (artiste · titre)"
                      value={bookingMusique}
                      onChange={e => setBookingMusique(e.target.value)}
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Parrainé par (optionnel)"
                      value={bookingParrain}
                      onChange={e => setBookingParrain(e.target.value)}
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors"
                    />
                    <textarea
                      placeholder="Un message ? (optionnel)"
                      value={bookingMsg}
                      onChange={e => setBookingMsg(e.target.value)}
                      rows={2}
                      className="border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors resize-none"
                    />
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Code promo (optionnel)"
                          value={promoCode}
                          onChange={e => { setPromoCode(e.target.value); setPromoValid(null); setPromoError(""); }}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); checkPromo(promoCode); } }}
                          className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-violet-400 transition-colors uppercase"
                        />
                        {promoValid && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-600 font-medium">
                            -{promoValid.reduction}% ✓
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => checkPromo(promoCode)}
                        className="px-4 py-3 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:border-violet-400 hover:text-violet-600 transition-colors whitespace-nowrap"
                      >
                        Appliquer
                      </button>
                    </div>
                    {promoError && <p className="text-red-400 text-xs -mt-1">{promoError}</p>}
                    {bookingError && <p className="text-red-400 text-xs">{bookingError}</p>}

                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full bg-violet-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-violet-600 transition-colors disabled:opacity-50"
                    >
                      {(() => {
                        if (bookingLoading) return "Redirection…";
                        const base = isFollowUp ? 40 : 90;
                        const price = promoValid ? Math.round(base * (1 - promoValid.reduction / 100)) : base;
                        return `Payer ${price}€ avec Stripe →`;
                      })()}
                    </button>
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

        </div>

      </div>
      <Footer />
    </main>
  );
}
