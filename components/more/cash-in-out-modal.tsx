"use client";

import { useState } from "react";
import {
  Button,
  InputGroup,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCash,
} from "@tabler/icons-react";

interface CashInOutModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: (type: "in" | "out", amount: number, reason: string) => void;
}

const QUICK_REASONS = {
  in: ["Add Float", "Change Fund", "Owner Deposit", "Bank Withdrawal"],
  out: ["Buy Ice / Milk", "Store Supplies", "Emergency Expense", "Safe Drop"],
};

export function CashInOutModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: CashInOutModalProps) {
  const [transactionType, setTransactionType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.danger("Please enter a valid amount");
      return;
    }

    const selectedReason = reason.trim() || (transactionType === "in" ? "Cash In (Float)" : "Cash Out (Expense)");
    
    if (transactionType === "in") {
      toast.success(`Cash In recorded: +$${numAmount.toFixed(2)}`, {
        description: `Reason: ${selectedReason}`,
      });
    } else {
      toast.warning(`Cash Out recorded: -$${numAmount.toFixed(2)}`, {
        description: `Reason: ${selectedReason}`,
      });
    }

    if (onSuccess) {
      onSuccess(transactionType, numAmount, selectedReason);
    }

    setAmount("");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <IconCash size={20} />
              </div>
              <div className="flex flex-col">
                <Modal.Heading>
                  Cash In / Cash Out
                </Modal.Heading>
                <p className="text-xs text-muted">
                  Record drawer adjustments & petty cash
                </p>
              </div>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-secondary p-1">
              <Button
                size="sm"
                variant={transactionType === "in" ? "primary" : "ghost"}
                onPress={() => setTransactionType("in")}
              >
                <IconArrowDownLeft size={16} />
                <span>Cash In (Deposit)</span>
              </Button>
              <Button
                size="sm"
                variant={transactionType === "out" ? "primary" : "ghost"}
                onPress={() => setTransactionType("out")}
              >
                <IconArrowUpRight size={16} />
                <span>Cash Out (Payout)</span>
              </Button>
            </div>

            {/* Amount Input */}
            <TextField
              aria-label="Amount"
              value={amount}
              onChange={setAmount}
              fullWidth
            >
              <Label>
                Amount ($ USD)
              </Label>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  $
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  autoFocus
                />
              </InputGroup>
            </TextField>

            {/* Quick Reason Suggestions */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">
                Quick reason:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REASONS[transactionType].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReason(item)}
                    className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                      reason === item
                        ? "border-accent bg-accent/15 font-medium text-accent"
                        : "border-border bg-surface-secondary/50 text-muted hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Input */}
            <TextField
              aria-label="Reason or notes"
              value={reason}
              onChange={setReason}
              fullWidth
            >
              <Label>
                Reason / Note
              </Label>
              <InputGroup variant="secondary">
                <InputGroup.Input
                  placeholder="e.g. Bought fresh milk, Added morning float..."
                />
              </InputGroup>
            </TextField>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline"
              size="md"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant={transactionType === "in" ? "primary" : "danger"}
              size="md"
              onPress={() => handleSubmit()}
            >
              {transactionType === "in" ? "Confirm Cash In" : "Confirm Cash Out"}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
