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
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconMail,
  IconMessage2,
  IconSend,
} from "@tabler/icons-react";
import { formatUsd, type InvoiceRecord } from "./invoices-data";

interface SendReceiptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
}

type ChannelOption = "telegram" | "whatsapp" | "sms" | "email";

export function SendReceiptModal({
  isOpen,
  onOpenChange,
  invoice,
}: SendReceiptModalProps) {
  const [channel, setChannel] = useState<ChannelOption>("telegram");
  const [recipient, setRecipient] = useState(
    invoice?.customer.phone || invoice?.customer.email || "",
  );
  const [includeVat, setIncludeVat] = useState(true);

  if (!invoice) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!recipient.trim()) {
      toast.danger("Please provide phone number or email");
      return;
    }

    const channelNames: Record<ChannelOption, string> = {
      telegram: "Telegram",
      whatsapp: "WhatsApp",
      sms: "SMS",
      email: "Email",
    };

    toast.success(`E-Receipt sent via ${channelNames[channel]}`, {
      description: `Dispatched to ${recipient} • ${formatUsd(invoice.totalUsd)}`,
    });

    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <IconSend size={20} />
              </div>
              <div>
                <Modal.Heading>
                  Send Digital E-Receipt
                </Modal.Heading>
                <p className="text-xs text-muted">
                  Invoice {invoice.receiptNumber} ({formatUsd(invoice.totalUsd)})
                </p>
              </div>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            {/* Channel Selection */}
            <div className="space-y-1.5">
              <Label>Delivery Channel</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setChannel("telegram");
                    if (!recipient && invoice.customer.phone)
                      setRecipient(invoice.customer.phone);
                  }}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-start text-xs transition-colors ${
                    channel === "telegram"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <IconBrandTelegram size={18} className="text-blue-500" />
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChannel("whatsapp");
                    if (!recipient && invoice.customer.phone)
                      setRecipient(invoice.customer.phone);
                  }}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-start text-xs transition-colors ${
                    channel === "whatsapp"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <IconBrandWhatsapp size={18} className="text-emerald-500" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChannel("sms");
                    if (!recipient && invoice.customer.phone)
                      setRecipient(invoice.customer.phone);
                  }}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-start text-xs transition-colors ${
                    channel === "sms"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <IconMessage2 size={18} className="text-amber-500" />
                  <span>SMS</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setChannel("email");
                    if (invoice.customer.email)
                      setRecipient(invoice.customer.email);
                  }}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-start text-xs transition-colors ${
                    channel === "email"
                      ? "border-accent bg-accent/10 font-semibold text-accent"
                      : "border-border bg-surface-secondary/40 text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  <IconMail size={18} className="text-purple-500" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Recipient Input */}
            <TextField
              fullWidth
              aria-label="Recipient Contact"
              value={recipient}
              onChange={setRecipient}
            >
              <Label>
                {channel === "email"
                  ? "Customer Email Address"
                  : "Customer Mobile Number"}
              </Label>
              <Input
                placeholder={
                  channel === "email"
                    ? "customer@domain.com"
                    : "+855 12 345 678"
                }
                variant="secondary"
              />
            </TextField>

            {/* VAT Invoice Attachment Option */}
            <div className="flex items-center justify-between rounded-xl bg-surface-secondary/70 p-3 text-xs">
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  Attach Official Tax Invoice
                </span>
                <span className="text-[11px] text-muted">
                  Includes GDT Tax Invoice PDF with VAT TIN
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
                className="size-4 rounded border-border text-accent focus:ring-accent"
              />
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
              onPress={() => handleSend()}
            >
              <IconSend size={16} />
              <span>Send E-Receipt</span>
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
