export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <span className="text-xl font-bold tracking-widest uppercase">E-Tario</span>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/artist" className="hover:text-white transition-colors">Artist</a>
          <a href="/teaching" className="hover:text-white transition-colors">Teach</a>
          <a href="/creation" className="hover:text-white transition-colors">Create</a>
          <a href="/contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-40">
        <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Perform - Create - Teach</p>
        <img src="/Logo_2k26v2.png" alt="E-Tario" className="w-90 mb-10" />
        <p className="text-zinc-400 text-lg max-w-md mb-10">
          Résident Baltazar Dijon. House, Electro, French Touch. Since 2014, 1500+ performances.
        </p>
        <div className="flex gap-4">
          <a href="/formation" className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Formation DJ
          </a>
          <a href="/artiste" className="border border-zinc-700 px-6 py-3 rounded-full text-sm hover:border-zinc-400 transition-colors">
            Découvrir
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-zinc-900 px-8 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { number: "10+", label: "Ans d'expérience" },
            { number: "1500+", label: "Performances" },
            { number: "3", label: "Pays" },
            { number: "1", label: "Résidence active" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold mb-2">{stat.number}</p>
              <p className="text-zinc-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formation */}
      <section className="border-t border-zinc-900 px-8 py-24">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Formation DJ</p>
            <h2 className="text-4xl font-bold mb-6">Devenir DJ Résident</h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              La seule formation pensée pour décrocher et garder une résidence. Pas de théorie creuse — des méthodes issues de 10 ans de terrain et d'une résidence active.
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {[
                "Fondamentaux du mix et lecture de foule",
                "Mindset et réalités du DJ résident",
                "Décrocher et négocier une résidence",
                "Fidéliser sur le long terme",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex gap-4 items-center">
              <a href="/formation" className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
                Voir la formation
              </a>
              <span className="text-zinc-500 text-sm">À partir de 49€</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full">
            {[
              { tier: "Basic", price: "49€", desc: "Modules 1 & 2" },
              { tier: "Premium", price: "79€", desc: "Modules 1 à 4 + Bonus" },
            ].map((plan) => (
              <div key={plan.tier} className="border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{plan.tier}</span>
                  <span className="text-2xl font-bold">{plan.price}</span>
                </div>
                <p className="text-zinc-500 text-sm">{plan.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-zinc-900 px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-4">Bookings</p>
          <h2 className="text-4xl font-bold mb-6">Travaillons ensemble</h2>
          <p className="text-zinc-400 mb-10 max-w-md mx-auto">
            Clubs, festivals, événements privés. Disponible pour dates en France et international.
          </p>
          <a href="mailto:contact@iametario.com" className="bg-white text-black px-8 py-4 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors">
            Envoyer un message
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-8 text-center text-zinc-600 text-sm">
        © 2026 E-Tario. Tous droits réservés.
      </footer>

    </main>
  );
}