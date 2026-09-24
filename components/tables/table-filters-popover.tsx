"use client";

import {
  Button,
  Chip,
  Label,
  ListBox,
  Popover,
  Select,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  IconAdjustmentsHorizontal,
  IconRefresh,
} from "@tabler/icons-react";
import type { TableStatus } from "./table-data";

export type TableStatusFilter = "all" | TableStatus;
export type TableServerFilter = "all" | "Sokha" | "Dara" | "Mony";

const statusFilterOptions: ReadonlyArray<{
  id: TableStatusFilter;
  labelKey: string;
}> = [
  { id: "all", labelKey: "filterAll" },
  { id: "available", labelKey: "statusAvailable" },
  { id: "inProgress", labelKey: "statusInProgress" },
  { id: "reserved", labelKey: "statusReserved" },
  { id: "dirty", labelKey: "statusDirty" },
];

const serverFilterOptions: ReadonlyArray<{
  id: TableServerFilter;
  labelKey: string;
}> = [
  { id: "all", labelKey: "filterAllServers" },
  { id: "Sokha", labelKey: "filterSokha" },
  { id: "Dara", labelKey: "filterDara" },
  { id: "Mony", labelKey: "filterMony" },
];

export function TableFiltersPopover({
  activeFilterCount,
  serverFilter,
  statusFilter,
  onResetFilters,
  onServerFilterChange,
  onStatusFilterChange,
}: {
  activeFilterCount: number;
  serverFilter: TableServerFilter;
  statusFilter: TableStatusFilter;
  onResetFilters: () => void;
  onServerFilterChange: (value: TableServerFilter) => void;
  onStatusFilterChange: (value: TableStatusFilter) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <Popover>
      <Button
        aria-label={t("pages.table.filters")}
        className="relative h-10 w-10 min-w-10 shrink-0"
        isIconOnly
        variant="secondary"
      >
        <IconAdjustmentsHorizontal aria-hidden="true" size={18} />
        {activeFilterCount > 0 ? (
          <Chip
            className="absolute -end-1 -top-1"
            color="accent"
            size="sm"
            variant="soft"
          >
            {activeFilterCount}
          </Chip>
        ) : null}
      </Button>

      <Popover.Content
        className="w-[320px] max-w-[95vw]"
        placement="bottom end"
      >
        <Popover.Dialog className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Popover.Heading>
                {t("pages.table.filters")}
              </Popover.Heading>
              {activeFilterCount > 0 ? (
                <Chip
                  color="accent"
                  size="sm"
                  variant="soft"
                >
                  {activeFilterCount}
                </Chip>
              ) : null}
            </div>

            {activeFilterCount > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                onPress={onResetFilters}
              >
                <IconRefresh aria-hidden="true" size={14} />
                {t("pages.table.filterReset")}
              </Button>
            ) : null}
          </div>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 text-start text-sm">
            <TableFilterSelect
              ariaLabel={t("pages.table.filterStatusLabel")}
              label={t("pages.table.filterStatusLabel")}
              options={statusFilterOptions.map((option) => ({
                id: option.id,
                label: t(`pages.table.${option.labelKey}`),
              }))}
              selectedValue={statusFilter}
              onChange={onStatusFilterChange}
            />
            <TableFilterSelect
              ariaLabel={t("pages.table.filterServerLabel")}
              label={t("pages.table.filterServerLabel")}
              options={serverFilterOptions.map((option) => ({
                id: option.id,
                label: t(`pages.table.${option.labelKey}`),
              }))}
              selectedValue={serverFilter}
              onChange={onServerFilterChange}
            />
          </div>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

type TableFilterSelectOption<T extends string> = {
  id: T;
  label: string;
};

function TableFilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  label: string;
  onChange: (value: T) => void;
  options: TableFilterSelectOption<T>[];
  selectedValue: T;
}) {
  const currentOption = options.find((option) => option.id === selectedValue);

  return (
    <Select
      aria-label={ariaLabel}
      className="w-full"
      value={selectedValue}
      variant="secondary"
      onChange={(value) => {
        if (typeof value === "string") {
          onChange(value as T);
        }
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger className="w-full justify-start text-start">
        <Select.Value>
          {({ defaultChildren, isPlaceholder }) => {
            if (isPlaceholder || !currentOption) {
              return defaultChildren;
            }

            return <span>{currentOption.label}</span>;
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom start">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              className="text-start"
              id={option.id}
              textValue={option.label}
            >
              <span>{option.label}</span>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
