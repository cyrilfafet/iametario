"use client";
import { useState, useRef, Suspense } from "react";
import Footer from "@/components/Footer";

const demos = [
  {
    client: "Thomas R.",
    brief: "Salut, j'aurais besoin d'une version intro de la musique Movin' On de Starting Rock pour mes sets, quelque chose de techno, avec du suspense, assez sombre tout en étant orchestral et épique, style festival.",
    title: "Movin' On — Orchestral Edit",
    file: "/Movin_On_Techno_DEMO.mp3",
    tag: "Intro Festival DJ",
  },
  {
    client: "Karim B.",
    brief: "Salut E-Tario, j'aurais besoin d'un edit de 'Alors la Zone' de Jul pour mon intro de festival. Quelque chose d'épique qui monte, avec le vocal 'indépendance' qu'il dit dans un live Skyrock en boucle si possible.",
    title: "Alors la Zone — Festival intro",
    file: "/Alors_La_Zone_DEMO.mp3",
    tag: "Intro Festival",
  },
  {
    client: "Discothèque la D****",
    brief: "Bonjour, pouvez vous intégrer des voix dans vos intros ? Nous faisons une soirée 60-2010 en afterwork pour Halloween, et aimerions une voix qui introduit la soirée, dans le style Halloween, sur un fond musical adapté.",
    title: "Soirée 60-2010 — Halloween Intro",
    file: "/Halloween_Soiree_60_2010_DEMO.mp3",
    tag: "Intro Soirée",
  },
  {
    client: "Camille D.",
    brief: "Bonjour ! Je suis témoin de mariage, on prépare une chorée surprise. Il nous faudrait un montage 3 titres : Women de Doja Cat, Jatti De Nain à partir de 0:38, et le show Shakira & JLo Super Bowl 2020 entre 4:34 et 5:52.",
    title: "Women × Jatti × Shakira — Wedding Mix",
    file: "/Women_Jatti_Shakira_Wedding_Mix.mp3",
    tag: "Chorée Mariage",
  },
];

const services = [
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="10" r="4" />
        <path d="M8 28c0-4.418 3.582-8 8-8s8 3.582 8 8" />
        <path d="M22 6c1.5.8 2.5 2.3 2.5 4s-1 3.2-2.5 4" />
        <circle cx="24" cy="22" r="2" /><line x1="26" y1="22" x2="30" y2="22" />
      </svg>
    ),
    title: "Intro DJ Sur Mesure",
    desc: "Intro épique pour vos sets festival ou club — orchestrale, techno, montée dramatique. Votre identité sonore en quelques secondes.",
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="16" r="6" />
        <circle cx="20" cy="16" r="6" />
        <path d="M14.5 11.5a6 6 0 0 1 3 0M14.5 20.5a6 6 0 0 0 3 0" />
      </svg>
    ),
    title: "Custom Edits & Mashups",
    desc: "Fusion de titres, transitions sur mesure, réorchestrations. Pour des moments uniques sur la piste.",
  },
  {
    icon: (
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="8" x2="6" y2="24" /><line x1="6" y1="12" x2="10" y2="12" /><line x1="6" y1="20" x2="10" y2="20" />
        <circle cx="12" cy="12" r="2" /><circle cx="12" cy="20" r="2" />
        <line x1="14" y1="8" x2="14" y2="24" /><line x1="14" y1="16" x2="18" y2="16" />
        <circle cx="20" cy="16" r="2" />
        <line x1="22" y1="8" x2="22" y2="24" /><line x1="22" y1="11" x2="26" y2="11" /><line x1="22" y1="22" x2="26" y2="22" />
        <circle cx="28" cy="11" r="2" /><circle cx="28" cy="22" r="2" />
      </svg>
    ),
    title: "Montage & Chorégraphie",
    desc: "Montages multi-titres pour mariages, enterrements de vie, événements corporate. Transitions fluides garanties.",
  },
];

function WaveformBars({ count = 36, flip = false }: { count?: number; flip?: boolean }) {
  const heights = [18, 32, 52, 28, 65, 42, 80, 38, 70, 55, 85, 45, 72, 35, 60, 48, 90, 40, 75, 30, 58, 68, 25, 50, 82, 44, 66, 36, 56, 78, 42, 62, 28, 48, 70, 38];
  return (
    <svg
      viewBox={`0 0 ${count * 9} 100`}
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {heights.slice(0, count).map((h, i) => (
        <rect key={i} x={i * 9 + 1} y={(100 - h) / 2} width={6} height={h} rx={2} fill="#B8936A" opacity={0.5 + (i / count) * 0.35} />
      ))}
    </svg>
  );
}

