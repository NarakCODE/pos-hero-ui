"use client";

import { useState } from "react";
import {
  Button,
  Chip,
  Input,
  Tabs,
  TextField,
  toast,
} from "@heroui/react";
import {
  IconAlertTriangle,
  IconCopy,
  IconFileInvoice,
  IconPrinter,
  IconReceipt,
  IconReceiptRefund,
  IconSend,
} from "@tabler/icons-react";
import { POSAside } from "@/components/shared/pos-aside";
import {
  formatUsd,
  type InvoiceRecord,
} from "./invoices-data";
import { ReceiptThermalView } from "./receipt-thermal-view";
import { TaxInvoiceView } from "./tax-invoice-view";

interface InvoicesAsideProps {
  selectedInvoice: InvoiceRecord | null;
  onUpdateInvoiceNotes?: (invoiceId: string, notes: string) => void;
  onOpenRefundModal?: () => void;
  onOpenVoidModal?: () => void;
  onOpenSendModal?: () => void;
}

export function InvoicesAside({
  selectedInvoice,
  onUpdateInvoiceNotes,
  onOpenRefundModal,
  onOpenVoidModal,
  onOpenSendModal,
}: InvoicesAsideProps) {
  const [viewFormat, setViewFormat] = useState<"thermal" | "tax">("thermal");
  const [notes, setNotes] = useState(selectedInvoice?.notes ?? "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  if (!selectedInvoice) {
    return (
      <POSAside
        ariaLabel="Receipt inspection aside"
        className="h-full"
        mainClassName="flex h-full items-center justify-center p-6 text-center text-sm text-muted"
      >
        <div className="flex flex-col items-center gap-2">
          <IconReceipt size={32} className="text-muted/60" />
          <p className="font-semibold text-foreground">No Invoice Selected</p>
          <p className="text-xs">
            Select an invoice from the listing to review and manage.
          </p>
        </div>
      </POSAside>
    );
  }

  const isPaid = selectedInvoice.status === "paid";
  const isRefunded = selectedInvoice.status === "refunded";
  const isVoided = selectedInvoice.status === "voided";

  const handlePrint = () => {
    toast.success(`Printing ${selectedInvoice.receiptNumber}`, {
      description: "Dispatching to 80mm thermal receipt printer...",
    });
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(selectedInvoice.receiptNumber);
    toast.info("Copied Receipt Number", {
      description: selectedInvoice.receiptNumber,
    });
  };

  const handleSaveNotes = () => {
    if (onUpdateInvoiceNotes) {
      onUpdateInvoiceNotes(selectedInvoice.id, notes);
    }
    setIsEditingNotes(false);
    toast.success("Invoice remarks updated");
  };

  const statusColor: "success" | "danger" | "warning" | "default" = isPaid
    ? "success"
    : isVoided
      ? "danger"
      : isRefunded
        ? "default"
        : "warning";

  return (
    <POSAside
      ariaLabelledBy="invoices-aside-title"
      headerClassName="p-[var(--pos-content-padding)] border-b border-border/80"
      mainClassName="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-[var(--pos-content-padding)]"
      footerClassName="p-[var(--pos-content-padding)] border-t border-border/80 bg-surface space-y-2 shrink-0"
      header={
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-muted uppercase">
                Receipt Inspector
              </p>
              <h2
                id="invoices-aside-title"
                className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5"
              >
                <span>{selectedInvoice.receiptNumber}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy receipt number"
                  className="rounded p-1 text-muted hover:bg-surface-secondary hover:text-foreground"
                >
                  <IconCopy size={14} />
                </button>
              </h2>
            </div>

            <Chip color={statusColor} size="sm" variant="soft">
              {selectedInvoice.status}
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-surface-secondary/70 p-2">
              <span className="text-[10px] text-muted block">Order & Table</span>
              <span className="font-semibold text-foreground">
                {selectedInvoice.orderCode} • {selectedInvoice.tableNumber}
              </span>
            </div>
            <div className="rounded-lg bg-surface-secondary/70 p-2">
              <span className="text-[10px] text-muted block">Total Amount</span>
              <span className="font-bold text-accent">
                {formatUsd(selectedInvoice.totalUsd)}
              </span>
            </div>
          </div>

          {/* View Format Selector Tabs */}
          <Tabs
            selectedKey={viewFormat}
            variant="secondary"
            onSelectionChange={(key) => setViewFormat(key as "thermal" | "tax")}
            className="w-full"
          >
            <Tabs.ListContainer className="w-full">
              <Tabs.List aria-label="Receipt format" className="w-full grid grid-cols-2">
                <Tabs.Tab id="thermal">
                  <IconReceipt size={16} />
                  <span>Thermal Slip (80mm)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="tax">
                  <IconFileInvoice size={16} />
                  <span>Tax Invoice (VAT)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>
      }
      footer={
        <div className="flex flex-col gap-2">
          {/* Primary Action: Print Receipt */}
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onPress={handlePrint}
          >
            <IconPrinter size={20} />
            <span>Print Receipt Slip ({formatUsd(selectedInvoice.totalUsd)})</span>
          </Button>

          {/* Secondary Management Quick Actions */}
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              size="sm"
              variant="outline"
              isDisabled={isRefunded || isVoided}
              onPress={onOpenRefundModal}
            >
              <IconReceiptRefund size={16} className="text-purple-500" />
              <span>Refund</span>
            </Button>

            <Button
              size="sm"
              variant="danger"
              isDisabled={isRefunded || isVoided}
              onPress={onOpenVoidModal}
            >
              <IconAlertTriangle size={16} />
              <span>Void</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onPress={onOpenSendModal}
            >
              <IconSend size={16} className="text-accent" />
              <span>Send E-Slip</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Render Format: Thermal or Official Tax Invoice */}
        {viewFormat === "thermal" ? (
          <ReceiptThermalView invoice={selectedInvoice} />
        ) : (
          <TaxInvoiceView invoice={selectedInvoice} />
        )}

        {/* Audit Remarks Section */}
        <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">
              Cashier Audit Remarks
            </span>
            {!isEditingNotes ? (
              <button
                type="button"
                onClick={() => {
                  setNotes(selectedInvoice.notes ?? "");
                  setIsEditingNotes(true);
                }}
                className="text-[11px] font-medium text-accent hover:underline"
              >
                Edit Note
              </button>
            ) : null}
          </div>

          {isEditingNotes ? (
            <div className="mt-2 flex flex-col gap-2">
              <TextField
                fullWidth
                aria-label="Edit notes"
                value={notes}
                onChange={setNotes}
              >
                <Input
                  placeholder="Enter audit note for reconciliation..."
                  variant="secondary"
                />
              </TextField>
              <div className="flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setIsEditingNotes(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onPress={handleSaveNotes}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-muted leading-relaxed">
              {selectedInvoice.notes || "No remarks noted on this invoice."}
            </p>
          )}
        </div>
      </div>
    </POSAside>
  );
}
