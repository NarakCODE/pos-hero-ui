"use client";

import {
  Avatar,
  Button,
  Chip,
  Label,
  ListBox,
  Pagination,
  Popover,
  SearchField,
  Select,
  Table,
  Tabs,
} from "@heroui/react";
import type { Key, Selection, SortDescriptor } from "@heroui/react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Receipt2,
  RotateRight,
  Send2,
  Sliders,
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
    if (channelFilter !== "all") count++;
    if (dateFilter !== "today") count++;
    if (paymentStatusFilter !== "all") count++;
    return count;
  }, [channelFilter, dateFilter, paymentStatusFilter]);

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
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden text-foreground">
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

      <div className="flex min-h-0 flex-1 p-(--pos-content-padding)">
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
                {(order) => (
                  <OrderTableRows key={order.id} order={order} t={t} />
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <div className="shrink-0 px-(--pos-content-padding) pb-(--pos-content-padding)">
        <TablePagination
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={updatePageSize}
          t={t}
        />
      </div>
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
    <div className="flex shrink-0 flex-col">
      <Tabs
        className="min-w-0"
        selectedKey={statusFilter}
        variant="secondary"
        onSelectionChange={(key) =>
          onStatusFilterChange(String(key) as StatusFilter)
        }
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("toolbar.statusLabel")}>
            {statusFilterOptions.map((opt) => (
              <Tabs.Tab
                key={opt.id}
                id={opt.id}
                className="w-auto shrink-0 whitespace-nowrap"
              >
                {t(opt.labelKey)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="flex w-full shrink-0 items-center gap-2 px-(--pos-content-padding) py-3">
        <SearchField
          aria-label={t("toolbar.searchLabel")}
          className="flex-1"
          fullWidth
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
              className="relative h-10 w-10 min-w-10 shrink-0"
              isIconOnly
              variant="secondary"
            >
              <Sliders aria-hidden="true" size={18} />
              {activeFilterCount > 0 ? (
                <Chip
                  className="absolute -inset-e-1 -top-1"
                  color="accent"
                  size="sm"
                  variant="soft"
                >
                  {activeFilterCount}
                </Chip>
              ) : null}
            </Button>

            <Popover.Content
              className="w-85 max-w-[95vw] rounded-2xl border-0 bg-surface p-0 shadow-2xl sm:w-105"
              placement="bottom end"
            >
              <Popover.Dialog className="flex w-full flex-col p-0 text-start outline-none">
                <div className="flex w-full items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Popover.Heading className="text-start text-sm font-semibold text-foreground">
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

                <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 text-start text-sm">
                  <FilterSelect
                    ariaLabel={t("toolbar.channelLabel")}
                    label={t("toolbar.channelLabel")}
                    options={channelFilterOptions.map((opt) => {
                      const avatarSrc =
                        opt.id !== "all"
                          ? getOrderChannelAvatarSrc(opt.id)
                          : undefined;

                      return {
                        id: opt.id,
                        label: t(opt.labelKey),
                        leading:
                          opt.id !== "all" ? (
                            <Avatar
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0"
                            >
                              {avatarSrc ? (
                                <Avatar.Image
                                  alt=""
                                  className="object-contain"
                                  src={avatarSrc}
                                />
                              ) : (
                                <Avatar.Fallback>
                                  <Receipt2 aria-hidden="true" size={12} />
                                </Avatar.Fallback>
                              )}
                            </Avatar>
                          ) : undefined,
                      };
                    })}
                    selectedValue={channelFilter}
                    onChange={onChannelFilterChange}
                  />

                  <FilterSelect
                    ariaLabel={t("toolbar.dateLabel")}
                    label={t("toolbar.dateLabel")}
                    options={dateFilterOptions.map((opt) => ({
                      id: opt.id,
                      label: t(opt.labelKey),
                    }))}
                    selectedValue={dateFilter}
                    onChange={onDateFilterChange}
                  />

                  <FilterSelect
                    ariaLabel={t("toolbar.paymentStatusLabel")}
                    label={t("toolbar.paymentStatusLabel")}
                    options={paymentStatusFilterOptions.map((opt) => ({
                      id: opt.id,
                      label: t(opt.labelKey),
                    }))}
                    selectedValue={paymentStatusFilter}
                    onChange={onPaymentStatusFilterChange}
                  />
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
      </div>
    </div>
  );
}

type FilterSelectOption<T extends string> = {
  id: T;
  label: string;
  leading?: ReactNode;
};

function FilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  onChange: (value: T) => void;
  options: FilterSelectOption<T>[];
  selectedValue: T;
  label: string;
}) {
  const currentOption = options.find((opt) => opt.id === selectedValue);

  return (
    <Select
      aria-label={ariaLabel}
      className="w-full"
      value={selectedValue}
      variant="secondary"
      onChange={(value) => {
        const nextValue = normalizeFilterValue(value);

        if (nextValue) {
          onChange(nextValue as T);
        }
      }}
    >
      <Label className="text-start text-xs font-semibold text-muted">
        {label}
      </Label>
      <Select.Trigger className="w-full justify-start text-start">
        <Select.Value>
          {({ defaultChildren, isPlaceholder }) => {
            if (isPlaceholder || !currentOption) {
              return defaultChildren;
            }

            return (
              <div className="flex items-center gap-2">
                {currentOption.leading}
                <span>{currentOption.label}</span>
              </div>
            );
          }}
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom start">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              className="text-start"
              id={option.id}
              key={option.id}
              textValue={option.label}
            >
              <div className="flex items-center gap-2">
                {option.leading}
                <span>{option.label}</span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
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
