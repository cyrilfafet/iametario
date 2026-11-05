import { z } from "zod";
import { supabase } from "./clients";
import { renderInvoice } from "./render";
import { computeTotal, type InvoiceRecord } from "./types";

export const InvoiceSchema = z.object({
  clientName: z.string().min(1),
  clientStreet: z.string().min(1),
  clientPostalCode: z.string().min(1),
  clientCity: z.string().min(1),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  label: z.string().min(1),
  quantity: z.coerce.number().positive().default(1),
  unitPrice: z.coerce.number().nonnegative(),
  travel: z.coerce.number().nonnegative().default(0),
  lodging: z.coerce.number().nonnegative().default(0),
  meals: z.coerce.number().nonnegative().default(0),
  deposit: z.coerce.number().nonnegative().default(0),
  issuedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function createInvoice(raw: unknown): Promise<InvoiceRecord> {
  const parsed = InvoiceSchema.parse(raw);
  const { clientStreet, clientPostalCode, clientCity, ...rest } = parsed;
  // Même format que sur tes factures : "9, Place St-Jean de Maizel - 71100 Chalon Sur Saône"
  const input = {
    ...rest,
    clientAddress: `${clientStreet} - ${clientPostalCode} ${clientCity}`,
  };
  const db = supabase();
  const issuedAt = input.issuedAt ?? new Date().toISOString().slice(0, 10);
  const total = computeTotal(input);
  if (total < 0) throw new Error("Le total ne peut pas être négatif.");

  const { data: number, error: numErr } = await db.rpc("next_invoice_number", {
    p_year: Number(issuedAt.slice(0, 4)),
  });
  if (numErr || !number) throw new Error(`Numérotation : ${numErr?.message}`);

  const { data: row, error } = await db
    .from("invoices")
    .insert({
      number,
      issued_at: issuedAt,
      client_name: input.clientName,
      client_address: input.clientAddress,
      client_phone: input.clientPhone || null,
      client_email: input.clientEmail || null,
      label: input.label,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      travel: input.travel,
      lodging: input.lodging,
      meals: input.meals,
      deposit: input.deposit,
      total,
    })
    .select("id")
    .single();
  if (error || !row) throw new Error(`Enregistrement : ${error?.message}`);

  // Le client rejoint (ou met à jour) la liste déroulante.
  await db.from("clients").upsert(
    {
      name: input.clientName,
      address: clientStreet,
      postal_code: clientPostalCode,
      city: clientCity,
      phone: input.clientPhone || null,
      email: input.clientEmail || null,
    },
    { onConflict: "name" },
  );

  const inv: InvoiceRecord = { ...input, id: row.id, number, issuedAt, total };
  const pdf = await renderInvoice(inv);

  const pdfPath = `${issuedAt.slice(0, 4)}/Facture_${number}.pdf`;
  const up = await db.storage
    .from("invoices")
    .upload(pdfPath, pdf, { contentType: "application/pdf", upsert: true });
  if (up.error) throw new Error(`Stockage PDF : ${up.error.message}`);
  await db.from("invoices").update({ pdf_path: pdfPath }).eq("id", row.id);

  return inv;
}
