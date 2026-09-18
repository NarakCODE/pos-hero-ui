"use client";

import { Button, Chip } from "@heroui/react";
import { Clock } from "reicon-react";
import type { ReactNode } from "react";
import { OrderChannelSelect } from "@/components/order-channel-select";
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
  onOrderChannelChange,
  orderNumber,
  orderChannel,
  orderChannelLabel = "Order Channel",
  orderType,
  sequenceLabel = "Seq.",
  sequenceNumber,
  status,
  statusLabel = "Status",
  tableTicketLabel = "Table/Ticket No",
  tableTicketNo,
  tableNumber,
  timestamp,
}: OrderHeaderProps) {
  const formattedOrderNumber =
    orderNumber !== undefined && orderNumber !== null
      ? typeof orderNumber === "string" && (orderNumber.startsWith("#") || orderNumber.toLowerCase().startsWith("ticket"))
        ? orderNumber
        : `#${orderNumber}`
      : undefined;

  const hasTicketMetadata = Boolean(
    tableTicketNo || sequenceNumber !== undefined || status || orderChannel,
  );

  return (
    <header className={`flex flex-col gap-3 ${className}`}>
      {eyebrow || actions || onClearTicket ? (
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {eyebrow}
              </p>
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
      ) : null}

      {hasTicketMetadata ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border border-border/70 bg-surface-secondary/60 p-3">
          {tableTicketNo ? (
            <MetadataItem label={tableTicketLabel} value={tableTicketNo} />
          ) : null}
          {sequenceNumber !== undefined ? (
            <MetadataItem label={sequenceLabel} value={sequenceNumber} />
          ) : null}
          {status ? (
            <MetadataItem
              label={statusLabel}
              value={
                <Chip color="warning" size="sm" variant="soft">
                  {status}
                </Chip>
              }
            />
          ) : null}
          {orderChannel ? (
            onOrderChannelChange ? (
              <OrderChannelSelect
                label={orderChannelLabel}
                onChange={onOrderChannelChange}
                value={orderChannel}
              />
            ) : (
              <MetadataItem label={orderChannelLabel} value={orderChannel} />
            )
          ) : null}
        </div>
      ) : formattedOrderNumber || orderType || tableNumber || customerName || timestamp ? (
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

function MetadataItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
