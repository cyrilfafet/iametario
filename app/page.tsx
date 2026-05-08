"use client";
import { useState, useEffect } from "react";

export default function Artist() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [bookingNom, setBookingNom] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingType, setBookingType] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingBudget, setBookingBudget] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: bookingNom, email: bookingEmail, type: bookingType, date: bookingDate, budget: bookingBudget, message: bookingMessage }),
    });
    setBookingSubmitted(true);
    setBookingLoading(false);
  };

  const progress = Math.min(1, scrollY / 350);
  const opacity = 0.5 * (1 - progress);
  const blur = `grayscale(1) blur(${progress * 10}px)`;

  const imgStyle = (x: number, y: number, rot: number) => ({
    transform: `translateX(${progress * x}px) translateY(${progress * y}px) rotate(${progress * rot}deg)`,
    opacity,
    filter: blur,
    transition: "none",
  });

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="hidden md:flex gap-8 text-sm text-zinc-500">
          <a href="/" className="text-blue-500">PERFORM</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
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
          <a href="/" className="text-blue-500">PERFORM</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
        </div>
      )}

      {/* Hero */}
<section className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">

  {/* Images gauche */}
<div className="hidden md:flex absolute left-0 top-0 h-full items-center pointer-events-none">
  <img src="/clubmed.png" className="w-107 grayscale opacity-50 -mt-30 -ml-20" style={imgStyle(-55, -20, -4)} />
  <img src="/color_dole.png" className="w-80 grayscale opacity-50 -mt-10 -ml-74" style={imgStyle(-90, 15, 6)} />
  <img src="/baltazar.png" className="w-80 grayscale opacity-50 -mt-10 -ml-19" style={imgStyle(-65, -10, -8)} />
</div>

{/* Images droite */}
<div className="hidden md:flex absolute right-0 top-0 h-full items-center pointer-events-none">
  <img src="/montagne.png" className="w-88 grayscale opacity-50 -mt-25 -mr-18" style={imgStyle(70, -15, 5)} />
  <img src="/soireeibiza1.png" className="w-80 grayscale opacity-50 -mt-30 -mr-0" style={imgStyle(45, 20, -6)} />
</div>

  {/* Photo + Logo - centre */}
<div className="flex flex-col items-center">
  <img src="/DSC_1607.png" alt="E-Tario" className="w-50 md:w-130 -mt-20" />
  <img src="/Logo _V1_black.png" alt="E-Tario" className="w-85 md:w-95 -mt-30" />
</div>

{/* Réseaux + Booking */}
<div className="flex items-center justify-center gap-8 mt-8">
  <div className="flex gap-6 items-center">
    <a href="https://instagram.com/iametario" target="_blank" className="text-zinc-500 hover:text-zinc-900 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a href="https://soundcloud.com/iametario" target="_blank" className="opacity-50 hover:opacity-100 transition-opacity">
  <img src="/soundcloudlogo.png" alt="Soundcloud" className="h-10" />
</a>
    <a href="https://open.spotify.com/intl-fr/artist/5PRHGYHjRAJsxSiHWuBUVp?si=QOFkWIr5Q12Fn2TDoBzlKg" target="_blank" className="text-zinc-500 hover:text-zinc-900 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
    </a>
    <a href="https://youtube.com/@e-tario" target="_blank" className="text-zinc-500 hover:text-zinc-900 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    </a>
  </div>
  <span className="text-zinc-300">|</span>
  <a href="mailto:contact@iametario.com" className="bg-blue-500 text-white px-5 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
  Booking
