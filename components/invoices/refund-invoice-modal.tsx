"use client";

import { useState } from "react";
import { Button, Input, Label, Modal, TextField, toast } from "@heroui/react";
import { IconReceiptRefund } from "@tabler/icons-react";
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

export function RefundInvoiceModal({
  isOpen,
  onOpenChange,
  invoice,
  onRefundConfirm,
}: RefundInvoiceModalProps) {
  const [amount, setAmount] = useState<string | null>(null);
  const [reason, setReason] = useState("Customer request");
  const [refundMethod, setRefundMethod] = useState<"original" | "cash">(
    "original",
  );

  if (!invoice) return null;

  const amountValue = amount ?? invoice.totalUsd.toFixed(2);
  const refundAmount = Number(amountValue);
  const methodLabel =
    refundMethod === "original"
      ? `Original Tender (${invoice.tenderLabel})`
      : "Cash from Drawer";

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAmount(null);
      setReason("Customer request");
      setRefundMethod("original");
    }
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0 ||
      refundAmount > invoice.totalUsd
    ) {
      toast.danger("Enter a valid refund amount", {
        description: `Use an amount between $0.01 and ${formatUsd(invoice.totalUsd)}.`,
      });
      return;
    }

    const details: RefundDetails = {
      refundedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      refundedBy: invoice.cashierName,
      reason: reason.trim() || "Customer request",
      amountUsd: refundAmount,
      refundMethod: methodLabel,
    };

    onRefundConfirm(invoice.id, details);
    toast.success(`Refund issued for ${invoice.receiptNumber}`, {
      description: `${formatUsd(refundAmount)} · ${methodLabel}`,
    });
    handleOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div>
              <Modal.Heading>Issue refund</Modal.Heading>
              <p className="text-sm text-muted">
                {invoice.receiptNumber} · {formatUsd(invoice.totalUsd)}
              </p>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
              <TextField
                fullWidth
                aria-label="Refund amount"
                value={amountValue}
                onChange={setAmount}
              >
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  min="0.01"
                  max={invoice.totalUsd}
                  step="0.01"
                  variant="secondary"
                />
              </TextField>

              <TextField
                fullWidth
                aria-label="Refund reason"
                value={reason}
                onChange={setReason}
              >
                <Label>Reason</Label>
                <Input placeholder="Customer request" variant="secondary" />
              </TextField>

              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Refund to
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={refundMethod === "original" ? "secondary" : "outline"}
                    onPress={() => setRefundMethod("original")}
                  >
                    Original tender
                  </Button>
                  <Button
                    size="sm"
                    variant={refundMethod === "cash" ? "secondary" : "outline"}
                    onPress={() => setRefundMethod("cash")}
                  >
                    Cash
                  </Button>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline"
              onPress={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onPress={handleSubmit}>
              <IconReceiptRefund aria-hidden="true" size={16} />
              Refund {formatUsd(Number.isFinite(refundAmount) ? refundAmount : 0)}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
