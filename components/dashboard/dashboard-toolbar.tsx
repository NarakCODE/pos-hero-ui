"use client";

import { Button, Modal } from "@heroui/react";
import { useState } from "react";

export type TimeRange = "Today" | "7D" | "1M" | "MTD";

export interface DashboardToolbarProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRanges: TimeRange[] = ["Today", "7D", "1M", "MTD"];

export function DashboardToolbar({
  selectedRange,
  onRangeChange,
}: DashboardToolbarProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportOpen(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Context - No Icons on Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Store Performance
        </h1>
        <p className="text-xs text-muted sm:text-sm">
          Real-time sales, order mix & register telemetry
        </p>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Time Range Switcher */}
        <div className="flex items-center rounded-lg border border-border bg-surface p-0.5 shadow-xs">
          {timeRanges.map((range) => {
            const isSelected = selectedRange === range;
            return (
              <Button
                key={range}
                size="sm"
                variant={isSelected ? "primary" : "ghost"}
                onPress={() => onRangeChange(range)}
              >
                {range}
              </Button>
            );
          })}
        </div>

        {/* Export Button */}
        <Button
          size="sm"
          variant="secondary"
          onPress={() => setIsExportOpen(true)}
        >
          Export Report
        </Button>
      </div>

      {/* Export Report Modal */}
      <Modal isOpen={isExportOpen} onOpenChange={setIsExportOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog aria-labelledby="export-report-title">
              <Modal.CloseTrigger />
              <Modal.Header>
                <div>
                  <Modal.Heading id="export-report-title">
                    Export Dashboard Report
                  </Modal.Heading>
                </div>
              </Modal.Header>

              <Modal.Body>
                <div className="flex flex-col gap-4 py-2">
                  <p className="text-xs text-muted">
                    Generate an audit summary of sales transactions, payment
                    breakdowns, and item volumes for the selected timeframe (
                    <strong className="text-foreground">{selectedRange}</strong>).
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Select Format:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["csv", "pdf", "excel"] as const).map((fmt) => (
                        <Button
                          key={fmt}
                          size="sm"
                          variant={exportFormat === fmt ? "primary" : "outline"}
                          onPress={() => setExportFormat(fmt)}
                        >
                          {fmt.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="flex w-full items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => setIsExportOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    isDisabled={isExporting}
                    size="sm"
                    variant="primary"
                    onPress={handleExport}
                  >
                    {isExporting ? "Generating..." : "Download Report"}
                  </Button>
                </div>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
