import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formations - FL Studio - DJ Résident · E-Tario",
  description: "Coaching individuel FL Studio en live sur Zoom — crée ton premier remix en 3h. Formation DJ Résident disponible septembre 2026.",
  openGraph: {
    title: "Formations - FL Studio - DJ Résident · E-Tario",
    description: "Coaching individuel FL Studio en live sur Zoom — crée ton premier remix en 3h. Formation DJ Résident disponible septembre 2026.",
    url: "https://www.iametario.com/formations",
    type: "website",
    images: [{ url: "https://www.iametario.com/Logo%20_V1_black.png", width: 1200, height: 630 }],
  },
};

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