</a>
</div>

  <p className="text-zinc-500 text-base leading-relaxed max-w-4xl mt-8 text-center">
    <span style={{color: '#111111', fontSize: '1.25rem', fontWeight: 800}}>Une décennie d'expériences, plus de 1500 sets.</span>
    <br /><br />
    Depuis <strong style={{color: '#111111', fontWeight: 700}}>2014</strong>, j'ai réalisé plus de 1500 dj sets — des clubs français aux festivals, d'Ibiza aux hôtels de renom, en passant par les saisons en montagne. Ce parcours, forgé sur le terrain, a défini mon ADN musical : un mix dynamique entre House, Electro et French Touch.
    <br /><br />
    Partageant l'affiche avec des artistes comme <strong className="text-zinc-900">Joachim Garraud</strong> ou <strong className="text-zinc-900">Willy William</strong>, j'ai imposé ma signature jusque dans la production. Mon remix de Peggy Gou (+70k plays) a ainsi voyagé des ondes de ZuTv en Roumanie jusqu'en Inde, où il a resonné lors du  <strong className="text-zinc-900">Sunburn Festival</strong>.
    <br /><br />
    Aujourd'hui résident au <strong className="text-zinc-900">Bal'tazar</strong> (Dijon), je joue à l'instinct — mashups exclusifs, transitions techniques et sets qui s'adaptent à chaque moment.
    <br /><br />
    Entre la préparation de mon <strong className="text-zinc-900">troisième single</strong> pour juin 2026 et mes services de création audio, je prépare également une formation dédiée aux futurs DJs résidents.
  </p>
  {/* Lecteurs Soundcloud */}
<div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
  <iframe
    width="100%"
    height="166"
    scrolling="no"
    frameBorder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2162991717&color=%232c2a32&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false"
  />
  <iframe
    width="100%"
    height="166"
    scrolling="no"
    frameBorder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2273673995&color=%232c2a32&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false"
  />
</div>
</section>

      {/* Booking */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="border-t border-zinc-200 pt-16">

          {/* Titre */}
          <div className="text-center mb-14">
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">Booking</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Donnez une vraie signature à votre soirée.</h2>
            <p className="text-zinc-400 text-xs tracking-wide mb-4">+1500 sets · Clubs · Festivals · Ibiza · Sunburn Festival</p>
            <p className="text-zinc-500 text-base mb-7">Disponible pour clubs, festivals et événements privés.</p>
            <a href="#booking-form" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
              Booker une date
            </a>
          </div>

          {/* 3 blocs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">Clubs & Résidences</p>
              <p className="text-zinc-500 text-sm leading-relaxed">L'expertise du clubbing. Lecture de foule en temps réel et mashups exclusifs. Résident au Baltazar.</p>
            </div>
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">Festivals & Open-Air</p>
              <p className="text-zinc-500 text-sm leading-relaxed">Format grande scène. Adaptabilité et énergie pour vos événements extérieurs et programmations festives.</p>
            </div>
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">Privé & Corporate</p>
              <p className="text-zinc-500 text-sm leading-relaxed">L'élégance musicale. Une sélection pointue et une technique irréprochable pour vos événements d'exception et soirées privées.</p>
            </div>
          </div>

          {/* Formulaire */}
          <div id="booking-form">
            {bookingSubmitted ? (
              <div className="border border-blue-500/40 rounded-2xl px-6 py-10 text-center">
                <p className="text-blue-500 font-semibold mb-1">Demande envoyée ✓</p>
                <p className="text-zinc-500 text-sm">Je reviens vers toi rapidement.</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Nom / Structure" value={bookingNom} onChange={e => setBookingNom(e.target.value)} required className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors" />
                  <input type="email" placeholder="Email" value={bookingEmail} onChange={e => setBookingEmail(e.target.value)} required className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select value={bookingType} onChange={e => setBookingType(e.target.value)} required className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer">
                    <option value="" disabled>Type d'événement</option>
                    <option value="Club">Club</option>
                    <option value="Festival">Festival</option>
                    <option value="Événement privé & Corporate">Événement privé & Corporate</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <input type="text" placeholder="Date envisagée" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <input type="text" placeholder="Budget approximatif (optionnel)" value={bookingBudget} onChange={e => setBookingBudget(e.target.value)} className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors" />
                <textarea placeholder="Message" value={bookingMessage} onChange={e => setBookingMessage(e.target.value)} rows={4} className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
                <button type="submit" disabled={bookingLoading} className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-50">
                  {bookingLoading ? "Envoi…" : "Envoyer ma demande"}
                </button>
                <p className="text-center mt-1">
                  <a href="/presskit.pdf" target="_blank" className="text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
                    Télécharger mon presskit →
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
