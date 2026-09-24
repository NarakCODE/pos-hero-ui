"use client";

import { Button, ScrollShadow, Table } from "@heroui/react";
import {
  IconCoffee,
  IconMinus,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
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
      <div
        className={`flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border px-5 py-10 text-center ${className}`}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-surface-secondary text-muted">
          {emptyIcon || <IconCoffee aria-hidden="true" size={24} />}
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          {emptyTitle}
        </p>
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
        <Table className="min-h-0 flex-1" variant="secondary">
          <Table.ScrollContainer className="min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain">
            <Table.Content
              aria-label={labels.item || "Order items"}
              className="w-full min-w-[30rem]"
            >
              <Table.Header className="sticky top-0 z-10">
                <Table.Column className="w-full" isRowHeader>
                  {labels.item || "Product"}
                </Table.Column>
                <Table.Column className="w-20 text-end">
                  {labels.price || "Price"}
                </Table.Column>
                <Table.Column className="w-32 text-center">
                  {labels.quantity || "QTY"}
                </Table.Column>
                <Table.Column className="w-36 text-end">
                  {labels.total || "Amount"}
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {items.map((item) => {
                  const modifierSummary = formatModifiers(item.modifiers);
                  const lineTotal = item.price * item.quantity;

                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell className="align-top">
                        <div className="min-w-32 py-1">
                          <p className="font-semibold leading-5 text-foreground">
                            {item.name}
                          </p>
                          {modifierSummary ? (
                            <p className="mt-1 text-[11px] leading-4 text-muted">
                              {modifierSummary}
                            </p>
                          ) : null}
                          {item.notes ? (
                            <p className="text-xs italic text-muted">
                              {item.notes}
                            </p>
                          ) : null}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-top text-end">
                        <span className="block py-1 text-xs tabular-nums text-muted">
                          {item.formattedUnitPrice ??
                            formatCurrency(item.price)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="align-top">
                        <div className="flex items-center justify-center gap-1.5 py-1">
                          <Button
                            aria-label={decreaseAriaLabel(item.name)}
                            isIconOnly
                            onPress={() => handleDecrease(item)}
                            size="sm"
                            variant="secondary"
                          >
                            <IconMinus aria-hidden="true" />
                          </Button>
                          <span className="min-w-5 text-center font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            aria-label={increaseAriaLabel(item.name)}
                            isIconOnly
                            onPress={() => handleIncrease(item)}
                            size="sm"
                            variant="secondary"
                          >
                            <IconPlus aria-hidden="true" />
                          </Button>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="align-top text-end">
                        <div className="flex items-center justify-end gap-2 py-1">
                          <span className="font-semibold tabular-nums text-foreground">
                            {item.formattedTotalPrice ?? formatCurrency(lineTotal)}
                          </span>
                          <Button
                            aria-label={removeAriaLabel(item.name)}
                            isIconOnly
                            onPress={() => handleRemove(item)}
                            size="sm"
                            variant="danger-soft"
                          >
                            <IconTrash aria-hidden="true" />
                          </Button>
                        </div>
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
      <ScrollShadow className="flex-1 overflow-y-auto">
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
                      <Button
                        aria-label={decreaseAriaLabel(item.name)}
                        isIconOnly
                        onPress={() => handleDecrease(item)}
                        size="sm"
                        variant="secondary"
                      >
                        <IconMinus aria-hidden="true" />
                      </Button>
                      <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        aria-label={increaseAriaLabel(item.name)}
                        isIconOnly
                        onPress={() => handleIncrease(item)}
                        size="sm"
                        variant="secondary"
                      >
                        <IconPlus aria-hidden="true" />
                      </Button>
                    </div>

                    <Button
                      aria-label={removeAriaLabel(item.name)}
                      isIconOnly
                      onPress={() => handleRemove(item)}
                      size="sm"
                      variant="danger"
                    >
                      <IconTrash aria-hidden="true" size={16} />
                    </Button>
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
