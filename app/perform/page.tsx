"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import Footer from "@/components/Footer";

const timeline = [
  { year: 2012, event: "Premières platines" },
  { year: 2017, event: "17ème sur 18 à mon premier concours DJ" },
  { year: 2018, event: "1er à 3 concours DJ consécutifs" },
  { year: 2019, event: "Première résidence au Beverly (Dijon)" },
  { year: 2021, event: "Saison DJ au Club Med" },
  { year: 2023, event: "Remix Peggy Gou : 70k plays, ZuTv Roumanie, Sunburn Festival Inde" },
  { year: 2024, event: "500k vues sur les réseaux sociaux" },
  { year: 2025, event: 'Premier titre "Your Stage" + Line Up Amani Ibiza' },
  { year: 2026, event: "Résident Bal'tazar Dijon + Fun Radio Bourgogne", detail: "Interview chez Fun Radio Bourgogne" },
];

export default function Artist() {
  const { t, lang, setLang } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [tlIndex, setTlIndex] = useState(timeline.length - 1);
  const [bookingNom, setBookingNom] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
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
      body: JSON.stringify({ nom: bookingNom, email: bookingEmail, date: bookingDate, message: bookingMessage }),
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

  const LangToggle = () => (
    <div className="flex items-center gap-2">
      <button onClick={() => setLang("fr")} className={`text-lg transition-opacity ${lang === "fr" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}>🇫🇷</button>
      <button onClick={() => setLang("en")} className={`text-lg transition-opacity ${lang === "en" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}>🇬🇧</button>
    </div>
  );

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100/60">
        <div className="flex items-center gap-3">
          <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
          <LangToggle />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
          <a href="/perform" className="text-blue-500">{t.nav.perform}</a>
          <a href="/creation" className="hover:text-indigo-400 transition-colors">{t.nav.create}</a>
          <a href="/teaching" className="hover:text-violet-400 transition-colors">{t.nav.teach}</a>
          <a href="/shop" className="hover:text-zinc-900 transition-colors">{t.nav.shop}</a>
          <a href="/contact" className="hover:text-zinc-600 transition-colors">{t.nav.contact}</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-zinc-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b border-zinc-100 text-sm text-zinc-500">
          <a href="/perform" className="text-blue-500">{t.nav.perform}</a>
          <a href="/creation" className="hover:text-indigo-400 transition-colors">{t.nav.create}</a>
          <a href="/teaching" className="hover:text-violet-400 transition-colors">{t.nav.teach}</a>
          <a href="/shop" className="hover:text-zinc-900 transition-colors">{t.nav.shop}</a>
          <a href="/contact" className="hover:text-zinc-600 transition-colors">{t.nav.contact}</a>
          <LangToggle />
        </div>
      )}

      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">

        {/* Images gauche */}
        <div className="hidden md:flex absolute left-0 top-0 h-full items-center pointer-events-none">
          <img src="/clubmed.png" className="w-107 grayscale opacity-50 -mt-30 -ml-20" style={imgStyle(-55, -20, -4)} />
          <img src="/color_dole.png" className="w-80 grayscale opacity-50 -mt-10 -ml-74" style={imgStyle(-90, 15, 6)} />
          <div
            className="w-80 h-80 -mt-10 -ml-19 flex-shrink-0"
            style={{
              ...imgStyle(-65, -10, -8),
              WebkitMaskImage: "url('/baltazar.png')",
              maskImage: "url('/baltazar.png')",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <video
              src="/baltazar-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Images droite */}
        <div className="hidden md:flex absolute right-0 top-0 h-full items-center pointer-events-none">
          <div
            className="w-88 h-88 -mt-25 -mr-18 flex-shrink-0"
            style={{
              ...imgStyle(70, -15, 5),
              WebkitMaskImage: "url('/montagne.png')",
              maskImage: "url('/montagne.png')",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <video
              src="/montagne-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <img src="/soireeibiza1.png" className="w-80 grayscale opacity-50 -mt-30 -mr-0" style={imgStyle(45, 20, -6)} />
        </div>

        {/* Photo + Logo */}
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
          <a href="#booking-form" className="bg-blue-500 text-white px-5 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
            {t.booking_btn}
          </a>
        </div>

        {/* Bio */}
        <p className="text-zinc-500 text-base leading-relaxed max-w-4xl mt-8 text-center">
          <span style={{color: '#111111', fontSize: '1.25rem', fontWeight: 800}}>{t.bio.highlight}</span>
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p1}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p2}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p3}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p4}} />
        </p>

        {/* Timeline */}
        <div className="w-full max-w-3xl mt-14">
          {/* Année + événement */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <button
              onClick={() => setTlIndex(i => Math.max(0, i - 1))}
              disabled={tlIndex === 0}
              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
            >‹</button>
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-bold tabular-nums" style={{ color: "#60A5FA" }}>
                {timeline[tlIndex].year}
              </p>
              <p className="text-zinc-500 text-base mt-2 max-w-sm mx-auto leading-snug">
                {timeline[tlIndex].event}
              </p>
              {"detail" in timeline[tlIndex] && (
                <p className="text-zinc-400 text-xs mt-1.5 max-w-xs mx-auto">
                  {(timeline[tlIndex] as { detail: string }).detail}
                </p>
              )}
            </div>
            <button
              onClick={() => setTlIndex(i => Math.min(timeline.length - 1, i + 1))}
              disabled={tlIndex === timeline.length - 1}
              className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
            >›</button>
          </div>

          {/* Ligne des années */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-6 px-4 relative min-w-max mx-auto justify-center">
                {timeline.map((item, i) => (
                  <button
                    key={item.year}
                    onClick={() => setTlIndex(i)}
                    className="relative flex flex-col items-center gap-1.5 py-1 transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{ backgroundColor: i === tlIndex ? "#60A5FA" : "#d4d4d8" }}
                    />
                    <span
                      className="text-xs font-mono transition-colors whitespace-nowrap"
                      style={{ color: i === tlIndex ? "#60A5FA" : "#a1a1aa" }}
                    >
                      {item.year}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Médias */}
      <section className="w-full bg-zinc-950 py-14">
        <p className="text-zinc-600 text-xs uppercase tracking-widest mb-8 text-center">Médias</p>
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-3 px-8 min-w-max mx-auto" style={{ maxWidth: "fit-content" }}>

            {/* SoundCloud 1 */}
            <div className="w-80 flex-shrink-0 bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">Audio</p>
                <p className="text-white text-sm font-medium">Mix Club — 2024</p>
              </div>
              <iframe width="100%" height="130" scrolling="no" frameBorder="no" allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2162991717&color=%233b82f6&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
              />
            </div>

            {/* SoundCloud 2 */}
            <div className="w-80 flex-shrink-0 bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">Audio</p>
                <p className="text-white text-sm font-medium">Mix Festival — 2025</p>
              </div>
              <iframe width="100%" height="130" scrolling="no" frameBorder="no" allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2273673995&color=%233b82f6&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"
              />
            </div>

            {/* Vidéo set — placeholder */}
            <div className="w-80 flex-shrink-0 bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">Vidéo</p>
                <p className="text-white text-sm font-medium">Set — Live</p>
              </div>
              <div className="w-full h-44 flex flex-col items-center justify-center gap-2">
                <span className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                  <span className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-zinc-600 ml-0.5" />
                </span>
                <span className="text-zinc-700 text-xs tracking-widest uppercase">Bientôt disponible</span>
              </div>
            </div>

            {/* Interview — placeholder */}
            <div className="w-80 flex-shrink-0 bg-zinc-900 rounded-2xl overflow-hidden">
              <div className="px-5 pt-4 pb-3">
                <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">Interview</p>
                <p className="text-white text-sm font-medium">Fun Radio Bourgogne</p>
              </div>
              <div className="w-full h-44 flex flex-col items-center justify-center gap-2">
                <span className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center">
                  <span className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-zinc-600 ml-0.5" />
                </span>
                <span className="text-zinc-700 text-xs tracking-widest uppercase">Bientôt disponible</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="px-6 py-24 max-w-4xl mx-auto w-full">
        <div className="border-t border-zinc-200 pt-16">

          <div className="text-center mb-14">
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">{t.booking.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.booking.title}</h2>
            <p className="text-zinc-400 text-xs tracking-wide mb-4">{t.booking.credibility}</p>
            <p className="text-zinc-500 text-base mb-7">{t.booking.subtitle}</p>
            <a href="#booking-form" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
              {t.booking.cta}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">{t.booking.card1_title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{t.booking.card1_text}</p>
            </div>
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">{t.booking.card2_title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{t.booking.card2_text}</p>
            </div>
            <div className="border border-zinc-200 rounded-2xl px-7 py-8">
              <p className="text-zinc-900 font-semibold mb-3">{t.booking.card3_title}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{t.booking.card3_text}</p>
            </div>
          </div>

          <div id="booking-form" className="max-w-lg mx-auto">
            {bookingSubmitted ? (
              <div className="border border-zinc-200 px-8 py-12 text-center">
                <p className="text-blue-500 font-semibold mb-2">{t.booking.success_title}</p>
                <p className="text-zinc-400 text-sm">{t.booking.success_text}</p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="flex flex-col gap-0">
                <input
                  type="text"
                  placeholder={t.booking.form_name}
                  value={bookingNom}
                  onChange={e => setBookingNom(e.target.value)}
                  required
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                />
                <input
                  type="email"
                  placeholder={t.booking.form_email}
                  value={bookingEmail}
                  onChange={e => setBookingEmail(e.target.value)}
                  required
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                />
                <input
                  type="text"
                  placeholder={t.booking.form_date}
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-white"
                />
                <textarea
                  placeholder={t.booking.form_message}
                  value={bookingMessage}
                  onChange={e => setBookingMessage(e.target.value)}
                  rows={5}
                  required
                  className="border border-zinc-200 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors resize-none bg-white"
                />
                <div className="flex flex-col items-start gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="border border-zinc-900 text-zinc-900 px-7 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {bookingLoading ? t.booking.form_sending : t.booking.form_submit}
                  </button>
                  <a href="/presskit.pdf" target="_blank" className="text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
                    {t.booking.presskit}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />

    </main>
  );
}
