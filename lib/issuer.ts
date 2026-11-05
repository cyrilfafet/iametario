// Coordonnées émetteur : affichées sur chaque facture.
// Modifie ici, pas dans le composant PDF.
export const ISSUER = {
  name: "FAFET Cyril",
  addressLines: ["36, Rue Bersot", "25000 Besançon"],
  phone: "+33 6 41 14 77 58",
  email: "djetario@gmail.com",
  website: "www.iametario.com",
  legalLine: "Dj E-Tario - Micro Entreprise - 801 015 116 00016",
  vatLine: "TVA non applicable - article 293 B du CGI",
  bank: {
    holder: "M. FAFET Cyril",
    iban: process.env.ISSUER_IBAN ?? "",
    bic: process.env.ISSUER_BIC ?? "",
  },
  paymentDelayDays: 15,
  lateFee: 40,
  lateInterestPct: 12,
};
