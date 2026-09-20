"use client";

import {
  Avatar,
  Button,
  Chip,
  ListBox,
  Pagination,
  Popover,
  SearchField,
  Select,
  Table,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import type { Key, Selection, SortDescriptor } from "@heroui/react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  CloseCircle,
  Filter,
  Receipt2,
  RotateRight,
  Send2,
} from "reicon-react";
import { getOrderChannelAvatarSrc } from "@/components/order-channel-select";
import {
  orderRecords,
  type FulfillmentStatus,
  type OrderChannel,
  type OrderRecord,
  type OrderShift,
  type PaymentStatus,
} from "./orders-data";

type ChannelFilter = "all" | OrderChannel;
type DateFilter = "today" | OrderShift | "custom";
type StatusFilter = "all" | FulfillmentStatus;
type PaymentStatusFilter = "all" | PaymentStatus;
type PageSize = 25 | 50 | 100;

const pageSizes: PageSize[] = [25, 50, 100];
const linkClass = "text-muted hover:bg-surface hover:text-foreground";
const activeClass = "bg-accent text-accent-foreground hover:bg-accent-hover";
const filterToggleClass =
  "h-8 gap-1.5 rounded-lg bg-surface-secondary px-2.5 text-xs font-medium text-muted transition-colors hover:bg-surface-secondary/80 hover:text-foreground data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-accent-foreground data-[selected=true]:hover:bg-accent-hover";

const statusFilterOptions: { id: StatusFilter; labelKey: string }[] = [
  { id: "all", labelKey: "statuses.all" },
  { id: "inProgress", labelKey: "statuses.inProgress" },
  { id: "completed", labelKey: "statuses.completed" },
  { id: "onHold", labelKey: "statuses.onHold" },
  { id: "new", labelKey: "statuses.new" },
  { id: "cancelled", labelKey: "statuses.cancelled" },
  { id: "refund", labelKey: "statuses.refund" },
  { id: "rejected", labelKey: "statuses.rejected" },
];

const channelFilterOptions: { id: ChannelFilter; labelKey: string }[] = [
  { id: "all", labelKey: "channels.all" },
  { id: "pos", labelKey: "channels.pos" },
  { id: "foodpanda", labelKey: "channels.foodpanda" },
  { id: "grabfood", labelKey: "channels.grabfood" },
  { id: "wownow", labelKey: "channels.wownow" },
  { id: "nham24", labelKey: "channels.nham24" },
];

const dateFilterOptions: { id: DateFilter; labelKey: string }[] = [
  { id: "today", labelKey: "dateFilters.today" },
  { id: "morning", labelKey: "dateFilters.morning" },
  { id: "afternoon", labelKey: "dateFilters.afternoon" },
  { id: "evening", labelKey: "dateFilters.evening" },
  { id: "custom", labelKey: "dateFilters.custom" },
];

const paymentStatusFilterOptions: {
  id: PaymentStatusFilter;
  labelKey: string;
}[] = [
  { id: "all", labelKey: "paymentStatuses.all" },
  { id: "paid", labelKey: "paymentStatuses.paid" },
  { id: "pending", labelKey: "paymentStatuses.pending" },
  { id: "refunded", labelKey: "paymentStatuses.refunded" },
];

