"use client";

import { Button, Chip } from "@heroui/react";
import { Clock } from "reicon-react";
import type { OrderHeaderProps } from "./types";

export function OrderHeader({
  actions,
  canClear = true,
  changeButtonLabel = "Change",
  className = "",
  clearButtonLabel = "Clear",
  customerName,
  eyebrow,
  onChangeOrderType,
  onClearTicket,
  orderNumber,
  orderType,
  tableNumber,
  timestamp,
  title,
}: OrderHeaderProps) {
  const formattedOrderNumber =
    orderNumber !== undefined && orderNumber !== null
      ? typeof orderNumber === "string" && (orderNumber.startsWith("#") || orderNumber.toLowerCase().startsWith("ticket"))
        ? orderNumber
        : `#${orderNumber}`
      : undefined;

  return (
    <header className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-0.5 truncate text-xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {onClearTicket ? (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              isDisabled={!canClear}
              onPress={onClearTicket}
              className="text-muted hover:text-danger focus-visible:text-danger"
            >
              {clearButtonLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {formattedOrderNumber || orderType || tableNumber || customerName || timestamp ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-secondary px-3.5 py-2.5 text-sm">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {formattedOrderNumber ? (
              <span className="font-semibold text-foreground">
                {formattedOrderNumber}
              </span>
            ) : null}

            {orderType ? (
              <Chip variant="primary" className="text-xs font-medium">
                <Chip.Label>{orderType}</Chip.Label>
              </Chip>
            ) : null}

            {tableNumber ? (
              <span className="text-xs text-muted">
                {typeof tableNumber === "string" && tableNumber.toLowerCase().includes("table")
                  ? tableNumber
                  : `Table ${tableNumber}`}
              </span>
            ) : null}

            {customerName ? (
              <span className="text-xs font-medium text-foreground">
                {customerName}
              </span>
            ) : null}

            {timestamp ? (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Clock aria-hidden="true" size={14} />
                <span>{timestamp}</span>
              </span>
            ) : null}
          </div>

          {onChangeOrderType ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onPress={onChangeOrderType}
            >
              {changeButtonLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
