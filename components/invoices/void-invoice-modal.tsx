"use client";

import { useState } from "react";
import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import { IconAlertTriangle } from "@tabler/icons-react";
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

export function VoidInvoiceModal({
  isOpen,
  onOpenChange,
  invoice,
  onVoidConfirm,
}: VoidInvoiceModalProps) {
  const [pin, setPin] = useState("");
  const [reason, setReason] = useState("");
  const [pinError, setPinError] = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (!invoice) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPin("");
      setReason("");
      setPinError("");
      setReasonError(false);
    }
    onOpenChange(open);
  };

  const handleSubmit = () => {
    if (!/^\d{4}$/.test(pin)) {
      setPinError("Enter the 4-digit supervisor PIN.");
      return;
    }
    if (!reason.trim()) {
      setReasonError(true);
      return;
    }

    const details: VoidDetails = {
      voidedAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      voidedBy: invoice.cashierName,
      supervisorPin: pin,
      reason: reason.trim(),
    };

    onVoidConfirm(invoice.id, details);
    toast.warning(`Invoice ${invoice.invoiceNumber} voided`);
    handleOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div>
              <Modal.Heading>Void invoice?</Modal.Heading>
              <p className="text-sm text-muted">
                {invoice.invoiceNumber} · {formatUsd(invoice.totalUsd)}
              </p>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted">
                This action cannot be undone. Enter a supervisor PIN and reason
                to continue.
              </p>

              <TextField
                fullWidth
                aria-label="Supervisor PIN"
                isInvalid={Boolean(pinError)}
                value={pin}
                onChange={(value) => {
                  setPin(value.replace(/\D/g, "").slice(0, 4));
                  setPinError("");
                }}
              >
                <Label>Supervisor PIN</Label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  autoFocus
                  placeholder="4 digits"
                  variant="secondary"
                />
                {pinError ? <FieldError>{pinError}</FieldError> : null}
              </TextField>

              <TextField
                fullWidth
                aria-label="Void reason"
                isInvalid={reasonError}
                value={reason}
                onChange={(value) => {
                  setReason(value);
                  setReasonError(false);
                }}
              >
                <Label>Reason</Label>
                <Input placeholder="e.g. Duplicate transaction" variant="secondary" />
                {reasonError ? (
                  <FieldError>Enter a reason to continue.</FieldError>
                ) : null}
              </TextField>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" onPress={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="danger" onPress={handleSubmit}>
              <IconAlertTriangle aria-hidden="true" size={16} />
              Void invoice
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
