"use client";

import { Button, ScrollShadow, Table } from "@heroui/react";
import { Add, Coffee, Minus, Trash9 } from "reicon-react";
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

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

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
                            <Minus aria-hidden="true" />
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
                            <Add aria-hidden="true" />
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="font-semibold text-foreground">
                          {item.formattedTotalPrice ?? formatCurrency(lineTotal)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        <Button isIconOnly variant="danger"
                          onClick={() => handleRemove(item)}
                          aria-label={removeAriaLabel(item.name)}
                        >
                          <Trash9 aria-hidden="true" />

                        </Button>

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
      className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-surface/30 ${className}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-b border-border/70 bg-surface-secondary/60 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
        <span>{labels.item || "Product"} x{totalQuantity}</span>
        <span>{labels.price || "Price"}</span>
        <span>{labels.quantity || "QTY"}</span>
        <span className="text-end">{labels.total || "Amount"}</span>
      </div>

      <ScrollShadow className="min-h-0 flex-1 overflow-y-auto">
        <div>
          {items.map((item) => {
            const modifierSummary = formatModifiers(item.modifiers);
            const lineTotal = item.price * item.quantity;

            return (
              <div
                key={item.id}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 border-b border-border/60 px-3 py-3 last:border-b-0"
              >
                <div className="min-w-0 pe-1">
                  <p className="break-words text-xs font-semibold leading-4 text-foreground">
                    {item.name}
                  </p>
                  {modifierSummary ? (
                    <p className="mt-1 ps-2 text-[10px] leading-4 text-muted">
                      {modifierSummary}
                    </p>
                  ) : null}
                  {item.notes ? (
                    <p className="mt-1 ps-2 text-[10px] italic leading-4 text-muted">
                      {item.notes}
                    </p>
                  ) : null}
                </div>

                <span className="text-xs tabular-nums text-muted">
                  {item.formattedUnitPrice ?? formatCurrency(item.price)}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={decreaseAriaLabel(item.name)}
                    className="flex size-6 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    onClick={() => handleDecrease(item)}
                  >
                    <Minus aria-hidden="true" className="size-3" />
                  </button>
                  <span className="min-w-4 text-center text-xs font-semibold tabular-nums text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={increaseAriaLabel(item.name)}
                    className="flex size-6 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    onClick={() => handleIncrease(item)}
                  >
                    <Add aria-hidden="true" className="size-3" />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <span className="text-xs font-semibold tabular-nums text-foreground">
                    {item.formattedTotalPrice ?? formatCurrency(lineTotal)}
                  </span>
                  <button
                    type="button"
                    aria-label={removeAriaLabel(item.name)}
                    className="rounded-md p-1 text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    onClick={() => handleRemove(item)}
                  >
                    <Trash9 aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
}
