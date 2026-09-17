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
  const [heroProgress, setHeroProgress] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const [tlIndex, setTlIndex] = useState(0);
  const [tlShown, setTlShown] = useState(8);
  const [tlPhase, setTlPhase] = useState<"idle"|"exit"|"enter">("idle");
  const tlDir = useRef(1);
  const tlTouchX = useRef(0);
  const tlPickerRef = useRef<HTMLDivElement>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [vw, setVw] = useState(375);
  const [vh, setVh] = useState(844);
  const [navH, setNavH] = useState(0);
  const touchStartX = useRef(0);
  useEffect(() => {
    const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    const measure = () => setNavH(nav.getBoundingClientRect().height);
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(nav);
    return () => obs.disconnect();
  }, []);

  const [bookingNom, setBookingNom] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = heroRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = rect.height - window.innerHeight;
      setHeroProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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

  // Phase 1 (0→8%): photo + sides fade
  const p1 = Math.min(1, heroProgress / 0.08);
  // Phase 2 (0→55%): logo zoom + fade
  const p2 = Math.min(1, Math.max(0, heroProgress / 0.55));
  // Phase 3 (55→72%): bio typewriter reveal
  const p3 = Math.min(1, Math.max(0, (heroProgress - 0.55) / 0.17));
  // Bio opacity: appears then fades out as timeline approaches
  const p3fade = Math.min(1, Math.max(0, (heroProgress - 0.70) / 0.10));
  const bioOpacity = p3 * (1 - p3fade);
  // Phase 4 (78→100%): timeline rail slides in from right
  const p4raw = Math.min(1, Math.max(0, (heroProgress - 0.78) / 0.22));
  // Ease-out cubic for smooth deceleration
  const p4 = 1 - Math.pow(1 - p4raw, 3);

  const sidesOp = 0.5 * Math.max(0, 1 - p1 * 0.6 - p2);
  const sideStyle = (x: number, y: number, rot: number) => ({
    transform: `translateX(${p1 * x}px) translateY(${p1 * y}px) rotate(${p1 * rot}deg)`,
    opacity: sidesOp,
    filter: `grayscale(1) blur(${p1 * 3}px)`,
    transition: "none",
  });

  const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");
  const bioParagraphs = [
    { stripped: stripHtml(t.bio.p1), html: t.bio.p1, isQuote: false },
    { stripped: stripHtml(t.bio.p2), html: t.bio.p2, isQuote: false },
    { stripped: stripHtml(t.bio.p3), html: t.bio.p3, isQuote: false },
    { stripped: stripHtml(t.bio.p4), html: t.bio.p4, isQuote: true },
  ];
  const bioStripped = bioParagraphs.map(p => p.stripped).join("\n\n");
  const charsRevealed = Math.floor(p3 * bioStripped.length); // p3 = reveal progress
  let _rem = charsRevealed;
  const bioRevealed = bioParagraphs.map((p, i) => {
    const sep = i < bioParagraphs.length - 1 ? 2 : 0;
    if (_rem <= 0) return { state: "hidden" as const, text: "" };
    if (_rem >= p.stripped.length) { _rem -= p.stripped.length + sep; return { state: "complete" as const, text: p.html }; }
    const t2 = p.stripped.slice(0, _rem); _rem = 0;
    return { state: "typing" as const, text: t2 };
  });

  const LangToggle = () => (
    <div className="flex items-center gap-2">
      <button onClick={() => setLang("fr")} className={`text-lg transition-opacity ${lang === "fr" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}>🇫🇷</button>
      <button onClick={() => setLang("en")} className={`text-lg transition-opacity ${lang === "en" ? "opacity-100" : "opacity-30 hover:opacity-60"}`}>🇬🇧</button>
    </div>
  );

  return (
    <main className="min-h-screen text-zinc-900 flex flex-col [overflow-x:clip]">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 bg-zinc-50/80 backdrop-blur-md border-b border-zinc-100/60">
        <div className="flex items-center gap-3">
          <a href="/"><img src="/logo-etario.svg" alt="E-Tario" className="h-4 md:h-6" /></a>
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

      {/* Hero — scroll storytelling, 400vh. marginTop: -navH aligns hero top with viewport top
          so the sticky inner div is already at top:0 in normal flow — no jump on first scroll. */}
      <section ref={heroRef} style={{ height: "500vh", position: "relative", marginTop: -navH }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>

        {/* Background — reste fixe dans le sticky, ne remonte jamais */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: [
            "radial-gradient(ellipse 90% 80% at 10% 15%, rgba(184,147,106,0.10) 0%, transparent 65%)",
            "radial-gradient(ellipse 80% 90% at 90% 80%, rgba(201,169,110,0.08) 0%, transparent 65%)",
            "radial-gradient(ellipse 100% 70% at 50% 110%, rgba(224,213,197,0.25) 0%, transparent 55%)",
            "linear-gradient(to bottom, rgba(245,239,228,0) 0%, rgba(245,239,228,0) 70%, rgba(245,239,228,1) 100%)",
            "url(/bannieretest.jpg)",
          ].join(", "),
          backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: Math.max(0, 1 - p2 * 1.4),
          transition: "none",
        }} />

        {/* Images gauche */}
        <div className="hidden md:flex absolute left-0 top-0 h-full items-center pointer-events-none">
          <img src="/clubmed.png" className="w-107 grayscale -mt-30 -ml-20" style={sideStyle(-55, -20, -4)} />
          <img src="/color_dole.png" className="w-80 grayscale -mt-10 -ml-74" style={sideStyle(-90, 15, 6)} />
          <div
            className="w-80 h-80 -mt-10 -ml-19 flex-shrink-0"
            style={{
              ...sideStyle(-65, -10, -8),
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
              ...sideStyle(70, -15, 5),
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
          <img src="/soireeibiza1.png" className="w-80 grayscale -mt-30 -mr-0" style={sideStyle(45, 20, -6)} />
        </div>

        {/* Photo — reste fixe, disparaît en fondu (effet parallaxe) */}
        <img src="/mainphotov3.png" alt="E-Tario" className="w-36 md:w-130" style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, calc(-50% - 4rem))",
          opacity: Math.max(0, 1 - p1 * 2),
          transition: "none", zIndex: 2,
        }} />

        {/* Logo — SVG viewBox zoom into A (phase 2). No CSS scale = perfectly sharp. */}
        {(() => {
          const vwS = Math.max(vw, 375);
          const vhS = Math.max(vh, 600);
          const logoNatW = vw >= 768 ? 380 : 224;
          // viewBox at p2=0: show logo at natural CSS size, centered on A
          const vbWS = 2026 * vwS / logoNatW;
          const vbHS = vbWS * vhS / vwS;
          // viewBox at p2=1: zoomed 70× into A center
          const vbWE = vbWS / 600;
          const vbHE = vbHS / 70;
          // Zoom exponentiel : vitesse perçue constante (chaque % de scroll = même facteur)
          const vbW = vbWS * Math.pow(vbWE / vbWS, p2);
          const vbH = vbHS * Math.pow(vbHE / vbHS, p2);
          // A center in SVG space, with vertical offset matching original position
          const aCX = 1499;
          const aCY = 1464;
          const offsetY = (56 / vhS) * (1 - p2); // logo was 56px below viewport center; smoothly re-center during zoom
          const vbX = aCX - vbW / 2;
          const vbY = aCY - vbH * (0.5 + offsetY);
          return (
            <svg
              viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                opacity: Math.max(0, 1 - p2), transition: "none", zIndex: 3,
                pointerEvents: "none", overflow: "hidden",
              }}
            >
              <path fill="white" transform="translate(1495,1334)" d="M0 0 C1.827 0.194 1.827 0.194 4 1 C5.445 3.11 5.445 3.11 6.77 5.891 C7.263 6.905 7.756 7.919 8.265 8.963 C8.775 10.048 9.286 11.133 9.812 12.25 C10.874 14.451 11.938 16.652 13.004 18.852 C13.516 19.914 14.028 20.977 14.555 22.071 C16.806 26.634 19.311 31.029 21.891 35.414 C23.615 39.435 23.476 42.695 21.981 46.795 C21.744 47.271 21.744 47.271 20.543 49.684 C20.013 50.764 19.483 51.844 18.937 52.958 C18.36 54.106 17.782 55.254 17.188 56.438 C16.589 57.649 15.992 58.861 15.397 60.074 C14.184 62.541 12.966 65.005 11.744 67.467 C9.261 72.497 6.847 77.559 4.438 82.625 C3.543 84.498 2.649 86.37 1.754 88.242 C1.307 89.178 0.86 90.113 0.399 91.077 C-2.103 96.304 -4.615 101.527 -7.125 106.75 C-10.985 114.784 -14.824 122.827 -18.631 130.886 C-22.065 138.153 -25.538 145.402 -29.02 152.647 C-31.442 157.698 -33.823 162.765 -36.167 167.852 C-36.7 169.008 -37.233 170.164 -37.782 171.354 C-38.184 172.227 -38.586 173.1 -39 174 C-38.504 173.999 -38.504 173.999 -35.993 173.993 C-8.823 173.934 18.348 173.927 45.519 173.994 C47.818 174 50.117 174.004 52.416 174.009 C59.125 174.024 65.832 174.059 72.541 174.154 C74.338 174.176 76.135 174.19 77.933 174.195 C80.337 174.204 82.738 174.243 85.141 174.293 C86.415 174.309 87.688 174.324 89.001 174.341 C92 175 92 175 93.819 177.344 C94.014 177.782 94.014 177.782 95 180 C95.581 181.058 96.163 182.117 96.762 183.207 C97.406 184.408 98.048 185.61 98.688 186.812 C99.039 187.472 99.39 188.132 99.751 188.811 C103.201 195.328 106.497 201.918 109.772 208.523 C112.3 213.623 114.836 218.719 117.375 223.812 C117.652 224.368 117.652 224.368 119.052 227.181 C122.939 234.959 126.934 242.672 131.105 250.302 C134 255.679 134 255.679 134 259 C131.259 259.766 128.78 260.14 125.938 260.193 C125.544 260.201 125.544 260.201 123.551 260.242 C119.977 260.286 116.403 260.327 112.828 260.35 C110.943 260.367 109.057 260.394 107.172 260.432 C104.448 260.487 101.725 260.509 99 260.523 C98.158 260.546 97.316 260.569 96.449 260.592 C90.603 260.571 90.603 260.571 87.552 257.681 C85.66 254.413 83.932 251.097 82.312 247.688 C79.147 241.181 75.754 234.852 72.146 228.581 C65 216.118 65 216.118 65 213 C44.705 213.165 44.705 213.165 -58 214 C-66 230 -66 230 -69.703 237.617 C-71.484 241.262 -71.484 241.262 -72.365 243.06 C-72.966 244.293 -73.563 245.528 -74.156 246.765 C-75.036 248.597 -75.93 250.42 -76.828 252.242 C-77.085 252.773 -77.085 252.773 -78.388 255.457 C-80.158 258.25 -81.003 258.809 -84 260 C-85.986 260.247 -85.986 260.247 -88.094 260.243 C-88.888 260.246 -89.682 260.249 -90.501 260.252 C-90.925 260.249 -90.925 260.249 -93.07 260.23 C-93.948 260.23 -94.825 260.23 -95.729 260.229 C-97.58 260.226 -99.431 260.218 -101.282 260.206 C-104.122 260.188 -106.961 260.185 -109.801 260.186 C-111.599 260.181 -113.397 260.175 -115.195 260.168 C-115.621 260.167 -115.621 260.167 -117.777 260.165 C-123.768 260.116 -123.768 260.116 -126 259 C-124.673 253.665 -122.732 249.287 -120.062 244.5 C-113.085 231.658 -106.986 218.384 -100.792 205.153 C-95.596 194.062 -90.194 183.096 -84.437 172.284 C-77.125 158.548 -70.498 144.5 -63.912 130.405 C-63.73 130.019 -63.73 130.019 -62.812 128.062 C-62.533 127.466 -62.253 126.869 -61.965 126.254 C-59.849 121.757 -57.674 117.292 -55.441 112.852 C-55.103 112.176 -54.764 111.501 -54.415 110.805 C-53.278 108.536 -52.139 106.268 -51 104 C-47.847 97.717 -44.696 91.433 -41.546 85.148 C-40.603 83.266 -39.659 81.385 -38.714 79.504 C-33.141 68.406 -27.648 57.277 -22.347 46.046 C-19.943 40.954 -17.478 35.9 -14.938 30.875 C-10.782 22.636 -6.843 14.299 -2.926 5.944 C-1.976 3.95 -0.994 1.973 0 0 Z " />
              <path fill="white" transform="translate(537,1343)" d="M0 0 C31.16 -0.045 62.321 -0.081 93.481 -0.102 C97.158 -0.105 100.834 -0.107 104.51 -0.11 C105.242 -0.11 105.974 -0.111 106.728 -0.111 C118.589 -0.12 130.45 -0.136 142.311 -0.154 C154.475 -0.173 166.64 -0.184 178.805 -0.188 C186.315 -0.191 193.825 -0.2 201.335 -0.216 C207.087 -0.228 212.84 -0.229 218.592 -0.226 C220.957 -0.227 223.321 -0.231 225.685 -0.238 C228.903 -0.248 232.12 -0.246 235.338 -0.241 C236.283 -0.246 237.227 -0.252 238.2 -0.258 C239.06 -0.254 239.919 -0.25 240.805 -0.246 C241.548 -0.247 242.291 -0.248 243.056 -0.248 C245 0 245 0 248 2 C248.279 4.897 248.372 7.577 248.328 10.473 C248.326 11.311 248.324 12.149 248.322 13.013 C248.316 14.786 248.302 16.559 248.281 18.331 C248.25 21.055 248.24 23.778 248.234 26.502 C248.225 28.221 248.215 29.941 248.203 31.66 C248.199 32.48 248.195 33.3 248.19 34.144 C248.117 39.883 248.117 39.883 247 41 C243.827 41.098 240.676 41.13 237.503 41.12 C236.493 41.121 235.484 41.122 234.444 41.123 C231.033 41.125 227.623 41.119 224.213 41.114 C221.779 41.113 219.345 41.113 216.912 41.114 C211.658 41.114 206.405 41.111 201.151 41.106 C193.555 41.098 185.959 41.095 178.363 41.094 C166.04 41.092 153.718 41.085 141.395 41.075 C129.421 41.066 117.448 41.059 105.475 41.055 C105.106 41.055 105.106 41.055 103.24 41.054 C99.54 41.053 95.84 41.052 92.141 41.05 C61.427 41.04 30.714 41.022 0 41 C0 27.47 0 13.94 0 0 Z " />
              <path fill="white" transform="translate(1052,1344)" d="M0 0 C31.449 -0.023 62.899 -0.04 94.348 -0.051 C98.057 -0.052 101.766 -0.054 105.475 -0.055 C106.213 -0.055 106.952 -0.055 107.712 -0.056 C119.685 -0.06 131.657 -0.068 143.629 -0.077 C155.904 -0.086 168.179 -0.092 180.455 -0.094 C188.035 -0.095 195.616 -0.1 203.197 -0.108 C209 -0.114 214.803 -0.114 220.606 -0.113 C222.994 -0.113 225.381 -0.115 227.769 -0.119 C231.014 -0.124 234.258 -0.123 237.503 -0.12 C238.461 -0.123 239.419 -0.126 240.406 -0.129 C246.886 -0.114 246.886 -0.114 248 1 C248.101 3.8 248.14 6.575 248.133 9.375 C248.134 10.215 248.135 11.054 248.136 11.919 C248.136 13.698 248.135 15.477 248.13 17.256 C248.125 19.988 248.13 22.721 248.137 25.453 C248.136 27.177 248.135 28.901 248.133 30.625 C248.135 31.448 248.137 32.271 248.139 33.119 C248.115 38.885 248.115 38.885 247 40 C213.01 40 179.02 40 144 40 C144 108.97 144 177.94 144 249 C139.968 250.008 136.355 250.144 132.242 250.133 C131.498 250.134 130.754 250.135 129.987 250.136 C128.418 250.136 126.85 250.135 125.282 250.13 C122.877 250.125 120.472 250.13 118.066 250.137 C116.542 250.136 115.017 250.135 113.492 250.133 C113.132 250.134 113.132 250.134 111.308 250.139 C106.23 250.115 106.23 250.115 104 249 C103.67 180.36 103.34 111.72 103 41 C69.01 40.67 35.02 40.34 0 40 C0 26.8 0 13.6 0 0 Z " />
              <path fill="white" transform="translate(1724.5111389160156,1343.8595581054688)" d="M0 0 C0.689 -0.003 1.377 -0.006 2.087 -0.009 C4.412 -0.018 6.737 -0.019 9.062 -0.021 C10.722 -0.025 12.383 -0.03 14.043 -0.036 C18.571 -0.049 23.098 -0.055 27.626 -0.06 C30.458 -0.063 33.291 -0.067 36.123 -0.071 C44.993 -0.085 53.863 -0.095 62.734 -0.098 C72.954 -0.103 83.173 -0.12 93.393 -0.149 C101.3 -0.171 109.207 -0.181 117.114 -0.182 C121.831 -0.184 126.548 -0.189 131.265 -0.207 C135.715 -0.224 140.165 -0.226 144.616 -0.217 C146.238 -0.216 147.861 -0.221 149.483 -0.231 C173.328 -0.369 193.218 5.868 210.919 22.535 C226.165 37.99 234.404 57.032 234.801 78.765 C234.152 100.714 227.093 119.51 211.489 135.14 C210.728 135.913 209.968 136.685 209.184 137.48 C195.01 151.073 176.136 158.479 156.489 158.14 C161.398 163.921 166.58 169.328 171.989 174.64 C176.778 179.344 181.382 184.101 185.76 189.189 C188.685 192.491 191.839 195.556 194.989 198.64 C198.689 202.264 202.316 205.885 205.676 209.828 C210.78 215.747 216.432 221.152 221.989 226.64 C234.157 238.659 234.157 238.659 238.833 243.734 C239.381 244.329 239.93 244.924 240.495 245.537 C240.823 246.066 241.151 246.595 241.489 247.14 C241.159 248.13 240.829 249.12 240.489 250.14 C233.515 250.319 226.542 250.441 219.566 250.525 C217.195 250.56 214.825 250.608 212.455 250.669 C209.039 250.754 205.625 250.793 202.208 250.824 C201.681 250.842 201.681 250.842 199.019 250.934 C193.507 250.936 190.222 250.487 185.979 246.813 C184.793 245.61 183.629 244.386 182.489 243.14 C181.306 241.99 180.119 240.844 178.926 239.703 C176.737 237.485 174.684 235.21 172.68 232.824 C166.814 226.088 160.334 219.919 153.989 213.64 C139.285 199.09 139.285 199.09 134.1 192.974 C130.762 189.175 127.094 185.685 123.489 182.14 C118.562 177.296 113.746 172.445 109.29 167.16 C108.695 166.494 108.101 165.827 107.489 165.14 C107.119 164.612 107.119 164.612 105.248 161.939 C101.095 157.865 95.864 158.418 90.384 158.461 C88.932 158.492 87.48 158.523 86.028 158.555 C84.684 158.563 83.34 158.569 81.995 158.573 C77.035 158.604 72.074 158.688 67.114 158.765 C61.566 158.827 61.566 158.827 33.489 159.14 C33.159 188.84 32.829 218.54 32.489 249.14 C28.818 250.364 25.432 250.284 21.61 250.273 C20.842 250.274 20.074 250.275 19.283 250.276 C17.662 250.277 16.04 250.275 14.419 250.271 C11.932 250.265 9.446 250.271 6.96 250.277 C5.385 250.276 3.81 250.275 2.235 250.273 C1.489 250.275 0.743 250.277 -0.025 250.279 C-5.281 250.255 -5.281 250.255 -7.511 249.14 C-7.534 217.564 -7.552 185.987 -7.562 154.41 C-7.563 150.686 -7.565 146.962 -7.566 143.238 C-7.566 142.497 -7.567 141.756 -7.567 140.992 C-7.571 128.971 -7.579 116.95 -7.588 104.93 C-7.598 92.605 -7.603 80.28 -7.605 67.955 C-7.607 60.343 -7.611 52.732 -7.619 45.121 C-7.625 39.294 -7.626 33.468 -7.624 27.641 C-7.625 25.244 -7.627 22.846 -7.63 20.449 C-7.635 17.191 -7.634 13.933 -7.631 10.676 C-7.634 9.714 -7.637 8.752 -7.64 7.76 C-7.623 0.135 -7.529 0.018 0 0 Z M32.489 41.14 C32.389 43.508 32.353 45.847 32.359 48.215 C32.358 48.954 32.356 49.694 32.354 50.457 C32.35 52.914 32.353 55.371 32.356 57.828 C32.355 59.528 32.354 61.228 32.353 62.928 C32.352 66.496 32.354 70.064 32.358 73.632 C32.364 78.215 32.361 82.799 32.355 87.383 C32.351 90.895 32.352 94.407 32.355 97.919 C32.356 99.609 32.355 101.3 32.353 102.99 C32.35 105.349 32.354 107.708 32.359 110.066 C32.357 110.772 32.355 111.477 32.353 112.204 C32.375 117.026 32.375 117.026 33.489 118.14 C35.109 118.243 36.733 118.276 38.357 118.281 C39.411 118.287 40.465 118.292 41.551 118.298 C42.717 118.299 43.884 118.3 45.086 118.302 C45.697 118.304 45.697 118.304 48.787 118.317 C52.149 118.329 55.511 118.336 58.873 118.341 C60.976 118.344 63.079 118.348 65.183 118.352 C71.77 118.366 78.357 118.375 84.944 118.379 C92.533 118.384 100.122 118.401 107.712 118.43 C113.584 118.452 119.455 118.462 125.327 118.463 C128.83 118.464 132.333 118.47 135.837 118.488 C139.757 118.508 143.677 118.503 147.598 118.497 C148.744 118.506 149.891 118.515 151.072 118.525 C163.681 118.46 172.997 115.585 182.489 107.14 C191.203 98.151 194.12 89.047 193.957 76.754 C193.516 65.746 189.172 58 181.489 50.14 C170.271 40.985 159.145 39.986 145.214 40.011 C144.005 40.009 142.796 40.008 141.55 40.006 C138.257 40.002 134.964 40.003 131.671 40.006 C128.221 40.009 124.77 40.006 121.319 40.005 C115.533 40.003 109.747 40.005 103.962 40.01 C97.267 40.016 90.572 40.014 83.877 40.008 C78.124 40.004 72.371 40.003 66.618 40.006 C63.183 40.007 59.749 40.007 56.314 40.004 C52.496 40.001 48.677 40.005 44.858 40.011 C43.715 40.009 42.572 40.007 41.394 40.005 C40.877 40.006 40.877 40.006 38.263 40.013 C37.36 40.014 36.457 40.014 35.526 40.015 C33.489 40.14 33.489 40.14 32.489 41.14 Z " />
              <path fill="white" transform="translate(2070.0338134765625,1343.8610534667969)" d="M0 0 C0.845 0.002 1.69 0.004 2.56 0.006 C3.422 0.005 4.284 0.004 5.172 0.003 C6.998 0.003 8.823 0.004 10.649 0.009 C13.454 0.014 16.259 0.009 19.064 0.002 C20.833 0.003 22.603 0.004 24.372 0.006 C25.217 0.004 26.062 0.002 26.932 0 C32.851 0.024 32.851 0.024 33.966 1.139 C34.064 4.324 34.096 7.488 34.086 10.674 C34.087 11.688 34.088 12.701 34.089 13.746 C34.091 17.17 34.085 20.594 34.08 24.018 C34.079 26.462 34.08 28.905 34.08 31.348 C34.08 36.623 34.078 41.898 34.072 47.173 C34.064 54.8 34.061 62.427 34.06 70.053 C34.058 82.426 34.051 94.799 34.042 107.171 C34.032 119.193 34.025 131.215 34.021 143.237 C34.021 143.977 34.021 144.718 34.02 145.481 C34.019 149.196 34.018 152.91 34.017 156.625 C34.006 187.463 33.988 218.301 33.966 249.139 C30.24 250.381 26.752 250.321 22.869 250.342 C22.078 250.348 21.288 250.353 20.474 250.359 C18.806 250.369 17.137 250.375 15.469 250.379 C12.91 250.389 10.351 250.42 7.792 250.451 C6.172 250.458 4.551 250.463 2.931 250.467 C2.163 250.479 1.396 250.492 0.605 250.504 C-1.55 250.495 -1.55 250.495 -5.034 250.139 C-7.094 247.048 -7.284 246.42 -7.283 242.931 C-7.287 242.068 -7.292 241.206 -7.297 240.318 C-7.291 239.37 -7.286 238.422 -7.281 237.446 C-7.283 236.439 -7.286 235.433 -7.288 234.396 C-7.294 231.008 -7.285 227.62 -7.277 224.232 C-7.278 221.81 -7.28 219.387 -7.282 216.965 C-7.287 211.059 -7.282 205.154 -7.273 199.248 C-7.262 192.377 -7.262 185.505 -7.263 178.633 C-7.263 166.377 -7.254 154.121 -7.24 141.865 C-7.226 129.961 -7.218 118.056 -7.219 106.152 C-7.219 105.419 -7.219 104.685 -7.219 103.93 C-7.219 103.197 -7.219 102.465 -7.219 101.711 C-7.22 88.173 -7.214 74.635 -7.205 61.096 C-7.202 56.301 -7.201 51.506 -7.201 46.711 C-7.2 40.265 -7.194 33.818 -7.184 27.372 C-7.181 24.999 -7.179 22.625 -7.18 20.252 C-7.18 17.027 -7.175 13.803 -7.168 10.578 C-7.169 9.626 -7.171 8.674 -7.172 7.693 C-7.143 0.029 -7.143 0.029 0 0 Z " />
              <path fill="white" transform="translate(2369,1347)" d="M0 0 C0.716 0.193 1.432 0.387 2.17 0.586 C35.356 9.897 62.832 32.236 80 62 C82.707 67.178 84.923 72.544 87 78 C87.241 78.629 87.482 79.258 87.73 79.906 C99.49 111.243 97.724 145.694 84.043 176.128 C69.073 207.984 42.855 231.629 9.805 243.559 C5.91 244.886 1.984 245.969 -2 247 C-3.177 247.318 -4.354 247.637 -5.566 247.965 C-24.806 252.392 -46.113 251.64 -65 246 C-65.722 245.786 -66.444 245.571 -67.188 245.351 C-82.355 240.699 -96.631 234.017 -109 224 C-109.544 223.567 -110.087 223.134 -110.647 222.688 C-132.221 205.404 -148.254 182.015 -155 155 C-155.15 154.417 -155.15 154.417 -155.906 151.465 C-162.862 119.294 -157.52 84.13 -139.858 56.194 C-134.568 48.205 -128.617 40.934 -122 34 C-121.713 33.675 -121.713 33.675 -120.258 32.031 C-91.419 0.758 -40.292 -10.975 0 0 Z M-96.613 60.555 C-114.695 79.487 -121.658 101.475 -121.475 127.104 C-121.242 136.284 -120.062 144.331 -117 153 C-116.83 153.512 -116.83 153.512 -115.973 156.102 C-107.662 178.518 -89.668 195.447 -68.562 205.812 C-46.372 215.342 -20.976 215.985 1.562 207.375 C22.871 198.624 41.814 181.342 50.853 159.984 C60.149 136.469 60.952 112.401 51.688 88.688 C40.54 63.885 22.063 47.311 -3.101 37.68 C-36.277 25.805 -72.085 36.577 -96.613 60.555 Z " />
              <path fill="white" transform="translate(2381,1401)" d="M0 0 C0.66 0 1.32 0 2 0 C0.009 7.606 -2.263 15.074 -4.766 22.527 C-5.122 23.596 -5.479 24.665 -5.846 25.767 C-6.597 28.019 -7.351 30.27 -8.105 32.521 C-9.236 35.896 -10.363 39.273 -11.488 42.65 C-12.949 47.028 -14.421 51.402 -15.902 55.772 C-17.262 59.787 -18.587 63.81 -19.881 67.847 C-20.469 69.632 -21.056 71.418 -21.645 73.203 C-21.891 74 -22.137 74.796 -22.391 75.617 C-25.217 84.052 -31.115 88.742 -38 94 C-39.406 95.217 -40.804 96.445 -42.188 97.688 C-42.802 98.22 -43.417 98.752 -44.051 99.301 C-48.081 102.814 -52.032 106.417 -56 110 C-61.276 114.765 -66.562 119.514 -71.93 124.176 C-74.357 126.315 -76.738 128.503 -79.125 130.688 C-82.596 133.826 -86 136.579 -90 139 C-86.428 125.183 -81.796 111.678 -77.332 98.13 C-76.274 94.916 -75.227 91.699 -74.19 88.479 C-72.927 84.557 -71.644 80.642 -70.348 76.731 C-69.861 75.252 -69.381 73.771 -68.908 72.288 C-66.246 63.959 -63.62 57.057 -57 51 C-56.537 50.551 -56.537 50.551 -54.191 48.277 C-53.758 47.891 -53.758 47.891 -51.562 45.938 C-50.616 45.092 -49.67 44.246 -48.695 43.375 C-45.813 40.835 -42.927 38.298 -40.027 35.777 C-37.665 33.706 -35.332 31.605 -33 29.5 C-30.041 26.83 -27.071 24.177 -24.062 21.562 C-19.88 17.921 -15.792 14.179 -11.695 10.441 C-8.649 7.682 -5.566 4.97 -2.461 2.277 C-1.62 1.542 -0.79 0.79 0 0 Z M-55.438 62.875 C-56.332 66.255 -55.872 68.628 -55 72 C-53.141 74.911 -51.142 77.429 -48 79 C-42.747 79.344 -39.174 79.577 -35 76 C-32.132 71.889 -31.525 68.724 -32.348 63.898 C-33.649 60.111 -36.502 57.749 -40 56 C-47.563 55.244 -50.727 56.73 -55.438 62.875 Z " />
              <path fill="white" transform="translate(537,1448)" d="M0 0 C21.348 -0.045 42.697 -0.082 64.045 -0.104 C73.957 -0.114 83.869 -0.128 93.781 -0.151 C102.417 -0.171 111.054 -0.184 119.69 -0.188 C124.266 -0.191 128.841 -0.197 133.416 -0.211 C137.719 -0.225 142.021 -0.229 146.324 -0.226 C147.907 -0.227 149.489 -0.231 151.072 -0.238 C153.226 -0.248 155.379 -0.246 157.533 -0.241 C158.741 -0.242 159.949 -0.244 161.193 -0.246 C164 0 164 0 166 2 C166.188 4.857 166.256 7.616 166.23 10.473 C166.23 11.311 166.23 12.149 166.229 13.013 C166.226 14.786 166.218 16.558 166.206 18.331 C166.188 21.055 166.185 23.778 166.186 26.502 C166.181 28.221 166.175 29.941 166.168 31.66 C166.167 32.48 166.166 33.3 166.165 34.144 C166.116 39.884 166.116 39.884 165 41 C162.874 41.097 160.744 41.122 158.616 41.12 C157.941 41.121 157.266 41.122 156.571 41.123 C154.294 41.125 152.017 41.119 149.74 41.114 C148.114 41.113 146.489 41.113 144.863 41.114 C140.435 41.114 136.008 41.108 131.58 41.101 C126.958 41.095 122.337 41.095 117.715 41.093 C108.957 41.09 100.198 41.082 91.44 41.072 C81.471 41.061 71.503 41.055 61.535 41.05 C41.023 41.04 20.512 41.022 0 41 C0 27.47 0 13.94 0 0 Z " />
              <path fill="white" transform="translate(870,1448)" d="M0 0 C33.33 0 66.66 0 101 0 C102.639 3.279 102.12 6.906 102.098 10.508 C102.096 11.348 102.095 12.189 102.093 13.055 C102.088 15.745 102.075 18.435 102.062 21.125 C102.057 22.947 102.053 24.768 102.049 26.59 C102.038 31.06 102.021 35.53 102 40 C99.153 41.61 97.114 42.25 93.85 42.254 C93.441 42.257 93.441 42.257 91.369 42.271 C90.479 42.267 89.59 42.263 88.673 42.259 C87.73 42.262 86.786 42.266 85.814 42.269 C82.696 42.278 79.579 42.272 76.461 42.266 C74.297 42.267 72.132 42.269 69.968 42.271 C65.434 42.274 60.9 42.27 56.365 42.261 C50.543 42.249 44.721 42.256 38.899 42.268 C34.431 42.275 29.963 42.273 25.496 42.268 C23.348 42.266 21.201 42.268 19.053 42.273 C16.058 42.278 13.063 42.27 10.068 42.259 C9.174 42.263 8.281 42.267 7.36 42.271 C1.229 42.229 1.229 42.229 -1 40 C-1.188 37.154 -1.256 34.408 -1.23 31.562 C-1.23 30.727 -1.23 29.891 -1.229 29.03 C-1.226 27.261 -1.218 25.492 -1.206 23.724 C-1.188 21.011 -1.185 18.299 -1.186 15.586 C-1.181 13.87 -1.175 12.154 -1.168 10.438 C-1.167 9.623 -1.166 8.808 -1.165 7.969 C-1.116 2.232 -1.116 2.232 0 0 Z " />
              <path fill="white" transform="translate(537,1553)" d="M0 0 C31.449 -0.023 62.899 -0.04 94.348 -0.051 C98.057 -0.052 101.766 -0.054 105.475 -0.055 C106.213 -0.055 106.952 -0.055 107.712 -0.056 C119.685 -0.06 131.657 -0.068 143.629 -0.077 C155.904 -0.086 168.179 -0.092 180.455 -0.094 C188.035 -0.095 195.616 -0.1 203.197 -0.108 C209 -0.114 214.803 -0.114 220.606 -0.113 C222.994 -0.113 225.381 -0.115 227.769 -0.119 C231.014 -0.124 234.258 -0.123 237.503 -0.12 C238.461 -0.123 239.419 -0.126 240.406 -0.129 C246.886 -0.114 246.886 -0.114 248 1 C248.089 3.884 248.115 6.745 248.098 9.629 C248.097 10.061 248.097 10.061 248.093 12.248 C248.088 15.019 248.075 17.791 248.062 20.562 C248.057 22.437 248.053 24.311 248.049 26.186 C248.038 30.79 248.021 35.395 248 40 C243.079 41.285 238.22 41.136 233.174 41.12 C232.177 41.121 231.18 41.122 230.154 41.123 C226.811 41.124 223.468 41.119 220.126 41.114 C217.731 41.113 215.336 41.113 212.941 41.114 C207.111 41.114 201.281 41.11 195.451 41.104 C188.667 41.096 181.882 41.095 175.098 41.094 C162.999 41.092 150.901 41.085 138.802 41.075 C127.05 41.066 115.298 41.059 103.546 41.055 C102.822 41.055 102.097 41.054 101.351 41.054 C97.716 41.053 94.081 41.052 90.446 41.05 C60.298 41.04 30.149 41.022 0 41 C0 27.47 0 13.94 0 0 Z " />
            </svg>
          );
        })()}

        {/* Tagline */}
        <p style={{
          position: "absolute", left: "50%", top: "calc(50% + 6rem)",
          transform: "translateX(-50%)",
          fontSize: 11, fontWeight: 600, letterSpacing: ".25em", color: "white",
          textTransform: "uppercase", whiteSpace: "nowrap",
          opacity: Math.max(0, 1 - p1 * 3), zIndex: 4,
        }}>Phlegmatic Dj</p>

        {/* Bio typewriter — phase 3 */}
        {bioOpacity > 0 && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(680px, calc(100vw - 48px))",
            opacity: bioOpacity, zIndex: 10, padding: "0 24px", textAlign: "center",
          }}>
            {/* Titre */}
            <p style={{
              fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
              fontWeight: 700,
              color: "#1A1410",
              marginBottom: "1.6rem",
              lineHeight: 1.3,
            }}>
              {t.bio.highlight}
            </p>
            {/* Paragraphes */}
            {bioRevealed.map((r, i) => {
              if (r.state === "hidden") return null;
              const isCursor = r.state === "typing" && p3 < 1;
              const isQuote = bioParagraphs[i].isQuote;
              return (
                <p key={i} style={{
                  color: isQuote ? "#7A6050" : "#4A3F35",
                  fontSize: isQuote ? "clamp(0.95rem, 1.6vw, 1.05rem)" : "clamp(0.9rem, 1.5vw, 1rem)",
                  fontStyle: isQuote ? "italic" : "normal",
                  lineHeight: 1.9,
                  marginBottom: i < bioParagraphs.length - 1 ? "1.2rem" : 0,
                }}>
                  {r.state === "complete"
                    ? <span dangerouslySetInnerHTML={{ __html: r.text }} />
                    : r.text}
                  {isCursor && <span className="bio-cursor" />}
                </p>
              );
            })}
          </div>
        )}

        {/* Réseaux + Booking — fades in phase 1 */}
        <div style={{ position: "absolute", bottom: "6vh", left: "50%", transform: "translateX(-50%)", opacity: Math.max(0, 1 - p1 * 3), zIndex: 5, pointerEvents: p1 > 0.3 ? "none" : "auto" }}
          className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
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
        </div>{/* end social */}

        {/* Timeline — phase 4: cinematic black reveal */}
        {p4 > 0 && (() => {
          type TLItem = { period: string; title: string };
          const items = (t.timeline as TLItem[]);
          const N = items.length;

          // Dark overlay — fades in with p4
          const overlayOp = Math.min(0.92, p4 * 1.1);

          // Line draws left→right, ease-out quad, completes at p4=0.45
          const lineRaw = Math.min(1, p4 / 0.45);
          const lineP = 1 - Math.pow(1 - lineRaw, 2);

          // Spark head: bright glow racing ahead of the line
          const sparkOp = lineRaw < 1 ? (1 - lineRaw) * 0.9 : 0;

          return (
            <div style={{
              position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
              zIndex: 6, pointerEvents: "none", overflow: "hidden",
            }}>
              {/* Dark overlay */}
              <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
                background: "#0A0907",
                opacity: overlayOp,
              }} />

              {/* Timeline centred */}
              <div style={{
                position: "absolute",
                top: "50%", left: "10%",
                width: "80%",
                transform: "translateY(-50%)",
              }}>
                {/* Line track — draws left to right */}
                <div style={{ position: "relative", height: 1, overflow: "visible" }}>
                  {/* Drawn line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0,
                    width: `${lineP * 100}%`, height: "100%",
                    background: "rgba(255,255,255,0.9)",
                  }} />
                  {/* Racing spark — luminous blur head */}
                  <div style={{
                    position: "absolute", top: "50%",
                    left: `${lineP * 100}%`,
                    transform: "translate(-100%, -50%)",
                    width: "12vw", height: 3,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.7) 85%, white 100%)",
                    filter: "blur(1.5px)",
                    opacity: sparkOp,
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Dots + labels — staggered per item */}
                {items.map((item, i) => {
                  const pct = N > 1 ? (i / (N - 1)) * 100 : 50;
                  const dotDelay = 0.38 + i * 0.06;
                  const lblDelay = dotDelay + 0.08;
                  const dotP = Math.min(1, Math.max(0, (p4 - dotDelay) / 0.22));
                  const dotE = 1 - Math.pow(1 - dotP, 3);
                  const lblP = Math.min(1, Math.max(0, (p4 - lblDelay) / 0.28));
                  const above = i % 2 === 0;

                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${pct}%`,
                      top: "50%", transform: "translate(-50%, -50%)",
                    }}>
                      {/* Dot */}
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "white",
                        boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                        opacity: dotE,
                        transform: `scale(${0.4 + dotE * 0.6})`,
                        position: "relative", zIndex: 1,
                      }} />
                      {/* Labels */}
                      <div style={{
                        position: "absolute",
                        ...(above ? { bottom: 18 } : { top: 18 }),
                        left: "50%",
                        transform: `translateX(-50%) translateY(${above ? (1 - lblP) * 10 : -(1 - lblP) * 10}px)`,
                        opacity: lblP,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}>
                        <div style={{
                          fontSize: 13, fontWeight: 700, color: "white",
                          letterSpacing: "0.1em", marginBottom: 3,
                        }}>{item.period}</div>
                        <div style={{
                          fontSize: 11, fontWeight: 400,
                          color: "rgba(255,255,255,0.5)",
                          letterSpacing: "0.05em",
                        }}>{item.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        </div>{/* end sticky inner */}
      </section>{/* end 400vh hero */}

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
