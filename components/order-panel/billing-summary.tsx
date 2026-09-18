"use client";

import { Separator } from "@heroui/react";
import type { BillingSummaryProps } from "./types";

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export function BillingSummary({
  className = "",
  customRows,
  discount = 0,
  discountLabel = "Discount",
  discountRate,
  formatCurrency = defaultFormatCurrency,
  itemCount,
  itemsLabel = "Items",
  paymentLabel = "Payment",
  paymentMethod,
  receivedLabel = "Received",
  receivedAmount,
  changeLabel = "Change",
  changeAmount,
  changeSecondaryAmount,
  totalSecondaryAmount,
  serviceCharge,
  serviceChargeLabel = "Service Charge",
  subtotal,
  subtotalLabel = "Subtotal",
  tax,
  taxLabel = "Tax",
  taxRate,
  total,
  totalLabel = "Total",
}: BillingSummaryProps) {
  const displayItemsLabel =
    itemCount !== undefined && itemCount !== null
      ? `${itemsLabel} (${itemCount})`
      : itemsLabel;

  const displayDiscountLabel = discountRate
    ? `${discountLabel} (${typeof discountRate === "number" ? `${discountRate * 100}%` : discountRate})`
    : discountLabel;

  const displayTaxLabel = taxRate
    ? `${taxLabel} (${typeof taxRate === "number" ? `${taxRate * 100}%` : taxRate})`
    : taxLabel;

  const hasTenderDetails = Boolean(
    paymentMethod !== undefined ||
      receivedAmount !== undefined ||
      changeAmount !== undefined ||
      totalSecondaryAmount !== undefined,
  );

  return (
    <section aria-label="Billing summary" className={`border-t border-border pt-4 ${className}`}>
      {hasTenderDetails ? (
        <div className="grid grid-cols-2 rounded-xl border border-border/70 bg-surface-secondary/35 p-3">
          <div className="space-y-3 pe-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                {paymentLabel}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {paymentMethod ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                {receivedLabel}
              </p>
              <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                {receivedAmount ?? "—"}
              </p>
            </div>

            <div className="border-t border-border/70 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                {changeLabel}
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums text-accent">
                {changeAmount ?? "—"}
              </p>
              {changeSecondaryAmount ? (
                <p className="mt-0.5 text-[11px] tabular-nums text-muted">
                  {changeSecondaryAmount}
                </p>
              ) : null}
            </div>
          </div>

          <div className="border-s border-border/70 ps-3">
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">{subtotalLabel}</span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-muted">{displayDiscountLabel}</span>
                <span className="font-medium tabular-nums text-muted">
                  -{formatCurrency(discount)}
                </span>
              </div>

              {tax !== undefined && tax !== null ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted">{displayTaxLabel}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(tax)}
                  </span>
                </div>
              ) : null}

              {serviceCharge !== undefined && serviceCharge !== null && serviceCharge > 0 ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted">{serviceChargeLabel}</span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatCurrency(serviceCharge)}
                  </span>
                </div>
              ) : null}

              {customRows?.map((row, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <span className={row.isMuted ? "text-muted" : "text-foreground"}>
                    {row.label}
                  </span>
                  <span
                    className={
                      row.isTotal
                        ? "font-semibold text-foreground"
                        : row.isDeduction
                          ? "font-medium text-muted"
                          : "font-medium text-foreground"
                    }
                  >
                    {typeof row.value === "number" ? formatCurrency(row.value) : row.value}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex items-end justify-between gap-2">
              <span className="text-sm font-bold text-foreground">{totalLabel}</span>
              <div className="text-end">
                <p className="text-lg font-bold tracking-tight tabular-nums text-foreground">
                  {formatCurrency(total)}
                </p>
                {totalSecondaryAmount ? (
                  <p className="text-[11px] font-medium tabular-nums text-muted">
                    {totalSecondaryAmount}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">{displayItemsLabel}</span>
              <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">{displayDiscountLabel}</span>
                <span className="font-medium text-muted">-{formatCurrency(discount)}</span>
              </div>
            ) : null}

            {tax !== undefined && tax !== null ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">{displayTaxLabel}</span>
                <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
              </div>
            ) : null}

            {serviceCharge !== undefined && serviceCharge !== null && serviceCharge > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted">{serviceChargeLabel}</span>
                <span className="font-medium text-foreground">{formatCurrency(serviceCharge)}</span>
              </div>
            ) : null}

            {customRows?.map((row, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className={row.isMuted ? "text-muted" : "text-foreground"}>
                  {row.label}
                </span>
                <span
                  className={
                    row.isTotal
                      ? "font-semibold text-foreground"
                      : row.isDeduction
                        ? "font-medium text-muted"
                        : "font-medium text-foreground"
                  }
                >
                  {typeof row.value === "number" ? formatCurrency(row.value) : row.value}
                </span>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-base font-bold text-foreground">{totalLabel}</span>
            <span className="text-xl font-bold tracking-tight text-foreground tabular-nums">
              {formatCurrency(total)}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
