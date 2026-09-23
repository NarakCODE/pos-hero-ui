"use client";

import { Button, Chip, InputGroup, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useId, useState, type FormEvent } from "react";
import { IconCalendarOff } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/empty-state";
import { POSAside } from "@/components/shared/pos-aside";
import {
  tableBookingHours,
  type FloorTable,
  type TableBooking,
} from "./table-data";

interface TableAsideProps {
  table?: FloorTable | null;
  onBook?: (tableId: string, bookings: TableBooking[]) => void;
  onCancel?: () => void;
}

export function TableAside({
  onBook,
  onCancel,
  table = null,
}: TableAsideProps = {}) {
  const t = useTranslations("SalesMenu");

  if (!table || !onBook || !onCancel) {
    return (
      <POSAside
        id="table-booking-aside"
        ariaLabel={t("pages.table.asideAriaLabel")}
        mainClassName="flex items-center justify-center"
      >
        <EmptyState className="size-full">
          <EmptyState.Media
            role="img"
            aria-label={t("pages.table.asideEmptyState")}
            style={{ marginBottom: 0 }}
          >
            <IconCalendarOff aria-hidden="true" size={24} />
          </EmptyState.Media>
        </EmptyState>
      </POSAside>
    );
  }

  return (
    <TableBookingAside table={table} onBook={onBook} onCancel={onCancel} />
  );
}

function TableBookingAside({
  onBook,
  onCancel,
  table,
}: {
  onBook: (tableId: string, bookings: TableBooking[]) => void;
  onCancel: () => void;
  table: FloorTable;
}) {
  const t = useTranslations("SalesMenu");
  const formId = useId();
  const tableNumber = getTableNumber(table.label);
  const [slotValues, setSlotValues] = useState<Record<string, string>>(() =>
    getInitialSlotValues(table, t),
  );

  const saveTableBookings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedValues = Object.fromEntries(
      tableBookingHours.map((hour) => [hour, slotValues[hour]?.trim() ?? ""]),
    );
    const currentBookings = new Map(
      table.bookings.map((booking) => [booking.time, booking]),
    );
    const bookings = tableBookingHours.flatMap((hour) => {
      const guestName = normalizedValues[hour];
      if (!guestName) return [];

      const currentBooking = currentBookings.get(hour);
      if (
        currentBooking &&
        guestName === getBookingDisplayName(currentBooking, t)
      ) {
        return [currentBooking];
      }

      return [
        {
          time: hour,
          guestName,
          status: currentBooking?.status ?? "upcoming",
          ...(currentBooking?.partySize === undefined
            ? {}
            : { partySize: currentBooking.partySize }),
        } satisfies TableBooking,
      ];
    });

    setSlotValues(normalizedValues);
    onBook(table.id, bookings);
    toast.success(t("pages.table.bookingSaved", { table: tableNumber }));
  };

  return (
    <POSAside
      id="table-booking-aside"
      ariaLabelledBy="table-booking-aside-title"
      headerClassName="shrink-0 p-[var(--pos-content-padding)]"
      mainClassName="min-h-0 flex-1 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)]"
      footerClassName="shrink-0 p-[var(--pos-content-padding)]"
      header={
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className="truncate text-base font-semibold text-foreground"
              id="table-booking-aside-title"
            >
              {t("pages.table.bookingDetailsTitle", { table: tableNumber })}
            </h2>
            <Chip color="default" size="sm" variant="soft">
              {t("pages.table.tableCapacity", { count: table.capacity })}
            </Chip>
          </div>
          <p className="mt-1 text-xs text-muted">
            {t("pages.table.bookingSchedule")}
            {" · "}
            {tableBookingHours[0]} – {tableBookingHours.at(-1)}
          </p>
        </div>
      }
      footer={
        <div className="flex gap-2">
          <Button
            className="flex-1"
            type="button"
            variant="secondary"
            onPress={onCancel}
          >
            {t("pages.table.cancelBooking")}
          </Button>
          <Button
            className="flex-1"
            form={formId}
            type="submit"
            variant="primary"
          >
            {t("pages.table.confirmBooking")}
          </Button>
        </div>
      }
    >
      <form
        className="flex flex-col gap-2"
        id={formId}
        onSubmit={saveTableBookings}
      >
        {tableBookingHours.map((hour) => (
          <InputGroup key={hour} fullWidth variant="secondary">
            <InputGroup.Prefix>{hour}</InputGroup.Prefix>
            <InputGroup.Input
              aria-label={t("pages.table.bookingInputLabel", { time: hour })}
              autoComplete="off"
              name={`booking-${hour}`}
              placeholder={t("pages.table.bookingInputPlaceholder")}
              value={slotValues[hour] ?? ""}
              onChange={(event) =>
                setSlotValues((currentValues) => ({
                  ...currentValues,
                  [hour]: event.target.value,
                }))
              }
            />
          </InputGroup>
        ))}
      </form>
    </POSAside>
  );
}

function getInitialSlotValues(
  table: FloorTable,
  t: ReturnType<typeof useTranslations>,
) {
  return Object.fromEntries(
    tableBookingHours.map((hour) => {
      const booking = table.bookings.find((item) => item.time === hour);
      return [hour, booking ? getBookingDisplayName(booking, t) : ""];
    }),
  );
}

function getBookingDisplayName(
  booking: TableBooking,
  t: ReturnType<typeof useTranslations>,
) {
  if (booking.walkIn === "breakfast") return t("pages.table.walkInBreakfast");
  if (booking.walkIn === "lunch") return t("pages.table.walkInLunch");
  return booking.guestName ?? "";
}

function getTableNumber(label: string) {
  return label.replace(/^TA/i, "");
}
