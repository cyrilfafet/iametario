"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const demos = [
  {
    client: "Thomas R.",
    brief: "Salut, j'aurais besoin d'une version intro de la musique Movin' On de Starting Rock pour mes sets, quelque chose de techno, avec du suspense, assez sombre tout en étant orchestral et épique, style festival.",
    title: "Movin' On — Orchestral Edit",
    file: "/Movin_On_Techno_DEMO.mp3",
    tag: "Intro Festival DJ",
    price: "120€",
  },
  {
    client: "Karim B.",
    brief: "Salut E-Tario, j'aurais besoin d'un edit de 'Alors la Zone' de Jul pour mon intro de festival. Quelque chose d'épique qui monte, avec le vocal 'indépendance' qu'il dit dans un live Skyrock en boucle si possible. Merci !",
    title: "Alors la Zone — Festival intro",
    file: "/Alors_La_Zone_DEMO.mp3",
    tag: "Intro Festival",
    price: "75€",
  },
  {
    client: "Discothèque la D****",
    brief: "Bonjour, pouvez vous intégrer des voix dans vos intros ? Nous faisons une soirée 60-2010 en aferwork pour Halloween, et aimerions une voix qui introduit la soirée, dans le style Halloween, sur un fond musical adapté à l'ambiance. Merci.",
    title: "Soirée 60-2010 — Halloween Intro",
    file: "/Halloween_Soiree_60_2010_DEMO.mp3",
    tag: "Intro Soirée",
    price: "130€",
  },
  {
    client: "Camille D.",
    brief: "Bonjour ! Je suis témoin de mariage, on prépare une chorée surprise pour la mariée avec les autres témoins. Il nous faudrait un montage 3 titres : Women de Doja Cat depuis le début, ensuite Jatti De Nain de Millind Gaba à partir de 0:38 avec une transition fluide, et quand la musique finit, je voudrais le show Shakira & JLo Super Bowl 2020 entre 4:34 et 5:52. Pour la fin, carte blanche si vous arrivez à faire quelque chose de naturel !",
    title: "Women × Jatti × Shakira — Wedding Mix",
    file: "/Women_Jatti_Shakira_Wedding_Mix.mp3",
    tag: "Chorée Mariage",
    price: "90€",
  },
];

function CreationInner() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>(demos.map(() => 0));
  const [durations, setDurations] = useState<number[]>(demos.map(() => 0));
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preset, setPreset] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showFaq, setShowFaq] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [voix, setVoix] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get("payment") === "success";

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    if (playing === index) {
      audio.pause();
      setPlaying(null);
    } else {
      audioRefs.current.forEach((a, i) => { if (i !== index && a) a.pause(); });
      audio.play();
      setPlaying(index);
    }
  };

  const handleTimeUpdate = (index: number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    setProgress(prev => prev.map((p, i) => i === index ? pct : p));
  };

  const handleSeek = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRefs.current[index];
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(prev => prev.map((p, i) => i === index ? value : p));
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">

    <nav className="flex items-center justify-between px-8 py-6">
  <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
  <div className="hidden md:flex gap-8 text-sm text-zinc-500">
    <a href="/" className="hover:text-blue-500 transition-colors">PERFORM</a>
    <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
    <a href="/creation" className="text-blue-500">CREATE</a>
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
    <a href="/artist" className="hover:text-blue-500 transition-colors">ARTIST</a>
    <a href="/teaching" className="hover:text-blue-500 transition-colors">TEACH</a>
    <a href="/creation" className="text-blue-500">CREATE</a>
    <a href="/contact" className="hover:text-blue-500 transition-colors">CONTACT</a>
  </div>
)}

      {/* Hero */}
<section className="relative text-center px-8 py-16 overflow-hidden min-h-[420px] flex flex-col items-center justify-center">

  {/* Images gauche */}
<div className="hidden md:flex absolute left-0 top-0 h-full items-center pointer-events-none">
  <img src="/radio.png" className="w-70 grayscale opacity-50 mt-0 ml-0" />
  <img src="/Mariage.png" className="w-80 grayscale opacity-50 mt-6 -ml-55" />
  <img src="/club.png" className="w-80 grayscale opacity-50 -mt-0 -ml-23" />
</div>

{/* Images droite */}
<div className="hidden md:flex absolute right-0 top-0 h-full items-center pointer-events-none">
  <img src="/danse.png" className="w-80 grayscale opacity-50 mt-25 -mr-20" />
  <img src="/feu_artifice.png" className="w-80 grayscale opacity-50 -mt-4 mr-15" />
