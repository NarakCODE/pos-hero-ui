"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  InputGroup,
  Modal,
  Separator,
  toast,
} from "@heroui/react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconCircleX,
  IconDiscount,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type {
  AppliedPromotion,
  Promotion,
  PromotionModalProps,
} from "./types";

export const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: "promo-10-percent",
    name: "10% Off",
    code: "SAVE10",
    description: "Save 10% on this order",
    type: "percentage",
    value: 10,
    minSpend: 0,
    isAvailable: true,
  },
  {
    id: "promo-5-off",
    name: "$5 Off",
    code: "SAVE5",
    description: "Minimum spend $20",
    type: "fixed",
    value: 5,
    minSpend: 20,
    isAvailable: true,
  },
  {
    id: "promo-happy-hour",
    name: "Happy Hour",
    code: "HAPPY20",
    description: "20% off selected drinks",
    type: "percentage",
    value: 20,
    minSpend: 0,
    isAvailable: true,
  },
  {
    id: "promo-expired",
    name: "Summer Kickoff",
    code: "SUMMER50",
    description: "Expired Aug 31 · 50% off",
    type: "percentage",
    value: 50,
    minSpend: 25,
    isAvailable: false,
    expiryDate: "Expired Aug 31, 2026",
  },
];

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

type PromotionUIState =
  | "default"
  | "selected"
  | "invalid_code"
  | "expired_unavailable"
  | "applied";

export function PromotionModal({
  appliedPromotion,
  className = "",
  formatCurrency = defaultFormatCurrency,
  isOpen,
  onApplyPromotion,
  onOpenChange,
  onRemovePromotion,
  promotions = DEFAULT_PROMOTIONS,
  subtotal = 0,
}: PromotionModalProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="cover">
        {isOpen ? (
          <PromotionModalDialog
            appliedPromotion={appliedPromotion}
            className={className}
            formatCurrency={formatCurrency}
            onApplyPromotion={onApplyPromotion}
            onClose={() => onOpenChange(false)}
            onRemovePromotion={onRemovePromotion}
            promotions={promotions}
            subtotal={subtotal}
          />
        ) : null}
      </Modal.Container>
    </Modal.Backdrop>
  );
}

interface PromotionModalDialogProps {
  appliedPromotion?: AppliedPromotion | null;
  className?: string;
  formatCurrency: (amount: number) => string;
  onApplyPromotion?: (promotion: AppliedPromotion) => void;
  onClose: () => void;
  onRemovePromotion?: () => void;
  promotions: Promotion[];
  subtotal: number;
}

