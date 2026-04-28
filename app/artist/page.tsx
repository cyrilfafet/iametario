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
  Depuis 2014, j'ai parcouru plus de 1500 scènes — des clubs aux festivals, d'Ibiza aux saisons en montagne, du Club Med aux mainstages français.
  <br /><br />
  Ce parcours, façonné par les clubs et nourri par la diversité des cultures rencontrées, m'a permis de forger une identité sonore ancrée dans la House, l'Electro et la French Touch. En chemin, l'affiche a été partagée avec INNA, Willy William, Djibril Cissé, Joachim Garraud et Sound Of Legend.
  <br /><br />
  Au-delà des platines, la production occupe une place centrale. Mon remix de "Nanana" de Peggy Gou cumule aujourd'hui +70k plays et a traversé les frontières — du Sunburn Festival en Inde aux ondes de ZuTv en Roumanie. J'ai également sorti deux titres sur les plateformes, le 3ème étant en préparation pour Juin 2026.
  <br /><br />
  Aujourd'hui résident au Baltazar à Dijon, je partage mon temps entre les sets, la création musicale, les services audio sur mesure que je développe pour DJs, mariages et événements, ainsi que la création d'une formation pour devenir Dj Résident. 
  <br /><br />
  Sur scène, chaque set devient un voyage : mashups personnalisés, drops inattendus, souvenirs musicaux oubliés. Le dynamisme guide tout — jouer sur les contrastes, alterner breaks émotifs et montées énergiques, lire la foule en temps réel et créer ces moments où tout explose.
</p>
</section>

    </main>
  );
}