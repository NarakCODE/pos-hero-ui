"use client";

import {
  Button,
  Description,
  InputGroup,
  Label,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  toast,
} from "@heroui/react";
import { IconCreditCard, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

import type { PaymentMethodOption } from "./types";

interface BankCardPaymentModalProps {
  method: PaymentMethodOption;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPaymentSuccess?: () => void;
}

type CardOptionId = "visa" | "mastercard" | `custom-${string}`;

interface PaymentCardOption {
  description: string;
  label: string;
  value: CardOptionId;
}

interface NewPaymentCardDetails {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  securityCode: string;
}

const AMOUNT_DUE = 22.5;

const initialCardOptions = [
  {
    description: "Expires 01/2028",
    label: "Visa •••• 0123",
    value: "visa",
  },
  {
    description: "Expires 08/2029",
    label: "Mastercard •••• 8304",
    value: "mastercard",
  },
] satisfies ReadonlyArray<PaymentCardOption>;

export function BankCardPaymentModal({
  isOpen,
  method,
  onOpenChange,
  onPaymentSuccess,
}: BankCardPaymentModalProps) {
  const [cardOptions, setCardOptions] =
    useState<PaymentCardOption[]>(initialCardOptions);
  const [selectedCard, setSelectedCard] = useState<CardOptionId>("visa");
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const isPaymentReady = Boolean(selectedCard);

  const handlePayment = () => {
    if (!isPaymentReady) {
      return;
    }

    toast.success("Bank card payment completed", {
      description: `Payment received: $${AMOUNT_DUE.toFixed(2)}`,
    });

    onPaymentSuccess?.();
    onOpenChange(false);
  };

  const handleAddPaymentCard = (details: NewPaymentCardDetails) => {
    const digits = details.cardNumber.replace(/\D/g, "");
    const option: PaymentCardOption = {
      description: `Expires ${details.expirationDate}`,
      label: `${details.cardholderName.trim()} •••• ${digits.slice(-4)}`,
      value: `custom-${Date.now()}`,
    };

    setCardOptions((currentOptions) => [...currentOptions, option]);
    setSelectedCard(option.value);
    setIsAddPaymentOpen(false);
  };

  return (
    <>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container size="cover">
          <Modal.Dialog aria-label={method.label}>
            <Modal.CloseTrigger />

            <Modal.Header>
              <div className="space-y-1">
                <Modal.Heading>{method.label}</Modal.Heading>

                <p className="text-sm text-muted">
                  Select a card to complete the payment.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body>
              <div className="flex flex-col gap-6">
              {/* Amount */}
              <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-secondary px-4 py-3">
                <div>
                  <p className="text-sm text-muted">Amount due</p>
                  <p className="text-xs text-muted">Order #15306</p>
                </div>

                <span className="text-2xl font-semibold tabular-nums">
                  ${AMOUNT_DUE.toFixed(2)}
                </span>
              </div>

              {/* Payment cards */}
              <RadioGroup
                aria-label="Payment card"
                name="bankCard"
                value={selectedCard}
                variant="secondary"
                onChange={(value) => setSelectedCard(value as CardOptionId)}
              >
                <div className="flex items-center justify-between gap-3">
                  <Label>Payment card</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsAddPaymentOpen(true)}
                  >
                    <IconPlus aria-hidden="true" size={16} />
                    Add payment
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {cardOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      <Radio.Content className="relative flex min-h-24 w-full items-start gap-3 rounded-xl border border-default bg-surface p-4 data-[selected=true]:bg-surface-secondary">
                        <IconCreditCard
                          aria-hidden="true"
                          className="mt-0.5 shrink-0"
                          size={22}
                        />

                        <div className="min-w-0 flex-1 pe-7">
                          <p className="font-medium">{option.label}</p>

                          <Description>{option.description}</Description>
                        </div>

                        <Radio.Control className="absolute end-4 top-4">
                          <Radio.Indicator />
                        </Radio.Control>
                      </Radio.Content>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>

              </div>
            </Modal.Body>

            <Modal.Footer className="w-full flex-col gap-2 sm:flex-row">
              <Button
                className="sm:flex-1"
                fullWidth
                size="lg"
                slot="close"
                variant="secondary"
              >
                Cancel
              </Button>

              <Button
                className="sm:flex-1"
                fullWidth
                isDisabled={!isPaymentReady}
                size="lg"
                onPress={handlePayment}
              >
                Pay ${AMOUNT_DUE.toFixed(2)}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      <AddPaymentCardModal
        isOpen={isAddPaymentOpen}
        onAdd={handleAddPaymentCard}
        onOpenChange={setIsAddPaymentOpen}
      />
    </>
  );
}

interface AddPaymentCardModalProps {
  isOpen: boolean;
  onAdd: (details: NewPaymentCardDetails) => void;
  onOpenChange: (isOpen: boolean) => void;
}

const mockPaymentCardDetails: NewPaymentCardDetails = {
  cardNumber: "4242 4242 4242 4242",
  cardholderName: "Demo Cardholder",
  expirationDate: "01/28",
  securityCode: "123",
};

const createMockPaymentCardDetails = () => ({ ...mockPaymentCardDetails });

function AddPaymentCardModal({
  isOpen,
  onAdd,
  onOpenChange,
}: AddPaymentCardModalProps) {
  const [cardDetails, setCardDetails] = useState<NewPaymentCardDetails>(
    createMockPaymentCardDetails,
  );

  const cardDigits = cardDetails.cardNumber.replace(/\D/g, "");
  const isCardReady =
    cardDigits.length === 16 &&
    cardDetails.cardholderName.trim().length > 0 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expirationDate) &&
    /^\d{3,4}$/.test(cardDetails.securityCode);

  const resetForm = () =>
    setCardDetails(createMockPaymentCardDetails());

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      resetForm();
    }

    onOpenChange(nextIsOpen);
  };

  const handleCardNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);

    setCardDetails((currentDetails) => ({
      ...currentDetails,
      cardNumber: formatCardNumber(digits),
    }));
  };

  const handleExpirationChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    setCardDetails((currentDetails) => ({
      ...currentDetails,
      expirationDate:
        digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}`
          : digits,
    }));
  };

  const handleSubmit = () => {
    if (!isCardReady) {
      return;
    }

    onAdd(cardDetails);
    resetForm();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container>
        <Modal.Dialog aria-label="Add payment card" className="sm:max-w-xl">
          <Modal.CloseTrigger />

          <Modal.Header>
            <Modal.Heading>Add payment</Modal.Heading>
            <p className="text-sm text-muted">
              Enter the card details to save a payment method.
            </p>
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
              <TextField fullWidth name="cardNumber">
                <Label>Card number</Label>

                <InputGroup fullWidth variant="secondary">
                  <InputGroup.Prefix>
                    <IconCreditCard aria-hidden="true" size={18} />
                  </InputGroup.Prefix>

                  <InputGroup.Input
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardDetails.cardNumber}
                    onChange={(event) =>
                      handleCardNumberChange(event.target.value)
                    }
                  />
                </InputGroup>
              </TextField>

              <TextField fullWidth name="cardholderName">
                <Label>Cardholder name</Label>

                <InputGroup fullWidth variant="secondary">
                  <InputGroup.Input
                    autoComplete="cc-name"
                    placeholder="Name on card"
                    value={cardDetails.cardholderName}
                    onChange={(event) =>
                      setCardDetails((currentDetails) => ({
                        ...currentDetails,
                        cardholderName: event.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </TextField>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField fullWidth name="expirationDate">
                  <Label>Expiration date</Label>

                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Input
                      autoComplete="cc-exp"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={cardDetails.expirationDate}
                      onChange={(event) =>
                        handleExpirationChange(event.target.value)
                      }
                    />
                  </InputGroup>
                </TextField>

                <TextField fullWidth name="securityCode">
                  <Label>Security code</Label>

                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Input
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="CVV"
                      type="password"
                      value={cardDetails.securityCode}
                      onChange={(event) =>
                        setCardDetails((currentDetails) => ({
                          ...currentDetails,
                          securityCode: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4),
                        }))
                      }
                    />
                  </InputGroup>
                </TextField>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer className="w-full flex-col gap-2 sm:flex-row">
            <Button
              className="sm:flex-1"
              fullWidth
              size="lg"
              slot="close"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              className="sm:flex-1"
              fullWidth
              isDisabled={!isCardReady}
              size="lg"
              onPress={handleSubmit}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function formatCardNumber(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim();
}
