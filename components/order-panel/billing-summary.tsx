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
  serviceCharge,
  serviceChargeLabel = "Service Charge",
  subtotal,
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

  return (
    <section aria-label="Billing summary" className={`border-t border-border pt-4 ${className}`}>
      <div className="flex flex-col gap-2 text-sm">
        {/* Subtotal / Items */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted">{displayItemsLabel}</span>
          <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
        </div>

        {/* Discount */}
        {discount > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">{displayDiscountLabel}</span>
            <span className="font-medium text-muted">
              -{formatCurrency(discount)}
            </span>
          </div>
        ) : null}

        {/* Tax */}
        {tax !== undefined && tax !== null ? (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">{displayTaxLabel}</span>
            <span className="font-medium text-foreground">{formatCurrency(tax)}</span>
          </div>
        ) : null}

        {/* Optional Service charge */}
        {serviceCharge !== undefined && serviceCharge !== null && serviceCharge > 0 ? (
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted">{serviceChargeLabel}</span>
            <span className="font-medium text-foreground">{formatCurrency(serviceCharge)}</span>
          </div>
        ) : null}

        {/* Custom rows if passed */}
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

      {/* Grand Total */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-base font-bold text-foreground">{totalLabel}</span>
        <span className="text-xl font-bold tracking-tight text-foreground tabular-nums">
          {formatCurrency(total)}
        </span>
      </div>
    </section>
  );
}
