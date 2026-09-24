"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  InputGroup,
  Label,
  Modal,
  TextField,
  toast,
} from "@heroui/react";
import {
  IconCheck,
  IconPrinter,
  IconScale,
} from "@tabler/icons-react";

interface CloseShiftModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onShiftClosed?: () => void;
}

export function CloseShiftModal({
  isOpen,
  onOpenChange,
  onShiftClosed,
}: CloseShiftModalProps) {
  const expectedCash = 823.50;
  const [countedCash, setCountedCash] = useState("");
  const [shouldPrintZReport, setShouldPrintZReport] = useState(true);

  const difference = useMemo(() => {
    const num = parseFloat(countedCash);
    if (isNaN(num)) return null;
    return num - expectedCash;
  }, [countedCash, expectedCash]);

  const handleCloseShift = () => {
    toast.success("Shift #04 closed successfully", {
      description: shouldPrintZReport
        ? "Z-Report printed to Receipt Printer. Shift closed."
        : "Shift record saved to reports.",
    });

    if (onShiftClosed) {
      onShiftClosed();
    }
    onOpenChange(false);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="md">
        <Modal.Dialog>
          <Modal.Header>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-warning/15 text-warning">
                <IconScale size={20} />
              </div>
              <div className="flex flex-col">
                <Modal.Heading>
                  Shift Reconciliation & Z-Report
                </Modal.Heading>
                <p className="text-xs text-muted">
                  End Shift #04 · Cashier: Sokha
                </p>
              </div>
            </div>
            <Modal.CloseTrigger />
          </Modal.Header>

          <Modal.Body>
            <div className="flex flex-col gap-4">
            {/* Shift Breakdown Box */}
            <div className="flex flex-col gap-2 rounded-xl bg-surface-secondary/60 p-3.5 text-xs">
              <div className="flex items-center justify-between text-muted">
                <span>Shift Start Time:</span>
                <span className="font-medium text-foreground">Today, 07:00 AM</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Opening Cash Float:</span>
                <span className="font-medium text-foreground">$150.00</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Total Cash Sales:</span>
                <span className="font-medium text-foreground">+$648.50</span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span>Net Cash In / Out:</span>
                <span className="font-medium text-foreground">+$25.00</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-border/70 pt-2 text-sm font-semibold">
                <span className="text-foreground">Expected Drawer Cash:</span>
                <span className="text-accent">${expectedCash.toFixed(2)}</span>
              </div>
            </div>

            {/* Actual Cash Counted Input */}
            <TextField
              aria-label="Actual counted cash"
              value={countedCash}
              onChange={setCountedCash}
              fullWidth
            >
              <div className="flex items-center justify-between">
                <Label>
                  Actual Counted Cash ($ USD)
                </Label>
                {difference !== null ? (
                  <Chip
                    size="sm"
                    variant="soft"
                    color={
                      Math.abs(difference) < 0.01
                        ? "success"
                        : difference > 0
                        ? "accent"
                        : "danger"
                    }
                  >
                    {Math.abs(difference) < 0.01
                      ? "Balanced (Exact)"
                      : difference > 0
                      ? `Over +$${difference.toFixed(2)}`
                      : `Short -$${Math.abs(difference).toFixed(2)}`}
                  </Chip>
                ) : null}
              </div>
              <InputGroup variant="secondary">
                <InputGroup.Prefix>
                  $
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder={expectedCash.toFixed(2)}
                  type="number"
                  step="0.01"
                  autoFocus
                />
              </InputGroup>
            </TextField>

            {/* Print Z-Report Option */}
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border p-3 hover:bg-surface-secondary/40">
              <input
                type="checkbox"
                checked={shouldPrintZReport}
                onChange={(e) => setShouldPrintZReport(e.target.checked)}
                className="size-4 rounded accent-accent"
              />
              <div className="flex min-w-0 flex-1 items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <IconPrinter size={16} className="text-muted" />
                  <span>Print End-of-Day Z-Report</span>
                </div>
                <span className="text-[11px] text-muted">Thermal (80mm)</span>
              </div>
            </label>
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
              onPress={handleCloseShift}
            >
              <IconCheck size={16} />
              <span>Confirm & Close Shift</span>
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
