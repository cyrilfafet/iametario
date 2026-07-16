import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formations - FL Studio - DJ Résident · E-Tario",
  description: "Coaching individuel FL Studio en live sur Zoom — crée ton premier remix en 3h. Formation DJ Résident disponible septembre 2026.",
  openGraph: {
    title: "Formations - FL Studio - DJ Résident · E-Tario",
    description: "Coaching individuel FL Studio en live sur Zoom — crée ton premier remix en 3h. Formation DJ Résident disponible septembre 2026.",
    url: "https://www.iametario.com/formations",
  },
};

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