function PromotionModalDialog({
  appliedPromotion,
  className = "",
  formatCurrency,
  onApplyPromotion,
  onClose,
  onRemovePromotion,
  promotions,
  subtotal,
}: PromotionModalDialogProps) {
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    appliedPromotion?.id ?? null,
  );
  const [promoCodeInput, setPromoCodeInput] = useState(
    appliedPromotion?.code ?? "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<"invalid" | "expired" | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    appliedPromotion ? `Currently applied: ${appliedPromotion.name}` : null,
  );

  // Filter available promotions by optional search query
  const filteredPromotions = useMemo(() => {
    if (!searchQuery.trim()) return promotions;
    const query = searchQuery.toLowerCase().trim();
    return promotions.filter(
      (promo) =>
        promo.name.toLowerCase().includes(query) ||
        promo.description.toLowerCase().includes(query) ||
        promo.code?.toLowerCase().includes(query),
    );
  }, [promotions, searchQuery]);

  // Current selected promotion object
  const selectedPromo = useMemo(() => {
    return promotions.find((p) => p.id === selectedPromotionId) ?? null;
  }, [promotions, selectedPromotionId]);

  // Calculate preview values
  const { discountAmount, newTotal } = useMemo(() => {
    if (!selectedPromo) {
      return { discountAmount: 0, newTotal: subtotal };
    }

    let calculated = 0;
    if (selectedPromo.type === "percentage") {
      calculated = (subtotal * selectedPromo.value) / 100;
    } else {
      calculated = Math.min(selectedPromo.value, subtotal);
    }

    const finalTotal = Math.max(0, subtotal - calculated);
    return {
      discountAmount: Number(calculated.toFixed(2)),
      newTotal: Number(finalTotal.toFixed(2)),
    };
  }, [selectedPromo, subtotal]);

  // Determine current UI state
  const uiState: PromotionUIState = useMemo(() => {
    if (errorMessage) {
      return errorType === "expired" ? "expired_unavailable" : "invalid_code";
    }
    if (
      selectedPromo &&
      appliedPromotion &&
      selectedPromo.id === appliedPromotion.id
    ) {
      return "applied";
    }
    if (selectedPromo) {
      return "selected";
    }
    return "default";
  }, [errorMessage, errorType, selectedPromo, appliedPromotion]);

  // Handler for selecting an available promotion
  const handleSelectPromotion = (promo: Promotion) => {
    setErrorMessage(null);
    setErrorType(null);

    // Check if expired or unavailable
    if (promo.isAvailable === false) {
      setErrorMessage(
        promo.expiryDate
          ? `This promotion has expired (${promo.expiryDate}).`
          : "This promotion is currently unavailable.",
      );
      setErrorType("expired");
      return;
    }

    // Check minimum spend
    if (promo.minSpend && subtotal < promo.minSpend) {
      setErrorMessage(
        `Minimum spend of ${formatCurrency(promo.minSpend)} required (Current subtotal: ${formatCurrency(subtotal)}).`,
      );
      setErrorType("expired");
      return;
    }

    // If clicking already selected, toggle selection off
    if (selectedPromotionId === promo.id) {
      setSelectedPromotionId(null);
      setPromoCodeInput("");
      setSuccessMessage(null);
      return;
    }

    setSelectedPromotionId(promo.id);
    setPromoCodeInput(promo.code || "");
    setSuccessMessage(`Selected ${promo.name} (${promo.description})`);
  };

  // Handler for promo code submission
  const handleApplyCode = (codeToVerify?: string) => {
    const rawInput = (codeToVerify ?? promoCodeInput).trim();

    if (!rawInput) {
      setErrorMessage("Please enter a promotion code.");
      setErrorType("invalid");
      return;
    }

    const lowerInput = rawInput.toLowerCase();

    // Look up in available promotions case-insensitively
    const matched = promotions.find(
      (p) => p.code?.trim().toLowerCase() === lowerInput,
    );

    if (!matched) {
      // Check for known mock codes or invalid
      if (lowerInput === "summer50" || lowerInput.includes("expired")) {
        setErrorMessage("This promotion code has expired.");
        setErrorType("expired");
      } else {
        setErrorMessage("Invalid promotion code. Please check and try again.");
        setErrorType("invalid");
      }
      setSelectedPromotionId(null);
      setSuccessMessage(null);
      return;
    }

    // Check availability
    if (matched.isAvailable === false) {
      setErrorMessage(
        matched.expiryDate
          ? `This code has expired (${matched.expiryDate}).`
          : "This promotion is no longer available.",
      );
      setErrorType("expired");
      setSelectedPromotionId(null);
      setSuccessMessage(null);
      return;
    }

    // Check minimum spend
    if (matched.minSpend && subtotal < matched.minSpend) {
      setErrorMessage(
        `Minimum spend of ${formatCurrency(matched.minSpend)} required for code "${rawInput}".`,
      );
      setErrorType("expired");
      setSelectedPromotionId(null);
      setSuccessMessage(null);
      return;
    }

    // Valid code!
    setErrorMessage(null);
    setErrorType(null);
    setSelectedPromotionId(matched.id);
    setSuccessMessage(`Code "${rawInput}" applied: ${matched.name}!`);
  };

  // Handler for applying the promotion to the order
  const handleConfirmApply = () => {
    if (!selectedPromo) return;

    const applied: AppliedPromotion = {
      id: selectedPromo.id,
      name: selectedPromo.name,
      code: selectedPromo.code,
      type: selectedPromo.type,
      value: selectedPromo.value,
      discountAmount,
      description: selectedPromo.description,
    };

    onApplyPromotion?.(applied);
    toast.success("Promotion applied", {
      description: `${selectedPromo.name} (-${formatCurrency(discountAmount)})`,
    });
    onClose();
  };

  // Handler for removing applied promotion
  const handleRemove = () => {
    onRemovePromotion?.();
    setSelectedPromotionId(null);
    setPromoCodeInput("");
    setSuccessMessage(null);
    setErrorMessage(null);
    toast.info("Promotion removed", {
      description: "Order total has been restored.",
    });
    onClose();
  };

  const isCurrentPromotionAlreadyApplied =
    Boolean(appliedPromotion && selectedPromo?.id === appliedPromotion.id);

  return (
    <Modal.Dialog
      aria-label="Promotion"
      data-ui-state={uiState}
      className={className}
    >
      <Modal.CloseTrigger />

      <Modal.Header>
        <div className="space-y-1">
          <Modal.Heading>Promotion</Modal.Heading>
          <p className="text-sm text-muted">
            Order adjustment discount before checkout
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          {/* 1. Order Subtotal Banner */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-secondary/40 p-3.5">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-muted">
                Order subtotal
              </span>
              <p className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                {formatCurrency(subtotal)}
              </p>
            </div>

            {appliedPromotion ? (
              <div className="flex items-center gap-2">
                <Chip color="success" size="sm" variant="soft">
                  <IconCircleCheck aria-hidden="true" size={13} />
                  <Chip.Label>{appliedPromotion.code || appliedPromotion.name} applied</Chip.Label>
                </Chip>
                {onRemovePromotion ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    aria-label="Remove applied promotion"
                    onPress={handleRemove}
                  >
                    <IconTrash aria-hidden="true" size={15} className="text-muted hover:text-danger" />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* 2. Available Promotions Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">
                Available promotions
              </span>
              {promotions.length > 3 ? (
                <Chip size="sm" variant="secondary">
                  {promotions.length} offers
                </Chip>
              ) : null}
            </div>

            {/* Optional search promotions */}
            {promotions.length > 3 ? (
              <InputGroup fullWidth variant="secondary">
                <InputGroup.Prefix>
                  <IconSearch aria-hidden="true" size={14} className="text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder="Search promotions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery ? (
                  <InputGroup.Suffix>
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery("")}
                      className="text-muted hover:text-foreground"
                    >
                      <IconCircleX aria-hidden="true" size={14} />
                    </button>
                  </InputGroup.Suffix>
                ) : null}
              </InputGroup>
            ) : null}

            {/* Promotions List */}
            <div className="space-y-2" role="radiogroup" aria-label="Available promotions">
              {filteredPromotions.map((promo) => {
                const isSelected = selectedPromotionId === promo.id;
                const isUnavailable =
                  promo.isAvailable === false ||
                  (promo.minSpend !== undefined && subtotal < promo.minSpend);

                return (
                  <button
                    key={promo.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isUnavailable && !isSelected}
                    onClick={() => handleSelectPromotion(promo)}
                    className={`group relative flex w-full items-start gap-3 rounded-xl border p-3 text-start transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs dark:bg-primary/10"
                        : isUnavailable
                          ? "cursor-not-allowed border-border/50 bg-surface-secondary/20 opacity-60"
                          : "border-border bg-surface hover:border-border/80 hover:bg-surface-secondary/30"
                    }`}
                  >
                    {/* Radio Circle Indicator */}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted/60 bg-transparent group-hover:border-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <span className="size-2 rounded-full bg-current" />
                      ) : null}
                    </span>

                    {/* Promotion Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {promo.name}
                        </span>

                        <Chip
                          color={
                            promo.isAvailable === false
                              ? "danger"
                              : promo.minSpend && subtotal < promo.minSpend
                                ? "warning"
                                : "accent"
                          }
                          size="sm"
                          variant="soft"
                          className="shrink-0"
                        >
                          {promo.isAvailable === false
                            ? "Expired"
                            : promo.minSpend && subtotal < promo.minSpend
                              ? `Min ${formatCurrency(promo.minSpend)}`
                              : promo.type === "percentage"
                                ? `${promo.value}% off`
                                : `${formatCurrency(promo.value)} off`}
                        </Chip>
                      </div>

                      <p className="mt-0.5 text-xs text-muted">
                        {promo.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator className="my-1" />

          {/* 3. Promo Code Section */}
          <div className="space-y-1.5">
            <label
              htmlFor="promo-code-input"
              className="text-xs font-semibold text-muted"
            >
              Promo code
            </label>

            <div className="flex gap-2">
              <InputGroup
                fullWidth
                variant="secondary"
                isInvalid={Boolean(errorMessage)}
                className="flex-1"
              >
                <InputGroup.Prefix>
                  <IconDiscount aria-hidden="true" size={18} className="text-muted" />
                </InputGroup.Prefix>

                <InputGroup.Input
                  id="promo-code-input"
                  placeholder="Enter promotion code"
                  value={promoCodeInput}
                  onChange={(e) => {
                    setPromoCodeInput(e.target.value);
                    if (errorMessage) {
                      setErrorMessage(null);
                      setErrorType(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCode();
                    }
                  }}
                />

                {promoCodeInput ? (
                  <InputGroup.Suffix>
                    <button
                      type="button"
                      aria-label="Clear promo code"
                      onClick={() => {
                        setPromoCodeInput("");
                        setErrorMessage(null);
                        setErrorType(null);
                      }}
                      className="text-muted hover:text-foreground"
                    >
                      <IconCircleX aria-hidden="true" size={16} />
                    </button>
                  </InputGroup.Suffix>
                ) : null}
              </InputGroup>

              <Button
                type="button"
                size="md"
                variant="secondary"
                onPress={() => handleApplyCode()}
                isDisabled={!promoCodeInput.trim()}
                className="shrink-0"
              >
                Verify
              </Button>
            </div>

            {/* Feedback messages: Invalid / Expired / Success */}
            {errorMessage ? (
              <div
                role="alert"
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  errorType === "expired"
                    ? "text-warning-soft-foreground"
                    : "text-danger"
                }`}
              >
                {errorType === "expired" ? (
                    <IconAlertTriangle aria-hidden="true" size={14} className="shrink-0" />
                ) : (
                    <IconAlertCircle aria-hidden="true" size={14} className="shrink-0" />
                )}
                <span>{errorMessage}</span>
              </div>
            ) : successMessage ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-success">
                  <IconCheck aria-hidden="true" size={14} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : null}
          </div>

          <Separator className="my-1" />

          {/* 4. Quick Preview Section */}
          <div className="rounded-xl border border-border/80 bg-surface-secondary/25 p-3.5">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Promotion discount</span>
                <span
                  className={`font-semibold tabular-nums ${
                    discountAmount > 0
                      ? "text-success"
                      : "text-muted"
                  }`}
                >
                  {discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : formatCurrency(0)}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-border/60 pt-2">
                <span className="text-sm font-bold text-foreground">
                  New total
                </span>
                <span className="text-lg font-bold tracking-tight text-foreground tabular-nums">
                  {formatCurrency(newTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      {/* 5. Footer Buttons */}
      <Modal.Footer className="w-full flex-col sm:flex-row">
        {appliedPromotion && onRemovePromotion ? (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onPress={handleRemove}
            className="sm:flex-1"
          >
            <span className="flex items-center gap-1.5 text-danger">
              <IconTrash aria-hidden="true" size={18} />
              <span>Remove promotion</span>
            </span>
          </Button>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          size="lg"
          fullWidth
          slot="close"
          className="sm:flex-1"
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={!selectedPromo || isCurrentPromotionAlreadyApplied}
          onPress={handleConfirmApply}
          className="sm:flex-1"
        >
          {isCurrentPromotionAlreadyApplied
            ? "Applied"
            : "Apply promotion"}
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
}
