"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n";
import Footer from "@/components/Footer";


function SoundCloudCard({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!active && ref.current?.contentWindow) {
      ref.current.contentWindow.postMessage(JSON.stringify({ method: "pause" }), "*");
    }
  }, [active]);
  return (
    <iframe ref={ref} width="100%" height="150" scrolling="no" frameBorder="no" allow="autoplay" src={src} />
  );
}

function FullscreenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VideoCard({ src, active, objectPosition = "center" }: { src: string; active: boolean; objectPosition?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.muted = !active;
  }, [active]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  const fullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = ref.current;
    if (!video) return;
    // iOS Safari uses webkitEnterFullscreen on the video element
    if ((video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className="relative" style={{ height: 150, overflow: "hidden", cursor: "pointer" }} onClick={toggle}>
      <video ref={ref} autoPlay loop muted playsInline style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", minWidth: "100%", minHeight: "100%", width: "auto", height: "auto" }}>
        <source src={src} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${paused ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.25)" }}>
        <div className="w-10 h-10 rounded-full bg-zinc-50/90 flex items-center justify-center shadow">
          <span className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[11px] border-transparent border-l-zinc-800 ml-1" />
        </div>
      </div>
      <button onClick={fullscreen} className="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors pointer-events-auto">
        <FullscreenIcon />
      </button>
    </div>
  );
}

function YouTubeCard({ videoId, active }: { videoId: string; active: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe?.contentWindow) return;
    const func = active ? "unMute" : "mute";
    iframe.contentWindow.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
  }, [active]);

  return (
    <div className="relative" style={{ height: 150 }}>
      <iframe
        ref={ref}
        width="100%" height="150"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ display: "block" }}
      />
    </div>
  );
}

