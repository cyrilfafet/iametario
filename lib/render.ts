import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import { InvoicePdf } from "./invoice-pdf";
import type { InvoiceRecord } from "./types";

export function renderInvoice(inv: InvoiceRecord): Promise<Buffer> {
  // InvoicePdf retourne directement un <Document>, react-pdf attend cet élément racine.
  return renderToBuffer(InvoicePdf({ inv }) as ReactElement<DocumentProps>);
}
