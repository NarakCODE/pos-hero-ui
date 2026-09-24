"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  IconAlertCircle,
  IconArrowBackUp,
  IconReceiptRefund,
} from "@tabler/icons-react";
import {
  formatUsd,
  type InvoiceRecord,
  type RefundDetails,
} from "./invoices-data";

interface RefundInvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
  onRefundConfirm: (invoiceId: string, details: RefundDetails) => void;
}

const REFUND_REASONS = [
  "Customer Changed Mind / Cancelled",
  "Incorrect Modifier or Sugar Level",
  "Quality / Taste Complaint",
  "Spilled or Damaged by Counter Staff",
  "Accidental Double Billed",
  "Other Reason",
];

export function RefundInvoiceModal({
  isOpen,
  onOpenChange,
  invoice,
  onRefundConfirm,
}: RefundInvoiceModalProps) {
  const [selectedReason, setSelectedReason] = useState(REFUND_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<"original" | "cash">("original");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [customAmount, setCustomAmount] = useState("");
  const [notes, setNotes] = useState("");

  if (!invoice) return null;

  const refundAmount =
    refundType === "full"
      ? invoice.totalUsd
      : parseFloat(customAmount) || invoice.totalUsd;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (refundType === "partial") {
      const parsed = parseFloat(customAmount);
      if (isNaN(parsed) || parsed <= 0 || parsed > invoice.totalUsd) {
        toast.danger("Invalid partial refund amount", {
          description: `Must be between $0.01 and ${formatUsd(invoice.totalUsd)}`,
        });
        return;
      }
    }

    const finalReason =
      selectedReason === "Other Reason" && customReason.trim()
        ? customReason.trim()
        : selectedReason;

    const details: RefundDetails = {
      refundedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      refundedBy: invoice.cashierName,
      reason: finalReason,
      amountUsd: refundAmount,
      refundMethod:
        refundMethod === "original"
          ? `Original Tender (${invoice.tenderLabel})`
          : "Cash from Drawer",
      notes: notes.trim() || undefined,
    };

    onRefundConfirm(invoice.id, details);

    toast.success(`Refund issued for ${invoice.receiptNumber}`, {
      description: `Amount: ${formatUsd(refundAmount)} • ${details.refundMethod}`,
    });

    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="md">
        <Modal.Dialog>
          <Modal.Header>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <IconReceiptRefund size={20} />
              </div>
              <div>
                <Modal.Heading>
                  Issue Refund — {invoice.receiptNumber}
                </Modal.Heading>
                <p className="text-xs text-muted">
                  Order {invoice.orderCode} • Total: {formatUsd(invoice.totalUsd)}
                </p>
              </div>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            {/* Refund Type Selector */}
            <div className="space-y-1.5">
              <Label>Refund Scope</Label>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-secondary p-1">
                <Button
                  size="sm"
                  variant={refundType === "full" ? "primary" : "ghost"}
                  onPress={() => setRefundType("full")}
                >
                  <IconArrowBackUp size={16} />
                  <span>Full ({formatUsd(invoice.totalUsd)})</span>
                </Button>
                <Button
                  size="sm"
                  variant={refundType === "partial" ? "primary" : "ghost"}
                  onPress={() => {
                    setRefundType("partial");
                    if (!customAmount) setCustomAmount((invoice.totalUsd / 2).toFixed(2));
                  }}
                >
                  <span>Partial Amount</span>
                </Button>
              </div>
            </div>

            {/* Custom Amount for Partial */}
            {refundType === "partial" && (
              <TextField
                fullWidth
                aria-label="Partial Refund Amount"
                value={customAmount}
                onChange={setCustomAmount}
              >
                <Label>Custom Refund Amount ($ USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  max={invoice.totalUsd}
                  placeholder={`Max: ${invoice.totalUsd.toFixed(2)}`}
                  variant="secondary"
                />
              </TextField>
            )}

            {/* Refund Reason Selection */}
            <div className="space-y-1.5">
              <Label>Reason for Refund</Label>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto overscroll-contain pr-1">
                {REFUND_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-start text-xs transition-colors ${
                      selectedReason === reason
                        ? "border-accent bg-accent/10 font-semibold text-accent"
                        : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                    }`}
                  >
                    <span>{reason}</span>
                    {selectedReason === reason && (
                      <span className="size-2 rounded-full bg-accent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedReason === "Other Reason" && (
              <TextField
                fullWidth
                aria-label="Specify reason"
                value={customReason}
                onChange={setCustomReason}
              >
                <Label>Specify details</Label>
                <Input
                  placeholder="Explain why this refund is needed..."
                  variant="secondary"
                />
              </TextField>
            )}

            {/* Refund Payout Method */}
            <div className="space-y-1.5">
              <Label>Refund Payment Channel</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefundMethod("original")}
                  className={`flex flex-col items-start rounded-xl border p-2.5 text-xs transition-colors ${
                    refundMethod === "original"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <span>Original Tender</span>
                  <span className="text-[10px] text-muted">
                    {invoice.tenderLabel}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRefundMethod("cash")}
                  className={`flex flex-col items-start rounded-xl border p-2.5 text-xs transition-colors ${
                    refundMethod === "cash"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <span>Cash Drawer Payout</span>
                  <span className="text-[10px] text-muted">From drawer float</span>
                </button>
              </div>
            </div>

            {/* Optional Notes */}
            <TextField
              fullWidth
              aria-label="Cashier Remarks"
              value={notes}
              onChange={setNotes}
            >
              <Label>Cashier Remarks (Optional)</Label>
              <Input
                placeholder="Additional audit notes..."
                variant="secondary"
              />
            </TextField>

            <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 p-2.5 text-purple-900 dark:text-purple-200 text-xs">
              <IconAlertCircle size={16} className="shrink-0" />
              <p className="leading-tight">
                Refunding will log this transaction under cashier{" "}
                <span className="font-semibold">{invoice.cashierName}</span> and
                update the shift balance.
              </p>
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
              variant="primary"
              size="md"
              onPress={() => handleSubmit()}
            >
              Confirm Refund ({formatUsd(refundAmount)})
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