export default function Artist() {
  const { t, lang, setLang } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [tlIndex, setTlIndex] = useState(0);
  const [tlShown, setTlShown] = useState(8);
  const [tlPhase, setTlPhase] = useState<"idle"|"exit"|"enter">("idle");
  const tlDir = useRef(1);
  const tlTouchX = useRef(0);
  const tlPickerRef = useRef<HTMLDivElement>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [vw, setVw] = useState(375);
  const touchStartX = useRef(0);
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
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

  useEffect(() => {
    const el = tlPickerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (tlDir.current === 0) return;
      tlDir.current = 0;
      setTlIndex(i => Math.min(Math.max(0, i + (e.deltaY > 0 ? 1 : -1)), 4));
      setTimeout(() => { tlDir.current = 1; }, 320);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
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

  const TL_MILESTONES: Record<number, string> = {
    2018: "3 victoires consécutives",
    2023: "70k plays · International",
    2025: "Ibiza",
    2026: "En cours",
  };

  const goTimeline = (dir: number) => {
    if (tlPhase !== "idle") return;
    const next = tlIndex + dir;
    if (next < 0 || next >= t.timeline.length) return;
    tlDir.current = dir > 0 ? 1 : -1;
    setTlIndex(next);
    setTlPhase("exit");
    setTimeout(() => {
      setTlShown(next);
      setTlPhase("enter");
      requestAnimationFrame(() => requestAnimationFrame(() => setTlPhase("idle")));
    }, 210);
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
    <main className="min-h-screen text-zinc-900 flex flex-col [overflow-x:clip]">
      {/* Background image — fixed, behind everything */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
        <img src="/bannieretest.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", opacity: 0.12 }} />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-100/60">
        <div className="flex items-center gap-3">
          <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6" /></a>
          <LangToggle />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
          <a href="/" className="font-medium text-zinc-900">{t.nav.perform}</a>
          <a href="/services" className="hover:text-zinc-900 transition-colors">{t.nav.create}</a>
          <a href="/formations" className="hover:text-zinc-900 transition-colors">{t.nav.teach}</a>
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
          <a href="/" onClick={() => setMenuOpen(false)} className="text-blue-500">{t.nav.perform}</a>
          <a href="/services" onClick={() => setMenuOpen(false)} className="hover:text-indigo-400 transition-colors">{t.nav.create}</a>
          <a href="/formations" onClick={() => setMenuOpen(false)} className="hover:text-violet-400 transition-colors">{t.nav.teach}</a>
          <a href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-zinc-900 transition-colors">{t.nav.shop}</a>
          <a href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-zinc-600 transition-colors">{t.nav.contact}</a>
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
          <img src="/DSC_1607.png" alt="E-Tario" className="w-36 md:w-130 -mt-10 md:-mt-20" />
          <img src="/Logo _V1_black.png" alt="E-Tario" className="w-56 md:w-95 -mt-16 md:-mt-30" />
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".25em", color: "#7A6E5F", marginTop: 10, textTransform: "uppercase" }}>
            Phlegmatic DJ &amp; Producer
          </p>
        </div>

        {/* Réseaux + Booking */}
        <div className="flex flex-col items-center gap-4 mt-6 md:flex-row md:gap-8 md:mt-8">
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <a href="https://www.instagram.com/etario_music" target="_blank" className="text-zinc-500 hover:text-zinc-900 transition-colors">
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
          <span className="hidden md:block text-zinc-300">|</span>
          <a href="#booking-form" onClick={() => setMenuOpen(false)} className="bg-blue-500 text-white px-5 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
            {t.booking_btn}
          </a>
        </div>

        {/* Bio */}
        <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-4xl mt-6 md:mt-8 text-center">
          <span style={{color: '#111111', fontSize: '1.25rem', fontWeight: 800}}>+1500 sets, une décennie d'expériences.</span>
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p1}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p2}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p3}} />
          <br /><br />
          <span dangerouslySetInnerHTML={{__html: t.bio.p4}} />
        </p>

        {/* Timeline — picker scroll */}
        {(() => {
          // Centre = item expanded (period + title + content), sides = compact single line
          const SIDE_H = 44;
          const CENTER_H = 180;
          const TOTAL_H = SIDE_H + CENTER_H + SIDE_H;
          const MAX_IDX = t.timeline.length - 1;
          const step = (dir: number) => {
            setTlIndex(i => Math.min(Math.max(0, i + dir), MAX_IDX));
          };

          type TLItem = { period: string; title: string; description: string; bullets: string[] };
          const items = t.timeline as TLItem[];

          const thumbPct = MAX_IDX > 0 ? (tlIndex / MAX_IDX) * 100 : 0;

          return (
            <div style={{ width: "100%", maxWidth: 896, margin: "56px auto 0", background: "#DDD0BE", borderRadius: 16, padding: "28px 0" }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1A1410", textAlign: "center", marginBottom: 6, letterSpacing: ".04em" }}>{t.timeline_title}</h2>
              <p style={{ fontSize: 11, textAlign: "center", marginBottom: 20, color: "#9A8E7E", letterSpacing: ".1em" }}>↑ ↓ défiler</p>

              <div style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
                {/* Barre de défilement décorative */}
                <div style={{
                  position: "absolute", right: 20, top: 16, bottom: 16,
                  width: 2, borderRadius: 2, background: "#C8BAA4", zIndex: 10,
                }}>
                  <div style={{
                    position: "absolute", left: 0, right: 0,
                    height: "28%",
                    top: `${thumbPct * 0.72}%`,
                    background: "#B8936A", borderRadius: 2,
                    transition: "top 0.28s cubic-bezier(.4,0,.2,1)",
                  }} />
                </div>

              <div
                ref={tlPickerRef}
                style={{ position: "relative", height: TOTAL_H, overflow: "hidden", cursor: "ns-resize", flex: 1 }}
              >
                {/* masques haut/bas */}
                <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                  background: `linear-gradient(to bottom, #DDD0BE 0%, transparent ${SIDE_H}px, transparent ${SIDE_H + CENTER_H}px, #DDD0BE 100%)` }} />

                {/* lignes encadrant le centre */}
                <div style={{ position: "absolute", left: 32, right: 32, top: SIDE_H, height: 1, background: "#C8BAA4", zIndex: 1 }} />
                <div style={{ position: "absolute", left: 32, right: 32, top: SIDE_H + CENTER_H, height: 1, background: "#C8BAA4", zIndex: 1 }} />

                {items.map((item, i) => {
                  const dist = i - tlIndex;
                  if (Math.abs(dist) > 1.5) return null;
                  const isCenter = dist === 0;
                  const offsetY = dist === 0 ? SIDE_H
                               : dist === -1 ? 0
                               : SIDE_H + CENTER_H;

                  return (
                    <div
                      key={item.period}
                      onClick={() => !isCenter && step(dist)}
                      style={{
                        position: "absolute", left: 0, right: 0,
                        top: offsetY,
                        height: isCenter ? CENTER_H : SIDE_H,
                        opacity: isCenter ? 1 : 0.4,
                        filter: isCenter ? "none" : "blur(1px)",
                        transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
                        cursor: isCenter ? "default" : "pointer",
                        display: "flex",
                        alignItems: isCenter ? "flex-start" : "center",
                        gap: 14,
                        padding: isCenter ? "18px 32px" : "0 32px",
                        zIndex: isCenter ? 2 : 1,
                      }}
                    >
                      {isCenter ? (
                        /* Item centré : hiérarchie complète */
                        <div key={tlIndex} style={{ width: "100%", animation: "tlFadeIn .25s ease" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", color: "#B8936A", whiteSpace: "nowrap" }}>
                              {item.period}
                            </span>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#B8936A", flexShrink: 0 }} />
                            <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1410" }}>{item.title}</span>
                          </div>
                          {item.description ? (
                            <p style={{ fontSize: 13, color: "#4A3A2A", lineHeight: 1.7, margin: 0 }}>{item.description}</p>
                          ) : (
                            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                              {item.bullets.map((b, j) => {
                                const [label, ...rest] = b.split(" : ");
                                const hasLabel = rest.length > 0;
                                return (
                                  <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <span style={{ color: "#B8936A", flexShrink: 0, marginTop: 3, fontSize: 8 }}>◆</span>
                                    <span style={{ fontSize: 13, color: "#4A3A2A", lineHeight: 1.65 }}>
                                      {hasLabel ? <><strong style={{ color: "#1A1410" }}>{label}</strong>{" : "}{rest.join(" : ")}</> : b}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        /* Item voisin : période + titre sur une ligne */
                        <>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#7A6E5F", letterSpacing: ".06em", whiteSpace: "nowrap" }}>
                            {item.period}
                          </span>
                          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8BAA4", flexShrink: 0 }} />
                          <span style={{ fontSize: 13, color: "#7A6E5F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.title}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              </div>{/* end flex wrapper */}
            </div>
          );
        })()}

      </section>

      {/* Médias */}
      {(() => {
        const mediaItems = [
          {
            type: "Audio", color: "#3B82F6", title: "Afro House Selection by E-Tario", subtitle: "2024",
            content: (active: boolean) => <SoundCloudCard active={active} src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2162991717&color=%233b82f6&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false" />,
          },
          {
            type: "Audio", color: "#3B82F6", title: "EDM Club Selection by E-Tario", subtitle: "2025",
            content: (active: boolean) => <SoundCloudCard active={active} src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2273673995&color=%233b82f6&auto_play=false&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false" />,
          },
          {
            type: "Vidéo", color: "#818cf8", title: "Peggy Gou – Nanana (E-Tario Remix)", subtitle: "2025",
            content: (active: boolean) => <YouTubeCard videoId="9x81NCHbXhU" active={active} />,
          },
          {
            type: "Vidéo", color: "#818cf8", title: "Hugel – Movin To The Sun (E-Tario Remix)", subtitle: "2025",
            content: (active: boolean) => <YouTubeCard videoId="i67MKS6Vnz4" active={active} />,
          },
          {
            type: "Vidéo", color: "#818cf8", title: "Mix House @Mimi Dole", subtitle: "2025",
            content: (active: boolean) => <YouTubeCard videoId="Y4scDZipvCU" active={active} />,
          },
          {
            type: "Vidéo", color: "#a78bfa", title: "E-Tario @ Almanach Festival", subtitle: "Set Live",
            content: (active: boolean) => <VideoCard src="https://pub-23c7de8a0b4249ae88f17836c36cce74.r2.dev/videos/extrait-pjanoo-linkin.mp4" active={active} />,
          },
          {
            type: "Interview", color: "#f472b6", title: "E-Tario @ Fun Radio Bourgogne", subtitle: "2026",
            content: (active: boolean) => <VideoCard src="https://pub-23c7de8a0b4249ae88f17836c36cce74.r2.dev/videos/interview-fun-radio-part1.mp4" active={active} objectPosition="center center" />,
          },
        ];
        return (
          <section className="w-full pt-12 pb-6 border-t border-zinc-100 overflow-hidden">
            <div className="flex flex-col items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-zinc-900">Médias</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setMediaIndex(i => (i - 1 + mediaItems.length) % mediaItems.length)}
                  className="w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-400 transition-colors shadow-sm"
                >‹</button>
                <button
                  onClick={() => setMediaIndex(i => (i + 1) % mediaItems.length)}
                  className="w-10 h-10 rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-400 transition-colors shadow-sm"
                >›</button>
              </div>
            </div>
            <div
              className="relative flex items-center justify-center"
              style={{ height: 280 }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 40) {
                  if (dx < 0) setMediaIndex(i => (i + 1) % mediaItems.length);
                  else setMediaIndex(i => (i - 1 + mediaItems.length) % mediaItems.length);
                }
              }}
            >

              {/* Cartes */}
              {mediaItems.map((item, i) => {
                let offset = i - mediaIndex;
                const n = mediaItems.length;
                if (offset > n / 2) offset -= n;
                if (offset < -n / 2) offset += n;
                if (Math.abs(offset) > 1) return null;
                const isActive = offset === 0;
                const cardW = Math.min(320, vw - 40);
                const cardOff = Math.min(300, vw - 32);
                return (
                  <div
                    key={i}
                    onClick={() => !isActive && setMediaIndex(i)}
                    style={{
                      position: "absolute",
                      width: cardW,
                      transform: `translateX(${offset * cardOff}px) scale(${isActive ? 1 : 0.82})`,
                      filter: isActive ? "none" : "blur(3px)",
                      opacity: isActive ? 1 : 0.45,
                      zIndex: isActive ? 10 : 5,
                      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                      cursor: isActive ? "default" : "pointer",
                    }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-zinc-200/80 flex flex-col"
                  >
                    <div className="h-px w-full flex-shrink-0" style={{ backgroundColor: "#E4DDD1" }} />
                    <div className="px-5 pt-4 pb-3 flex-shrink-0">
                      <p className="text-xs uppercase tracking-widest mb-1 text-zinc-400">{item.type}</p>
                      <p className="text-zinc-900 font-semibold text-base truncate">{item.title}</p>
                      <p className="text-zinc-400 text-xs mt-0.5">{item.subtitle}</p>
                    </div>
                    <div className="flex-1 overflow-hidden">{item.content(isActive)}</div>
                  </div>
                );
              })}

            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {mediaItems.map((_, i) => (
                <button key={i} onClick={() => setMediaIndex(i)}
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{ backgroundColor: i === mediaIndex ? "#B8936A" : "#d4d4d8" }}
                />
              ))}
            </div>
          </section>
        );
      })()}

      {/* Booking */}
      <section className="px-6 py-12 md:py-24 max-w-4xl mx-auto w-full">
        <div className="border-t border-zinc-200 pt-16">

          <div className="text-center mb-14">
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-4">{t.booking.label}</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t.booking.title}</h2>

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
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-zinc-50"
                />
                <input
                  type="email"
                  placeholder={t.booking.form_email}
                  value={bookingEmail}
                  onChange={e => setBookingEmail(e.target.value)}
                  required
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-zinc-50"
                />
                <input
                  type="text"
                  placeholder={t.booking.form_date}
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  className="border border-zinc-200 border-b-0 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors bg-zinc-50"
                />
                <textarea
                  placeholder={t.booking.form_message}
                  value={bookingMessage}
                  onChange={e => setBookingMessage(e.target.value)}
                  rows={5}
                  required
                  className="border border-zinc-200 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-400 transition-colors resize-none bg-zinc-50"
                />
                <div className="flex flex-col items-start gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="border border-zinc-900 text-zinc-900 px-7 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {bookingLoading ? t.booking.form_sending : t.booking.form_submit}
                  </button>
                  <div className="flex items-center gap-3">
                    <a href="https://drive.google.com/uc?export=download&id=1arBCB3lIxc3WMxNI-0ysMbxHshVbkRhB" target="_blank" className="flex items-center gap-1.5 text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
                      <span>🇫🇷</span> {t.booking.presskit}
                    </a>
                    <span className="text-zinc-200">·</span>
                    <a href="https://drive.google.com/uc?export=download&id=1EMQiTEdGsh3BnQioadN4WMm7lvgkDejq" target="_blank" className="flex items-center gap-1.5 text-zinc-400 text-xs hover:text-zinc-600 transition-colors">
                      <span>🇬🇧</span> Press kit
                    </a>
                  </div>
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
