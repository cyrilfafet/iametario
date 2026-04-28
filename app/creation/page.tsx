"use client";
import { useState, useRef, useEffect } from "react";

const demos = [
  {
    client: "Thomas R.",
    brief: "Salut, j'aurais besoin d'une intro pour mes sets, quelque chose de techno, assez sombre, avec mon nom dedans. Style festival.",
    title: "Movin' On — Techno Edit",
    file: "/Movin_On_Techno_DEMO.mp3",
    tag: "Intro DJ",
    price: "49€",
  },
  {
    client: "Karim B.",
    brief: "Salut E-Tario, j'aurais besoin d'un edit de 'Alors la Zone' de Jul pour mon intro de festival. Quelque chose d'épique qui monte, avec le vocal 'indépendance' qu'il dit dans un live Skyrock en boucle si possible. Merci !",
    title: "Alors la Zone — Festival Edit",
    file: "/Alors_La_Zone_DEMO.mp3",
    tag: "Intro Festival",
    price: "69€",
  },
];

export default function Creation() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [progress, setProgress] = useState<number[]>(demos.map(() => 0));
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <main className="min-h-screen bg-black text-white">

    <nav className="flex items-center justify-between px-8 py-6">
  <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
  <div className="hidden md:flex gap-8 text-sm text-zinc-400">
    <a href="/artist" className="hover:text-blue-400 transition-colors">PERFORM</a>
    <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
    <a href="/creation" className="text-blue-400">CREATE</a>
    <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
  </div>
  <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
    <span className={`w-6 h-px bg-white transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
    <span className={`w-6 h-px bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
    <span className={`w-6 h-px bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
  </button>
</nav>

{menuOpen && (
  <div className="md:hidden flex flex-col items-center gap-6 py-8 border-b border-zinc-900 text-sm text-zinc-400">
    <a href="/artist" className="hover:text-blue-400 transition-colors">ARTIST</a>
    <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
    <a href="/creation" className="text-blue-400">CREATE</a>
    <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
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
    <p className="text-zinc-400 text-lg max-w-xl mx-auto">
      Du studio à la scène — montages audio sur mesure.<br />
      <span className="text-zinc-500 text-base">Intro DJ & Club, bandes son spectacle, feux d'artifice, entrée des mariés, publicité audio...</span>
    </p>
    <a href="#commander" className="inline-block mt-6 bg-blue-400 text-black px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors">
      Commander une création audio
    </a>
  </div>

</section>

      {/* Démos */}
      <section className="border-t border-zinc-900 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-12 text-center">Ils m'ont demandé, j'ai livré</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {demos.map((demo, index) => (
              <div key={demo.title} className="flex flex-col gap-3">
                {/* Bulle client */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
                    {demo.client[0]}
                  </div>
                  <div className="bg-zinc-900 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-xs text-zinc-500 mb-1">{demo.client}</p>
                    <p className="text-sm text-zinc-200 leading-relaxed">{demo.brief}</p>
                  </div>
                </div>
                {/* Lecteur audio */}
                <div className="ml-11 flex items-center gap-4">
                  <div className="flex-1 border border-zinc-800 rounded-2xl px-5 py-4 hover:border-blue-400 transition-colors">
                    <div className="flex items-center gap-4 mb-3">
                      <button
                        onClick={() => togglePlay(index)}
                        className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:border-blue-400 transition-colors flex-shrink-0"
                      >
                        {playing === index ? (
                          <span className="w-3 h-3 flex gap-0.5">
                            <span className="w-1 h-full bg-white rounded-sm" />
                            <span className="w-1 h-full bg-white rounded-sm" />
                          </span>
                        ) : (
                          <span className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-white ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{demo.title}</p>
                        <span className="text-xs text-blue-400 border border-blue-400 rounded-full px-2.5 py-0.5">{demo.tag}</span>
                      </div>
                    </div>
                    {/* Barre de progression */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progress[index]}
                      onChange={(e) => handleSeek(index, e)}
                      className="w-full h-1 accent-blue-400 cursor-pointer"
                    />
                    <audio
                      ref={(el) => { audioRefs.current[index] = el; }}
                      src={demo.file}
                      onTimeUpdate={() => handleTimeUpdate(index)}
                      onEnded={() => { setPlaying(null); setProgress(prev => prev.map((p, i) => i === index ? 0 : p)); }}
                    />
                  </div>
                  <span className="text-base font-semibold text-zinc-300 border border-zinc-700 rounded-full px-3 py-1 flex-shrink-0">{demo.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire */}
<section id="commander" className="border-t border-zinc-900 px-8 py-24">
  <div className="max-w-xl mx-auto">
    <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4 text-center">Contact</p>
    <h2 className="text-3xl font-bold mb-2 text-center">Un projet en tête ?</h2>
    <p className="text-zinc-400 text-center mb-12">Dis-moi ce que tu cherches, je te réponds sous 48h avec un devis.</p>

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
          alert("Message envoyé ! Je te réponds sous 48h.");
          (e.target as HTMLFormElement).reset();
        } else {
          alert("Erreur lors de l'envoi. Réessaie ou contacte-moi directement.");
        }
      }}
      className="flex flex-col gap-4"
    >
      <input
        name="nom"
        type="text"
        placeholder="Ton nom"
        required
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors"
      />
      <input
        name="email"
        type="email"
        placeholder="Ton email"
        required
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors"
      />
      <input
        name="prestation"
        type="text"
        placeholder="Type de prestation (intro DJ, mariage, spectacle...)"
        required
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors"
      />
      <textarea
        name="description"
        placeholder="Décris ton projet en détail — plus tu es précis, mieux je peux t'aider"
        rows={5}
        required
        className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-400 transition-colors resize-none"
      />
      <div className="border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-600 transition-colors">
        <label className="text-sm text-zinc-500 block mb-2">Joindre un fichier (optionnel)</label>
        <input
          name="fichier"
          type="file"
          className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-400 text-black px-6 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors mt-2"
      >
        Envoyer ma demande
      </button>
    </form>
  </div>
</section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-zinc-600 text-sm">
        © 2026 E-Tario. Tous droits réservés.
      </footer>

    </main>
  );
}