export function OrdersDataGrid({
  onOrderSelect,
  selectedOrderId,
}: {
  onOrderSelect: (orderId: string) => void;
  selectedOrderId: string | null;
}) {
  const t = useTranslations("OrdersPage");
  const orders = orderRecords;
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatusFilter>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "created",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    if (channelFilter !== "all") count++;
    if (dateFilter !== "today") count++;
    if (paymentStatusFilter !== "all") count++;
    return count;
  }, [channelFilter, dateFilter, paymentStatusFilter, statusFilter]);

  const handleResetFilters = () => {
    setStatusFilter("all");
    setChannelFilter("all");
    setDateFilter("today");
    setPaymentStatusFilter("all");
    setPage(1);
  };

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          order.orderCode,
          order.customerName,
          order.customerPhone,
          order.tableNumber,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus =
        statusFilter === "all" || order.fulfillmentStatus === statusFilter;
      const matchesChannel =
        channelFilter === "all" || order.channel === channelFilter;
      const matchesDate =
        dateFilter === "today" ||
        dateFilter === "custom" ||
        order.shift === dateFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        order.paymentStatus === paymentStatusFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesChannel &&
        matchesDate &&
        matchesPaymentStatus
      );
    });
  }, [
    channelFilter,
    dateFilter,
    orders,
    paymentStatusFilter,
    query,
    statusFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((first, second) =>
      compareOrders(first, second, sortDescriptor),
    );
  }, [filteredOrders, sortDescriptor]);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return sortedOrders.slice(start, start + pageSize);
  }, [pageSize, safePage, sortedOrders]);

  const selectedKeys = useMemo<Selection>(
    () => (selectedOrderId ? new Set([selectedOrderId]) : new Set()),
    [selectedOrderId],
  );

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") {
      return;
    }

    const selectedKey = Array.from(selection)[0];

    if (selectedKey !== undefined) {
      onOrderSelect(String(selectedKey));
    }
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const updateStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const updateChannelFilter = (value: ChannelFilter) => {
    setChannelFilter(value);
    setPage(1);
  };

  const updateDateFilter = (value: DateFilter) => {
    setDateFilter(value);
    setPage(1);
  };

  const updatePaymentStatusFilter = (value: PaymentStatusFilter) => {
    setPaymentStatusFilter(value);
    setPage(1);
  };

  const updatePageSize = (value: Key | Key[] | null) => {
    setPageSize(Number(normalizeFilterValue(value)) as PageSize);
    setPage(1);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3 p-3 text-foreground sm:gap-4 sm:p-4">
      <OrdersToolbar
        activeFilterCount={activeFilterCount}
        channelFilter={channelFilter}
        dateFilter={dateFilter}
        paymentStatusFilter={paymentStatusFilter}
        query={query}
        statusFilter={statusFilter}
        t={t}
        onChannelFilterChange={updateChannelFilter}
        onDateFilterChange={updateDateFilter}
        onPaymentStatusFilterChange={updatePaymentStatusFilter}
        onResetFilters={handleResetFilters}
        onSearchChange={updateQuery}
        onStatusFilterChange={updateStatusFilter}
      />

      <Table className="min-h-0 flex-1" variant="secondary">
        <Table.ScrollContainer className="min-h-0 flex-1 overflow-auto overscroll-contain">
          <Table.Content
            aria-label={t("table.label")}
            selectedKeys={selectedKeys}
            selectionMode="single"
            sortDescriptor={sortDescriptor}
            onSelectionChange={handleSelectionChange}
            onSortChange={setSortDescriptor}
          >
            <Table.Header className="sticky top-0 z-20 bg-surface text-foreground">
              <Table.Column
                allowsSorting
                id="sequence"
                className="text-center after:hidden"
              >
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.no")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="customer" isRowHeader>
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.customer")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="channel">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.channel")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="payment">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.payment")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="total" className="text-end">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.totalBill")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="created" className="text-end">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.dateTime")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="pickup" className="text-end">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.pickupTime")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="end" className="text-end">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.endTime")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="status" className="text-center">
                {({ sortDirection }) => (
                  <Table.SortableColumnHeader sortDirection={sortDirection}>
                    {t("table.status")}
                  </Table.SortableColumnHeader>
                )}
              </Table.Column>
            </Table.Header>
            <Table.Body
              items={paginatedOrders}
              renderEmptyState={() => (
                <div className="p-10 text-center text-sm text-muted">
                  {t("table.empty")}
                </div>
              )}
            >
              {(order) => <OrderTableRows key={order.id} order={order} t={t} />}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <TablePagination
        page={safePage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={updatePageSize}
        t={t}
      />
    </div>
  );
}

