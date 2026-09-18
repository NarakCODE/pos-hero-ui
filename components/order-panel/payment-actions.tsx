"use client";

import { Button, Spinner } from "@heroui/react";
import { Check, Clock, Printer, Refresh } from "reicon-react";
import type { PaymentActionsProps, QuickActionOption } from "./types";

export function PaymentActions({
  actionsSlot,
  chargeAmount,
  chargeLabel = "Charge",
  className = "",
  completeLabel = "Payment complete",
  disabled = false,
  holdLabel = "Hold order",
  isCharging = false,
  isPaid = false,
  onCharge,
  onHoldOrder,
  onPrintReceipt,
  onResetOrder,
  onSelectPaymentMethod,
  paidMessage = "Payment recorded. Ready for the next ticket.",
  paymentMethods,
  paymentTitle = "Payment method",
  quickActions,
  printLabel = "Print receipt",
  resetLabel = "New order",
  selectedPaymentMethod,
}: PaymentActionsProps) {
  const displayChargeText = chargeAmount ? `${chargeLabel} ${chargeAmount}` : chargeLabel;
  const actionTiles: Array<QuickActionOption & { kind: "payment" | "quick" }> = [
    ...(paymentMethods ?? []).map((method) => ({ ...method, kind: "payment" as const })),
    ...(quickActions ?? []).map((action) => ({ ...action, kind: "quick" as const })),
  ];

  return (
    <section aria-label="Payment actions" className={`mt-4 flex flex-col gap-3 ${className}`}>
      {/* Payment and quick action keypad */}
      {actionTiles.length > 0 ? (
        <div>
          {paymentTitle ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {paymentTitle}
            </p>
          ) : null}
          <div className="grid grid-cols-3 gap-2">
            {actionTiles.slice(0, 9).map((tile) => {
              const isSelected = tile.kind === "payment" && selectedPaymentMethod === tile.id;
              const Icon = tile.icon;

              return (
                <Button
                  key={tile.id}
                  fullWidth
                  type="button"
                  isDisabled={disabled || tile.disabled}
                  variant={isSelected ? "primary" : "outline"}
                  size="md"
                  onPress={() => {
                    if (tile.kind === "payment") {
                      onSelectPaymentMethod?.(tile.id);
                    } else {
                      tile.onPress?.();
                    }
                  }}
                  aria-label={tile.ariaLabel ?? tile.label}
                  className="min-h-16 flex-col gap-1 px-1.5 py-2 text-[10px] font-semibold leading-tight"
                >
                  {Icon ? <Icon aria-hidden="true" size={17} /> : null}
                  {tile.label ? <span className="line-clamp-2 text-center">{tile.label}</span> : null}
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Main Payment / Charge Button */}
      <Button
        fullWidth
        size="lg"
        type="button"
        isDisabled={disabled || isCharging}
        isPending={isCharging}
        variant={isPaid ? "secondary" : "primary"}
        onPress={onCharge}
        className="font-semibold"
      >
        {({ isPending }) => (
          <span className="flex items-center justify-center gap-2">
            {isPending ? <Spinner color="current" size="sm" /> : null}
            {isPaid ? (
              <>
                <Check aria-hidden="true" size={18} />
                <span>{completeLabel}</span>
              </>
            ) : (
              <span>{displayChargeText}</span>
            )}
          </span>
        )}
      </Button>

      {/* Paid Success Banner */}
      {isPaid && paidMessage ? (
        <div
          role="status"
          className="flex items-center justify-center gap-2 rounded-xl bg-success/10 py-2 px-3 text-center text-xs font-medium text-success"
        >
          <Check aria-hidden="true" size={14} className="shrink-0" />
          <span>{paidMessage}</span>
        </div>
      ) : null}

      {/* Auxiliary Action Controls */}
      {onPrintReceipt || onHoldOrder || onResetOrder || actionsSlot ? (
        <div className="flex items-center gap-2 pt-1">
          {onPrintReceipt ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onPress={onPrintReceipt}
              className="text-xs"
            >
              <Printer aria-hidden="true" size={14} />
              <span>{printLabel}</span>
            </Button>
          ) : null}

          {onHoldOrder && !isPaid ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onPress={onHoldOrder}
              className="text-xs"
            >
              <Clock aria-hidden="true" size={14} />
              <span>{holdLabel}</span>
            </Button>
          ) : null}

          {onResetOrder && isPaid ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onPress={onResetOrder}
              className="text-xs"
            >
              <Refresh aria-hidden="true" size={14} />
              <span>{resetLabel}</span>
            </Button>
          ) : null}

          {actionsSlot}
        </div>
      ) : null}
    </section>
  );
}
