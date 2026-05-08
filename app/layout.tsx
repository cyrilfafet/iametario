import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Tario — DJ & Services Audio",
  description: "Résident Baltazar Dijon. Dj & Producer - Formations DJ - Edition Audio sur mesure.",
  openGraph: {
    title: "E-Tario",
    description: "Résident Baltazar Dijon. Dj & Producer - Formations DJ - Edition Audio sur mesure.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.22}}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="topo">
                <feTurbulence type="turbulence" baseFrequency="0.012" numOctaves="4" seed="5" result="turb"/>
                <feDisplacementMap in="SourceGraphic" in2="turb" scale="55" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
              <pattern id="hlines" x="0" y="0" width="100%" height="22" patternUnits="userSpaceOnUse">
                <line x1="0" y1="11" x2="10000" y2="11" stroke="#333" strokeWidth="0.65" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hlines)" filter="url(#topo)"/>
          </svg>
        </div>
      </body>
    </html>
  );
}
