"use client";

import {
  formatKhr,
  formatUsd,
  KHR_RATE,
  type InvoiceRecord,
  STORE_INFO,
} from "./invoices-data";

interface TaxInvoiceViewProps {
  invoice: InvoiceRecord;
  className?: string;
}

export function TaxInvoiceView({
  invoice,
  className = "",
}: TaxInvoiceViewProps) {
  return (
    <div
      id="printable-tax-invoice"
      className={`mx-auto w-full max-w-2xl rounded-xl border border-border bg-surface p-6 font-sans text-xs text-foreground shadow-xs sm:p-8 ${className}`}
    >
      {/* Official Tax Invoice Header */}
      <div className="border-b-2 border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              {STORE_INFO.nameKm}
            </h1>
            <h2 className="text-sm font-semibold text-foreground">
              {STORE_INFO.nameEn}
            </h2>
            <p className="mt-1 text-[11px] text-muted">
              {STORE_INFO.branchKm} ({STORE_INFO.branchEn})
            </p>
            <p className="text-[11px] text-muted">{STORE_INFO.addressKm}</p>
            <p className="text-[11px] text-muted">{STORE_INFO.addressEn}</p>
            <p className="mt-1 text-[11px] font-medium text-foreground">
              លេខអត្តសញ្ញាណកម្ម អតប (VATTIN):{" "}
              <span className="font-mono font-bold">{STORE_INFO.vatTin}</span>
            </p>
            <p className="text-[11px] text-muted">ទូរស័ព្ទ / Phone: {STORE_INFO.phone}</p>
          </div>

          <div className="flex flex-col sm:items-end">
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-center sm:text-end">
              <h3 className="font-bold text-accent text-sm">
                វិក្កយបត្រពន្ធ
              </h3>
              <p className="font-semibold text-accent text-[11px] tracking-wider uppercase">
                TAX INVOICE
              </p>
            </div>
            <div className="mt-3 space-y-0.5 text-end text-[11px]">
              <p>
                <span className="text-muted">លេខវិក្កយបត្រ / Inv No: </span>
                <span className="font-mono font-bold text-foreground">
                  {invoice.invoiceNumber}
                </span>
              </p>
              <p>
                <span className="text-muted">បង្កាន់ដៃ / Rec No: </span>
                <span className="font-mono text-foreground">
                  {invoice.receiptNumber}
                </span>
              </p>
              <p>
                <span className="text-muted">កាលបរិច្ឆេទ / Date: </span>
                <span className="font-medium text-foreground">
                  {invoice.date} {invoice.time}
                </span>
              </p>
              <p>
                <span className="text-muted">អត្រាប្តូរប្រាក់ / NBC Rate: </span>
                <span className="font-medium tabular-nums text-foreground">
                  1 USD = 4,100 KHR
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information Block */}
      <div className="my-4 rounded-lg bg-surface-secondary/70 p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div>
            <p className="text-muted">
              អតិថិជន / Customer Name:{" "}
              <span className="font-semibold text-foreground">
                {invoice.customer.name || "General Walk-in Customer"}
              </span>
            </p>
            <p className="mt-0.5 text-muted">
              ទូរស័ព្ទ / Phone:{" "}
              <span className="text-foreground">
                {invoice.customer.phone || "N/A"}
              </span>
            </p>
            <p className="mt-0.5 text-muted">
              អ៊ីមែល / Email:{" "}
              <span className="text-foreground">
                {invoice.customer.email || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-muted">
              ប្រភេទសេវា / Order Type:{" "}
              <span className="font-semibold text-foreground uppercase">
                {invoice.orderType} ({invoice.tableNumber})
              </span>
            </p>
            <p className="mt-0.5 text-muted">
              បេឡាករ / Cashier:{" "}
              <span className="text-foreground">
                {invoice.cashierName} ({invoice.registerId})
              </span>
            </p>
            <p className="mt-0.5 text-muted">
              វិធីទូទាត់ / Payment Method:{" "}
              <span className="font-medium text-foreground">
                {invoice.tenderLabel}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-start text-[11px]">
          <thead>
            <tr className="border-y border-border bg-surface-secondary/50 font-semibold text-muted">
              <th className="py-2 ps-2 text-start">ល.រ / No</th>
              <th className="py-2 text-start">បរិយាយមុខទំនិញ / Description</th>
              <th className="py-2 text-center">បរិមាណ / Qty</th>
              <th className="py-2 text-end">តម្លៃឯកតា / Unit Price</th>
              <th className="py-2 text-end">សរុប (USD)</th>
              <th className="py-2 pe-2 text-end">សរុប (KHR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {invoice.items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-surface-secondary/30">
                <td className="py-2.5 ps-2 tabular-nums text-muted">{idx + 1}</td>
                <td className="py-2.5">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  {item.nameKm && (
                    <p className="text-[10px] text-muted">{item.nameKm}</p>
                  )}
                  {item.modifiers && (
                    <p className="text-[10px] text-muted">
                      {item.modifiers}
                    </p>
                  )}
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-[10px] text-accent">
                      + {item.addOns.join(", ")}
                    </p>
                  )}
                </td>
                <td className="py-2.5 text-center tabular-nums text-foreground">
                  {item.quantity}
                </td>
                <td className="py-2.5 text-end tabular-nums text-foreground">
                  {formatUsd(item.unitPrice)}
                </td>
                <td className="py-2.5 text-end font-medium tabular-nums text-foreground">
                  {formatUsd(item.totalPrice)}
                </td>
                <td className="py-2.5 pe-2 text-end tabular-nums text-muted">
                  {formatKhr(item.totalPrice * KHR_RATE)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-t border-border pt-4">
        <div className="max-w-xs space-y-1 text-[11px] text-muted">
          <p className="font-medium text-foreground">សម្គាល់ / Notes:</p>
          <p>{invoice.notes || "ទំនិញទិញរួចមិនអាចប្តូរប្រាក់វិញបានទេ / Goods sold cannot be returned without receipt."}</p>
          <div className="mt-2 rounded border border-border/80 p-2 text-[10px]">
            <p>
              ស្ថានភាពទូទាត់:{" "}
              <span className="font-bold uppercase text-foreground">
                {invoice.status}
              </span>
            </p>
            {invoice.tenderDetails.khqrRef && (
              <p>Ref: {invoice.tenderDetails.khqrRef}</p>
            )}
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted">សរុបមិនរួមពន្ធ / Subtotal:</span>
            <span className="tabular-nums font-medium text-foreground">
              {formatUsd(invoice.subtotalUsd)}
            </span>
          </div>

          {invoice.discountUsd > 0 && (
            <div className="flex justify-between text-success">
              <span>បញ្ចុះតម្លៃ / Discount:</span>
              <span className="tabular-nums font-medium">
                -{formatUsd(invoice.discountUsd)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-muted">អាករលើតម្លៃបន្ថែម (10% VAT):</span>
            <span className="tabular-nums font-medium text-foreground">
              {formatUsd(invoice.vatUsd)}
            </span>
          </div>

          <div className="border-t border-border pt-1.5">
            <div className="flex items-baseline justify-between text-foreground">
              <span className="text-xs font-bold">សរុបរួម / Total USD:</span>
              <span className="text-sm font-bold tabular-nums text-accent">
                {formatUsd(invoice.totalUsd)}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-muted">
              <span className="text-[11px]">ជាប្រាក់រៀល / Total KHR:</span>
              <span className="text-xs font-semibold tabular-nums text-foreground">
                {formatKhr(invoice.totalKhr)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-8 grid grid-cols-2 gap-8 border-t border-dashed border-border pt-6 text-center text-[10px]">
        <div>
          <p className="font-semibold text-foreground">ហត្ថលេខា និងឈ្មោះអ្នកទិញ</p>
          <p className="text-muted">Buyer&apos;s Signature & Name</p>
          <div className="mt-12 border-b border-border/80" />
        </div>
        <div>
          <p className="font-semibold text-foreground">ហត្ថលេខា និងឈ្មោះអ្នកលក់</p>
          <p className="text-muted">Seller&apos;s Signature & Name</p>
          <div className="mt-12 border-b border-border/80" />
          <p className="mt-1 text-muted">{invoice.cashierName}</p>
        </div>
      </div>
    </div>
  );
}
