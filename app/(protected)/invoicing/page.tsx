"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { POSLayout } from "@/components/shared/pos-layout";
import {
  InvoicesAside,
  InvoicesDataGrid,
  RefundInvoiceModal,
  VoidInvoiceModal,
  SendReceiptModal,
  initialInvoiceRecords,
  type InvoiceRecord,
  type RefundDetails,
  type VoidDetails,
} from "@/components/invoices";

export default function InvoicingPage() {
  const t = useTranslations("InvoicingPage");
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(
    initialInvoiceRecords,
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    initialInvoiceRecords[0]?.id ?? null,
  );

  // Modal states
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const selectedInvoice = useMemo(
    () =>
      invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
      invoices[0] ??
      null,
    [invoices, selectedInvoiceId],
  );

  const handleUpdateNotes = (invoiceId: string, notes: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, notes } : inv)),
    );
  };

  const handleRefundConfirm = (invoiceId: string, details: RefundDetails) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: "refunded",
              refundDetails: details,
            }
          : inv,
      ),
    );
  };

  const handleVoidConfirm = (invoiceId: string, details: VoidDetails) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: "voided",
              voidDetails: details,
            }
          : inv,
      ),
    );
  };

  const handleBatchPrint = () => {
    window.print();
  };

  const handleBatchSettle = (invoiceIds: string[]) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        invoiceIds.includes(inv.id) && inv.status === "pending"
          ? { ...inv, status: "paid" }
          : inv,
      ),
    );
  };

  return (
    <>
      <POSLayout
        showSearch={false}
        headerTitle={t("title")}
        rightPanelLabel="Receipt Inspector"
        rightPanelWidth="38%"
        rightPanel={
          <InvoicesAside
            selectedInvoice={selectedInvoice}
            onUpdateInvoiceNotes={handleUpdateNotes}
            onOpenRefundModal={() => setIsRefundModalOpen(true)}
            onOpenVoidModal={() => setIsVoidModalOpen(true)}
            onOpenSendModal={() => setIsSendModalOpen(true)}
          />
        }
      >
        <InvoicesDataGrid
          invoices={invoices}
          selectedInvoiceId={selectedInvoiceId}
          onInvoiceSelect={setSelectedInvoiceId}
          onBatchPrint={handleBatchPrint}
          onBatchSettle={handleBatchSettle}
          onQuickRefund={(inv) => {
            setSelectedInvoiceId(inv.id);
            setIsRefundModalOpen(true);
          }}
          onQuickVoid={(inv) => {
            setSelectedInvoiceId(inv.id);
            setIsVoidModalOpen(true);
          }}
        />
      </POSLayout>

      {/* Cashier Operation Modals */}
      <RefundInvoiceModal
        isOpen={isRefundModalOpen}
        onOpenChange={setIsRefundModalOpen}
        invoice={selectedInvoice}
        onRefundConfirm={handleRefundConfirm}
      />

      <VoidInvoiceModal
        isOpen={isVoidModalOpen}
        onOpenChange={setIsVoidModalOpen}
        invoice={selectedInvoice}
        onVoidConfirm={handleVoidConfirm}
      />

      <SendReceiptModal
        isOpen={isSendModalOpen}
        onOpenChange={setIsSendModalOpen}
        invoice={selectedInvoice}
      />
    </>
  );
}
