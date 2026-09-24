"use client";

import { useMemo } from "react";
import {
  IconReceipt,
  IconUser,
  IconWifi,
} from "@tabler/icons-react";
import {
  formatKhr,
  formatUsd,
  type InvoiceRecord,
  STORE_INFO,
} from "./invoices-data";

interface ReceiptThermalViewProps {
  invoice: InvoiceRecord;
  className?: string;
}

export function ReceiptThermalView({
  invoice,
  className = "",
}: ReceiptThermalViewProps) {
  const isPaid = invoice.status === "paid";
  const isRefunded = invoice.status === "refunded";
  const isVoided = invoice.status === "voided";

  // Mock Barcode lines
  const barcodeBars = useMemo(() => {
    const bars = [];
    const seed = invoice.sequence * 37 + 101;
    for (let i = 0; i < 48; i++) {
      const isThick = ((seed * (i + 13)) % 5) === 0;
      const isMedium = ((seed * (i + 7)) % 3) === 0;
      bars.push(isThick ? "w-1.5" : isMedium ? "w-1" : "w-0.5");
    }
    return bars;
  }, [invoice.sequence]);

  return (
    <div
      id="printable-pos-receipt"
      className={`relative mx-auto w-full max-w-[340px] rounded-lg border border-border/80 bg-surface p-4 text-xs font-mono text-foreground shadow-sm sm:p-5 ${className}`}
    >
      {/* Status Watermark for Refunded / Voided */}
      {isRefunded && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rotate-[-25deg] rounded-lg border-2 border-purple-500/40 px-6 py-2 text-2xl font-black uppercase tracking-widest text-purple-600/60 dark:text-purple-400/60">
            REFUNDED
          </div>
        </div>
      )}
      {isVoided && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rotate-[-25deg] rounded-lg border-2 border-danger/40 px-6 py-2 text-2xl font-black uppercase tracking-widest text-danger/60">
            VOIDED
          </div>
        </div>
      )}

      {/* Store Header */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-1 flex size-9 items-center justify-center rounded-full bg-foreground text-background">
          <IconReceipt aria-hidden="true" size={20} />
        </div>
        <h1 className="text-sm font-bold tracking-tight text-foreground">
          {STORE_INFO.nameEn}
        </h1>
        <p className="font-sans text-[11px] text-muted">{STORE_INFO.nameKm}</p>
        <p className="mt-1 text-[10px] text-muted">{STORE_INFO.addressEn}</p>
        <p className="text-[10px] text-muted">Tel: {STORE_INFO.phone}</p>
        <p className="mt-0.5 text-[10px] font-medium text-foreground">
          VAT TIN: {STORE_INFO.vatTin}
        </p>
      </div>

      <div className="my-3 border-b border-dashed border-border" />

      {/* Ticket Details */}
      <div className="space-y-1 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-muted">Receipt No:</span>
          <span className="font-bold text-foreground">
            {invoice.receiptNumber}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Invoice No:</span>
          <span className="text-foreground">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Order / Seq:</span>
          <span className="font-semibold text-foreground">
            {invoice.orderCode} • #{invoice.sequence}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Date & Time:</span>
          <span className="text-foreground">
            {invoice.date} {invoice.time}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Station / Cashier:</span>
          <span className="text-foreground">
            {invoice.registerId} • {invoice.cashierName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Type / Table:</span>
          <span className="font-medium text-foreground">
            {invoice.orderType === "dineIn"
              ? invoice.tableNumber
              : invoice.orderType === "takeaway"
                ? "Takeaway"
                : `Delivery (${invoice.channel})`}
          </span>
        </div>
        {invoice.customer.name && (
          <div className="flex items-center justify-between">
            <span className="text-muted">Customer:</span>
            <span className="flex items-center gap-1 font-medium text-foreground">
              <IconUser aria-hidden="true" size={12} />
              {invoice.customer.name}
              {invoice.customer.loyaltyTier && (
                <span className="rounded bg-surface-secondary px-1 py-0.2 text-[9px] uppercase">
                  {invoice.customer.loyaltyTier}
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="my-3 border-b border-dashed border-border" />

      {/* Items Table */}
      <div>
        <div className="mb-2 grid grid-cols-[1fr_2.5rem_3.5rem] border-b border-border/50 pb-1 text-[10px] font-semibold text-muted uppercase">
          <span>Item</span>
          <span className="text-center">Qty</span>
          <span className="text-end">Total</span>
        </div>

        <div className="space-y-2">
          {invoice.items.map((item) => (
            <div key={item.id} className="text-[11px]">
              <div className="grid grid-cols-[1fr_2.5rem_3.5rem] items-start">
                <div className="min-w-0 pr-1">
                  <p className="font-semibold text-foreground leading-snug">
                    {item.name}
                  </p>
                  {item.nameKm && (
                    <p className="font-sans text-[10px] text-muted">
                      {item.nameKm}
                    </p>
                  )}
                  {item.modifiers && (
                    <p className="text-[10px] text-muted leading-tight">
                      • {item.modifiers}
                    </p>
                  )}
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-[10px] text-accent leading-tight">
                      + {item.addOns.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-center tabular-nums text-foreground">
                  x{item.quantity}
                </div>
                <div className="text-end font-semibold tabular-nums text-foreground">
                  {formatUsd(item.totalPrice)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-3 border-b border-dashed border-border" />

      {/* Financial Summary */}
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-muted">Subtotal:</span>
          <span className="tabular-nums font-medium text-foreground">
            {formatUsd(invoice.subtotalUsd)}
          </span>
        </div>

        {invoice.discountUsd > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount ({invoice.discountLabel ?? "Promo"}):</span>
            <span className="tabular-nums font-medium">
              -{formatUsd(invoice.discountUsd)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-muted">VAT (10%):</span>
          <span className="tabular-nums font-medium text-foreground">
            {formatUsd(invoice.vatUsd)}
          </span>
        </div>

        {invoice.serviceChargeUsd > 0 && (
          <div className="flex justify-between">
            <span className="text-muted">Service Charge:</span>
            <span className="tabular-nums font-medium text-foreground">
              {formatUsd(invoice.serviceChargeUsd)}
            </span>
          </div>
        )}

        <div className="my-1.5 border-t border-border pt-1.5" />

        {/* Dual Grand Total */}
        <div className="flex items-baseline justify-between font-bold text-foreground">
          <span className="text-sm">TOTAL USD:</span>
          <span className="text-base tabular-nums">
            {formatUsd(invoice.totalUsd)}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-muted">
          <span className="text-xs">TOTAL KHR (៛):</span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {formatKhr(invoice.totalKhr)}
          </span>
        </div>
      </div>

      <div className="my-3 border-b border-dashed border-border" />

      {/* Payment Details */}
      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-muted">Payment Tender:</span>
          <span className="font-semibold text-foreground">
            {invoice.tenderLabel}
          </span>
        </div>

        {invoice.tenderDetails.cashReceivedUsd !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted">Cash Tendered:</span>
            <span className="tabular-nums text-foreground">
              {formatUsd(invoice.tenderDetails.cashReceivedUsd)}
            </span>
          </div>
        )}

        {invoice.tenderDetails.cashReceivedKhr !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted">Cash (KHR):</span>
            <span className="tabular-nums text-foreground">
              {formatKhr(invoice.tenderDetails.cashReceivedKhr)}
            </span>
          </div>
        )}

        {invoice.tenderDetails.changeUsd !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted">Change USD:</span>
            <span className="tabular-nums font-semibold text-foreground">
              {formatUsd(invoice.tenderDetails.changeUsd)}
            </span>
          </div>
        )}

        {invoice.tenderDetails.changeKhr !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted">Change KHR:</span>
            <span className="tabular-nums text-foreground">
              {formatKhr(invoice.tenderDetails.changeKhr)}
            </span>
          </div>
        )}

        {invoice.tenderDetails.khqrRef && (
          <div className="flex justify-between text-[10px]">
            <span className="text-muted">KHQR Ref:</span>
            <span className="font-mono text-foreground">
              {invoice.tenderDetails.khqrRef}
            </span>
          </div>
        )}

        {invoice.tenderDetails.approvalCode && (
          <div className="flex justify-between text-[10px]">
            <span className="text-muted">Approval Code:</span>
            <span className="font-mono text-foreground">
              {invoice.tenderDetails.approvalCode}
            </span>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between rounded bg-surface-secondary/70 px-2 py-1">
          <span className="text-muted">Status:</span>
          <span
            className={`font-bold uppercase ${
              isPaid
                ? "text-success"
                : isRefunded
                  ? "text-purple-600 dark:text-purple-400"
                  : isVoided
                    ? "text-danger"
                    : "text-warning"
            }`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Refund Details Note if Refunded */}
      {invoice.refundDetails && (
        <div className="mt-2 rounded border border-purple-500/30 bg-purple-500/10 p-2 text-[10px] text-purple-900 dark:text-purple-200">
          <p className="font-bold">
            Refund: {formatUsd(invoice.refundDetails.amountUsd)} at{" "}
            {invoice.refundDetails.refundedAt}
          </p>
          <p className="text-muted">Reason: {invoice.refundDetails.reason}</p>
          <p className="text-muted">By: {invoice.refundDetails.refundedBy}</p>
        </div>
      )}

      {/* Void Details Note if Voided */}
      {invoice.voidDetails && (
        <div className="mt-2 rounded border border-danger/30 bg-danger/10 p-2 text-[10px] text-danger">
          <p className="font-bold">
            Voided at {invoice.voidDetails.voidedAt} by{" "}
            {invoice.voidDetails.voidedBy}
          </p>
          <p className="text-muted">Reason: {invoice.voidDetails.reason}</p>
        </div>
      )}

      <div className="my-3 border-b border-dashed border-border" />

      {/* Barcode Mockup */}
      <div className="flex flex-col items-center py-1">
        <div
          className="flex h-8 items-stretch justify-center gap-0.5"
          aria-hidden="true"
        >
          {barcodeBars.map((w, idx) => (
            <div key={idx} className={`h-full bg-foreground ${w}`} />
          ))}
        </div>
        <p className="mt-1 font-mono text-[9px] tracking-widest text-muted">
          *{invoice.receiptNumber}*
        </p>
      </div>

      <div className="my-2 border-b border-dashed border-border" />

      {/* Wi-Fi & Store Footer Greeting */}
      <div className="space-y-1 text-center text-[10px] text-muted">
        <div className="flex items-center justify-center gap-1 font-sans text-foreground">
          <IconWifi aria-hidden="true" size={12} />
          <span>Wi-Fi: {STORE_INFO.wifiSsid}</span>
          <span className="text-muted">|</span>
          <span>Pass: {STORE_INFO.wifiPass}</span>
        </div>
        <p className="font-sans font-medium text-foreground">
          Thank you for visiting RakPOS!
        </p>
        <p className="font-sans">សូមអរគុណ និងសូមអញ្ជើញមកម្តងទៀត!</p>
        <p className="text-[9px] text-muted/80">
          Goods sold are returnable within 2 hours with valid receipt.
        </p>
      </div>
    </div>
  );
}
