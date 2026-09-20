"use client";

import { Button, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  type FulfillmentStatus,
  orderRecords,
  type OrderRecord,
} from "./orders-data";
import { Check, X } from "reicon-react";

interface OrdersAsideProps {
  selectedOrderId: string | null;
}

const currencyRate = 4000;

export function OrdersAside({ selectedOrderId }: OrdersAsideProps) {
  const t = useTranslations("OrdersPage");
  const selectedOrder =
    orderRecords.find((order) => order.id === selectedOrderId) ??
    orderRecords[0];
  const [localAction, setLocalAction] = useState<{
    orderId: string;
    status: FulfillmentStatus;
  } | null>(null);

  if (!selectedOrder) {
    return null;
  }

  const status =
    localAction?.orderId === selectedOrder.id
      ? localAction.status
      : selectedOrder.fulfillmentStatus;
  const vat = selectedOrder.totalUsd * 0.1;

  return (
    <section
      aria-labelledby="orders-aside-title"
      className="flex h-full min-h-0 flex-col bg-background"
    >
      <header className="shrink-0 px-5 py-4 sm:px-6">
        <div className="mb-4">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted">
            {t("aside.eyebrow")}
          </p>
          <h2
            id="orders-aside-title"
            className="text-base font-bold tracking-tight text-foreground"
          >
            {t("aside.title")}
          </h2>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-3">
            <MetadataItem
              label={t("aside.tableTicket")}
              value={selectedOrder.tableNumber}
            />
            <MetadataItem
              label={t("aside.sequence")}
              value={String(selectedOrder.sequence)}
            />
          </div>

          <div className="flex min-w-0 max-w-[48%] flex-col items-end gap-2">
            <Chip
              color={fulfillmentStatusColor(status)}
              size="sm"
              variant="soft"
            >
              {t("aside.status")}: {t(`statuses.${status}`)}
            </Chip>
            <p
              className="max-w-full truncate text-end text-sm text-foreground"
              title={channelLabel(selectedOrder, t)}
            >
              <span className="text-[10px] font-medium tracking-wider text-muted">
                {t("aside.orderChannel")}:
              </span>{" "}
              {channelLabel(selectedOrder, t)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-4 sm:px-6">
        <section
          aria-labelledby="orders-items-title"
          className="flex min-h-0 flex-1 flex-col border-y border-border/70"
        >
          <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_4rem_3rem_5rem] gap-2 bg-surface-secondary/50 px-2 py-2.5 text-xs font-semibold text-muted">
            <h3 id="orders-items-title">
              {t("aside.product")} x{selectedOrder.totalQuantity}
            </h3>
            <span className="text-end">{t("aside.price")}</span>
            <span className="text-center">{t("aside.quantity")}</span>
            <span className="text-end">{t("aside.amount")}</span>
          </div>

          <div
            aria-label={t("details.itemsTitle")}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          >
            <div className="divide-y divide-border/60">
              {selectedOrder.items.map((item) => (
                <div
                  key={`${selectedOrder.id}-${item.name}`}
                  className="grid grid-cols-[minmax(0,1fr)_4rem_3rem_5rem] items-start gap-2 px-2 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold leading-5 text-foreground">
                      {item.name}
                    </p>
                    <p className="truncate ps-3 text-[11px] leading-4 text-muted">
                      {item.modifiers}
                    </p>
                    {item.addOns?.map((addOn) => (
                      <p
                        key={`${selectedOrder.id}-${item.name}-${addOn}`}
                        className="truncate ps-3 text-[11px] leading-4 text-accent"
                      >
                        +${addOn}
                      </p>
                    ))}
                  </div>
                  <span className="text-end tabular-nums text-muted">
                    {item.price}
                  </span>
                  <span className="text-center tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <span className="text-end font-medium tabular-nums text-foreground">
                    {lineTotal(item.price, item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="orders-remark-title"
          className="mt-3 shrink-0 rounded-xl bg-surface-secondary/60 px-3 py-3"
        >
          <h3
            id="orders-remark-title"
            className="text-xs font-semibold text-foreground"
          >
            {t("aside.remarkTitle")}
          </h3>
          <p className="mt-1 text-sm leading-5 text-muted">
            {t("aside.remark")}
          </p>
        </section>

        <section
          aria-labelledby="orders-billing-title"
          className="mt-3 grid shrink-0 grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-4 border-y border-border/70 py-3"
        >
          <div className="min-w-0">
            <h3
              id="orders-billing-title"
              className="mb-2 text-xs font-semibold text-foreground"
            >
              {t("aside.tenderInfo")}
            </h3>
            <div className="flex flex-col gap-2">
              <BillingRow
                label={t("details.tender")}
                value={selectedOrder.tender}
              />
              <BillingRow
                label={t("details.received")}
                value={formatDualCurrencyFromString(selectedOrder.received)}
              />
              <BillingRow
                label={t("details.change")}
                value={formatDualCurrencyFromString(selectedOrder.change)}
              />
            </div>
          </div>

          <div className="min-w-0 border-s border-border/70 ps-4">
            <h3 className="mb-2 text-xs font-semibold text-foreground">
              {t("aside.totals")}
            </h3>
            <div className="flex flex-col gap-2">
              <BillingRow
                label={t("aside.subtotal")}
                value={formatUsd(selectedOrder.totalUsd)}
              />
              <BillingRow label={t("aside.discount")} value={formatUsd(0)} />
              <BillingRow label={t("aside.vat")} value={formatUsd(vat)} />
              <div className="mt-1 flex items-end justify-between gap-3 border-t border-border/70 pt-2">
                <span className="text-base font-bold text-foreground">
                  {t("aside.grandTotal")}
                </span>
                <span className="text-end text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {formatDualCurrency(
                    selectedOrder.totalUsd,
                    selectedOrder.totalKhr,
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid shrink-0 grid-cols-2 gap-2 pt-3">
          <Button
            fullWidth
            className="border border-success/20 bg-success-soft text-success hover:bg-success/15 hover:border-success/30"
            size="lg"
            type="button"
            variant="ghost"
            onPress={() =>
              setLocalAction({
                orderId: selectedOrder.id,
                status: "inProgress",
              })
            }
          >
            <Check size={24} />
            {t("aside.accept")}
          </Button>
          <Button
            fullWidth
            size="lg"
            type="button"
            variant="danger-soft"
            onPress={() =>
              setLocalAction({ orderId: selectedOrder.id, status: "rejected" })
            }
          >
            <X size={24} />
            {t("aside.reject")}
          </Button>
        </div>
      </div>
    </section>
  );
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function BillingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="min-w-0 text-muted">{label}</span>
      <span className="max-w-[65%] text-end font-medium tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}

function channelLabel(
  order: OrderRecord,
  t: ReturnType<typeof useTranslations<"OrdersPage">>,
) {
  if (order.channel === "pos") {
    return order.tableNumber.startsWith("Table")
      ? t("channels.dineIn")
      : t("channels.takeAway");
  }

  return t(`channels.${order.channel}`);
}

function lineTotal(price: string, quantity: number) {
  const numericPrice = Number.parseFloat(price.replace(/[^0-9.]/g, ""));

  return Number.isFinite(numericPrice)
    ? formatUsd(numericPrice * quantity)
    : price;
}

function formatUsd(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function formatDualCurrency(usd: number, khr: number) {
  return `${formatUsd(usd)} / ៛${khr.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
}

function formatDualCurrencyFromString(value: string) {
  const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""));

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return `${value} / ៛${(numericValue * currencyRate).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
}

function fulfillmentStatusColor(
  status: FulfillmentStatus,
): "accent" | "danger" | "warning" {
  if (
    status === "new" ||
    ["rejected", "refund", "void", "expired", "cancelled"].includes(status)
  ) {
    return "danger";
  }

  if (status === "completed") {
    return "accent";
  }

  return "warning";
}
