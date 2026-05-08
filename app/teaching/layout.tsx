import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formation DJ Résident — Technique, Mentalité & Réseau · E-Tario",
  description: "Apprends à mixer, créer des mashups et décrocher ta première résidence. Formation complète disponible septembre 2026.",
  openGraph: {
    title: "Formation DJ Résident — Technique, Mentalité & Réseau · E-Tario",
    description: "Apprends à mixer, créer des mashups et décrocher ta première résidence. Formation complète disponible septembre 2026.",
    url: "https://www.iametario.com/teaching",
  },
};

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
