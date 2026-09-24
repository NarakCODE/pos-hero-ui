"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  Button,
  Description,
  FieldError,
  Form,
  InputOTP,
  Label,
  Modal,
  REGEXP_ONLY_DIGITS,
  TextField,
} from "@heroui/react";
import { IconBackspace } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const pinKeypad = [
  "7",
  "8",
  "9",
  "4",
  "5",
  "6",
  "1",
  "2",
  "3",
  "clear",
  "0",
  "backspace",
] as const;

type PinKey = (typeof pinKeypad)[number];

interface CreatePinModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCreatePin: () => void;
}

export function CreatePinModal({
  isOpen,
  onOpenChange,
  onCreatePin,
}: CreatePinModalProps) {
  const t = useTranslations("SalesMenu");
  const [pin, setPin] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const isPinValid = /^\d{4,6}$/.test(pin);
  const pinError =
    hasAttemptedSubmit && !isPinValid
      ? t("pages.settings.pinLengthError")
      : undefined;

  const clearForm = () => {
    setPin("");
    setHasAttemptedSubmit(false);
  };

  const handleKeypadPress = (key: PinKey) => {
    if (key === "clear") {
      setPin("");
      return;
    }

    if (key === "backspace") {
      setPin((value) => value.slice(0, -1));
      return;
    }

    setPin((value) => `${value}${key}`.slice(0, 6));
  };

  const handleOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen) clearForm();
    onOpenChange(nextIsOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isPinValid) {
      pinInputRef.current?.focus();
      return;
    }

    onCreatePin();
    handleOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Container size="cover">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading id="create-pin-heading">
              {t("pages.settings.pinModalTitle")}
            </Modal.Heading>
            <p className="text-sm text-muted">
              {t("pages.settings.pinChangeDescription")}
            </p>
          </Modal.Header>
          <Form
            aria-labelledby="create-pin-heading"
            className="contents"
            onSubmit={handleSubmit}
            validationBehavior="aria"
          >
            <Modal.Body>
              <div className="flex flex-col items-center justify-center gap-4 text-center">
              <TextField
                className="items-center text-center"
                fullWidth
                isInvalid={Boolean(pinError)}
                isRequired
                name="newPin"
              >
                <Label htmlFor="create-pin-value">
                  {t("pages.settings.newPin")}
                </Label>
                <InputOTP
                  ref={pinInputRef}
                  aria-describedby={
                    pinError
                      ? "create-pin-error"
                      : "create-pin-value-description"
                  }
                  aria-invalid={Boolean(pinError)}
                  aria-required="true"
                  autoComplete="new-password"
                  id="create-pin-value"
                  inputMode="none"
                  maxLength={6}
                  name="newPin"
                  pattern={REGEXP_ONLY_DIGITS}
                  required
                  value={pin}
                  className="justify-center"
                  variant="secondary"
                  onChange={setPin}
                >
                  <InputOTP.Group>
                    <InputOTP.Slot index={0} />
                    <InputOTP.Slot index={1} />
                    <InputOTP.Slot index={2} />
                  </InputOTP.Group>
                  <InputOTP.Separator />
                  <InputOTP.Group>
                    <InputOTP.Slot index={3} />
                    <InputOTP.Slot index={4} />
                    <InputOTP.Slot index={5} />
                  </InputOTP.Group>
                </InputOTP>
                <Description id="create-pin-value-description">
                  {t("pages.settings.pinPlaceholder")}
                </Description>
                {pinError ? (
                  <FieldError id="create-pin-error">{pinError}</FieldError>
                ) : null}
              </TextField>

              <div className="flex w-full flex-col items-center gap-2">
                <p aria-live="polite" className="text-xs text-muted">
                  {t("pages.settings.pinKeypadTarget", {
                    field: t("pages.settings.newPin"),
                  })}
                </p>
                <div
                  aria-label={t("pages.settings.pinKeypadLabel")}
                  className="grid w-full flex-1 gap-2.5"
                  role="group"
                >
                  <div className="grid min-h-0 w-full grid-cols-3 grid-rows-4 gap-2.5">
                    {pinKeypad.map((key) => {
                      const isClearButton = key === "clear";
                      const isBackspaceButton = key === "backspace";

                      return (
                        <Button
                          aria-label={
                            isClearButton
                              ? t("pages.settings.pinKeyClear")
                              : isBackspaceButton
                                ? t("pages.settings.pinKeyBackspace")
                                : undefined
                          }
                          className={`h-full min-h-16 ${isBackspaceButton ? "w-full" : ""}`}
                          fullWidth
                          isIconOnly={isBackspaceButton}
                          key={key}
                          size="lg"
                          type="button"
                          variant={isBackspaceButton ? "danger-soft" : "secondary"}
                          onPress={() => handleKeypadPress(key)}
                        >
                          {isBackspaceButton ? (
                            <IconBackspace
                              aria-hidden="true"
                              className="size-5"
                            />
                          ) : (
                            <span className="text-xl tabular-nums">
                              {isClearButton ? "C" : key}
                            </span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="w-full flex-col sm:flex-row">
              <Button
                className="sm:flex-1"
                fullWidth
                size="lg"
                slot="close"
                type="button"
                variant="secondary"
              >
                {t("pages.settings.cancel")}
              </Button>
              <Button
                className="sm:flex-1"
                fullWidth
                size="lg"
                type="submit"
              >
                {t("pages.settings.createPinButton")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
