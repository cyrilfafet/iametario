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
        <div aria-hidden="true" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,opacity:0.18}}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="waves" x="0" y="0" width="200" height="28" patternUnits="userSpaceOnUse">
                <path d="M 0,14 C 25,4 50,24 100,14 C 150,4 175,24 200,14" stroke="#444" strokeWidth="0.7" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)"/>
          </svg>
        </div>
      </body>
    </html>
  );
}
