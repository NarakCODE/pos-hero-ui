"use client";

import { useId, useState, type ReactNode } from "react";
import { Button, Modal } from "@heroui/react";
import {
  IconCashBanknote,
  IconCheck,
  IconPrinter,
} from "@tabler/icons-react";

export interface PaymentSuccessfulModalProps {
  /**
   * Controlled open state of the modal.
   */
  isOpen?: boolean;
  /**
   * Initial open state when uncontrolled.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Callback fired when open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Optional custom trigger element to wrap with `<Modal>`.
   */
  trigger?: ReactNode;
  /**
   * Main heading text.
   * @default "Payment Successful!"
   */
  title?: ReactNode;
  /**
   * Staff reminder subtitle text.
   * @default "Don't forget to say Thank You to customers"
   */
  subtitle?: ReactNode;
  /**
   * Section header label.
   * @default "Payment Details"
   */
  sectionTitle?: ReactNode;
  /**
   * Total payment amount display string.
   * @default "US$117.55"
   */
  totalPayment?: ReactNode;
  /**
   * Label for total payment.
   * @default "Total Payment"
   */
  totalPaymentLabel?: ReactNode;
  /**
   * Payment method display name.
   * @default "Cash"
   */
  paymentMethod?: ReactNode;
  /**
   * Label for payment method.
   * @default "Payment Method"
   */
  paymentMethodLabel?: ReactNode;
  /**
   * Icon displayed alongside payment method.
   * Defaults to a banknote icon (`IconCashBanknote`).
   */
  paymentMethodIcon?: ReactNode;
  /**
   * Customer pays amount display string.
   * @default "US$200.00"
   */
  customerPays?: ReactNode;
  /**
   * Label for customer pays.
   * @default "Customer Pays"
   */
  customerPaysLabel?: ReactNode;
  /**
   * Change amount display string.
   * @default "US$3.45"
   */
  change?: ReactNode;
  /**
   * Label for change row.
   * @default "Change"
   */
  changeLabel?: ReactNode;
  /**
   * Label for the secondary outlined print button on the left.
   * @default "Print Bills"
   */
  printLabel?: ReactNode;
  /**
   * Label for the primary solid blue done button on the right.
   * @default "Payment Done"
   */
  doneLabel?: ReactNode;
  /**
   * Callback fired when "Print Bills" is pressed.
   * Defaults to `window.print()` if not supplied.
   */
  onPrintBills?: () => void;
  /**
   * Callback fired when "Payment Done" is pressed.
   * Closes the modal and triggers this handler.
   */
  onPaymentDone?: () => void;
  /**
   * Whether the modal can be dismissed by clicking outside or pressing ESC.
   * @default true
   */
  isDismissable?: boolean;
  /**
   * Optional order or ticket identifier (e.g. "1048").
   */
  orderNumber?: ReactNode;
  /**
   * Optional additional content rendered within the modal body.
   */
  children?: ReactNode;
  /**
   * Additional CSS classes applied to the dialog container.
   */
  className?: string;
}

export function PaymentSuccessfulModal({
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title = "Payment Successful!",
  subtitle = "Don't forget to say Thank You to customers",
  sectionTitle = "Payment Details",
  totalPayment = "US$117.55",
  totalPaymentLabel = "Total Payment",
  paymentMethod = "Cash",
  paymentMethodLabel = "Payment Method",
  paymentMethodIcon = (
    <IconCashBanknote
      aria-hidden="true"
      className="size-4.5 text-muted"
      size={18}
    />
  ),
  customerPays = "US$200.00",
  customerPaysLabel = "Customer Pays",
  change = "US$3.45",
  changeLabel = "Change",
  printLabel = "Print Bills",
  doneLabel = "Payment Done",
  onPrintBills,
  onPaymentDone,
  isDismissable = true,
  orderNumber,
  children,
  className,
}: PaymentSuccessfulModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const headingId = useId();
  const subtitleId = useId();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handlePrintBills = () => {
    if (onPrintBills) {
      onPrintBills();
    } else if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handlePaymentDone = () => {
    onPaymentDone?.();
    handleOpenChange(false);
  };

  const dialogContent = (
    <Modal.Backdrop
      isDismissable={isDismissable}
      isOpen={isOpen}
      variant="blur"
      onOpenChange={handleOpenChange}
    >
      <Modal.Container size="sm">
        <Modal.Dialog
          aria-describedby={subtitle ? subtitleId : undefined}
          aria-labelledby={headingId}
          className={`max-w-[420px] ${className ?? ""}`.trim()}
        >
          <Modal.CloseTrigger />

          {/* Top circular blue badge with checkmark icon, heading & subtitle */}
          <Modal.Header className="flex flex-col items-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              <IconCheck aria-hidden="true" size={32} stroke={2.5} />
            </div>

            <Modal.Heading id={headingId}>
              <span className="mt-4 block text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {title}
              </span>
            </Modal.Heading>

            {subtitle ? (
              <p className="mt-1.5 text-center text-sm text-muted" id={subtitleId}>
                {subtitle}
              </p>
            ) : null}
          </Modal.Header>

          {/* Payment Details Section */}
          <Modal.Body>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    {sectionTitle}
                  </h3>
                  {orderNumber ? (
                    <span className="text-xs font-medium text-muted">
                      #{orderNumber}
                    </span>
                  ) : null}
                </div>

                {/* Key-Value Breakdown Card */}
                <div className="divide-y divide-border rounded-2xl border border-border bg-surface-secondary/50 p-4">
                  {/* Total Payment */}
                  <div className="flex items-center justify-between pb-3 text-sm">
                    <span className="text-muted">{totalPaymentLabel}</span>
                    <span className="font-semibold tabular-nums text-foreground">
                      {totalPayment}
                    </span>
                  </div>

                  {/* Payment Method with Banknote Icon */}
                  <div className="flex items-center justify-between py-3 text-sm">
                    <span className="text-muted">{paymentMethodLabel}</span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      {paymentMethodIcon}
                      <span>{paymentMethod}</span>
                    </span>
                  </div>

                  {/* Customer Pays */}
                  <div className="flex items-center justify-between pt-3 text-sm">
                    <span className="text-muted">{customerPaysLabel}</span>
                    <span className="font-medium tabular-nums text-foreground">
                      {customerPays}
                    </span>
                  </div>
                </div>

                {/* Highlighted Summary Row for Change (neutral border & surface, no soft color outline) */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-surface-secondary px-4 py-3.5">
                  <span className="text-sm font-semibold text-foreground">
                    {changeLabel}
                  </span>
                  <span className="text-lg font-bold tabular-nums text-foreground">
                    {change}
                  </span>
                </div>
              </div>

              {children}
            </div>
          </Modal.Body>

          {/* Action Buttons: Secondary outlined on left, Primary solid blue on right */}
          <Modal.Footer className="flex w-full flex-row items-center">
            <Button
              className="flex-1"
              size="lg"
              variant="outline"
              onPress={handlePrintBills}
            >
              <IconPrinter aria-hidden="true" size={18} />
              <span>{printLabel}</span>
            </Button>

            <Button
              className="flex-1"
              size="lg"
              variant="primary"
              onPress={handlePaymentDone}
            >
              <IconCheck aria-hidden="true" size={18} stroke={2.5} />
              <span>{doneLabel}</span>
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );

  if (trigger) {
    return (
      <Modal>
        {trigger}
        {dialogContent}
      </Modal>
    );
  }

  return dialogContent;
}
