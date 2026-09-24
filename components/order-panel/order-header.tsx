"use client";

import { Button, Chip, Separator } from "@heroui/react";
import type { ReactNode } from "react";
import { IconClock } from "@tabler/icons-react";
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
  orderChannel,
  orderChannelLabel = "Order channel",
  orderTypeLabel,
  orderNumber,
  orderType,
  sequenceLabel = "Seq.",
  sequenceNumber,
  status,
  statusLabel = "Status",
  tableNumber,
  tableTicketLabel = "Table/Ticket No",
  tableTicketNumber,
  timestamp,
  title,
}: OrderHeaderProps) {
  const formattedOrderNumber =
    orderNumber !== undefined && orderNumber !== null
      ? typeof orderNumber === "string" &&
          (orderNumber.startsWith("#") || orderNumber.toLowerCase().startsWith("ticket"))
        ? orderNumber
        : `#${orderNumber}`
      : undefined;
  const tableTicketValue =
    tableTicketNumber ??
    (tableNumber !== undefined
      ? typeof tableNumber === "string" && tableNumber.toLowerCase().includes("table")
        ? tableNumber
        : `Table ${tableNumber}`
      : formattedOrderNumber);
  const sequenceValue = sequenceNumber ?? orderNumber;
  const statusValue = status ?? (orderTypeLabel ? undefined : orderType);
  const orderTypeValue = orderTypeLabel ? orderType : undefined;
  const metadataItems = [
    tableTicketValue,
    sequenceValue,
    statusValue,
    orderChannel,
    orderTypeValue,
  ];
  const hasMetadata = metadataItems.some((value) => value !== undefined && value !== null);

  return (
    <div className={`shrink-0 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-1 truncate text-base font-bold tracking-tight text-foreground">
              {title}
            </h2>
          ) : null}
          {customerName ? (
            <p className="mt-1 truncate text-xs text-muted">{customerName}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {actions}
          {onChangeOrderType ? (
            <Button type="button" variant="ghost" size="sm" onPress={onChangeOrderType}>
              {changeButtonLabel}
            </Button>
          ) : null}
          {onClearTicket ? (
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              isDisabled={!canClear}
              onPress={onClearTicket}
            >
              {clearButtonLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {hasMetadata ? (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          <MetadataItem label={tableTicketLabel} value={tableTicketValue} />
          <MetadataItem align="end" label={sequenceLabel} value={sequenceValue} />
          <MetadataItem
            label={statusLabel}
            value={
              statusValue ? (
                <Chip color="warning" size="sm" variant="soft">
                  {statusValue}
                </Chip>
              ) : null
            }
          />
          <MetadataItem align="end" label={orderChannelLabel} value={orderChannel} />
          {orderTypeLabel && orderTypeValue ? (
            <MetadataItem label={orderTypeLabel} value={orderTypeValue} />
          ) : null}
        </div>
      ) : null}

      {timestamp ? (
        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted">
            <IconClock aria-hidden="true" size={13} />
          <span>{timestamp}</span>
        </div>
      ) : null}

      <Separator className="mt-4" />
    </div>
  );
}

function MetadataItem({
  align = "start",
  label,
  value,
}: {
  align?: "start" | "end";
  label: ReactNode;
  value?: ReactNode;
}) {
  if (value === undefined || value === null) {
    return <div aria-hidden="true" />;
  }

  return (
    <div
      className={`flex min-w-0 flex-col ${
        align === "end" ? "items-end text-end" : "items-start text-start"
      }`}
    >
      <p className="text-[10px] font-medium tracking-wider text-muted">{label}</p>
      <div className="mt-0.5 min-w-0 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
