"use client";

import { useState } from "react";
import type { Key } from "@heroui/react";
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  toast,
} from "@heroui/react";
import { IconSend } from "@tabler/icons-react";
import { formatUsd, type InvoiceRecord } from "./invoices-data";

interface SendReceiptModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceRecord | null;
}

type ChannelOption = "telegram" | "whatsapp" | "sms" | "email";

const channelOptions: { id: ChannelOption; label: string }[] = [
  { id: "telegram", label: "Telegram" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
];

export function SendReceiptModal({
  isOpen,
  onOpenChange,
  invoice,
}: SendReceiptModalProps) {
  const [channel, setChannel] = useState<ChannelOption>("telegram");
  const [recipient, setRecipient] = useState(
    invoice?.customer.phone || invoice?.customer.email || "",
  );

  if (!invoice) return null;

  const handleChannelChange = (value: Key | Key[] | null) => {
    const key = Array.isArray(value) ? value[0] : value;
    const option = channelOptions.find((candidate) => candidate.id === key);
    if (!option) return;

    setChannel(option.id);
    setRecipient(
      option.id === "email"
        ? invoice.customer.email ?? ""
        : invoice.customer.phone ?? "",
    );
  };

  const handleSend = () => {
    const destination = recipient.trim();
    if (!destination) {
      toast.danger("Enter a recipient.");
      return;
    }
    if (channel === "email" && !/^\S+@\S+\.\S+$/.test(destination)) {
      toast.danger("Enter a valid email address.");
      return;
    }

    const channelName = channelOptions.find((option) => option.id === channel)?.label;
    toast.success(`Receipt sent via ${channelName}`, {
      description: `${destination} · ${formatUsd(invoice.totalUsd)}`,
    });
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog>
          <Modal.Header>
            <div>
              <Modal.Heading>Send receipt</Modal.Heading>
              <p className="text-sm text-muted">
                {invoice.receiptNumber} · {formatUsd(invoice.totalUsd)}
              </p>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
              <Select
                aria-label="Delivery method"
                fullWidth
                value={channel}
                variant="secondary"
                onChange={handleChannelChange}
              >
                <Label>Delivery method</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {channelOptions.map((option) => (
                      <ListBox.Item
                        key={option.id}
                        id={option.id}
                        textValue={option.label}
                      >
                        {option.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField
                fullWidth
                aria-label="Recipient"
                value={recipient}
                onChange={setRecipient}
              >
                <Label>{channel === "email" ? "Email address" : "Phone number"}</Label>
                <Input
                  type={channel === "email" ? "email" : "tel"}
                  autoComplete={channel === "email" ? "email" : "tel"}
                  placeholder={
                    channel === "email" ? "name@example.com" : "+855 12 345 678"
                  }
                  variant="secondary"
                />
              </TextField>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="outline" onPress={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="primary" onPress={handleSend}>
              <IconSend aria-hidden="true" size={16} />
              Send receipt
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
