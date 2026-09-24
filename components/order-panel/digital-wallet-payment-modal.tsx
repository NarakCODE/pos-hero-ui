"use client";

import {
  Avatar,
  Button,
  Label,
  Modal,
  Radio,
  RadioGroup,
  Spinner,
  Surface,
} from "@heroui/react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconWallet,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import type { PaymentMethodOption } from "./types";

export type DigitalWalletProviderId =
  | "bakongKhqr"
  | "wingBank"
  | "trueMoney"
  | "piPay";

export type DigitalWalletFlow = "qr" | "wallet" | "terminal";

export interface DigitalWalletProvider {
  flow: DigitalWalletFlow;
  id: DigitalWalletProviderId;
  label: string;
}

interface DigitalWalletPaymentModalProps {
  amountDue?: number;
  isOpen: boolean;
  method: PaymentMethodOption;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess?: () => void;
  supportedWallets?: readonly DigitalWalletProvider[];
}

type DigitalWalletPaymentState =
  | "selecting"
  | "ready"
  | "wallet"
  | "waiting"
  | "processing"
  | "success"
  | "failure"
  | "cancelled"
  | "expired";

const DEFAULT_AMOUNT_DUE = 22.5;
const QR_EXPIRY_SECONDS = 120;
const defaultSupportedWallets: readonly DigitalWalletProvider[] = [
  { flow: "qr", id: "bakongKhqr", label: "Bakong / KHQR" },
  { flow: "qr", id: "wingBank", label: "Wing Bank" },
  { flow: "qr", id: "trueMoney", label: "TrueMoney" },
  { flow: "qr", id: "piPay", label: "Pi Pay" },
];
const walletLogoByProviderId: Record<DigitalWalletProviderId, string> = {
  bakongKhqr: "/wallet/bakong-logo.png",
  piPay: "/wallet/pi-pay-logo.png",
  trueMoney: "/wallet/true-money-logo.png",
  wingBank: "/wallet/wingbank-logo.png",
};