</div>

  {/* Contenu centré */}
  <div className="relative z-10">
    <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Services Audio</p>
    <h1 className="text-5xl font-bold mb-6">Create</h1>
    <p className="text-zinc-500 text-lg max-w-xl mx-auto">
      Le bon son au bon moment. Sur mesure, toujours.<br />
      <span className="text-zinc-500 text-base">Intro DJ & Club, bandes son spectacle, feux d'artifice, entrée des mariés, publicité audio...</span>
    </p>
    <a href="#commander" className="inline-block mt-6 bg-blue-500 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors">
      Commander un montage audio
    </a>
  </div>

</section>

      {/* Démos */}
      <section className="border-t border-zinc-100 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-12 text-center">Ils m'ont demandé, j'ai livré</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {demos.map((demo, index) => (
              <div key={demo.title} className="flex flex-col gap-3">
                {/* Bulle client */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs text-zinc-500 flex-shrink-0">
                    {demo.client[0]}
                  </div>
                  <div className="bg-zinc-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-xs text-zinc-500 mb-1">{demo.client}</p>
                    <p className="text-sm text-zinc-700 leading-relaxed">{demo.brief}</p>
                  </div>
                </div>
                {/* Lecteur audio */}
                <div className="ml-11 flex items-center gap-4">
                  <div className={`flex-1 border rounded-2xl px-5 py-4 transition-colors ${demo.file ? "border-zinc-200 hover:border-blue-500" : "border-zinc-100 opacity-60"}`}>
                    <div className="flex items-center gap-4 mb-3">
                      <button
                        onClick={() => demo.file && togglePlay(index)}
                        disabled={!demo.file}
                        className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center hover:border-blue-500 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {playing === index ? (
                          <span className="w-3 h-3 flex gap-0.5">
                            <span className="w-1 h-full bg-zinc-900 rounded-sm" />
                            <span className="w-1 h-full bg-zinc-900 rounded-sm" />
                          </span>
                        ) : (
                          <span className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-zinc-900 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{demo.title}</p>
                        <span className="text-xs text-blue-500 border border-blue-500 rounded-full px-2.5 py-0.5">{demo.tag}</span>
                      </div>
                    </div>
                    {/* Barre de progression */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progress[index]}
                      onChange={(e) => handleSeek(index, e)}
                      className="w-full h-1 accent-blue-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400 mt-1">
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
                  <span className="text-base font-semibold text-zinc-500 border border-zinc-300 rounded-full px-3 py-1 flex-shrink-0">{demo.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-100 px-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="w-full flex items-center justify-between py-6 group"
          >
            <p className="text-zinc-500 text-sm tracking-widest uppercase">Questions fréquemment posées</p>
            <span className={`text-zinc-500 group-hover:text-zinc-900 transition-all duration-200 text-lg leading-none ${showFaq ? "rotate-45" : ""}`}>+</span>
          </button>
          {showFaq && <div className="flex flex-col divide-y divide-zinc-100 pb-10">
            {[
              {
                q: "Comment se passe la livraison ?",
                a: "Vos fichiers seront livrés par mail 10 jours maximum après validation de l'acompte, dans deux formats WAV (haute qualité) et MP3 (qualité standard plus légère). Vos fichiers resteront disponibles à vie et vous pourrez me les demander à tout moment en cas de perte.",
              },
              {
                q: "Est-ce que je peux fournir mes propres musiques ?",
                a: "Oui, la section « joindre un fichier » est prévue pour ça.",
              },
              {
                q: "Combien de révisions sont incluses ?",
                a: "3 révisions sont incluses par commande.",
              },
              {
                q: "Et si je ne suis pas satisfait ?",
                a: "Mon objectif est votre entière satisfaction. Si toutefois nous n'arrivons pas au résultat escompté après 3 révisions, la commande est close. L'acompte permet de couvrir l'expertise et le temps studio déjà engagés.",
              },
              {
                q: "Tout est possible ?",
                a: "Envoyez votre demande, les possibilités sont nombreuses mais pas infinies. Si la commande reçue est irréalisable pour diverses raisons, l'acompte sera immédiatement remboursé.",
              },
              {
                q: "Quel forfait choisir ?",
                a: "Un Edit Simple concerne le mélange de deux titres. Choisissez Création Avancée dès que votre projet nécessite une structure personnalisée ou plus de 3 titres.",
              },
              {
                q: "Comment se passe le paiement ?",
                a: "L'acompte de 30€ valide le lancement du projet. Le solde restant est réglé par lien sécurisé une fois que vous avez validé la commande.",
              },
              {
                q: "Appliquez-vous une réduction pour plusieurs commandes ?",
                a: "Oui bien sûr. Vous êtes Wedding Planner et souhaitez une collaboration long terme ? Un arrangement est possible, tout comme si vous êtes DJ et souhaitez différentes intros pour vos prestations.",
              },
            ].map(({ q, a }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                >
                  <span className={`text-sm font-medium transition-colors ${openFaq === i ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-900"}`}>{q}</span>
                  <span className={`text-zinc-500 transition-transform duration-200 text-lg leading-none ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <p className="text-sm text-zinc-500 leading-relaxed pb-5">{a}</p>
                )}
              </div>
            ))}
          </div>}
        </div>
      </section>

      {/* Formulaire */}
<section id="commander" className="border-t border-zinc-100 px-8 py-24">
  <div className="max-w-xl mx-auto">
    <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4 text-center">Contact</p>
    <h2 className="text-3xl font-bold mb-2 text-center">Un projet en tête ?</h2>
    <p className="text-zinc-500 text-center mb-2">Décrivez votre projet, je valide la faisabilité sous 48h après réception de votre acompte.</p>
    <p className="text-zinc-500 text-sm text-center mb-12">Livraison sous 10 jours · 3 révisions incluses</p>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await fetch("/api/contact", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          alert("Message envoyé ! Je vous réponds sous 48h.");
          (e.target as HTMLFormElement).reset();
        } else {
          alert("Erreur lors de l'envoi. Réessayez ou contactez-moi directement.");
        }
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="source" value="creation" />
      <input
        name="nom"
        type="text"
        placeholder="Votre nom"
        required
        value={nom}
        onChange={e => setNom(e.target.value)}
        className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <input
        name="email"
        type="email"
        placeholder="Votre email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
      />
      <div className="flex flex-col gap-2 border border-zinc-200 rounded-xl px-5 py-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest text-center mb-1">Grille tarifaire</p>
        {[
          { id: "simple", label: "Edit Simple", desc: "Mashup, transition propre, montage court", prix: "50€" },
          { id: "avance", label: "Création Avancée", desc: "Intro personnalisée, medley 3–5 titres", prix: "80€" },
          { id: "performance", label: "Pack Performance", desc: "Intro épique, montage complexe + Sound Design", prix: "Sur mesure" },
        ].map(({ id, label, desc, prix }) => (
          <label
            key={id}
            className={`flex items-center justify-between gap-4 rounded-lg px-4 py-3 cursor-pointer transition-colors border ${preset === id ? "border-blue-500 bg-blue-500/5" : "border-transparent hover:bg-zinc-50"}`}
          >
            <div className="flex items-center gap-3">
              <input type="radio" name="preset" value={id} checked={preset === id} onChange={() => setPreset(id)} className="accent-blue-500 w-4 h-4 cursor-pointer" />
              <div>
                <p className="text-sm font-medium text-zinc-700">{label}</p>
                <p className="text-xs text-zinc-500">{desc}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-zinc-500 shrink-0">{prix}</span>
          </label>
        ))}
        <div className="flex gap-8 justify-center border-t border-zinc-200 pt-3 mt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="urgent" checked={urgent} onChange={e => setUrgent(e.target.checked)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
            <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors">Délai urgent <span className="text-zinc-400">(−4 jours, +30€)</span></span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name="voix" checked={voix} onChange={e => setVoix(e.target.checked)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
            <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors">Intégration de voix <span className="text-zinc-400">(+40€)</span></span>
          </label>
        </div>
        <p className="text-zinc-400 text-xs text-center pt-1">Un devis personnalisé vous sera envoyé si votre projet nécessite un ajustement tarifaire.</p>
      </div>
      <textarea
        name="description"
        placeholder="Décrivez votre projet en détail — plus vous êtes précis, mieux je pourrai vous aider"
        rows={5}
        required
        className="bg-white border border-zinc-200 rounded-xl px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
      />
      <div className="border border-zinc-200 rounded-xl px-5 py-4 hover:border-zinc-400 transition-colors">
        <label className="text-sm text-zinc-500 block mb-2">Joindre un fichier (optionnel)</label>
        <input
          name="fichier"
          type="file"
          className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-900 hover:file:bg-zinc-300"
        />
      </div>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={loadingCheckout}
          onClick={async () => {
            setLoadingCheckout(true);
            const res = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nom, email, preset, urgent, voix }),
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
            else setLoadingCheckout(false);
          }}
          className="bg-blue-500 text-white px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingCheckout ? "Redirection…" : "Réserver avec un acompte de 30€"}
        </button>
        <p className="text-zinc-500 text-sm text-center">
          Acompte déduit du montant final à régler à la livraison
        </p>
      </div>

    </form>

    {paymentSuccess && (
      <div className="mt-8 bg-zinc-50 border border-blue-500 rounded-2xl px-6 py-5 text-center">
        <p className="text-blue-500 font-semibold mb-1">Acompte reçu ✓</p>
        <p className="text-zinc-500 text-sm">Merci ! Je vous contacte sous 48h pour lancer votre projet.</p>
      </div>
    )}

  </div>
</section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-8 py-8 text-center text-zinc-400 text-sm">
        © 2026 E-Tario. Tous droits réservés.
      </footer>

    </main>
  );
}

export default function Creation() {
  return (
    <Suspense>
      <CreationInner />
    </Suspense>
  );
}
