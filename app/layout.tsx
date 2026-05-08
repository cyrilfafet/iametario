import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata = {
  title: "E-Tario — DJ House & Electro · Résident Baltazar Dijon",
  description: "DJ professionnel depuis 2014. 1500+ sets en clubs, festivals et événements. Résident au Baltazar Dijon. Disponible pour booking.",
  openGraph: {
    title: "E-Tario — DJ House & Electro · Résident Baltazar Dijon",
    description: "DJ professionnel depuis 2014. 1500+ sets en clubs, festivals et événements. Résident au Baltazar Dijon. Disponible pour booking.",
    url: "https://www.iametario.com",
    images: [
      {
        url: "/Logo _V1_black",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
