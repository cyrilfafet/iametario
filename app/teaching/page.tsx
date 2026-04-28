export default function Teaching() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6">
  <a href="/"><img src="/Logo_2k26v2.png" alt="E-Tario" className="h-4 md:h-6" /></a>
        <div className="flex gap-8 text-sm text-zinc-400">
          <a href="/artist" className="hover:text-blue-400 transition-colors">PERFORM</a>
          <a href="/teaching" className="text-blue-400">TEACH</a>
          <a href="/creation" className="hover:text-blue-400 transition-colors">CREATE</a>
          <a href="/contact" className="hover:text-blue-400 transition-colors">CONTACT</a>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <p className="text-zinc-600 text-sm tracking-widest uppercase mb-4">Bientôt disponible</p>
        <h1 className="text-4xl font-bold mb-4">Teach</h1>
        <p className="text-zinc-500 max-w-sm">Page en cours de construction.</p>
        <a href="/" className="mt-10 text-sm text-zinc-500 hover:text-white transition-colors">← Retour à l'accueil</a>
      </div>
    </main>
  );
}