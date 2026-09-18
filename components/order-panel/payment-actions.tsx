"use client";

import { Button, Spinner } from "@heroui/react";
import { Check, Clock, Printer, Refresh } from "reicon-react";
import type { PaymentActionsProps } from "./types";

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
  printLabel = "Print receipt",
  resetLabel = "New order",
  selectedPaymentMethod,
}: PaymentActionsProps) {
  const displayChargeText = chargeAmount ? `${chargeLabel} ${chargeAmount}` : chargeLabel;

  return (
    <section aria-label="Payment actions" className={`mt-4 flex flex-col gap-3 ${className}`}>
      {/* Payment Method Selector */}
      {paymentMethods && paymentMethods.length > 0 ? (
        <div>
          {paymentTitle ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              {paymentTitle}
            </p>
          ) : null}
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${Math.min(paymentMethods.length, 3)}, minmax(0, 1fr))`,
            }}
          >
            {paymentMethods.map((method) => {
              const isSelected = selectedPaymentMethod === method.id;
              const Icon = method.icon;

              return (
                <Button
                  key={method.id}
                  fullWidth
                  type="button"
                  isDisabled={method.disabled}
                  variant={isSelected ? "primary" : "outline"}
                  size="md"
                  onPress={() => onSelectPaymentMethod?.(method.id)}
                  className="flex items-center justify-center gap-1.5 px-2 text-xs font-medium"
                >
                  {Icon ? <Icon aria-hidden="true" size={16} /> : null}
                  <span className="truncate">{method.label}</span>
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
