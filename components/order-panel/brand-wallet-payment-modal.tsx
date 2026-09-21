"use client";

import { Button, Modal, Surface } from "@heroui/react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconWallet,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

import type { PaymentMethodOption } from "./types";

interface BrandWalletPaymentModalProps {
  amountDue?: number;
  isOpen: boolean;
  method: PaymentMethodOption;
  onOpenChange: (isOpen: boolean) => void;
  walletBalance?: number;
}

type PaymentState = "default" | "insufficient" | "processing" | "success";

const DEFAULT_AMOUNT_DUE = 22.5;
const DEFAULT_WALLET_BALANCE = 50;

export function BrandWalletPaymentModal({
  amountDue = DEFAULT_AMOUNT_DUE,
  isOpen,
  method,
  onOpenChange,
  walletBalance = DEFAULT_WALLET_BALANCE,
}: BrandWalletPaymentModalProps) {
  const initialState: PaymentState =
    walletBalance >= amountDue ? "default" : "insufficient";
  const [paymentState, setPaymentState] =
    useState<PaymentState>(initialState);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInsufficient = walletBalance < amountDue;
  const isProcessing = paymentState === "processing";
  const isSuccessful = paymentState === "success";
  const remainingBalance = Math.max(walletBalance - amountDue, 0);

  const clearProcessingTimer = () => {
    if (processingTimer.current) {
      clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
  };

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      clearProcessingTimer();
      setPaymentState(initialState);
    }

    onOpenChange(nextIsOpen);
  };

  const handlePay = () => {
    if (isInsufficient) {
      setPaymentState("insufficient");
      return;
    }

    clearProcessingTimer();
    setPaymentState("processing");
    processingTimer.current = setTimeout(() => {
      setPaymentState("success");
      processingTimer.current = null;
    }, 800);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container size="cover">
        <Modal.Dialog aria-label={method.label}>
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>{method.label}</Modal.Heading>
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <BalanceCard
                  icon={<IconWallet aria-hidden="true" size={18} />}
                  label="Available balance"
                  value={formatCurrency(walletBalance)}
                />
                <BalanceCard label="Amount due" value={formatCurrency(amountDue)} />
                <BalanceCard
                  label="Remaining balance"
                  value={
                    isInsufficient
                      ? "Insufficient"
                      : formatCurrency(remainingBalance)
                  }
                />
              </div>

              <PaymentStatus state={paymentState} />
            </div>
          </Modal.Body>

          <Modal.Footer className="w-full flex-col gap-2 sm:flex-row">
            <Button
              className="sm:flex-1"
              fullWidth
              size="lg"
              slot="close"
              variant="secondary"
            >
              Cancel
            </Button>

            {isSuccessful ? (
              <Button
                className="sm:flex-1"
                fullWidth
                size="lg"
                slot="close"
              >
                Done
              </Button>
            ) : (
              <Button
                className="sm:flex-1"
                fullWidth
                isDisabled={isInsufficient || isProcessing}
                isPending={isProcessing}
                size="lg"
                onPress={handlePay}
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ${formatCurrency(amountDue)}`}
              </Button>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function BalanceCard({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Surface className="flex min-h-24 flex-col justify-between gap-3 p-4" variant="secondary">
      <div className="flex items-center gap-2 text-xs text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
    </Surface>
  );
}

function PaymentStatus({ state }: { state: PaymentState }) {
  if (state === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-success-soft p-4 text-success-soft-foreground">
        <IconCircleCheck aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
        <div>
          <p className="font-medium">Payment successful</p>
          <p className="mt-1 text-sm">The order has been paid from Brand Wallet.</p>
        </div>
      </div>
    );
  }

  if (state === "insufficient") {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-danger-soft p-4 text-danger-soft-foreground">
        <IconAlertTriangle aria-hidden="true" className="mt-0.5 shrink-0" size={20} />
        <div>
          <p className="font-medium">Insufficient balance</p>
          <p className="mt-1 text-sm">
            Add funds or choose another payment method to continue.
          </p>
        </div>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="rounded-xl bg-accent-soft p-4 text-accent-soft-foreground">
        <p className="font-medium">Processing payment</p>
        <p className="mt-1 text-sm">Confirming the Brand Wallet transaction.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-secondary p-4">
      <p className="font-medium">Ready to pay</p>
      <p className="mt-1 text-sm text-muted">
        Review the balance and complete the payment when ready.
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}