function ServicesInner() {
  const [demoPage, setDemoPage] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>(demos.map(() => 0));
  const [durations, setDurations] = useState<number[]>(demos.map(() => 0));
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFaq, setShowFaq] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const togglePlay = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    if (playing === index) { audio.pause(); setPlaying(null); }
    else {
      audioRefs.current.forEach((a, i) => { if (i !== index && a) a.pause(); });
      audio.play(); setPlaying(index);
    }
  };

  const handleTimeUpdate = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio || !audio.duration) return;
    setProgress(prev => prev.map((p, i) => i === index ? (audio.currentTime / audio.duration) * 100 : p));
  };

  const handleSeek = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(prev => prev.map((p, i) => i === index ? value : p));
  };

  return (
    <main className="min-h-screen text-zinc-100 flex flex-col" style={{ backgroundColor: "#0D0B08" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 z-50 border-b backdrop-blur-md" style={{ backgroundColor: "rgba(13,11,8,0.85)", borderColor: "rgba(184,147,106,0.15)" }}>
        <a href="/"><img src="/Logo _V1_black.png" alt="E-Tario" className="h-4 md:h-6 invert" /></a>
        <div className="hidden md:flex gap-8 text-sm" style={{ color: "rgba(245,239,228,0.5)" }}>
          <a href="/" className="hover:text-white transition-colors" style={{ fontFamily: "var(--font-syne)" }}>ACCUEIL</a>
          <a href="/services" className="font-semibold" style={{ color: "#B8936A", fontFamily: "var(--font-syne)" }}>SERVICES</a>
          <a href="/formations" className="hover:text-white transition-colors" style={{ fontFamily: "var(--font-syne)" }}>FORMATIONS</a>
          <a href="/shop" className="hover:text-white transition-colors" style={{ fontFamily: "var(--font-syne)" }}>SHOP</a>
          <a href="/contact" className="hover:text-white transition-colors" style={{ fontFamily: "var(--font-syne)" }}>CONTACT</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`w-6 h-px transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} style={{ backgroundColor: "#B8936A" }} />
          <span className={`w-6 h-px transition-all ${menuOpen ? "opacity-0" : ""}`} style={{ backgroundColor: "#B8936A" }} />
          <span className={`w-6 h-px transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ backgroundColor: "#B8936A" }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b text-sm" style={{ borderColor: "rgba(184,147,106,0.15)", color: "rgba(245,239,228,0.6)", backgroundColor: "#0D0B08" }}>
          <a href="/" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">ACCUEIL</a>
          <a href="/services" onClick={() => setMenuOpen(false)} style={{ color: "#B8936A" }}>SERVICES</a>
          <a href="/formations" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">FORMATIONS</a>
          <a href="/shop" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">SHOP</a>
          <a href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">CONTACT</a>
        </div>
      )}

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-8 py-20 overflow-hidden" style={{ minHeight: 480 }}>
        <div className="hidden md:block absolute left-0 top-0 h-full" style={{ width: 280, opacity: 0.9 }}>
          <WaveformBars count={36} />
        </div>
        <div className="hidden md:block absolute right-0 top-0 h-full" style={{ width: 280, opacity: 0.9 }}>
          <WaveformBars count={36} flip />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 50%, #0D0B08 60%, transparent 100%)" }} />

        <div className="relative z-10 text-center max-w-xl mx-auto mb-14">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#B8936A", fontFamily: "var(--font-syne)" }}>Services Audio</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: "#F5EFE4" }}>
            Le bon son,<br />sur mesure.
          </h1>
          <p style={{ color: "rgba(245,239,228,0.55)", fontSize: 15 }}>Production soignée · Livrée en 10 jours · 3 révisions incluses</p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto">
          {services.map((s, i) => (
            <a
              key={i} href="#commander"
              className="flex flex-col items-center text-center px-6 py-8 rounded-2xl transition-all group"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.25)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(184,147,106,0.6)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(184,147,106,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(184,147,106,0.25)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}
            >
              <span style={{ color: "#B8936A" }} className="mb-4 opacity-80 group-hover:opacity-100 transition-opacity">{s.icon}</span>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#F5EFE4", fontFamily: "var(--font-syne)" }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(245,239,228,0.5)" }}>{s.desc}</p>
            </a>
          ))}
        </div>

        <a
          href="#commander"
          className="relative z-10 mt-10 inline-block px-8 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
          style={{ backgroundColor: "#B8936A", color: "#0D0B08", borderRadius: 2, fontFamily: "var(--font-syne)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#C9A96E"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#B8936A"; }}
        >
          Commander un projet →
        </a>
      </section>

      {/* Séparateur */}
      <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(184,147,106,0.3), transparent)" }} />

      {/* Démos — coverflow 1 carte centrée */}
      <section className="py-16">
        <p className="text-xs tracking-widest uppercase mb-10 text-center px-8" style={{ color: "rgba(245,239,228,0.4)", fontFamily: "var(--font-syne)" }}>Exemples de réalisations</p>

        {/* Coverflow */}
        <div style={{ overflow: "hidden", perspective: "1100px", perspectiveOrigin: "50% 40%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "1fr" }}>
            {demos.map((demo, index) => {
              const relPos = index - demoPage;
              const isActive = relPos === 0;
              const isRight = relPos === 1;
              const isLeft = relPos === -1;
              const isVisible = isActive || isRight || isLeft;

              let cardTransform: string;
              let cardOpacity: number;
              let cardZIndex: number;
              let origin: string;

              if (isActive) {
                cardTransform = "translateX(0%) rotateY(0deg) scale(1)";
                cardOpacity = 1; cardZIndex = 10; origin = "center center";
              } else if (isRight) {
                cardTransform = "translateX(72%) rotateY(-52deg) scale(0.78)";
                cardOpacity = 0.38; cardZIndex = 5; origin = "left center";
              } else if (isLeft) {
                cardTransform = "translateX(-72%) rotateY(52deg) scale(0.78)";
                cardOpacity = 0.38; cardZIndex = 5; origin = "right center";
              } else {
                cardTransform = relPos > 1
                  ? "translateX(140%) rotateY(-52deg) scale(0.68)"
                  : "translateX(-140%) rotateY(52deg) scale(0.68)";
                cardOpacity = 0; cardZIndex = 1; origin = "center center";
              }

              return (
                <div key={index} style={{
                  gridRow: 1, gridColumn: 1,
                  padding: "0 max(16px, 10%)",
                  transform: cardTransform,
                  opacity: cardOpacity,
                  zIndex: cardZIndex,
                  transformOrigin: origin,
                  transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.45s",
                  pointerEvents: isActive ? "auto" : "none",
                  visibility: isVisible ? "visible" : "hidden",
                }}>
                  <div className="flex flex-col gap-4 p-5 rounded-2xl" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.18)" }}>
                    {/* Brief */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-semibold" style={{ backgroundColor: "rgba(184,147,106,0.15)", color: "#B8936A" }}>
                        {demo.client[0]}
                      </div>
                      <div>
                        <p className="text-xs mb-1.5" style={{ color: "rgba(245,239,228,0.35)" }}>{demo.client}</p>
                        <p className="text-sm leading-relaxed italic" style={{ color: "rgba(245,239,228,0.65)" }}>{demo.brief}</p>
                      </div>
                    </div>
                    {/* Player */}
                    <div className="rounded-xl px-4 py-3" style={{ backgroundColor: "rgba(184,147,106,0.05)", border: "1px solid rgba(184,147,106,0.15)" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => togglePlay(index)}
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                          style={{ border: "1px solid rgba(184,147,106,0.4)" }}
                          onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "#B8936A"; b.style.backgroundColor = "rgba(184,147,106,0.12)"; }}
                          onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = "rgba(184,147,106,0.4)"; b.style.backgroundColor = "transparent"; }}
                        >
                          {playing === index ? (
                            <span className="w-3 h-3 flex gap-0.5">
                              <span className="w-1 h-full rounded-sm" style={{ backgroundColor: "#B8936A" }} />
                              <span className="w-1 h-full rounded-sm" style={{ backgroundColor: "#B8936A" }} />
                            </span>
                          ) : (
                            <span className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent ml-0.5" style={{ borderLeftColor: "#B8936A" }} />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "#F5EFE4" }}>{demo.title}</p>
                          <span className="text-xs rounded-full px-2 py-0.5" style={{ color: "#B8936A", border: "1px solid rgba(184,147,106,0.35)" }}>{demo.tag}</span>
                        </div>
                      </div>
                      <input
                        type="range" min={0} max={100} value={progress[index]}
                        onChange={(e) => handleSeek(index, e)}
                        className="w-full h-1 cursor-pointer"
                        style={{ accentColor: "#B8936A" }}
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: "rgba(245,239,228,0.3)" }}>
                        <span>{fmt((progress[index] / 100) * durations[index])}</span>
                        <span>{fmt(durations[index])}</span>
                      </div>
                      <audio
                        ref={(el) => { audioRefs.current[index] = el; }}
                        src={demo.file}
                        onLoadedMetadata={() => {
                          const audio = audioRefs.current[index];
                          if (audio) setDurations(prev => prev.map((d, i) => i === index ? audio.duration : d));
                        }}
                        onTimeUpdate={() => handleTimeUpdate(index)}
                        onEnded={() => { setPlaying(null); setProgress(prev => prev.map((p, i) => i === index ? 0 : p)); }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation — 4 dots */}
        <div className="flex items-center justify-center gap-6 mt-8 px-8">
          <button
            onClick={() => setDemoPage(p => Math.max(0, p - 1))}
            disabled={demoPage === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
            style={{ border: "1px solid rgba(184,147,106,0.35)", color: "#B8936A" }}
          >‹</button>
          <div className="flex gap-2">
            {demos.map((_, p) => (
              <button key={p} onClick={() => setDemoPage(p)}
                className="rounded-full transition-all"
                style={{ width: demoPage === p ? 20 : 7, height: 7, backgroundColor: demoPage === p ? "#B8936A" : "rgba(184,147,106,0.25)" }}
              />
            ))}
          </div>
          <button
            onClick={() => setDemoPage(p => Math.min(demos.length - 1, p + 1))}
            disabled={demoPage === demos.length - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-20"
            style={{ border: "1px solid rgba(184,147,106,0.35)", color: "#B8936A" }}
          >›</button>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(184,147,106,0.15), transparent)" }} />

      {/* FAQ */}
      <section className="px-8 py-2">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full flex items-center justify-between py-6"
          >
            <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(245,239,228,0.4)", fontFamily: "var(--font-syne)" }}>Questions fréquemment posées</p>
            <span className={`transition-all duration-200 text-lg leading-none ${showFaq ? "rotate-45" : ""}`} style={{ color: "#B8936A" }}>+</span>
          </button>
          {showFaq && (
            <div className="flex flex-col pb-10" style={{ borderTop: "1px solid rgba(184,147,106,0.1)" }}>
              {[
                { q: "Comment se passe la livraison ?", a: "Vos fichiers seront livrés par mail dans les 10 jours suivant le démarrage du projet, en formats WAV (haute qualité) et MP3 (qualité standard). Vos fichiers restent disponibles 1 an — vous pouvez me les redemander à tout moment en cas de perte." },
                { q: "Est-ce que je peux fournir mes propres musiques ?", a: "Oui, la section « joindre un fichier » est prévue pour ça." },
                { q: "Combien de révisions sont incluses ?", a: "3 révisions sont incluses par commande." },
                { q: "Et si je ne suis pas satisfait ?", a: "Mon objectif est votre entière satisfaction. Si nous n'arrivons pas au résultat escompté après 3 révisions, on en discute — un arrangement sera toujours trouvé." },
                { q: "Tout est possible ?", a: "Envoyez votre demande, les possibilités sont nombreuses mais pas infinies. Si le projet est irréalisable, je vous le signale rapidement avant tout engagement." },
                { q: "Comment se passe le paiement ?", a: "Après confirmation de faisabilité, je vous envoie un devis et un lien de paiement sécurisé de 30€ pour valider le projet." },
                { q: "Appliquez-vous une réduction pour plusieurs commandes ?", a: "Oui bien sûr. Vous êtes Wedding Planner et souhaitez une collaboration long terme ? Un arrangement est possible, tout comme si vous êtes DJ et souhaitez différentes intros pour vos prestations." },
              ].map(({ q, a }, i) => (
                <div key={i} style={{ borderBottom: "1px solid rgba(184,147,106,0.08)" }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left gap-4"
                  >
                    <span className="text-sm font-medium transition-colors" style={{ color: openFaq === i ? "#F5EFE4" : "rgba(245,239,228,0.55)" }}>{q}</span>
                    <span className={`transition-transform duration-200 text-lg leading-none flex-shrink-0 ${openFaq === i ? "rotate-45" : ""}`} style={{ color: "#B8936A" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <p className="text-sm leading-relaxed pb-5" style={{ color: "rgba(245,239,228,0.45)" }}>{a}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "linear-gradient(to right, transparent, rgba(184,147,106,0.15), transparent)" }} />

      {/* Formulaire */}
      <section id="commander" className="px-8 py-24">
        <div className="max-w-xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4 text-center" style={{ color: "#B8936A", fontFamily: "var(--font-syne)" }}>Contact</p>
          <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: "#F5EFE4" }}>Un projet en tête ?</h2>
          <p className="text-center mb-2 text-sm" style={{ color: "rgba(245,239,228,0.5)" }}>Décrivez votre projet, je valide la faisabilité et vous envoie un lien pour un premier acompte de 30€ sous 48h.</p>
          <p className="text-center mb-12 text-xs" style={{ color: "rgba(245,239,228,0.35)" }}>Livraison sous 10 jours · 3 révisions incluses</p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const res = await fetch("/api/contact", { method: "POST", body: formData });
              const data = await res.json();
              if (data.success) {
                alert("Message envoyé ! Je vous réponds sous 48h.");
                (e.target as HTMLFormElement).reset();
                setNom(""); setEmail(""); setDescription(""); setFileName(null);
              } else {
                alert("Erreur lors de l'envoi. Réessayez ou contactez-moi directement.");
              }
            }}
            className="flex flex-col"
          >
            <input type="hidden" name="source" value="creation" />
            <input
              name="nom" type="text" placeholder="Votre nom" required
              value={nom} onChange={e => setNom(e.target.value)}
              className="px-5 py-4 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.2)", borderBottomWidth: 0, color: "#F5EFE4" }}
              onFocus={e => { e.target.style.borderColor = "rgba(184,147,106,0.6)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(184,147,106,0.2)"; }}
            />
            <input
              name="email" type="email" placeholder="Votre email" required
              value={email} onChange={e => setEmail(e.target.value)}
              className="px-5 py-4 text-sm focus:outline-none transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.2)", borderBottomWidth: 0, color: "#F5EFE4" }}
              onFocus={e => { e.target.style.borderColor = "rgba(184,147,106,0.6)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(184,147,106,0.2)"; }}
            />
            <textarea
              name="description"
              placeholder="Dites-moi ce que vous imaginez, je vous confirme la faisabilité sous 48h"
              rows={5} required
              value={description} onChange={e => setDescription(e.target.value)}
              className="px-5 py-4 text-sm focus:outline-none transition-colors resize-none"
              style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.2)", borderBottomWidth: 0, color: "#F5EFE4" }}
              onFocus={e => { e.target.style.borderColor = "rgba(184,147,106,0.6)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(184,147,106,0.2)"; }}
            />
            <div className="px-5 py-4" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,147,106,0.2)" }}>
              <input
                id="fichier-input" name="fichier" type="file" className="hidden"
                onChange={e => setFileName(e.target.files?.[0]?.name ?? null)}
              />
              <label
                htmlFor="fichier-input"
                className="inline-flex items-center gap-2 text-xs cursor-pointer transition-colors"
                style={{ color: "rgba(245,239,228,0.4)", border: "1px solid rgba(184,147,106,0.25)", padding: "6px 14px" }}
                onMouseEnter={e => { const l = e.currentTarget as HTMLLabelElement; l.style.color = "#B8936A"; l.style.borderColor = "#B8936A"; }}
                onMouseLeave={e => { const l = e.currentTarget as HTMLLabelElement; l.style.color = "rgba(245,239,228,0.4)"; l.style.borderColor = "rgba(184,147,106,0.25)"; }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {fileName ?? "Joindre un fichier (optionnel)"}
              </label>
            </div>

            <div className="flex flex-col items-start gap-3 mt-6">
              <button
                type="submit"
                className="px-7 py-3 text-xs font-semibold tracking-widest uppercase transition-all"
                style={{ border: "1px solid #B8936A", color: "#B8936A", fontFamily: "var(--font-syne)" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "#B8936A"; b.style.color = "#0D0B08"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.backgroundColor = "transparent"; b.style.color = "#B8936A"; }}
              >
                Envoyer
              </button>
              <p className="text-xs" style={{ color: "rgba(245,239,228,0.3)" }}>Je vous réponds sous 48h — confirmation de faisabilité et devis personnalisé.</p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function Creation() {
  return (
    <Suspense>
      <ServicesInner />
    </Suspense>
  );
}
