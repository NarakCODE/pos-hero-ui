"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";
import {
  IconAlertTriangle,
  IconPrinter,
  IconReceipt,
  IconReceiptRefund,
  IconSend,
} from "@tabler/icons-react";
import { POSAside } from "@/components/shared/pos-aside";
import { formatKhr, formatUsd, type InvoiceRecord } from "./invoices-data";
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
  const [printFormat, setPrintFormat] = useState<"receipt" | "tax">("receipt");
  const [editingNotesFor, setEditingNotesFor] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<{
    invoiceId: string;
    value: string;
  } | null>(null);

  if (!selectedInvoice) {
    return (
      <POSAside
        ariaLabel="Invoice details"
        className="h-full"
        mainClassName="flex h-full items-center justify-center p-4 text-center text-sm text-muted"
      >
        <div className="flex flex-col items-center gap-2">
          <IconReceipt aria-hidden="true" size={28} />
          <p className="font-medium text-foreground">Select an invoice</p>
        </div>
      </POSAside>
    );
  }

  const invoice = selectedInvoice;
  const noteText =
    noteDraft?.invoiceId === invoice.id ? noteDraft.value : invoice.notes ?? "";
  const isEditingNotes = editingNotesFor === invoice.id;
  const isUnavailable = invoice.status === "refunded" || invoice.status === "voided";
  const statusColor: "success" | "danger" | "warning" | "default" =
    invoice.status === "paid"
      ? "success"
      : invoice.status === "voided"
        ? "danger"
        : invoice.status === "refunded"
          ? "default"
          : "warning";
  const orderType =
    invoice.orderType === "dineIn"
      ? invoice.tableNumber
      : invoice.orderType === "takeaway"
        ? "Takeaway"
        : `Delivery · ${invoice.channel}`;
  const itemCount = invoice.items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = () => {
    toast.success(`Printing ${invoice.receiptNumber}`);
    window.print();
  };

  const handleSaveNotes = () => {
    onUpdateInvoiceNotes?.(invoice.id, noteText);
    setEditingNotesFor(null);
    toast.success("Invoice note saved");
  };

  return (
    <POSAside
      ariaLabelledBy="invoices-aside-title"
      headerClassName="flex items-center justify-between gap-3 border-b border-border/80 p-[var(--pos-content-padding)]"
      mainClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-[var(--pos-content-padding)]"
      footerClassName="flex shrink-0 flex-col gap-2 border-t border-border/80 bg-surface p-[var(--pos-content-padding)]"
      header={
        <>
          <div className="min-w-0">
            <p className="text-xs text-muted">Invoice</p>
            <h2
              id="invoices-aside-title"
              className="truncate text-sm font-semibold text-foreground"
            >
              {invoice.receiptNumber}
            </h2>
          </div>
          <Chip color={statusColor} size="sm" variant="soft">
            {invoice.status}
          </Chip>
        </>
      }
      footer={
        <>
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="min-w-0"
              fullWidth
              size="sm"
              variant={printFormat === "receipt" ? "secondary" : "outline"}
              onPress={() => setPrintFormat("receipt")}
            >
              Receipt
            </Button>
            <Button
              className="min-w-0"
              fullWidth
              size="sm"
              variant={printFormat === "tax" ? "secondary" : "outline"}
              onPress={() => setPrintFormat("tax")}
            >
              Tax invoice
            </Button>
          </div>
          <Button fullWidth size="md" variant="primary" onPress={handlePrint}>
            <IconPrinter aria-hidden="true" size={18} />
            <span>Print {printFormat === "receipt" ? "receipt" : "tax invoice"}</span>
          </Button>
          <div className="grid grid-cols-3 gap-2">
            <Button
              className="min-w-0"
              fullWidth
              size="sm"
              variant="outline"
              isDisabled={isUnavailable}
              onPress={onOpenRefundModal}
            >
              <IconReceiptRefund aria-hidden="true" size={15} />
              Refund
            </Button>
            <Button
              className="min-w-0"
              fullWidth
              size="sm"
              variant="danger"
              isDisabled={isUnavailable}
              onPress={onOpenVoidModal}
            >
              <IconAlertTriangle aria-hidden="true" size={15} />
              Void
            </Button>
            <Button
              className="min-w-0"
              fullWidth
              size="sm"
              variant="outline"
              onPress={onOpenSendModal}
            >
              <IconSend aria-hidden="true" size={15} />
              Send
            </Button>
          </div>
        </>
      }
    >
      <Card variant="default">
        <Card.Content>
          <p className="text-xs text-muted">Total</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {formatUsd(invoice.totalUsd)}
          </p>
          <p className="text-xs tabular-nums text-muted">
            {formatKhr(invoice.totalKhr)}
          </p>
        </Card.Content>
      </Card>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-4 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted">Customer</dt>
          <dd className="truncate font-medium text-foreground">
            {invoice.customer.name || "Walk-in"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">Order</dt>
          <dd className="truncate font-medium text-foreground">{orderType}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">Date</dt>
          <dd className="truncate text-foreground">{invoice.date}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">Payment</dt>
          <dd className="truncate text-foreground">{invoice.tenderLabel}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">Items</dt>
          <dd className="text-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-muted">Time</dt>
          <dd className="text-foreground">{invoice.time}</dd>
        </div>
      </dl>

      <section className="border-t border-border/80 pt-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground">Cashier note</h3>
          {!isEditingNotes ? (
            <Button
              size="sm"
              variant="ghost"
              onPress={() => {
                setNoteDraft({ invoiceId: invoice.id, value: invoice.notes ?? "" });
                setEditingNotesFor(invoice.id);
              }}
            >
              {invoice.notes ? "Edit" : "Add"}
            </Button>
          ) : null}
        </div>
        {isEditingNotes ? (
          <div className="flex flex-col gap-2">
            <TextField
              fullWidth
              aria-label="Cashier note"
              value={noteText}
              onChange={(value) =>
                setNoteDraft({ invoiceId: invoice.id, value })
              }
            >
              <Label>Note</Label>
              <Input placeholder="Add a short note" variant="secondary" />
            </TextField>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onPress={() => {
                  setEditingNotesFor(null);
                  setNoteDraft(null);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" variant="primary" onPress={handleSaveNotes}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="line-clamp-2 text-sm text-muted">
            {invoice.notes || "No note added."}
          </p>
        )}
      </section>

      <div className="hidden print:block">
        {printFormat === "receipt" ? (
          <ReceiptThermalView invoice={invoice} />
        ) : (
          <TaxInvoiceView invoice={invoice} />
        )}
      </div>
    </POSAside>
  );
}
