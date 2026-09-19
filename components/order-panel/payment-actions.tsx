"use client";

import { Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { ArrowRight, Check, Clock, Printer, Refresh } from "reicon-react";
import { CashPaymentModal } from "./cash-payment-modal";
import { PaymentMethodDrawer } from "./payment-method-drawer";
import type { PaymentActionsProps, PaymentMethodOption } from "./types";

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
  onQuickAction,
  onResetOrder,
  onSelectPaymentMethod,
  paidMessage = "Payment recorded. Ready for the next ticket.",
  paymentMethods,
  paymentTitle = "Payment method",
  printLabel = "Print receipt",
  quickActions,
  resetLabel = "New order",
  selectedPaymentMethod,
}: PaymentActionsProps) {
  const [openPaymentMethodId, setOpenPaymentMethodId] = useState<string | null>(null);
  const displayChargeText = chargeAmount ? `${chargeLabel} ${chargeAmount}` : chargeLabel;
  const hasActionGrid = Boolean(
    (paymentMethods && paymentMethods.length > 0) || (quickActions && quickActions.length > 0),
  );

  return (
    <section aria-label="Payment actions" className={`shrink-0 ${className}`}>
      {hasActionGrid ? (
        <div>
          {paymentTitle ? (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {paymentTitle}
            </p>
          ) : null}

          <div className="grid grid-cols-3 gap-2">
            {paymentMethods?.map((method) => (
              <ActionButton
                key={method.id}
                action={method}
                disabled={disabled}
                isSelected={selectedPaymentMethod === method.id}
                onPress={() => {
                  onSelectPaymentMethod?.(method.id);
                  setOpenPaymentMethodId(method.id);
                }}
              />
            ))}

            {quickActions?.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={disabled}
                onPress={() => onQuickAction?.(action.id)}
              />
            ))}

            <Button
              fullWidth
              isIconOnly
              aria-label={isPaid ? completeLabel : displayChargeText}
              isDisabled={disabled || isCharging}
              isPending={isCharging}
              size="lg"
              type="button"
              variant={isPaid ? "secondary" : "primary"}
              onPress={onCharge}
              className="w-full"
            >
              {({ isPending }) =>
                isPending ? (
                  <Spinner color="current" size="sm" />
                ) : isPaid ? (
                  <Check aria-hidden="true" size={20} />
                ) : (
                  <ArrowRight aria-hidden="true" size={22} />
                )
              }
            </Button>
          </div>

          {paymentMethods?.map((method) => (
            method.id === "cash" ? (
              <CashPaymentModal
                key={method.id}
                isOpen={openPaymentMethodId === method.id}
                method={method}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? method.id : null)
                }
              />
            ) : (
              <PaymentMethodDrawer
                key={method.id}
                isOpen={openPaymentMethodId === method.id}
                method={method}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? method.id : null)
                }
              />
            )
          ))}
        </div>
      ) : (
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
      )}

      {isPaid && paidMessage ? (
        <div
          role="status"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-center text-xs font-medium text-success"
        >
          <Check aria-hidden="true" size={14} className="shrink-0" />
          <span>{paidMessage}</span>
        </div>
      ) : null}

      {onPrintReceipt || onHoldOrder || onResetOrder || actionsSlot ? (
        <div className="flex items-center gap-2 pt-2">
          {onPrintReceipt ? (
            <Button type="button" variant="outline" size="sm" fullWidth onPress={onPrintReceipt} className="text-xs">
              <Printer aria-hidden="true" size={14} />
              <span>{printLabel}</span>
            </Button>
          ) : null}

          {onHoldOrder && !isPaid ? (
            <Button type="button" variant="outline" size="sm" fullWidth onPress={onHoldOrder} className="text-xs">
              <Clock aria-hidden="true" size={14} />
              <span>{holdLabel}</span>
            </Button>
          ) : null}

          {onResetOrder && isPaid ? (
            <Button type="button" variant="outline" size="sm" fullWidth onPress={onResetOrder} className="text-xs">
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

function ActionButton({
  action,
  disabled,
  isSelected = false,
  onPress,
}: {
  action: PaymentMethodOption;
  disabled: boolean;
  isSelected?: boolean;
  onPress: () => void;
}) {
  const Icon = action.icon;

  return (
    <Button
      fullWidth
      aria-label={action.label}
      isDisabled={disabled || action.disabled}
      size="lg"
      type="button"
      variant={isSelected ? "primary" : "secondary"}
      onPress={onPress}
    >
      {Icon ? <Icon aria-hidden="true" size={18} /> : null}
      <span>{action.label}</span>
    </Button>
  );
}