function OrdersToolbar({
  activeFilterCount,
  channelFilter,
  dateFilter,
  onChannelFilterChange,
  onDateFilterChange,
  onPaymentStatusFilterChange,
  onResetFilters,
  onSearchChange,
  onStatusFilterChange,
  paymentStatusFilter,
  query,
  statusFilter,
  t,
}: {
  activeFilterCount: number;
  channelFilter: ChannelFilter;
  dateFilter: DateFilter;
  onChannelFilterChange: (value: ChannelFilter) => void;
  onDateFilterChange: (value: DateFilter) => void;
  onPaymentStatusFilterChange: (value: PaymentStatusFilter) => void;
  onResetFilters: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  paymentStatusFilter: PaymentStatusFilter;
  query: string;
  statusFilter: StatusFilter;
  t: ReturnType<typeof useTranslations<"OrdersPage">>;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <SearchField
          aria-label={t("toolbar.searchLabel")}
          className="min-w-64 flex-1 sm:max-w-md"
          value={query}
          variant="secondary"
          onChange={onSearchChange}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={t("toolbar.searchPlaceholder")} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Popover>
          <Button
            aria-label={t("toolbar.filters")}
            className="relative flex h-10 items-center gap-2 px-3.5 font-medium"
            variant="secondary"
          >
            <Filter aria-hidden="true" size={18} />
            <span>{t("toolbar.filters")}</span>
            {activeFilterCount > 0 ? (
              <Chip
                className="h-5 min-w-5 justify-center px-1 text-xs font-bold"
                color="accent"
                size="sm"
                variant="soft"
              >
                {activeFilterCount}
              </Chip>
            ) : null}
          </Button>

          <Popover.Content
            className="w-[340px] max-w-[95vw] rounded-2xl border border-border bg-surface p-0 shadow-2xl sm:w-[420px]"
            placement="bottom end"
          >
            <Popover.Dialog className="flex flex-col outline-none">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Popover.Heading className="text-sm font-semibold text-foreground">
                    {t("toolbar.filters")}
                  </Popover.Heading>
                  {activeFilterCount > 0 ? (
                    <Chip
                      className="h-5 min-w-5 justify-center px-1 text-xs font-semibold"
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
                    className="h-7 px-2 text-xs font-medium text-muted hover:text-foreground"
                    size="sm"
                    variant="ghost"
                    onPress={onResetFilters}
                  >
                    <RotateRight
                      aria-hidden="true"
                      className="mr-1 inline-block"
                      size={14}
                    />
                    {t("toolbar.reset")}
                  </Button>
                ) : null}
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 text-sm">
                {/* 1. Order Status */}
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("toolbar.statusLabel")}
                  </div>
                  <FilterToggleGroup
                    ariaLabel={t("toolbar.statusLabel")}
                    options={statusFilterOptions.map((opt) => ({
                      id: opt.id,
                      label: t(opt.labelKey),
                    }))}
                    selectedValue={statusFilter}
                    onChange={onStatusFilterChange}
                  />
                </div>

                {/* 2. Order Channel */}
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("toolbar.channelLabel")}
                  </div>
                  <FilterToggleGroup
                    ariaLabel={t("toolbar.channelLabel")}
                    options={channelFilterOptions.map((opt) => {
                      const avatarSrc =
                        opt.id !== "all"
                          ? getOrderChannelAvatarSrc(opt.id)
                          : undefined;

                      return {
                        id: opt.id,
                        label: t(opt.labelKey),
                        leading: avatarSrc ? (
                          <Avatar
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                          >
                            <Avatar.Image
                              alt=""
                              className="object-contain"
                              src={avatarSrc}
                            />
                          </Avatar>
                        ) : undefined,
                      };
                    })}
                    selectedValue={channelFilter}
                    onChange={onChannelFilterChange}
                  />
                </div>

                {/* 3. Date / Shift */}
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("toolbar.dateLabel")}
                  </div>
                  <FilterToggleGroup
                    ariaLabel={t("toolbar.dateLabel")}
                    options={dateFilterOptions.map((opt) => ({
                      id: opt.id,
                      label: t(opt.labelKey),
                    }))}
                    selectedValue={dateFilter}
                    onChange={onDateFilterChange}
                  />
                </div>

                {/* 4. Payment Status */}
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    {t("toolbar.paymentStatusLabel")}
                  </div>
                  <FilterToggleGroup
                    ariaLabel={t("toolbar.paymentStatusLabel")}
                    options={paymentStatusFilterOptions.map((opt) => ({
                      id: opt.id,
                      label: t(opt.labelKey),
                    }))}
                    selectedValue={paymentStatusFilter}
                    onChange={onPaymentStatusFilterChange}
                  />
                </div>
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="mr-1 text-xs font-medium text-muted">
            {t("toolbar.filters")}:
          </span>

          {statusFilter !== "all" ? (
            <Chip
              className="gap-1 bg-surface-secondary pr-1 text-xs"
              size="sm"
              variant="secondary"
            >
              <Chip.Label>
                {t("toolbar.statusLabel")}: {t(`statuses.${statusFilter}`)}
              </Chip.Label>
              <Button
                aria-label={`Remove ${t("toolbar.statusLabel")} filter`}
                className="size-5 min-w-5 p-0 text-muted hover:bg-danger/15 hover:text-danger"
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onStatusFilterChange("all")}
              >
                <CloseCircle aria-hidden="true" size={14} />
              </Button>
            </Chip>
          ) : null}

          {channelFilter !== "all" ? (
            <Chip
              className="gap-1 bg-surface-secondary pr-1 text-xs"
              size="sm"
              variant="secondary"
            >
              <Chip.Label>
                {t("toolbar.channelLabel")}: {t(`channels.${channelFilter}`)}
              </Chip.Label>
              <Button
                aria-label={`Remove ${t("toolbar.channelLabel")} filter`}
                className="size-5 min-w-5 p-0 text-muted hover:bg-danger/15 hover:text-danger"
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onChannelFilterChange("all")}
              >
                <CloseCircle aria-hidden="true" size={14} />
              </Button>
            </Chip>
          ) : null}

          {dateFilter !== "today" ? (
            <Chip
              className="gap-1 bg-surface-secondary pr-1 text-xs"
              size="sm"
              variant="secondary"
            >
              <Chip.Label>
                {t("toolbar.dateLabel")}: {t(`dateFilters.${dateFilter}`)}
              </Chip.Label>
              <Button
                aria-label={`Remove ${t("toolbar.dateLabel")} filter`}
                className="size-5 min-w-5 p-0 text-muted hover:bg-danger/15 hover:text-danger"
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onDateFilterChange("today")}
              >
                <CloseCircle aria-hidden="true" size={14} />
              </Button>
            </Chip>
          ) : null}

          {paymentStatusFilter !== "all" ? (
            <Chip
              className="gap-1 bg-surface-secondary pr-1 text-xs"
              size="sm"
              variant="secondary"
            >
              <Chip.Label>
                {t("toolbar.paymentStatusLabel")}:{" "}
                {t(`paymentStatuses.${paymentStatusFilter}`)}
              </Chip.Label>
              <Button
                aria-label={`Remove ${t("toolbar.paymentStatusLabel")} filter`}
                className="size-5 min-w-5 p-0 text-muted hover:bg-danger/15 hover:text-danger"
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={() => onPaymentStatusFilterChange("all")}
              >
                <CloseCircle aria-hidden="true" size={14} />
              </Button>
            </Chip>
          ) : null}

          <Button
            className="h-6 px-1.5 text-xs text-muted hover:text-foreground"
            size="sm"
            variant="ghost"
            onPress={onResetFilters}
          >
            {t("toolbar.clearAll")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

type FilterToggleOption<T extends string> = {
  id: T;
  label: string;
  leading?: ReactNode;
};

function FilterToggleGroup<T extends string>({
  ariaLabel,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: FilterToggleOption<T>[];
  selectedValue: T;
}) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1.5"
      disallowEmptySelection
      isDetached
      selectedKeys={new Set([selectedValue])}
      selectionMode="single"
      size="sm"
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0];

        if (typeof selectedKey === "string") {
          onChange(selectedKey as T);
        }
      }}
    >
      {options.map((option) => (
        <ToggleButton
          className={filterToggleClass}
          id={option.id}
          key={option.id}
          variant="ghost"
        >
          {option.leading}
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function OrderTableRows({
  order,
  t,
}: {
  order: OrderRecord;
  t: ReturnType<typeof useTranslations<"OrdersPage">>;
}) {
  const avatarSrc = getOrderChannelAvatarSrc(order.channel);

  return (
    <Table.Row
      id={order.id}
      textValue={`${order.orderCode} ${order.customerName}`}
      className="cursor-pointer hover:bg-surface-secondary/50 data-[selected=true]:bg-accent/10 [&>td]:py-3"
    >
      <Table.Cell className="text-center text-sm tabular-nums text-muted">
        #{order.sequence}/1
      </Table.Cell>
      <Table.Cell textValue={order.customerName}>
        <div className="min-w-0">
          <p className="whitespace-normal text-sm font-semibold text-foreground">
            {order.customerName}
          </p>
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            {avatarSrc ? (
              <Avatar.Image
                alt={`${channelLabel(order, t)} logo`}
                className="object-contain"
                src={avatarSrc}
              />
            ) : null}
            <Avatar.Fallback>
              {order.channel === "pos" ? (
                <Receipt2 aria-hidden="true" size={16} />
              ) : (
                <Send2 aria-hidden="true" size={16} />
              )}
            </Avatar.Fallback>
          </Avatar>
          <Chip size="sm" variant="secondary">
            {channelLabel(order, t)}
          </Chip>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="whitespace-normal text-sm font-medium text-foreground">
          {order.tender}
        </span>
      </Table.Cell>
      <Table.Cell className="text-end">
        <div className="flex flex-col items-end">
          <span className="text-base font-semibold tabular-nums text-foreground">
            ${order.totalUsd.toFixed(2)}
          </span>
          <span className="text-xs tabular-nums text-muted">
            ៛{order.totalKhr.toLocaleString("en-US")}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell className="text-end">
        <TwoLineCell
          primary={order.createdTime}
          secondary={order.createdDate}
        />
      </Table.Cell>
      <Table.Cell className="text-end">
        <TwoLineCell primary={order.pickupTime} secondary={order.pickupDate} />
      </Table.Cell>
      <Table.Cell className="text-end">
        <TwoLineCell primary={order.endTime} secondary={order.endDate} />
      </Table.Cell>
      <Table.Cell className="text-center">
        <Chip
          color={fulfillmentStatusColor[order.fulfillmentStatus]}
          size="sm"
          variant="soft"
        >
          {t(`statuses.${order.fulfillmentStatus}`)}
        </Chip>
      </Table.Cell>
    </Table.Row>
  );
}

function TwoLineCell({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <div className="flex flex-col text-sm">
      <span className="font-medium tabular-nums text-foreground">
        {primary}
      </span>
      <span className="text-xs text-muted">{secondary}</span>
    </div>
  );
}

function channelLabel(
  order: OrderRecord,
  t: ReturnType<typeof useTranslations<"OrdersPage">>,
) {
  if (order.channel === "pos") {
    return order.tableNumber.startsWith("Table")
      ? t("channels.dineIn")
      : t("channels.takeAway");
  }

  return t(`channels.${order.channel}`);
}

function TablePagination({
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  t,
  totalPages,
}: {
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: Key | Key[] | null) => void;
  page: number;
  pageSize: PageSize;
  t: ReturnType<typeof useTranslations<"OrdersPage">>;
  totalPages: number;
}) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between gap-3 ">
      <Select
        aria-label={t("pagination.rows")}
        className="w-28 shrink-0"
        value={String(pageSize)}
        variant="secondary"
        onChange={onPageSizeChange}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {pageSizes.map((size) => (
              <ListBox.Item
                key={size}
                id={String(size)}
                textValue={String(size)}
              >
                {size}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Pagination className="justify-end">
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              aria-label={t("pagination.previous")}
              className={linkClass}
              isDisabled={page === 1}
              onPress={() => onPageChange(Math.max(1, page - 1))}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item key={pageNumber}>
                <Pagination.Link
                  className={pageNumber === page ? activeClass : linkClass}
                  isActive={pageNumber === page}
                  onPress={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}
          <Pagination.Item>
            <Pagination.Next
              aria-label={t("pagination.next")}
              className={linkClass}
              isDisabled={page === totalPages}
              onPress={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}

function normalizeFilterValue(value: Key | Key[] | null) {
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}

function compareOrders(
  first: OrderRecord,
  second: OrderRecord,
  descriptor: SortDescriptor,
) {
  const column = String(descriptor.column ?? "created");
  const firstValue = getSortValue(first, column);
  const secondValue = getSortValue(second, column);
  const comparison =
    typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue));

  return descriptor.direction === "descending" ? comparison * -1 : comparison;
}

function getSortValue(order: OrderRecord, column: string) {
  switch (column) {
    case "sequence":
      return order.sequence;
    case "orderCode":
      return order.orderCode;
    case "customer":
      return order.customerName;
    case "channel":
      return order.channel;
    case "payment":
      return order.tender;
    case "total":
      return order.totalUsd;
    case "pickup":
      return order.pickupTime;
    case "end":
      return order.endTime;
    case "status":
      return order.fulfillmentStatus;
    case "created":
      return order.sequence;
    default:
      return order.sequence;
  }
}

const fulfillmentStatusColor: Record<
  FulfillmentStatus,
  "accent" | "danger" | "warning"
> = {
  new: "accent",
  inProgress: "warning",
  onHold: "warning",
  completed: "accent",
  rejected: "danger",
  refund: "danger",
  void: "danger",
  expired: "danger",
  cancelled: "danger",
};
