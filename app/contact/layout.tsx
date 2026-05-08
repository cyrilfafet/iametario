import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · E-Tario DJ",
  description: "Une question, un projet ? Contactez E-Tario pour tout renseignement.",
  openGraph: {
    title: "Contact · E-Tario DJ",
    description: "Une question, un projet ? Contactez E-Tario pour tout renseignement.",
    url: "https://www.iametario.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
