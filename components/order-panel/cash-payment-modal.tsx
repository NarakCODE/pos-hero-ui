"use client";

import { useMemo, useState } from "react";
import {
  Button,
  InputGroup,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import { Backspace, Banknote } from "reicon-react";

import type { PaymentMethodOption } from "./types";

interface CashPaymentModalProps {
  method: PaymentMethodOption;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess?: () => void;
}

const AMOUNT_DUE = 22.5;

const keypad = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "clear",
  "0",
  ".",
] as const;

const quickAmounts = [10, 20, 50, 100] as const;

export function CashPaymentModal({
  isOpen,
  method,
  onOpenChange,
  onPaymentSuccess,
}: CashPaymentModalProps) {
  const [cashReceived, setCashReceived] = useState("");

  const receivedAmount = Number(cashReceived) || 0;

  const changeDue = useMemo(
    () => Math.max(receivedAmount - AMOUNT_DUE, 0),
    [receivedAmount],
  );

  const balanceDue = useMemo(
    () => Math.max(AMOUNT_DUE - receivedAmount, 0),
    [receivedAmount],
  );

  const canComplete = receivedAmount >= AMOUNT_DUE;

  const handleKeypadPress = (value: (typeof keypad)[number]) => {
    if (value === "clear") {
      setCashReceived("");
      return;
    }

    if (value === "." && cashReceived.includes(".")) {
      return;
    }

    setCashReceived((current) => `${current}${value}`);
  };

  const handleBackspace = () => {
    setCashReceived((current) => current.slice(0, -1));
  };

  const handleExactAmount = () => {
    setCashReceived(AMOUNT_DUE.toFixed(2));
  };

  const handleComplete = () => {
    toast.success("Cash payment completed", {
      description: `Payment received: $${receivedAmount.toFixed(2)}`,
    });
    onPaymentSuccess?.();
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="cover">
        <Modal.Dialog aria-label={method.label}>
          <Modal.CloseTrigger />

          <Modal.Header>
            <div>
              <Modal.Heading>{method.label}</Modal.Heading>
              <p className="text-sm">Checkout · Order #15306</p>
            </div>
          </Modal.Header>

          <Modal.Body className="grid min-h-0 flex-1 p-0 lg:grid-cols-[22rem_1fr]">
            {/* Order summary */}
            <aside className="flex min-h-0 flex-col p-6">
              <div className="space-y-2">
                <SummaryRow label="Discounts" value="$0.00" />
                <SummaryRow label="Service fee" value="$0.00" />
                <SummaryRow label="Subtotal" value="$22.50" />
                <SummaryRow label="Surcharge" value="$0.00" />
                <SummaryRow label="Tax" value="$0.00" />
              </div>

              <div className="space-y-3">
                <SummaryRow label="Total" value={`$${AMOUNT_DUE.toFixed(2)}`} />

                <SummaryRow
                  label="Balance due"
                  value={`$${balanceDue.toFixed(2)}`}
                />
              </div>

              {receivedAmount > 0 && (
                <div className="mt-5 space-y-2">
                  <SummaryRow
                    label="Cash"
                    value={`$${receivedAmount.toFixed(2)}`}
                  />
                </div>
              )}
            </aside>

            {/* Cash tender */}
            <section className="flex min-h-0 flex-col p-6">
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-surface-secondary p-4 md:text-end">
                  <p className="text-sm">Amount due</p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                    ${AMOUNT_DUE.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-surface-secondary p-4 md:text-end">
                  <p className="text-sm">Change</p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                    ${changeDue.toFixed(2)}
                  </p>
                </div>
              </div>

              <TextField fullWidth name="cashReceived">
                <Label>Cash received</Label>

                <InputGroup fullWidth variant="secondary">
                  <InputGroup.Prefix>
                    <Banknote aria-hidden="true" className="size-5" />
                  </InputGroup.Prefix>

                  <InputGroup.Input
                    inputMode="decimal"
                    placeholder="0.00"
                    value={cashReceived}
                    onChange={(event) => setCashReceived(event.target.value)}
                  />
                </InputGroup>
              </TextField>

              <div className="mt-6 grid flex-1 gap-2.5 md:grid-cols-[1fr_9rem]">
                {/* Numeric keypad */}
                <div className="grid min-h-0 grid-cols-3 grid-rows-4 gap-2.5">
                  {keypad.map((key) => (
                    <Button
                      fullWidth
                      key={key}
                      className="h-full min-h-16 text-xl tabular-nums"
                      size="lg"
                      type="button"
                      variant="secondary"
                      onPress={() => handleKeypadPress(key)}
                    >
                      {key === "clear" ? "C" : key}
                    </Button>
                  ))}
                </div>

                {/* Quick amounts */}
                <div className="grid min-h-0 grid-cols-2 grid-rows-3 gap-2.5 md:grid-cols-1 md:grid-rows-6">
                  {quickAmounts.map((amount) => (
                    <Button
                      fullWidth
                      key={amount}
                      className="h-full min-h-14 text-base tabular-nums"
                      size="lg"
                      type="button"
                      variant="tertiary"
                      onPress={() => setCashReceived(amount.toFixed(2))}
                    >
                      ${amount}
                    </Button>
                  ))}

                  <Button
                    fullWidth
                    className="h-full min-h-14"
                    size="lg"
                    type="button"
                    variant="secondary"
                    onPress={handleExactAmount}
                  >
                    Exact
                  </Button>

                  <Button
                    isIconOnly
                    aria-label="Delete last digit"
                    className="h-full min-h-14 w-full"
                    size="lg"
                    type="button"
                    variant="danger-soft"
                    onPress={handleBackspace}
                  >
                    <Backspace aria-hidden="true" className="size-5" />
                  </Button>
                </div>
              </div>
            </section>
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
            <Button
              className="sm:flex-1"
              fullWidth
              isDisabled={!canComplete}
              size="lg"
              onPress={handleComplete}
            >
              Complete
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}
