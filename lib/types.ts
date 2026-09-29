export type InvoiceInput = {
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  clientEmail?: string;
  /** Libellé de la prestation, ex. "DJ SET 11/09/26" */
  label: string;
  quantity: number;
  unitPrice: number;
  /** Frais VHR (Voyage, Hébergement, Restauration) */
  travel: number;
  lodging: number;
  meals: number;
  deposit: number;
  /** Date d'émission ISO (YYYY-MM-DD). Par défaut : aujourd'hui. */
  issuedAt?: string;
};

export type InvoiceRecord = InvoiceInput & {
  id: string;
  number: string;
  issuedAt: string;
  total: number;
};

export function computeTotal(i: InvoiceInput): number {
  const sum =
    i.quantity * i.unitPrice + i.travel + i.lodging + i.meals - i.deposit;
  return Math.round(sum * 100) / 100;
}
