"use client";

import { Card, Chip, SearchField, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Clock, Profile, Receipt2 } from "reicon-react";
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

export function TableFloor() {
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
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden text-foreground">
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

      <div className="flex shrink-0 items-center gap-2 px-[var(--pos-content-padding)] py-3">
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
        {filteredTables.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
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

  return (
    <Card<"button">
      className={`group min-h-44 w-full text-start transition-[background-color,border-color,box-shadow] duration-150 ${
        isSelected
          ? "border-accent bg-accent/5 shadow-sm ring-2 ring-accent/20"
          : "hover:bg-default-hover hover:shadow-sm"
      } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
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
          <Card.Title className="text-lg font-bold tracking-tight">
            {table.label}
          </Card.Title>
          <Card.Description className="mt-0.5 text-xs">
            {sectionLabel}
          </Card.Description>
        </div>

        <Chip color={tableStatusColors[table.status]} size="sm" variant="soft">
          {statusLabel}
        </Chip>
      </Card.Header>

      <Card.Content className="p-4 pt-5">
        {hasSession ? (
          <>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Profile aria-hidden="true" size={14} />
                {table.server}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Profile aria-hidden="true" size={14} />
                {t("pages.table.sessionGuests", {
                  count: table.guestCount ?? 0,
                })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Receipt2 aria-hidden="true" size={14} />
                {t("pages.table.sessionItems", {
                  count: table.itemCount ?? 0,
                })}
              </span>
            </div>

            <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/60 pt-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                <Clock aria-hidden="true" size={14} />
                {t("pages.table.sessionStarted", {
                  time: table.orderTime ?? "—",
                })}
              </span>
              <div className="text-end">
                <p className="text-[10px] font-medium text-muted">
                  {t("pages.table.sessionTotal")}
                </p>
                <p className="text-base font-bold tabular-nums text-foreground">
                  {table.runningTotal}
                </p>
              </div>
            </div>
          </>
        ) : table.status === "reserved" ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted">
            <Clock aria-hidden="true" size={15} />
            {t("pages.table.reservationAt", {
              time: table.reservationTime ?? "—",
            })}
          </span>
        ) : (
          <p className="text-sm text-muted">{t("pages.table.availableHint")}</p>
        )}
      </Card.Content>
    </Card>
  );
}
