"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  toast,
} from "@heroui/react";
import {
  IconBackspace,
  IconLock,
} from "@tabler/icons-react";

interface LockRegisterModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  cashierName?: string;
}

export function LockRegisterModal({
  isOpen,
  onOpenChange,
  cashierName = "Sokha",
}: LockRegisterModalProps) {
  const [pin, setPin] = useState("");

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        // Auto unlock on 4 digits
        setTimeout(() => {
          toast.success("Register unlocked", {
            description: `Welcome back, ${cashierName}`,
          });
          setPin("");
          onOpenChange(false);
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="sm">
        <Modal.Dialog className="rounded-2xl bg-surface p-6 text-center shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            {/* Lock Icon */}
            <div className="flex size-14 items-center justify-center rounded-2xl bg-danger/15 text-danger">
              <IconLock size={28} />
            </div>

            {/* Title & Info */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold text-foreground">
                Register Locked
              </h2>
              <p className="text-xs text-muted">
                Enter your 4-digit PIN to resume as{" "}
                <strong className="text-foreground">{cashierName}</strong>
              </p>
            </div>

            {/* PIN Dots Display */}
            <div className="flex items-center justify-center gap-3 py-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className={`size-3.5 rounded-full transition-all duration-150 ${
                    i < pin.length
                      ? "scale-110 bg-accent ring-4 ring-accent/20"
                      : "border border-border bg-surface-secondary"
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid w-full max-w-[16rem] grid-cols-3 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="secondary"
                  size="lg"
                  className="h-12 text-base font-semibold"
                  onPress={() => handleDigit(String(num))}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-xs font-medium text-muted"
                onPress={handleClear}
              >
                C
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-12 text-base font-semibold"
                onPress={() => handleDigit("0")}
              >
                0
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-muted"
                onPress={handleDelete}
                aria-label="Backspace"
              >
                <IconBackspace size={20} />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-muted"
              onPress={() => {
                setPin("");
                onOpenChange(false);
              }}
            >
              Cancel / Dismiss
            </Button>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
