export default function Artist() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/" className="text-blue-400">PERFORM</a>
          <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
          <a href="/creation" className="hover:text-blue-400 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero */}
<section className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
  
  {/* Images gauche */}
<div className="hidden md:flex absolute left-0 top-0 h-full items-center pointer-events-none">
  <img src="/clubmed.png" className="w-107 grayscale opacity-50 -mt-30 -ml-20" />
  <img src="/color_dole.png" className="w-80 grayscale opacity-50 -mt-10 -ml-74" />
  <img src="/baltazar.png" className="w-80 grayscale opacity-50 -mt-10 -ml-19" />
</div>

{/* Images droite */}
<div className="hidden md:flex absolute right-0 top-0 h-full items-center pointer-events-none">
  <img src="/montagne.png" className="w-88 grayscale opacity-50 -mt-25 -mr-18" />
  <img src="/soireeibiza1.png" className="w-80 grayscale opacity-50 -mt-30 -mr-0" />
</div>
  {/* Photo + Logo - centre */}
<div className="flex flex-col items-center">
  <img src="/mainphoto.png" alt="E-Tario" className="w-50 md:w-130 -mt-20" />
  <img src="/Logo_2k26v2.png" alt="E-Tario" className="w-85 md:w-95 -mt-30" />
</div>

{/* Réseaux + Booking */}
<div className="flex items-center justify-center gap-8 mt-8">
  <div className="flex gap-6 items-center">
    <a href="https://instagram.com/iametario" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a href="https://soundcloud.com/iametario" target="_blank" className="opacity-50 hover:opacity-100 transition-opacity">
  <img src="/soundcloudlogo.png" alt="Soundcloud" className="h-10" />
</a>
    <a href="https://open.spotify.com/intl-fr/artist/5PRHGYHjRAJsxSiHWuBUVp?si=QOFkWIr5Q12Fn2TDoBzlKg" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
    </a>
    <a href="https://youtube.com/@e-tario" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    </a>
  </div>
  <span className="text-zinc-700">|</span>
  <a href="mailto:contact@iametario.com" className="bg-blue-400 text-black px-5 py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-blue-300 transition-colors">
  Booking
</a>
</div>

  <p className="text-zinc-400 text-base leading-relaxed max-w-4xl mt-8 text-center">
    <span style={{color: 'white', fontSize: '1.25rem', fontWeight: 800}}>1500 scènes. Une décennie de vibrations.</span>
    <br /><br />
    Depuis <strong style={{color: 'white', fontWeight: 700}}>2014</strong>, j'ai parcouru plus de 1500 scènes — des clubs français aux festivals, d'Ibiza aux hôtels de renom, en passant par les saisons en montagne. Ce parcours, forgé sur le terrain, a défini mon ADN musical : un mix dynamique entre House, Electro et French Touch.
    <br /><br />
    Partageant l'affiche avec des artistes comme <strong className="text-white">Joachim Garraud</strong> ou <strong className="text-white">Willy William</strong>, j'ai imposé ma signature jusque dans la production. Mon remix de Peggy Gou (+70k plays) a ainsi voyagé des ondes de ZuTv en Roumanie jusqu'en Inde, où il a resonné lors du  <strong className="text-white">Sunburn Festival</strong>.
    <br /><br />
    <span className="text-white font-semibold">L'art du set, l'expertise du son</span>
    <br /><br />
    Aujourd'hui résident au <strong className="text-white">Bal'tazar</strong> (Dijon), je mise sur l'instinct : mashups exclusifs, drops inattendus et lecture du public en temps réel.
    <br /><br />
    Entre la préparation de mon <strong className="text-white">troisième single</strong> pour juin 2026 et mes services de création audio, je prépare également une formation dédiée aux futurs DJs résidents.
  </p>
  {/* Lecteur Soundcloud */}
<div className="w-full max-w-3xl mt-12">
  <iframe
    width="100%"
    height="300"
    scrolling="no"
    frameBorder="no"
    allow="autoplay"
    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2273673995&color=%232c2a32&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
  />
</div>
</section>

    </main>
  );
}