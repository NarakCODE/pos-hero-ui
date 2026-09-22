"use client";

import { Card, Chip, SearchField, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { IconClock, IconReceipt, IconUser } from "@tabler/icons-react";
import {
  TableFiltersPopover,
  type TableServerFilter,
  type TableStatusFilter,
} from "./table-filters-popover";
import {
  floorTables,
  type FloorTable,
  type TableSection,
  type TableStatus,
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

const tableStatusColors: Record<TableStatus, "success" | "warning" | "danger"> =
  {
    available: "success",
    inProgress: "warning",
    reserved: "danger",
    dirty: "danger",
  };

export interface TableFloorProps {
  className?: string;
  gridClassName?: string;
}

export function TableFloor({
  className = "",
  gridClassName = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
}: TableFloorProps = {}) {
  const t = useTranslations("SalesMenu");
  const [selectedSection, setSelectedSection] = useState<TableSection>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TableStatusFilter>("all");
  const [serverFilter, setServerFilter] = useState<TableServerFilter>("all");

  const activeFilterCount =
    Number(statusFilter !== "all") + Number(serverFilter !== "all");

  const filteredTables = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return floorTables.filter((table) => {
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
  }, [searchQuery, selectedSection, serverFilter, statusFilter]);

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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin px-(--pos-content-padding) pb-(--pos-content-padding)">
        {filteredTables.length > 0 ? (
          <div className={gridClassName}>
            {filteredTables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={selectedTableId === table.id}
                sectionLabel={t(
                  `pages.table.${tableSectionNameKeys[table.section]}`,
                )}
                statusLabel={t(
                  `pages.table.${tableStatusLabels[table.status]}`,
                )}
                onPress={() => setSelectedTableId(table.id)}
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
}: {
  isSelected: boolean;
  onPress: () => void;
  sectionLabel: string;
  statusLabel: string;
  table: FloorTable;
}) {
  const t = useTranslations("SalesMenu");
  const hasSession = table.status === "inProgress" || table.status === "dirty";
  const showSessionLayout = hasSession || table.status === "available";

  return (
    <Card<"button">
      className={`group min-h-44 w-full text-start transition-[background-color,box-shadow,border-color] duration-150 hover:bg-default-hover hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
        isSelected ? "border-accent ring-2 ring-accent/30" : ""
      }`}
      render={(props) => (
        <button
          {...props}
          aria-pressed={isSelected}
          aria-label={`${table.label}, ${statusLabel}`}
          type="button"
          onClick={onPress}
        />
      )}
      variant="default"
    >
      <Card.Header className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-0">
        <div className="min-w-0">
          <Card.Title className="truncate text-lg font-bold tracking-tight">
            {table.label}
          </Card.Title>
          <Card.Description className="mt-0.5 truncate text-xs">
            {sectionLabel}
          </Card.Description>
        </div>

        <Chip
          className="shrink-0"
          color={tableStatusColors[table.status]}
          size="sm"
          variant="soft"
        >
          {statusLabel}
        </Chip>
      </Card.Header>

      <Card.Content className="p-4 pt-5">
        {showSessionLayout ? (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <IconUser aria-hidden="true" className="shrink-0" size={14} />
                <span className="truncate">{table.server ?? "--"}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconUser aria-hidden="true" className="shrink-0" size={14} />
                <span className="truncate">
                  {table.guestCount === undefined
                    ? "--"
                    : t("pages.table.sessionGuests", {
                        count: table.guestCount,
                      })}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconReceipt aria-hidden="true" className="shrink-0" size={14} />
                <span className="truncate">
                  {table.itemCount === undefined
                    ? "0"
                    : t("pages.table.sessionItems", {
                        count: table.itemCount,
                      })}
                </span>
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/60 pt-3">
              <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted">
                <IconClock aria-hidden="true" className="shrink-0" size={14} />
                <span className="truncate">
                  {table.orderTime === undefined
                    ? "--"
                    : t("pages.table.sessionStarted", {
                        time: table.orderTime,
                      })}
                </span>
              </span>
              <div className="shrink-0 text-end">
                <p className="text-[10px] font-medium text-muted">
                  {t("pages.table.sessionTotal")}
                </p>
                <p className="text-base font-bold tabular-nums text-foreground">
                  {table.runningTotal ?? "0"}
                </p>
              </div>
            </div>
          </>
        ) : table.status === "reserved" ? (
          <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted">
            <IconClock aria-hidden="true" className="shrink-0" size={15} />
            <span className="truncate">
              {t("pages.table.reservationAt", {
                time: table.reservationTime ?? "—",
              })}
            </span>
          </span>
        ) : null}
      </Card.Content>
    </Card>
  );
}
