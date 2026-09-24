"use client";

import {
  Button,
  ButtonGroup,
  DateField,
  DateRangePicker,
  Label,
  Modal,
  RangeCalendar,
} from "@heroui/react";
import {
  getLocalTimeZone,
  today,
  type DateValue,
} from "@internationalized/date";
import { IconDownload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { TimeRange } from "./dashboard-data";

export type { TimeRange } from "./dashboard-data";

export interface DashboardToolbarProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

const timeRanges: { id: TimeRange; labelKey: string }[] = [
  { id: "Today", labelKey: "ranges.today" },
  { id: "7D", labelKey: "ranges.last7Days" },
  { id: "1M", labelKey: "ranges.last30Days" },
  { id: "MTD", labelKey: "ranges.monthToDate" },
];

function getRangeForTimeRange(timeRange: TimeRange): {
  start: DateValue;
  end: DateValue;
} {
  const currentToday = today(getLocalTimeZone());
  switch (timeRange) {
    case "Today":
      return { start: currentToday, end: currentToday };
    case "7D":
      return { start: currentToday.subtract({ days: 6 }), end: currentToday };
    case "1M":
      return { start: currentToday.subtract({ days: 29 }), end: currentToday };
    case "MTD":
      return { start: currentToday.set({ day: 1 }), end: currentToday };
    default:
      return { start: currentToday, end: currentToday };
  }
}

export function DashboardToolbar({
  selectedRange,
  onRangeChange,
}: DashboardToolbarProps) {
  const t = useTranslations("Dashboard");
  const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(() => getRangeForTimeRange(selectedRange));
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel">(
    "csv",
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleDateRangeChange = (
    value: { start: DateValue; end: DateValue } | null,
  ) => {
    setDateRange(value);
    if (!value?.start || !value?.end) return;

    const timeZone = getLocalTimeZone();
    const startMs = value.start.toDate(timeZone).getTime();
    const endMs = value.end.toDate(timeZone).getTime();
    const diffDays = Math.max(
      0,
      Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)),
    );

    if (diffDays <= 0) {
      onRangeChange("Today");
    } else if (diffDays <= 10) {
      onRangeChange("7D");
    } else if (diffDays <= 31) {
      onRangeChange("1M");
    } else {
      onRangeChange("MTD");
    }
  };

  const handlePresetSelect = (rangeId: TimeRange) => {
    const nextRange = getRangeForTimeRange(rangeId);
    setDateRange(nextRange);
    onRangeChange(rangeId);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportOpen(false);
    }, 800);
  };

  const selectedRangeLabel =
    dateRange?.start && dateRange?.end
      ? `${dateRange.start.toString()} – ${dateRange.end.toString()}`
      : t(
          timeRanges.find((range) => range.id === selectedRange)?.labelKey ??
            "ranges.today",
        );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground sm:text-base">
          {t("overviewTitle")}
        </p>
        <p className="mt-1 text-xs text-muted sm:text-sm">
          {t("overviewDescription")}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <DateRangePicker
          aria-label={t("rangeLabel")}
          className="w-auto"
          value={dateRange}
          onChange={handleDateRangeChange}
        >
          <Label className="sr-only">{t("rangeLabel")}</Label>
          <DateField.Group>
            <DateField.InputContainer>
              <DateField.Input slot="start">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
              <DateRangePicker.RangeSeparator />
              <DateField.Input slot="end">
                {(segment) => <DateField.Segment segment={segment} />}
              </DateField.Input>
            </DateField.InputContainer>
            <DateField.Suffix>
              <DateRangePicker.Trigger>
                <DateRangePicker.TriggerIndicator />
              </DateRangePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <DateRangePicker.Popover>
            <div className="flex flex-col gap-2">
              <RangeCalendar aria-label={t("rangeLabel")}>
                <RangeCalendar.Header>
                  <RangeCalendar.YearPickerTrigger>
                    <RangeCalendar.YearPickerTriggerHeading />
                    <RangeCalendar.YearPickerTriggerIndicator />
                  </RangeCalendar.YearPickerTrigger>
                  <RangeCalendar.NavButton slot="previous" />
                  <RangeCalendar.NavButton slot="next" />
                </RangeCalendar.Header>
                <RangeCalendar.Grid>
                  <RangeCalendar.GridHeader>
                    {(day) => (
                      <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>
                    )}
                  </RangeCalendar.GridHeader>
                  <RangeCalendar.GridBody>
                    {(date) => <RangeCalendar.Cell date={date} />}
                  </RangeCalendar.GridBody>
                </RangeCalendar.Grid>
                <RangeCalendar.YearPickerGrid>
                  <RangeCalendar.YearPickerGridBody>
                    {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                  </RangeCalendar.YearPickerGridBody>
                </RangeCalendar.YearPickerGrid>
              </RangeCalendar>

              <div className="flex items-center justify-between border-t border-border/60 pt-2">
                {timeRanges.map((range) => (
                  <Button
                    key={range.id}
                    size="sm"
                    variant={selectedRange === range.id ? "primary" : "ghost"}
                    onPress={() => handlePresetSelect(range.id)}
                  >
                    {t(range.labelKey)}
                  </Button>
                ))}
              </div>
            </div>
          </DateRangePicker.Popover>
        </DateRangePicker>

        <ButtonGroup size="sm">
          <Button
            variant="secondary"
            onPress={() => setIsExportOpen(true)}
          >
            <IconDownload aria-hidden="true" size={16} />
            {t("exportReport")}
          </Button>
        </ButtonGroup>
      </div>

      <Modal isOpen={isExportOpen} onOpenChange={setIsExportOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container>
            <Modal.Dialog aria-labelledby="export-report-title">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading id="export-report-title">
                  {t("exportTitle")}
                </Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <div className="flex flex-col gap-4 py-2">
                  <p className="text-xs text-muted">
                    {t("exportDescription", { range: selectedRangeLabel })}
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      {t("exportFormatLabel")}
                    </span>
                    <ButtonGroup fullWidth size="sm">
                      {(["csv", "pdf", "excel"] as const).map((format) => (
                        <Button
                          key={format}
                          variant={exportFormat === format ? "primary" : "outline"}
                          onPress={() => setExportFormat(format)}
                        >
                          {format !== "csv" ? <ButtonGroup.Separator /> : null}
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </ButtonGroup>
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
                    {t("cancel")}
                  </Button>
                  <Button
                    isDisabled={isExporting}
                    size="sm"
                    variant="primary"
                    onPress={handleExport}
                  >
                    {isExporting ? t("preparingExport") : t("downloadReport")}
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
