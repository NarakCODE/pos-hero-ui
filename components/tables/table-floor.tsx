"use client";

import { Card, Chip, SearchField, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import {
  TableFiltersPopover,
  type TableServerFilter,
  type TableStatusFilter,
} from "./table-filters-popover";
import {
  tableBookingHours,
  type TableBooking,
  type FloorTable,
  type TableSection,
  type TableStatus,
  type TableBookingStatus,
} from "./table-data";

const tableSections: TableSection[] = [
  "all",
  "reservation",
  "zoneA",
  "zoneB",
  "zoneC",
  "vip",
];

const tableSectionLabels: Record<TableSection, string> = {
  all: "sectionAll",
  reservation: "sectionReservation",
  zoneA: "sectionZoneA",
  zoneB: "sectionZoneB",
  zoneC: "sectionZoneC",
  vip: "sectionVip",
};

const tableSectionNameKeys: Record<FloorTable["section"], string> = {
  zoneA: "sectionZoneA",
  zoneB: "sectionZoneB",
  zoneC: "sectionZoneC",
  vip: "sectionVip",
};

const tableStatusLabels: Record<TableStatus, string> = {
  available: "statusAvailable",
  inProgress: "statusInProgress",
  reserved: "statusReserved",
  dirty: "statusDirty",
};

const tableStatusChipColors: Record<
  TableStatus,
  "default" | "accent" | "success" | "warning"
> = {
  available: "success",
  inProgress: "accent",
  reserved: "warning",
  dirty: "default",
};

const bookingStatusLabels: Record<TableBookingStatus, string> = {
  completed: "bookingCompleted",
  inProgress: "bookingInProgress",
  upcoming: "bookingUpcoming",
};

const bookingStatusDotColors: Record<TableBookingStatus, string> = {
  completed: "bg-success",
  inProgress: "bg-cyan-500",
  upcoming: "bg-amber-500",
};

export interface TableFloorProps {
  tables: FloorTable[];
  selectedTableId: string | null;
  onTableSelect: (tableId: string) => void;
  className?: string;
  gridClassName?: string;
}

export function TableFloor({
  tables,
  selectedTableId,
  onTableSelect,
  className = "",
  gridClassName = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
}: TableFloorProps) {
  const t = useTranslations("SalesMenu");
  const [selectedSection, setSelectedSection] = useState<TableSection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("all");
  const [serverFilter, setServerFilter] = useState<TableServerFilter>("all");

  const activeFilterCount =
    Number(statusFilter !== "all") + Number(serverFilter !== "all");

  const filteredTables = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tables.filter((table) => {
      const matchesSection =
        selectedSection === "all" ||
        (selectedSection === "reservation"
          ? table.status === "reserved"
          : table.section === selectedSection);
      const matchesStatus =
        statusFilter === "all" || table.status === statusFilter;
      const matchesServer =
        serverFilter === "all" || table.server === serverFilter;
      const searchableContent = [
        table.label,
        table.section,
        table.status,
        table.server,
        table.reservationTime,
        ...table.bookings.flatMap((booking) => [
          booking.guestName,
          booking.walkIn,
          booking.time,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesSection &&
        matchesStatus &&
        matchesServer &&
        searchableContent.includes(normalizedQuery)
      );
    });
  }, [searchQuery, selectedSection, serverFilter, statusFilter, tables]);

  const resetFilters = () => {
    setStatusFilter("all");
    setServerFilter("all");
  };

  return (
    <div
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden text-foreground ${className}`}
    >
      <Tabs
        align="start"
        className="min-w-0 shrink-0"
        selectedKey={selectedSection}
        variant="secondary"
        onSelectionChange={(key) =>
          setSelectedSection(String(key) as TableSection)
        }
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("pages.table.sectionLabel")}>
            {tableSections.map((section) => (
              <Tabs.Tab
                key={section}
                id={section}
                className="w-auto shrink-0 whitespace-nowrap"
              >
                {t(`pages.table.${tableSectionLabels[section]}`)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="flex shrink-0 items-center gap-2 px-(--pos-content-padding) py-3">
        <SearchField
          aria-label={t("pages.table.searchLabel")}
          className="min-w-0 flex-1"
          fullWidth
          value={searchQuery}
          variant="secondary"
          onChange={setSearchQuery}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              placeholder={t("pages.table.searchPlaceholder")}
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <TableFiltersPopover
          activeFilterCount={activeFilterCount}
          serverFilter={serverFilter}
          statusFilter={statusFilter}
          onResetFilters={resetFilters}
          onServerFilterChange={setServerFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 px-(--pos-content-padding) pb-2 text-[11px] text-muted">
        <span className="font-medium text-foreground">
          {t("pages.table.bookingLegend")}
        </span>
        {(["completed", "inProgress", "upcoming"] as const).map((status) => (
          <span key={status} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`size-2 shrink-0 rounded-full ${bookingStatusDotColors[status]}`}
            />
            {t(`pages.table.${bookingStatusLabels[status]}`)}
          </span>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin px-(--pos-content-padding) pb-(--pos-content-padding)">
        {filteredTables.length > 0 ? (
          <div className={gridClassName}>
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTableId === table.id}
                onPress={() => onTableSelect(table.id)}
                sectionLabel={t(
                  `pages.table.${tableSectionNameKeys[table.section]}`,
                )}
                statusLabel={t(
                  `pages.table.${tableStatusLabels[table.status]}`,
                )}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-surface-secondary/50 p-8 text-center">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("pages.table.emptySearch")}
              </p>
              <p className="mt-1 text-xs text-muted">
                {t("pages.table.emptySearchHint")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableCard({
  isSelected,
  onPress,
  sectionLabel,
  statusLabel,
  table,
  t,
}: {
  isSelected: boolean;
  onPress: () => void;
  sectionLabel: string;
  statusLabel: string;
  table: FloorTable;
  t: ReturnType<typeof useTranslations>;
}) {
  const tableNumber = getTableNumber(table.label);

  return (
    <div className="relative min-w-0">
      <Card variant={isSelected ? "tertiary" : "default"}>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {t("pages.table.tableLabel")}
              </p>
              <Card.Title>
                <span className="block text-2xl font-bold tabular-nums tracking-tight">
                  {tableNumber}
                </span>
              </Card.Title>
              <Card.Description>
                {t("pages.table.tableCapacity", { count: table.capacity })}
                <span aria-hidden="true"> · </span>
                {sectionLabel}
              </Card.Description>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Chip
                color={tableStatusChipColors[table.status]}
                size="sm"
                variant="soft"
              >
                {statusLabel}
              </Chip>
              <span
                aria-hidden="true"
                className="inline-flex size-6 shrink-0 items-center justify-center"
              >
                {isSelected || table.status === "available" ? (
                  <IconCircleCheckFilled
                    className={isSelected ? "text-accent" : "text-success"}
                    size={20}
                  />
                ) : (
                  <span className="size-2 rounded-full bg-muted/45" />
                )}
              </span>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <BookingTimeline bookings={table.bookings} t={t} />
        </Card.Content>
      </Card>
      <button
        aria-controls="table-booking-aside"
        aria-label={t("pages.table.tableCardAriaLabel", {
          table: tableNumber,
          section: sectionLabel,
          status: statusLabel,
        })}
        aria-pressed={isSelected}
        className="absolute inset-0 z-10 rounded-3xl bg-transparent transition-[box-shadow] duration-150 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        type="button"
        onClick={onPress}
      />
    </div>
  );
}

function BookingTimeline({
  bookings,
  t,
}: {
  bookings: TableBooking[];
  t: ReturnType<typeof useTranslations>;
}) {
  const bookingsByTime = new Map(
    bookings.map((booking) => [booking.time, booking]),
  );

  return (
    <div className="flex flex-col" role="list">
      {tableBookingHours.map((hour) => {
        const booking = bookingsByTime.get(hour);

        return (
          <div
            key={hour}
            aria-label={
              booking ? getBookingAccessibleLabel(booking, hour, t) : hour
            }
            className="flex min-w-0 items-center gap-1.5 text-[11px]"
            role="listitem"
          >
            <span className="w-[3.6rem] shrink-0 py-1 font-mono tabular-nums text-muted">
              {hour}
            </span>
            {booking ? (
              <>
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  {getBookingDisplayName(booking, t)}
                  {booking.partySize !== undefined && (
                    <span className="font-normal text-muted">
                      {` (${t("pages.table.bookingPax", { count: booking.partySize })})`}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${bookingStatusDotColors[booking.status]}`}
                  title={t(
                    `pages.table.${bookingStatusLabels[booking.status]}`,
                  )}
                />
              </>
            ) : (
              <span className="flex-1 text-muted/60">—</span>
            )}
          </div>
        );
      })}
    </div>
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

function getBookingAccessibleLabel(
  booking: TableBooking,
  hour: string,
  t: ReturnType<typeof useTranslations>,
) {
  const guest = getBookingDisplayName(booking, t);
  const party =
    booking.partySize === undefined
      ? ""
      : t("pages.table.bookingPax", { count: booking.partySize });
  const status = t(`pages.table.${bookingStatusLabels[booking.status]}`);

  return [hour, guest, party, status].filter(Boolean).join(", ");
}

function getTableNumber(label: string) {
  return label.replace(/^TA/i, "");
}
