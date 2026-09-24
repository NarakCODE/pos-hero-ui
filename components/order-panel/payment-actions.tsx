"use client";

import { Avatar, Button, Spinner, Surface } from "@heroui/react";
import { useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconPrinter,
  IconRefresh,
} from "@tabler/icons-react";
import { BankCardPaymentModal } from "./bank-card-payment-modal";
import { BrandWalletPaymentModal } from "./brand-wallet-payment-modal";
import { CashPaymentModal } from "./cash-payment-modal";
import { DigitalWalletPaymentModal } from "./digital-wallet-payment-modal";
import { KHQRPaymentModal } from "./khqr-payment-modal";
import { MemberModal } from "./member-modal";
import { PaymentMethodDrawer } from "./payment-method-drawer";
import { PromotionModal } from "./promotion-modal";
import type {
  MemberProfile,
  PaymentActionsProps,
  PaymentMethodOption,
} from "./types";

export function PaymentActions({
  actionsSlot,
  appliedPromotion,
  chargeAmount,
  chargeLabel = "Charge",
  className = "",
  completeLabel = "Payment complete",
  disabled = false,
  formatCurrency,
  holdLabel = "Hold order",
  isCharging = false,
  isPaid = false,
  onApplyPromotion,
  onCharge,
  onHoldOrder,
  onPrintReceipt,
  onQuickAction,
  onRemovePromotion,
  onResetOrder,
  onSelectPaymentMethod,
  paidMessage = "Payment recorded. Ready for the next ticket.",
  paymentMethods,
  paymentTitle = "Payment method",
  printLabel = "Print receipt",
  promotions,
  quickActions,
  resetLabel = "New order",
  selectedPaymentMethod,
  subtotal,
}: PaymentActionsProps) {
  const [openPaymentMethodId, setOpenPaymentMethodId] = useState<string | null>(null);
  const [appliedMember, setAppliedMember] = useState<MemberProfile | null>(null);
  const displayChargeText = chargeAmount ? `${chargeLabel} ${chargeAmount}` : chargeLabel;
  const hasActionGrid = Boolean(
    (paymentMethods && paymentMethods.length > 0) || (quickActions && quickActions.length > 0),
  );
  const handlePrimaryAction = () => {
    if (isPaid) {
      onResetOrder?.();
      return;
    }

    const selectedMethod = paymentMethods?.find(
      (method) => method.id === selectedPaymentMethod,
    );

    if (selectedMethod && !selectedMethod.disabled) {
      setOpenPaymentMethodId(selectedMethod.id);
      return;
    }

    onCharge?.();
  };

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
                }}
              />
            ))}

            {quickActions?.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={disabled}
                isSelected={
                  openPaymentMethodId === action.id ||
                  (action.id === "promotion" && Boolean(appliedPromotion)) ||
                  (action.id === "member" && Boolean(appliedMember))
                }
                onPress={() => {
                  onQuickAction?.(action.id);
                  if (
                    action.id === "brandWallet" ||
                    action.id === "digitalWallet" ||
                    action.id === "promotion" ||
                    action.id === "member"
                  ) {
                    setOpenPaymentMethodId(action.id);
                  }
                }}
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
              onPress={handlePrimaryAction}
              className="w-full"
            >
              {({ isPending }) =>
                isPending ? (
                  <Spinner color="current" size="sm" />
                ) : isPaid ? (
                  <IconCheck aria-hidden="true" size={20} />
                ) : (
                  <IconArrowRight aria-hidden="true" size={22} />
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
                onPaymentSuccess={onCharge}
              />
            ) : method.id === "bankCard" ? (
              <BankCardPaymentModal
                key={method.id}
                isOpen={openPaymentMethodId === method.id}
                method={method}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? method.id : null)
                }
                onPaymentSuccess={onCharge}
              />
            ) : method.id === "khqr" ? (
              <KHQRPaymentModal
                key={method.id}
                isOpen={openPaymentMethodId === method.id}
                method={method}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? method.id : null)
                }
                onPaymentSuccess={onCharge}
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

          {quickActions?.map((action) =>
            action.id === "brandWallet" ? (
              <BrandWalletPaymentModal
                key={action.id}
                isOpen={openPaymentMethodId === action.id}
                method={action}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? action.id : null)
                }
              />
            ) : action.id === "digitalWallet" ? (
              <DigitalWalletPaymentModal
                key={action.id}
                isOpen={openPaymentMethodId === action.id}
                method={action}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? action.id : null)
                }
                onPaymentSuccess={onCharge}
              />
            ) : action.id === "promotion" ? (
              <PromotionModal
                key={action.id}
                isOpen={openPaymentMethodId === action.id}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? action.id : null)
                }
                subtotal={
                  typeof subtotal === "number" && subtotal > 0
                    ? subtotal
                    : typeof chargeAmount === "number"
                      ? chargeAmount
                      : 22.5
                }
                appliedPromotion={appliedPromotion}
                onApplyPromotion={onApplyPromotion}
                onRemovePromotion={onRemovePromotion}
                promotions={promotions}
                formatCurrency={formatCurrency}
              />
            ) : action.id === "member" ? (
              <MemberModal
                key={action.id}
                appliedMember={appliedMember}
                isOpen={openPaymentMethodId === action.id}
                onApplyMember={setAppliedMember}
                onOpenChange={(isOpen) =>
                  setOpenPaymentMethodId(isOpen ? action.id : null)
                }
              />
            ) : null,
          )}
        </div>
      ) : (
        <Button
          fullWidth
          size="lg"
          type="button"
          isDisabled={disabled || isCharging}
          isPending={isCharging}
          variant={isPaid ? "secondary" : "primary"}
          onPress={handlePrimaryAction}
        >
          {({ isPending }) => (
            <span className="flex items-center justify-center gap-2">
              {isPending ? <Spinner color="current" size="sm" /> : null}
              {isPaid ? (
                <>
                  <IconCheck aria-hidden="true" size={18} />
                  <span>{completeLabel}</span>
                </>
              ) : (
                <span>{displayChargeText}</span>
              )}
            </span>
          )}
        </Button>
      )}

      {appliedMember ? (
        <AppliedMemberSummary
          member={appliedMember}
          onChange={() => setOpenPaymentMethodId("member")}
          onRemove={() => setAppliedMember(null)}
        />
      ) : null}

      {isPaid && paidMessage ? (
        <div
          role="status"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-center text-xs font-medium text-success"
        >
          <IconCheck aria-hidden="true" size={14} className="shrink-0" />
          <span>{paidMessage}</span>
        </div>
      ) : null}

      {onPrintReceipt || onHoldOrder || onResetOrder || actionsSlot ? (
        <div className="flex items-center gap-2 pt-2">
          {onPrintReceipt ? (
            <Button
              fullWidth
              size="lg"
              type="button"
              variant="secondary"
              onPress={onPrintReceipt}
            >
              <IconPrinter aria-hidden="true" size={14} />
              <span>{printLabel}</span>
            </Button>
          ) : null}

          {onHoldOrder && !isPaid ? (
            <Button
              fullWidth
              size="lg"
              type="button"
              variant="secondary"
              onPress={onHoldOrder}
            >
              <IconClock aria-hidden="true" size={14} />
              <span>{holdLabel}</span>
            </Button>
          ) : null}

          {onResetOrder && isPaid ? (
            <Button type="button" variant="outline" size="sm" fullWidth onPress={onResetOrder}>
              <IconRefresh aria-hidden="true" size={14} />
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

function AppliedMemberSummary({
  member,
  onChange,
  onRemove,
}: {
  member: MemberProfile;
  onChange: () => void;
  onRemove: () => void;
}) {
  return (
    <Surface
      className="mt-2"
      variant="secondary"
    >
      <div className="flex items-center gap-3 p-3">
        <Avatar size="sm">
          <Avatar.Fallback>{getMemberInitials(member.name)}</Avatar.Fallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted">Member</p>
          <p className="truncate text-sm font-medium">
            {member.name} · {member.tier.replace(/\s+Member$/, "")}
          </p>
          <p className="text-xs text-muted">
            {member.points.toLocaleString("en-US")} points
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button size="sm" variant="ghost" onPress={onChange}>
            Change
          </Button>
          <Button size="sm" variant="ghost" onPress={onRemove}>
            Remove
          </Button>
        </div>
      </div>
    </Surface>
  );
}

function getMemberInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