export function DigitalWalletPaymentModal({
  amountDue = DEFAULT_AMOUNT_DUE,
  isOpen,
  method,
  onOpenChange,
  onPaymentSuccess,
  supportedWallets = defaultSupportedWallets,
}: DigitalWalletPaymentModalProps) {
  const hasSingleProvider = supportedWallets.length === 1;
  const defaultProvider =
    supportedWallets.find((provider) => provider.id === "bakongKhqr") ??
    supportedWallets[0];
  const initialProviderId = defaultProvider?.id ?? null;
  const initialPaymentState: DigitalWalletPaymentState = hasSingleProvider
    ? "ready"
    : "selecting";

  const [selectedProviderId, setSelectedProviderId] =
    useState<DigitalWalletProviderId | null>(initialProviderId);
  const [paymentState, setPaymentState] =
    useState<DigitalWalletPaymentState>(initialPaymentState);
  const [qrExpiresIn, setQrExpiresIn] = useState(QR_EXPIRY_SECONDS);
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedProvider = supportedWallets.find(
    (provider) => provider.id === selectedProviderId,
  );
  const isProcessing = paymentState === "processing";
  const isSuccessful = paymentState === "success";
  const isActivePayment =
    paymentState === "wallet" ||
    paymentState === "waiting" ||
    paymentState === "processing";

  const clearProcessingTimer = () => {
    if (processingTimer.current) {
      clearTimeout(processingTimer.current);
      processingTimer.current = null;
    }
  };

  useEffect(() => {
    return () => clearProcessingTimer();
  }, []);

  useEffect(() => {
    if (paymentState !== "waiting") {
      return;
    }

    const interval = window.setInterval(() => {
      setQrExpiresIn((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(interval);
          setPaymentState("expired");
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [paymentState]);

  const resetPayment = () => {
    clearProcessingTimer();
    setSelectedProviderId(initialProviderId);
    setPaymentState(initialPaymentState);
    setQrExpiresIn(QR_EXPIRY_SECONDS);
  };

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      resetPayment();
    }

    onOpenChange(nextIsOpen);
  };

  const completePayment = () => {
    setPaymentState("success");
    onPaymentSuccess?.();
  };

  const beginProcessing = () => {
    clearProcessingTimer();
    setPaymentState("processing");
    processingTimer.current = setTimeout(() => {
      completePayment();
      processingTimer.current = null;
    }, 900);
  };

  const handleStartPayment = () => {
    if (!selectedProvider) {
      return;
    }

    if (selectedProvider.flow === "qr") {
      setQrExpiresIn(QR_EXPIRY_SECONDS);
      setPaymentState("waiting");
      return;
    }

    if (selectedProvider.flow === "wallet") {
      setPaymentState("wallet");
      return;
    }

    beginProcessing();
  };

  const handleCancelPayment = () => {
    clearProcessingTimer();
    setPaymentState("cancelled");
  };

  const handleTryAgain = () => {
    setPaymentState(hasSingleProvider ? "ready" : "selecting");
  };

  const handleGenerateNewQr = () => {
    if (!selectedProvider) {
      return;
    }

    setQrExpiresIn(QR_EXPIRY_SECONDS);
    setPaymentState("waiting");
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container size="cover">
        <Modal.Dialog aria-label={method.label}>
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>{method.label}</Modal.Heading>
          </Modal.Header>

          <Modal.Body className="min-h-0 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
              <Surface className="w-full" variant="secondary">
                <div className="flex min-h-20 w-full items-center justify-between gap-4 p-5 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-sm text-muted">Amount due</p>
                    <p className="mt-1 text-xs text-muted">Order #15306</p>
                  </div>
                  <span className="shrink-0 text-3xl font-semibold tabular-nums">
                    {formatCurrency(amountDue)}
                  </span>
                </div>
              </Surface>

              {paymentState === "selecting" ? (
                <ProviderSelection
                  providers={supportedWallets}
                  selectedProviderId={selectedProviderId}
                  onProviderChange={setSelectedProviderId}
                />
              ) : null}

              {paymentState === "ready" && selectedProvider ? (
                <ReadyPayment provider={selectedProvider} />
              ) : null}

              {paymentState === "wallet" && selectedProvider ? (
                <WalletAction provider={selectedProvider} />
              ) : null}

              {paymentState === "waiting" && selectedProvider ? (
                <QrWaitingState
                  amountDue={amountDue}
                  expiresIn={qrExpiresIn}
                  provider={selectedProvider}
                />
              ) : null}

              {paymentState === "processing" && selectedProvider ? (
                <ProcessingState provider={selectedProvider} />
              ) : null}

              {paymentState === "success" && selectedProvider ? (
                <SuccessState
                  amountDue={amountDue}
                  provider={selectedProvider}
                />
              ) : null}

              {paymentState === "failure" ? (
                <FailureState title="Payment failed">
                  The provider could not complete the payment. Try again or
                  choose another payment method.
                </FailureState>
              ) : null}

              {paymentState === "cancelled" ? (
                <FailureState title="Payment cancelled">
                  The payment was cancelled before the order was paid.
                </FailureState>
              ) : null}

              {paymentState === "expired" && selectedProvider ? (
                <ExpiredQrState provider={selectedProvider} />
              ) : null}
            </div>
          </Modal.Body>

          <Modal.Footer className="w-full flex-col sm:flex-row">
            {isSuccessful ? (
              <Button className="w-full" fullWidth size="lg" slot="close">
                Done
              </Button>
            ) : paymentState === "expired" ? (
              <>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  variant="secondary"
                  onPress={handleCancelPayment}
                >
                  Cancel payment
                </Button>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  isDisabled={!selectedProvider}
                  size="lg"
                  onPress={handleGenerateNewQr}
                >
                  Generate new QR
                </Button>
              </>
            ) : paymentState === "failure" || paymentState === "cancelled" ? (
              <>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  slot="close"
                  variant="secondary"
                >
                  Choose another payment method
                </Button>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  onPress={handleTryAgain}
                >
                  Try again
                </Button>
              </>
            ) : isActivePayment && paymentState === "wallet" ? (
              <>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  variant="secondary"
                  onPress={handleCancelPayment}
                >
                  Cancel payment
                </Button>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  onPress={beginProcessing}
                >
                  Continue / Open Wallet
                </Button>
              </>
            ) : isActivePayment ? (
              <Button
                className="w-full"
                fullWidth
                isDisabled={isProcessing}
                size="lg"
                variant="secondary"
                onPress={handleCancelPayment}
              >
                Cancel payment
              </Button>
            ) : (
              <>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  size="lg"
                  slot="close"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:flex-1"
                  fullWidth
                  isDisabled={!selectedProviderId || !selectedProvider}
                  size="lg"
                  onPress={handleStartPayment}
                >
                  Start payment · {formatCurrency(amountDue)}
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function ProviderSelection({
  onProviderChange,
  providers,
  selectedProviderId,
}: {
  onProviderChange: (providerId: DigitalWalletProviderId) => void;
  providers: readonly DigitalWalletProvider[];
  selectedProviderId: DigitalWalletProviderId | null;
}) {
  return (
    <RadioGroup
      aria-label="Digital wallet provider"
      name="digitalWalletProvider"
      variant="secondary"
      value={selectedProviderId ?? undefined}
      onChange={(value) => onProviderChange(value as DigitalWalletProviderId)}
    >
      <Label>Choose wallet</Label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <Radio key={provider.id} value={provider.id}>
            <Radio.Content className="w-full">
              <div className="flex min-h-24 w-full items-center gap-3 rounded-xl border border-default bg-surface p-4">
                <Avatar size="lg">
                  <Avatar.Image
                    alt={`${provider.label} logo`}
                    className="object-contain"
                    src={walletLogoByProviderId[provider.id]}
                  />
                  <Avatar.Fallback>
                    {provider.label.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {provider.label}
                </span>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
              </div>
            </Radio.Content>
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

function ReadyPayment({ provider }: { provider: DigitalWalletProvider }) {
  return (
    <PaymentStateSurface className="flex min-h-32 items-center gap-4 p-5 sm:p-6">
      <IconWallet aria-hidden="true" size={22} />
      <div>
        <p className="font-medium">{provider.label} is ready</p>
        <p className="mt-1 text-sm text-muted">
          Start payment to continue with this wallet.
        </p>
      </div>
    </PaymentStateSurface>
  );
}

function WalletAction({ provider }: { provider: DigitalWalletProvider }) {
  return (
    <PaymentStateSurface className="flex min-h-32 items-center gap-4 p-5 sm:p-6">
      <IconWallet aria-hidden="true" size={22} />
      <div>
        <p className="font-medium">Continue with {provider.label}</p>
        <p className="mt-1 text-sm text-muted">
          Continue to open the wallet and authorize this payment.
        </p>
      </div>
    </PaymentStateSurface>
  );
}

function QrWaitingState({
  amountDue,
  expiresIn,
  provider,
}: {
  amountDue: number;
  expiresIn: number;
  provider: DigitalWalletProvider;
}) {
  return (
    <PaymentStateSurface className="flex min-h-96 flex-col items-center gap-6 p-6 text-center sm:p-8">
      <div className="space-y-1">
        <p className="font-medium">Waiting for payment</p>
        <p className="text-sm text-muted">
          Scan the {provider.label} QR code to pay {formatCurrency(amountDue)}.
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${provider.label} payment QR code`}
          className="size-56 object-contain sm:size-64"
          height="256"
          src={getQrCodeUrl(provider, amountDue)}
          width="256"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner color="current" size="sm" />
        <span>Expires in {formatCountdown(expiresIn)}</span>
      </div>
    </PaymentStateSurface>
  );
}

function ProcessingState({ provider }: { provider: DigitalWalletProvider }) {
  return (
    <PaymentStateSurface className="flex min-h-56 flex-col items-center justify-center gap-4 p-6 text-center sm:p-8">
      <Spinner color="current" size="lg" />
      <div>
        <p className="font-medium">Processing payment</p>
        <p className="mt-1 text-sm text-muted">
          Waiting for {provider.label} to confirm the transaction.
        </p>
      </div>
    </PaymentStateSurface>
  );
}

function SuccessState({
  amountDue,
  provider,
}: {
  amountDue: number;
  provider: DigitalWalletProvider;
}) {
  return (
    <PaymentStateSurface className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center sm:p-8">
      <IconCircleCheck aria-hidden="true" className="text-success" size={40} />
      <div>
        <p className="text-lg font-semibold">Payment successful</p>
        <p className="mt-1 text-sm text-muted">
          {formatCurrency(amountDue)} paid with {provider.label}.
        </p>
      </div>
    </PaymentStateSurface>
  );
}

function FailureState({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <PaymentStateSurface className="flex min-h-32 items-start gap-4 p-5 sm:p-6">
      <IconAlertTriangle
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-danger"
        size={22}
      />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted">{children}</p>
      </div>
    </PaymentStateSurface>
  );
}

function ExpiredQrState({ provider }: { provider: DigitalWalletProvider }) {
  return (
    <PaymentStateSurface className="flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center sm:p-8">
      <IconAlertTriangle aria-hidden="true" className="text-danger" size={32} />
      <div>
        <p className="font-medium">QR code expired</p>
        <p className="mt-1 text-sm text-muted">
          Generate a new {provider.label} QR code to continue.
        </p>
      </div>
    </PaymentStateSurface>
  );
}

function PaymentStateSurface({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <Surface className="w-full" variant="secondary">
      <div className={className}>{children}</div>
    </Surface>
  );
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getQrCodeUrl(provider: DigitalWalletProvider, amountDue: number) {
  const payload = encodeURIComponent(
    `POS-${provider.id}-order-15306-amount-${amountDue.toFixed(2)}`,
  );

  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${payload}`;
}
