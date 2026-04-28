"use client";
import { useState, useRef } from "react";

const services = [
  { title: "Intro DJ", desc: "Identité sonore personnalisée pour ton set ou ta marque. Voix, jingle, ambiance." },
  { title: "Intro club & événement", desc: "Annonce d'ouverture, ambiance pré-show, montage sur mesure pour soirées et venues." },
  { title: "Entrée des mariés", desc: "Montage audio unique pour marquer le moment. Accentué, dramatique, ou festif." },
  { title: "Bande son spectacle", desc: "Création musicale synchronisée pour danseurs, shows, feux d'artifice." },
  { title: "Publicité audio", desc: "Spots radio, podcasts, réseaux sociaux. Format court, impact maximal." },
  { title: "Montage sur mesure", desc: "Un projet particulier ? On en parle et on trouve la bonne formule." },
];

const demos = [
  { title: "Movin' On — Techno Edit", file: "/Movin_On_Techno_DEMO.mp3", tag: "Montage DJ" },
];

export default function Creation() {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

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

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/" className="text-xl font-bold tracking-widest uppercase">E-Tario</a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/artist" className="hover:text-blue-400 transition-colors">ARTIST</a>
          <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
          <a href="/creation" className="text-blue-400">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-8 py-28">
        <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Services Audio</p>
        <h1 className="text-5xl font-bold mb-6">Create</h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Du studio à la scène — montages audio sur mesure pour événements, artistes, et marques. Chaque projet mérite un son qui lui ressemble.
        </p>
      </section>

      {/* Services */}
      <section className="border-t border-zinc-900 px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-12 text-center">Ce que je propose</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.title} className="border border-zinc-800 rounded-2xl p-6 hover:border-blue-400 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Démos */}
      <section className="border-t border-zinc-900 px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-12 text-center">Écouter des démos</p>
          <div className="flex flex-col gap-4">
            {demos.map((demo, index) => (
              <div key={demo.title} className="border border-zinc-800 rounded-2xl px-6 py-5 flex items-center justify-between gap-4 hover:border-zinc-600 transition-colors">
                <div>
                  <p className="font-medium">{demo.title}</p>
                  <p className="text-blue-400 text-xs mt-1">{demo.tag}</p>
                </div>
                <button
                  onClick={() => togglePlay(index)}
                  className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center hover:border-blue-400 transition-colors flex-shrink-0"
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
                <audio
                  ref={(el) => { audioRefs.current[index] = el; }}
                  src={demo.file}
                  onEnded={() => setPlaying(null)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900 px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Un projet en tête ?</h2>
        <p className="text-zinc-400 mb-10 max-w-md mx-auto">Dis-moi ce que tu cherches, je te réponds sous 48h avec un devis.</p>
        <a href="mailto:contact@iametario.com" className="bg-blue-400 text-black px-8 py-4 rounded-full text-sm font-medium hover:bg-blue-300 transition-colors">
          Me contacter
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-zinc-600 text-sm">
        © 2026 E-Tario. Tous droits réservés.
      </footer>

    </main>
  );
}