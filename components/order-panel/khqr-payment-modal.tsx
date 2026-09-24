"use client";

import { Button, Chip, Modal, Separator, Surface } from "@heroui/react";
import type { PaymentMethodOption } from "./types";

interface KHQRPaymentModalProps {
  method: PaymentMethodOption;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess?: () => void;
}

const QR_CODE_IMAGE_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSo9BFmJeRHwNxAMB4Z42J_RJDplCBI8ft3OTFeyqjAD6FQ-wa99SLm4U&s=10";

const orderItems = [
  {
    amount: "$10.00",
    details: "70% Sugar · Normal Ice",
    name: "S-Bubble Oolong Tea",
    quantity: 2,
  },
  {
    amount: "$12.50",
    details: "50% Sugar · Less Ice · Grass Jelly",
    name: "M-Black Tea Macchiato",
    quantity: 1,
  },
] as const;

const subtotal = "$22.50";

export function KHQRPaymentModal({
  isOpen,
  method,
  onOpenChange,
  onPaymentSuccess,
}: KHQRPaymentModalProps) {
  const handleComplete = () => {
    onPaymentSuccess?.();
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="cover">
        <Modal.Dialog aria-label={method.label}>
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>{method.label}</Modal.Heading>
          </Modal.Header>

          <Modal.Body className="min-h-0">
            <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 p-6 text-center sm:p-10 lg:w-3/5 lg:flex-none">
                <div className="max-w-md space-y-2">
                  <p className="text-sm font-medium">
                    Scan with your banking app
                  </p>
                  <p className="text-sm text-muted">
                    Open your preferred banking or wallet app and scan this KHQR
                    code to pay.
                  </p>
                </div>

                <div className="bg-white ring-1 ring-default">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="KHQR payment code"
                    className="size-64 object-contain sm:size-80"
                    height="320"
                    loading="eager"
                    src={QR_CODE_IMAGE_URL}
                    width="320"
                  />
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-semibold">Amount due {subtotal}</p>
                  <p className="text-muted">Order #15306 · Table02/05</p>
                </div>
              </section>

              <aside className="flex min-h-0 flex-1 lg:w-2/5 lg:flex-none">
                <Surface className="w-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Order summary</p>
                      <p className="mt-1 text-xs text-muted">Ticket #15306</p>
                    </div>
                    <Chip color="warning">
                      <Chip.Label>Waiting</Chip.Label>
                    </Chip>
                  </div>

                  <div className="mt-6 min-h-0 flex-1 space-y-5 overflow-y-auto">
                    {orderItems.map((item) => (
                      <div
                        className="flex items-start justify-between gap-4"
                        key={item.name}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="mt-1 text-xs text-muted">
                            {item.details}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Qty {item.quantity}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    <Separator />
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="font-medium tabular-nums">
                        {subtotal}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-lg font-semibold">
                      <span>Total</span>
                      <span className="tabular-nums">{subtotal}</span>
                    </div>
                  </div>
                </Surface>
              </aside>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-full flex-col sm:flex-row">
            <Button
              className="sm:flex-1"
              fullWidth
              size="lg"
              slot="close"
              variant="secondary"
            >
              Close
            </Button>
            {onPaymentSuccess ? (
              <Button
                className="sm:flex-1"
                fullWidth
                size="lg"
                onPress={handleComplete}
              >
                Mark as paid
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
