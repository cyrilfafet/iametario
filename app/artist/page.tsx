export default function Artist() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/artist" className="text-blue-400">PERFORM</a>
          <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
          <a href="/creation" className="hover:text-blue-400 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero */}
<section className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center">
  <img src="/mainphoto.png" alt="E-Tario" className="w-50 md:w-130 -mt-20" />
  <img src="/Logo_2k26v2.png" alt="E-Tario" className="w-85 md:w-95 -mt-30" />
  <p className="text-zinc-400 text-base leading-loose max-w-3xl mt-8 text-center">
  1500 scènes. Une décennie de vibrations.
  <br /><br />
    Depuis 2014, j’ai parcouru plus de 1500 scènes — des clubs français aux festivals, en passant par des hotels et privates en tous genres. Ce parcours, forgé sur le terrain, a défini mon ADN musical : un mix puissant entre House, Electro et French Touch.
    <br /><br />
    Partageant l’affiche avec des artistes comme Joachim Garraud ou Willy William, j'ai imposé ma signature jusque dans la production. Mon remix de Peggy Gou (+70k plays) a ainsi voyagé des ondes de ZuTv en Roumanie jusqu'en Inde, où il a résonné sur la scèhe du Sunburn Festival.
    <br /><br />
    L'art du set, l'expertise du son
    <br /><br />
    Aujourd'hui résident au Baltazar (Dijon), je mise sur l'instinct : mashups exclusifs, drops inattendus et lecture du public en temps réel. 
    <br /><br />
    Entre la préparation d'un 3ème single pour juin 2026 et mes services de création audio, mon prochain projet est de transmettre mon expérience via une formation dédiée aux futurs DJs résidents.
  <br /><br />
</p>
</section>

    </main>
  );
}