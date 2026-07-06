export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 px-8 py-10 text-sm text-zinc-400">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Liens rapides */}
        <nav className="flex gap-6 text-xs uppercase tracking-widest">
          <a href="/perform" className="hover:text-blue-500 transition-colors">Perform</a>
          <a href="/creation" className="hover:text-blue-500 transition-colors">Create</a>
          <a href="/teaching" className="hover:text-blue-500 transition-colors">Teach</a>
          <a href="/contact" className="hover:text-blue-500 transition-colors">Contact</a>
        </nav>

        {/* Réseaux */}
        <div className="flex gap-5 text-xs">
          <a href="https://instagram.com/iametario" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Instagram</a>
          <a href="https://soundcloud.com/iametario" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">SoundCloud</a>
          <a href="https://open.spotify.com/intl-fr/artist/5PRHGYHjRAJsxSiHWuBUVp?si=QOFkWIr5Q12Fn2TDoBzlKg" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Spotify</a>
          <a href="https://youtube.com/@e-tario" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">YouTube</a>
        </div>

        {/* Légal */}
        <div className="text-center md:text-right text-xs leading-relaxed">
          <p>© 2026 E-Tario — <a href="mailto:contact@iametario.com" className="hover:text-blue-500 transition-colors">contact@iametario.com</a></p>
        </div>

      </div>
    </footer>
  );
}
