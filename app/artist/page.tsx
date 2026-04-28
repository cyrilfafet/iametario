export default function Artist() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6">
        <a href="/" className="text-xl font-bold tracking-widest uppercase">E-Tario</a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/ARTIST" className="text-blue-400">ARTIST</a>
          <a href="/teaching" className="hover:text-blue-400 transition-colors">TEACH</a>
          <a href="/creation" className="hover:text-blue-400 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <p className="text-zinc-600 text-sm tracking-widest uppercase mb-4">Bientôt disponible</p>
        <h1 className="text-4xl font-bold mb-4">Artist</h1>
        <p className="text-zinc-500 max-w-sm">Page en cours de construction.</p>
        <a href="/" className="mt-10 text-sm text-zinc-500 hover:text-white transition-colors">← Retour à l'accueil</a>
      </div>
    </main>
  );
}