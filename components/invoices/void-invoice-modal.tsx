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
  IconAlertTriangle,
  IconLock,
  IconX,
} from "@tabler/icons-react";
import {
  formatUsd,
  type InvoiceRecord,
  type VoidDetails,
} from "./invoices-data";

interface VoidInvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
  onVoidConfirm: (invoiceId: string, details: VoidDetails) => void;
}

const VOID_REASONS = [
  "Accidental Double Entry on Register",
  "Cashier Test / Training Transaction",
  "Customer Walked Out Without Paying",
  "System Glitch / Duplicate Print",
  "Customer Changed Entire Order",
];

export function VoidInvoiceModal({
  isOpen,
  onOpenChange,
  invoice,
  onVoidConfirm,
}: VoidInvoiceModalProps) {
  const [pin, setPin] = useState("");
  const [selectedReason, setSelectedReason] = useState(VOID_REASONS[0]);
  const [customReason, setCustomReason] = useState("");
  const [pinError, setPinError] = useState("");

  if (!invoice) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check 4-digit supervisor PIN
    if (pin.length !== 4) {
      setPinError("Supervisor authorization PIN must be 4 digits");
      return;
    }

    setPinError("");

    const details: VoidDetails = {
      voidedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      voidedBy: invoice.cashierName,
      supervisorPin: pin,
      reason:
        selectedReason === "Other" && customReason.trim()
          ? customReason.trim()
          : selectedReason,
    };

    onVoidConfirm(invoice.id, details);

    toast.warning(`Invoice ${invoice.invoiceNumber} voided`, {
      description: `Authorized by supervisor PIN • Order ${invoice.orderCode}`,
    });

    setPin("");
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-danger/15 text-danger">
                <IconAlertTriangle size={20} />
              </div>
              <div>
                <Modal.Heading>
                  Void Invoice — {invoice.invoiceNumber}
                </Modal.Heading>
                <p className="text-xs text-muted">
                  Requires supervisor authorization PIN
                </p>
              </div>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-danger text-xs">
              <p className="font-semibold leading-snug">
                Warning: Voiding cancels this invoice permanently
              </p>
              <p className="mt-1 text-[11px] leading-tight text-danger/80">
                Amount {formatUsd(invoice.totalUsd)} will be subtracted from
                station {invoice.registerId} sales report.
              </p>
            </div>

            {/* Supervisor PIN Input */}
            <TextField
              fullWidth
              aria-label="Supervisor PIN"
              value={pin}
              onChange={(val) => {
                setPin(val.slice(0, 4));
                if (pinError) setPinError("");
              }}
            >
              <Label>
                <span className="flex items-center gap-1">
                  <IconLock size={14} className="text-accent" />
                  <span>Enter 4-Digit Supervisor PIN (e.g. 1234)</span>
                </span>
              </Label>
              <Input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                variant="secondary"
              />
              {pinError && (
                <p className="text-xs font-medium text-danger">{pinError}</p>
              )}
            </TextField>

            {/* Void Reason Selector */}
            <div className="space-y-1.5">
              <Label>Reason for Voiding</Label>
              <div className="space-y-1.5">
                {VOID_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-start text-xs transition-colors ${
                      selectedReason === reason
                        ? "border-danger bg-danger/10 font-semibold text-danger"
                        : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                    }`}
                  >
                    <span>{reason}</span>
                    {selectedReason === reason && (
                      <span className="size-2 rounded-full bg-danger" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedReason === "Other" && (
              <TextField
                fullWidth
                aria-label="Custom void reason"
                value={customReason}
                onChange={setCustomReason}
              >
                <Label>Specify Reason</Label>
                <Input
                  placeholder="Explain why invoice is being voided..."
                  variant="secondary"
                />
              </TextField>
            )}
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
              variant="danger"
              size="md"
              onPress={() => handleSubmit()}
            >
              <IconX size={16} />
              <span>Confirm Void Invoice</span>
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
