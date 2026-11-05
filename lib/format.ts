const nf = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 250 -> "250,00 €" */
export function eur2(n: number): string {
  return `${nf.format(n).replace(/ | /g, " ")} €`;
}

/** 250 -> "250 €" (prix unitaires du design) */
export function eur0(n: number): string {
  const s = Number.isInteger(n) ? String(n) : nf.format(n);
  return `${s} €`;
}

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
];

/** "2026-09-14" -> "Lundi 14 Septembre 2026" */
export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return `${DAYS[dt.getUTCDay()]} ${d} ${MONTHS[m - 1]} ${y}`;
}
