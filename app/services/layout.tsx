import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créations Audio Sur Mesure — Intros DJ, Mariages, Événements · E-Tario",
  description: "Montages audio professionnels : intros DJ, entrées mariés, feux d'artifice, playlists. Livraison 10 jours.",
  openGraph: {
    title: "Créations Audio Sur Mesure — Intros DJ, Mariages, Événements · E-Tario",
    description: "Montages audio professionnels : intros DJ, entrées mariés, feux d'artifice, playlists. Livraison 10 jours.",
    url: "https://www.iametario.com/creation",
  },
};

export default function CreationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
