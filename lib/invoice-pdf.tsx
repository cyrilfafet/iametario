import path from "node:path";
import React from "react";
import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import { ISSUER } from "./issuer";
import { eur0, eur2, longDate } from "./format";
import type { InvoiceRecord } from "./types";

const fontDir = path.join(process.cwd(), "assets", "fonts");
Font.register({
  family: "Jost",
  fonts: [
    { src: path.join(fontDir, "jost-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(fontDir, "jost-latin-500-normal.woff"), fontWeight: 500 },
    { src: path.join(fontDir, "jost-latin-700-normal.woff"), fontWeight: 700 },
  ],
});
Font.register({
  family: "Bodoni",
  fonts: [
    { src: path.join(fontDir, "bodoni-moda-latin-400-normal.woff"), fontWeight: 400 },
    { src: path.join(fontDir, "bodoni-moda-latin-700-normal.woff"), fontWeight: 700 },
    { src: path.join(fontDir, "bodoni-moda-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

const INK = "#111111";
const HAIR = "#cfcfcf";

type Box = {
  top: number;
  left?: number;
  right?: number;
  width?: number;
  align?: "left" | "center" | "right";
};

/** Texte positionné en absolu (coordonnées en points, page A4 = 595 x 842). */
const T: React.FC<
  Box & {
    size?: number;
    font?: "Jost" | "Bodoni";
    weight?: 400 | 500 | 700;
    italic?: boolean;
    spacing?: number;
    lineHeight?: number;
    children: React.ReactNode;
  }
> = ({
  top, left, right, width, align = "left", size = 9, font = "Bodoni",
  weight = 400, italic, spacing, lineHeight, children,
}) => (
  <Text
    style={{
      position: "absolute", top, left, right, width, textAlign: align,
      fontFamily: font, fontSize: size, fontWeight: weight,
      fontStyle: italic ? "italic" : "normal", letterSpacing: spacing,
      lineHeight, color: INK,
    }}
  >
    {children}
  </Text>
);

const Rule: React.FC<{ top: number; left: number; width: number; weight?: number; color?: string }> = ({
  top, left, width, weight = 0.6, color = HAIR,
}) => (
  <View style={{ position: "absolute", top, left, width, height: weight, backgroundColor: color }} />
);

// Centres de colonnes du tableau
const COL = { qty: 298, unit: 410, total: 521 };

export function InvoicePdf({ inv }: { inv: InvoiceRecord }) {
  const issued = inv.issuedAt;
  const mainTotal = inv.quantity * inv.unitPrice;
  const rows: [string, number][] = [
    ["DEPLACEMENT", inv.travel],
    ["HEBERGEMENT", inv.lodging],
    ["RESTAURATION", inv.meals],
  ];
  const { bank } = ISSUER;

  return (
    <Document title={`Facture ${inv.number}`} author={ISSUER.name}>
      <Page size="A4" style={{ backgroundColor: "#ffffff" }}>
        {/* En-tête */}
        <Image
          src={path.join(process.cwd(), "assets", "logo.png")}
          style={{ position: "absolute", top: 63, left: 205, width: 185 }}
        />
        <T top={111} left={0} width={595} align="center" font="Jost" weight={400} size={8.5} spacing={7.3}>
          {ISSUER.website}
        </T>

        {/* Émetteur */}
        <T top={170} right={62} align="right" weight={700} size={9.5}>{ISSUER.name}</T>
        {ISSUER.addressLines.map((l, i) => (
          <T key={l} top={185.5 + i * 15.5} right={62} align="right" size={9.5}>{l}</T>
        ))}
        <T top={216.5} right={62} align="right" size={9.5}>{ISSUER.phone}</T>
        <T top={232} right={62} align="right" size={9.5}>{ISSUER.email}</T>

        {/* Client */}
        <T top={237} left={89} weight={700} size={9.5}>{inv.clientName}</T>
        <T top={256} left={89} size={9.5}>{inv.clientAddress}</T>
        {inv.clientPhone ? <T top={275} left={89} size={9.5}>{inv.clientPhone}</T> : null}

        {/* Numéro & date */}
        <T top={316} left={149} weight={700} size={9.5}>{`FACTURE N°${inv.number}`}</T>
        <T top={334} left={149} size={9.5}>{longDate(issued)}</T>

        {/* En-têtes du tableau */}
        <T top={417} left={82} font="Jost" weight={500} size={7.5} spacing={3.2}>DESIGNATION</T>
        <T top={417} left={COL.qty - 50} width={100} align="center" font="Jost" weight={500} size={7.5} spacing={3.2}>QUANTITE</T>
        <T top={417} left={COL.unit - 60} width={120} align="center" font="Jost" weight={500} size={7.5} spacing={3.2}>PRIX UNITAIRE</T>
        <T top={417} left={COL.total - 40} width={80} align="center" font="Jost" weight={500} size={7.5} spacing={3.2}>TOTAL</T>

        <Rule top={439.5} left={18} width={558} weight={1.6} color={INK} />

        {/* Ligne principale */}
        <T top={447} left={18} width={225} align="center" size={9}>{inv.label}</T>
        <T top={447} left={COL.qty - 30} width={60} align="center" size={9}>{String(inv.quantity)}</T>
        <T top={447} left={COL.unit - 40} width={80} align="center" size={9}>{eur0(inv.unitPrice)}</T>
        <T top={447} left={COL.total - 40} width={80} align="center" size={9}>{eur2(mainTotal)}</T>
        <Rule top={462} left={18} width={558} />

        {/* Bloc VHR */}
        <T top={493} left={18} width={67} align="center" weight={700} size={8.5}>VHR</T>
        <View style={{ position: "absolute", top: 462, left: 85, width: 0.6, height: 71, backgroundColor: HAIR }} />
        {rows.map(([label, amount], i) => {
          const y = 462 + i * 23.7;
          return (
            <React.Fragment key={label}>
              <T top={y + 7.5} left={90} size={9}>{label}</T>
              {label === "DEPLACEMENT" ? (
                <T top={y + 7.5} left={COL.qty - 30} width={60} align="center" size={9}>1</T>
              ) : null}
              <T top={y + 7.5} left={COL.unit - 40} width={80} align="center" size={9}>{eur0(amount)}</T>
              <T top={y + 7.5} left={COL.total - 40} width={80} align="center" size={9}>{eur2(amount)}</T>
              <Rule top={y + 23.7} left={i === 2 ? 18 : 85} width={i === 2 ? 558 : 491} />
            </React.Fragment>
          );
        })}
        <Rule top={557} left={18} width={558} />

        {/* Totaux */}
        <T top={562} left={COL.unit - 50} width={100} align="center" font="Jost" weight={500} size={8.5}>ACCOMPTE</T>
        <T top={562} left={COL.total - 40} width={80} align="center" size={9}>{eur2(inv.deposit)}</T>
        <T top={585} left={COL.unit - 60} width={120} align="center" font="Jost" weight={700} size={8.5}>A PAYER (TTC)</T>
        <T top={585} left={COL.total - 40} width={80} align="center" size={9}>{eur2(inv.total)}</T>
        <Rule top={601} left={353} width={223} />
        <T top={604} right={22} align="right" italic size={6.5}>TVA non applicable</T>

        {/* Pied de page gauche */}
        <T top={686} left={56} size={6.5} lineHeight={1}>Paiement par espèces, chèque ou virement</T>
        <T top={702} left={56} width={212} size={6.5} lineHeight={0.95}>
          {`Délai de paiement de ${ISSUER.paymentDelayDays} jours à compter de la date d'émission de la facture`}
        </T>
        <T top={722} left={56} size={6.5} lineHeight={0.95}>Pas d'escompte pour paiement anticipé</T>
        <T top={738} left={56} width={300} size={6.5} lineHeight={0.95}>
          {`En cas de retard de paiement :\nIndemnité forfaitaire de ${ISSUER.lateFee}€\nIntérêts de retard au taux annuel de ${ISSUER.lateInterestPct}% sur le montant impayé`}
        </T>
        <T top={769} left={56} width={300} size={6.5} lineHeight={0.95}>
          {`${ISSUER.legalLine}\n${ISSUER.vatLine}`}
        </T>

        {/* Pied de page droit : RIB */}
        <T top={693} right={47} align="right" weight={700} size={7.5}>RIB pour virement :</T>
        <T top={717} right={47} align="right" size={7.5} lineHeight={1.05}>
          {`${bank.holder}\nIBAN\n${bank.iban}\n\nBIC\n${bank.bic}`}
        </T>
      </Page>
    </Document>
  );
}
