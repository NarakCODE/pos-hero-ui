"use client";

import { ScrollShadow, Table } from "@heroui/react";
import { Add, Coffee, Minus, Trash } from "reicon-react";
import type { OrderItemsTableProps, OrderPanelItem } from "./types";

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export function OrderItemsTable({
  className = "",
  decreaseAriaLabel = (name) => `Decrease quantity for ${name}`,
  emptyDescription = "Choose a product to start an order.",
  emptyIcon,
  emptyTitle = "Your ticket is empty",
  formatCurrency = defaultFormatCurrency,
  increaseAriaLabel = (name) => `Increase quantity for ${name}`,
  items,
  labels = {
    action: "",
    item: "Item",
    price: "Price",
    quantity: "Qty",
    total: "Total",
  },
  maxHeight,
  onRemoveItem,
  onUpdateQuantity,
  removeAriaLabel = (name) => `Remove ${name}`,
  viewMode = "list",
}: OrderItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className={`flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-10 text-center ${className}`}>
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-secondary text-muted">
          {emptyIcon || <Coffee aria-hidden="true" size={24} />}
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">{emptyTitle}</p>
        <p className="mt-1 text-xs text-muted max-w-56">{emptyDescription}</p>
      </div>
    );
  }

  const handleDecrease = (item: OrderPanelItem) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, -1);
    }
  };

  const handleIncrease = (item: OrderPanelItem) => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, 1);
    }
  };

  const handleRemove = (item: OrderPanelItem) => {
    if (onRemoveItem) {
      onRemoveItem(item.id);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(item.id, -item.quantity);
    }
  };

  const formatModifiers = (modifiers?: string | string[]) => {
    if (!modifiers) return "";
    if (Array.isArray(modifiers)) return modifiers.filter(Boolean).join(" · ");
    return modifiers;
  };

  if (viewMode === "table") {
    return (
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <Table aria-label={labels.item || "Order items"}>
          <Table.ScrollContainer>
            <Table.Content className="w-full text-sm">
              <Table.Header>
                <Table.Column isRowHeader>{labels.item || "Item"}</Table.Column>
                <Table.Column>{labels.price || "Price"}</Table.Column>
                <Table.Column>{labels.quantity || "Qty"}</Table.Column>
                <Table.Column>{labels.total || "Total"}</Table.Column>
                <Table.Column className="w-12 text-end">{labels.action || ""}</Table.Column>
              </Table.Header>
              <Table.Body>
                {items.map((item) => {
                  const modifierSummary = formatModifiers(item.modifiers);
                  const lineTotal = item.price * item.quantity;

                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        <div className="min-w-32">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          {modifierSummary ? (
                            <p className="text-xs text-muted">{modifierSummary}</p>
                          ) : null}
                          {item.notes ? (
                            <p className="text-xs italic text-muted">{item.notes}</p>
                          ) : null}
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-muted">
                          {item.formattedUnitPrice ?? formatCurrency(item.price)}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={decreaseAriaLabel(item.name)}
                            className="flex size-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            onClick={() => handleDecrease(item)}
                          >
                            <Minus aria-hidden="true" className="size-3.5" />
                          </button>
                          <span className="min-w-5 text-center font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={increaseAriaLabel(item.name)}
                            className="flex size-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                            onClick={() => handleIncrease(item)}
                          >
                            <Add aria-hidden="true" className="size-3.5" />
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-semibold text-foreground">
                          {item.formattedTotalPrice ?? formatCurrency(lineTotal)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        <button
                          type="button"
                          aria-label={removeAriaLabel(item.name)}
                          className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          onClick={() => handleRemove(item)}
                        >
                          <Trash aria-hidden="true" className="size-4" />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <ScrollShadow className="flex-1 overflow-y-auto pr-1">
        <div className="flex flex-col gap-2.5">
          {items.map((item) => {
            const modifierSummary = formatModifiers(item.modifiers);
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="group rounded-xl border border-border bg-surface/40 p-3 transition-colors hover:border-accent/30 hover:bg-surface"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.name}
                    </p>
                    {modifierSummary ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                        {modifierSummary}
                      </p>
                    ) : null}
                    {item.notes ? (
                      <p className="mt-0.5 text-xs italic text-muted">
                        {item.notes}
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {item.formattedTotalPrice ?? formatCurrency(lineTotal)}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">
                      {item.formattedUnitPrice ?? formatCurrency(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-label={decreaseAriaLabel(item.name)}
                        className="flex size-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        onClick={() => handleDecrease(item)}
                      >
                        <Minus aria-hidden="true" className="size-3.5" />
                      </button>
                      <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={increaseAriaLabel(item.name)}
                        className="flex size-7 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        onClick={() => handleIncrease(item)}
                      >
                        <Add aria-hidden="true" className="size-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={removeAriaLabel(item.name)}
                      className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      onClick={() => handleRemove(item)}
                    >
                      <Trash aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
}
