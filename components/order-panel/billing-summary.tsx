"use client";

import { Separator } from "@heroui/react";
import type { BillingSummaryProps } from "./types";

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export function BillingSummary({
  appliedPromotion,
  changeAmount,
  changeLabel = "Change",
  changeSecondaryAmount,
  className = "",
  customRows,
  discount = 0,
  discountLabel = "Discount",
  discountRate,
  formatCurrency = defaultFormatCurrency,
  itemCount,
  itemsLabel = "Items",
  onOpenPromotionModal,
  onRemovePromotion,
  paymentLabel = "Payment",
  paymentMethod,
  receivedAmount,
  receivedLabel = "Received",
  serviceCharge,
  serviceChargeLabel = "Service Charge",
  subtotal,
  subtotalLabel = "Subtotal",
  tax,
  taxLabel = "Tax",
  taxRate,
  total,
  totalDiscountLabel = "Total Discount",
  totalLabel = "Total",
}: BillingSummaryProps) {
  const displayItemsLabel =
    itemCount !== undefined && itemCount !== null ? `${itemsLabel} (${itemCount})` : itemsLabel;
  const displayDiscountLabel = discountRate
    ? `${totalDiscountLabel || discountLabel} (${typeof discountRate === "number" ? `${discountRate * 100}%` : discountRate})`
    : totalDiscountLabel || discountLabel;
  const hasPaymentDetails =
    paymentMethod !== undefined || receivedAmount !== undefined || changeAmount !== undefined;

  return (
    <section
      aria-label="Payment and totals summary"
      className={`shrink-0 border-t border-border pt-3 ${className}`}
    >
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="min-w-0 space-y-2">
          {hasPaymentDetails ? (
            <>
              <SummaryRow label={paymentLabel} value={paymentMethod} />
              <SummaryRow label={receivedLabel} value={receivedAmount} />
              <div className="flex items-start justify-between gap-2">
                <span className="text-muted">{changeLabel}</span>
                <span className="text-end text-sm font-semibold tabular-nums text-foreground">
                  <span className="block">{changeAmount ?? "—"}</span>
                  {changeSecondaryAmount ? (
                    <span className="block text-xs font-medium text-muted">
                      {changeSecondaryAmount}
                    </span>
                  ) : null}
                </span>
              </div>
            </>
          ) : (
            <SummaryRow label={displayItemsLabel} value={formatCurrency(subtotal)} />
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <SummaryRow label={subtotalLabel} value={formatCurrency(subtotal)} />
          <SummaryRow
            label={displayDiscountLabel}
            value={discount > 0 ? `-${formatCurrency(discount)}` : formatCurrency(0)}
            muted
          />
          {tax !== undefined && tax !== null ? (
            <SummaryRow
              label={taxRate ? `${taxLabel} (${taxRate})` : taxLabel}
              value={formatCurrency(tax)}
            />
          ) : null}
          {serviceCharge !== undefined && serviceCharge > 0 ? (
            <SummaryRow label={serviceChargeLabel} value={formatCurrency(serviceCharge)} />
          ) : null}
        </div>
      </div>

      {customRows?.map((row, index) => (
        <div key={index} className="mt-2 flex items-center justify-between gap-4 text-sm">
          <span className={row.isMuted ? "text-muted" : "text-foreground"}>{row.label}</span>
          <span className={row.isDeduction ? "font-medium text-muted" : "font-medium text-foreground"}>
            {typeof row.value === "number" ? formatCurrency(row.value) : row.value}
          </span>
        </div>
      ))}

      {appliedPromotion ? (
        <div className="mt-2.5 rounded-xl border border-accent/30 bg-accent-soft/30 p-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-accent-soft-foreground">
              Promotion ({appliedPromotion.code || appliedPromotion.name})
            </span>
            <span className="font-bold tabular-nums text-accent-soft-foreground">
              -{formatCurrency(appliedPromotion.discountAmount)}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
            <span className="truncate pe-2">
              {appliedPromotion.description || "Applied discount"}
            </span>

            <div className="flex shrink-0 items-center gap-2">
              {onOpenPromotionModal ? (
                <button
                  type="button"
                  onClick={onOpenPromotionModal}
                  className="font-medium text-foreground hover:underline"
                >
                  Change
                </button>
              ) : null}

              {onRemovePromotion ? (
                <button
                  type="button"
                  onClick={onRemovePromotion}
                  className="font-medium text-danger hover:underline"
                >
                  [Remove]
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <Separator className="my-3" />

      <div className="flex items-end justify-between gap-4">
        <span className="text-base font-bold text-foreground">{totalLabel}</span>
        <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>
    </section>
  );
}

function SummaryRow({
  label,
  muted = false,
  value,
}: {
  label: React.ReactNode;
  muted?: boolean;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-end text-sm font-medium tabular-nums ${muted ? "text-muted" : "text-foreground"}`}>
        {value ?? "—"}
      </span>
    </div>
  );
}
