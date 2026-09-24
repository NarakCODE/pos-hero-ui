"use client";

import { useMemo, useState } from "react";
import type { Key, Selection, SortDescriptor } from "@heroui/react";
import {
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
  toast,
} from "@heroui/react";
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconPrinter,
  IconReceipt,
  IconReceiptRefund,
  IconRotateClockwise,
} from "@tabler/icons-react";
import {
  formatUsd,
  type InvoiceRecord,
  type InvoiceStatus,
  type OrderChannel,
  type OrderShift,
  type PaymentMethod,
} from "./invoices-data";

type StatusFilter = "all" | InvoiceStatus;
type ShiftFilter = "all" | OrderShift | "yesterday" | "last7days";
type TenderFilter = "all" | PaymentMethod;
type ChannelFilter = "all" | OrderChannel;
type PageSize = 25 | 50 | 100;

const pageSizes: PageSize[] = [25, 50, 100];

const statusFilterTabs: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All Receipts" },
  { id: "paid", label: "Paid" },
  { id: "pending", label: "Pending" },
  { id: "refunded", label: "Refunded" },
  { id: "voided", label: "Voided" },
];

const shiftFilterOptions: { id: ShiftFilter; label: string }[] = [
  { id: "all", label: "Today (All Shifts)" },
  { id: "morning", label: "Morning Shift (06:00 - 14:00)" },
  { id: "afternoon", label: "Afternoon Shift (14:00 - 22:00)" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last7days", label: "Last 7 Days" },
];

const tenderFilterOptions: { id: TenderFilter; label: string }[] = [
  { id: "all", label: "All Payment Tenders" },
  { id: "cash", label: "Cash (USD / KHR)" },
  { id: "khqr", label: "KHQR (Bakong / ABA)" },
  { id: "bankCard", label: "Bank Card (Visa / MC)" },
  { id: "wownowPay", label: "Wownow Pay" },
  { id: "foodpandaPay", label: "Foodpanda Pay" },
];

const channelFilterOptions: { id: ChannelFilter; label: string }[] = [
  { id: "all", label: "All Channels" },
  { id: "pos", label: "In-Store POS" },
  { id: "foodpanda", label: "Foodpanda" },
  { id: "wownow", label: "WowNow" },
  { id: "grabfood", label: "GrabFood" },
  { id: "nham24", label: "NHAM24" },
];

interface InvoicesDataGridProps {
  invoices: InvoiceRecord[];
  onInvoiceSelect: (invoiceId: string) => void;
  onBatchPrint?: (invoiceIds: string[]) => void;
  onBatchSettle?: (invoiceIds: string[]) => void;
  onQuickRefund?: (invoice: InvoiceRecord) => void;
  onQuickVoid?: (invoice: InvoiceRecord) => void;
}

export function InvoicesDataGrid({
  invoices,
  onInvoiceSelect,
  onBatchPrint,
  onBatchSettle,
  onQuickRefund,
  onQuickVoid,
}: InvoicesDataGridProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [shiftFilter, setShiftFilter] = useState<ShiftFilter>("all");
  const [tenderFilter, setTenderFilter] = useState<TenderFilter>("all");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  // Active filters count
  const activeFilterCount =
    (shiftFilter !== "all" ? 1 : 0) +
    (tenderFilter !== "all" ? 1 : 0) +
    (channelFilter !== "all" ? 1 : 0);
  const hasActiveFilters =
    activeFilterCount > 0 || statusFilter !== "all" || query.trim() !== "";

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setShiftFilter("all");
    setTenderFilter("all");
    setChannelFilter("all");
    setPage(1);
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    const q = query.trim().toLowerCase();

    return invoices.filter((inv) => {
      // Status filter
      if (statusFilter !== "all" && inv.status !== statusFilter) {
        return false;
      }

      // Shift filter
      if (shiftFilter === "morning" || shiftFilter === "afternoon") {
        if (inv.shift !== shiftFilter) return false;
      }

      // Tender filter
      if (tenderFilter !== "all" && inv.paymentMethod !== tenderFilter) {
        return false;
      }

      // Channel filter
      if (channelFilter !== "all" && inv.channel !== channelFilter) {
        return false;
      }

      // Search query
      if (q) {
        const matchesReceipt = inv.receiptNumber.toLowerCase().includes(q);
        const matchesInvoice = inv.invoiceNumber.toLowerCase().includes(q);
        const matchesOrder = inv.orderCode.toLowerCase().includes(q);
        const matchesCustomer = inv.customer.name.toLowerCase().includes(q);
        const matchesPhone = inv.customer.phone?.toLowerCase().includes(q);
        const matchesCashier = inv.cashierName.toLowerCase().includes(q);
        const matchesTable = inv.tableNumber.toLowerCase().includes(q);
        const matchesItems = inv.items.some((it) =>
          it.name.toLowerCase().includes(q),
        );

        if (
          !matchesReceipt &&
          !matchesInvoice &&
          !matchesOrder &&
          !matchesCustomer &&
          !matchesPhone &&
          !matchesCashier &&
          !matchesTable &&
          !matchesItems
        ) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, statusFilter, shiftFilter, tenderFilter, channelFilter, query]);

  // Sorting
  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      const direction = sortDescriptor.direction === "ascending" ? 1 : -1;
      switch (sortDescriptor.column) {
        case "sequence":
          return (a.sequence - b.sequence) * direction;
        case "total":
          return (a.totalUsd - b.totalUsd) * direction;
        case "customer":
          return a.customer.name.localeCompare(b.customer.name) * direction;
        case "status":
          return a.status.localeCompare(b.status) * direction;
        case "date":
        default:
          return (
            (new Date(a.timestamp).getTime() -
              new Date(b.timestamp).getTime()) *
            direction
          );
      }
    });
  }, [filteredInvoices, sortDescriptor]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedInvoices = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return sortedInvoices.slice(start, start + pageSize);
  }, [safePage, pageSize, sortedInvoices]);

  // Selected row IDs
  const selectedIdSet = useMemo(() => {
    if (selectedKeys === "all") {
      return new Set(paginatedInvoices.map((inv) => inv.id));
    }
    return selectedKeys as Set<string>;
  }, [selectedKeys, paginatedInvoices]);

  const handleExportCsv = () => {
    const headers = [
      "Receipt No",
      "Invoice No",
      "Date",
      "Time",
      "Cashier",
      "Table/Service",
      "Customer",
      "Phone",
      "Payment Tender",
      "Subtotal USD",
      "VAT USD",
      "Total USD",
      "Total KHR",
      "Status",
    ];

    const rows = filteredInvoices.map((inv) => [
      inv.receiptNumber,
      inv.invoiceNumber,
      inv.date,
      inv.time,
      inv.cashierName,
      inv.tableNumber,
      inv.customer.name,
      inv.customer.phone ?? "",
      inv.tenderLabel,
      inv.subtotalUsd.toFixed(2),
      inv.vatUsd.toFixed(2),
      inv.totalUsd.toFixed(2),
      inv.totalKhr,
      inv.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `POS_Invoices_Report_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredInvoices.length} invoices to CSV`);
  };

  const handleBatchPrintAction = () => {
    const ids = Array.from(selectedIdSet);
    if (ids.length === 0) return;
    if (onBatchPrint) {
      onBatchPrint(ids);
    } else {
      toast.success(`Queued ${ids.length} receipts to thermal printer`);
      window.print();
    }
  };

  const handleBatchSettleAction = () => {
    const ids = Array.from(selectedIdSet);
    if (ids.length === 0) return;
    if (onBatchSettle) {
      onBatchSettle(ids);
    } else {
      toast.success(`Marked ${ids.length} invoices as Settled`);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden text-foreground">
      {/* Cashier Toolbar: Status Tabs & Smart Search / Filters */}
      <div className="flex shrink-0 flex-col border-b border-border/80 bg-surface">
        {/* Status Tabs with count badges */}
        <div className="flex min-w-0 items-center justify-between gap-2 border-b border-border/60">
          <Tabs
            className="min-w-0"
            selectedKey={statusFilter}
            variant="secondary"
            onSelectionChange={(key) => {
              setStatusFilter(String(key) as StatusFilter);
              setPage(1);
            }}
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label="Filter receipts by status">
                {statusFilterTabs.map((tab) => {
                  return (
                    <Tabs.Tab
                      key={tab.id}
                      id={tab.id}
                      className="w-auto shrink-0 whitespace-nowrap"
                    >
                      {tab.label}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>

          <div className="flex shrink-0 items-center pe-[var(--pos-content-padding)]">
            <Button
              aria-label="Export CSV"
              className="shrink-0"
              size="sm"
              variant="outline"
              onPress={handleExportCsv}
            >
              <IconDownload aria-hidden="true" size={15} />
              <span className="hidden xl:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Search and advanced filters */}
        <div className="flex w-full min-w-0 shrink-0 items-center gap-2 px-[var(--pos-content-padding)] py-3">
          <SearchField
            aria-label="Search invoices and receipts"
            className="min-w-0 flex-1"
            fullWidth
            value={query}
            variant="secondary"
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search receipts, orders, customers, or tables..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          <Popover>
            <Button
              aria-label="Invoice filters"
              className="relative h-10 w-10 min-w-10 shrink-0"
              isIconOnly
              variant="secondary"
            >
              <IconAdjustmentsHorizontal aria-hidden="true" size={18} />
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

            <Popover.Content placement="bottom end">
              <Popover.Dialog>
                <div className="w-80 max-w-[95vw] sm:w-96">
                  <div className="flex w-full items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Popover.Heading>Filters</Popover.Heading>
                      {activeFilterCount > 0 ? (
                        <Chip color="accent" size="sm" variant="soft">
                          {activeFilterCount}
                        </Chip>
                      ) : null}
                    </div>

                    {hasActiveFilters ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onPress={resetFilters}
                      >
                        <IconRotateClockwise aria-hidden="true" size={14} />
                        Reset
                      </Button>
                    ) : null}
                  </div>

                  <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
                    <InvoiceFilterSelect
                      ariaLabel="Filter by date or shift"
                      label="Date and shift"
                      options={shiftFilterOptions}
                      selectedValue={shiftFilter}
                      onChange={(value) => {
                        setShiftFilter(value);
                        setPage(1);
                      }}
                    />
                    <InvoiceFilterSelect
                      ariaLabel="Filter by payment tender"
                      label="Payment tender"
                      options={tenderFilterOptions}
                      selectedValue={tenderFilter}
                      onChange={(value) => {
                        setTenderFilter(value);
                        setPage(1);
                      }}
                    />
                    <InvoiceFilterSelect
                      ariaLabel="Filter by service channel"
                      label="Service channel"
                      options={channelFilterOptions}
                      selectedValue={channelFilter}
                      onChange={(value) => {
                        setChannelFilter(value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        </div>

        {/* Batch Action Bar if items are selected */}
        {selectedIdSet.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-accent/10 px-[var(--pos-content-padding)] py-2 text-xs text-accent">
            <span className="font-semibold">
              {selectedIdSet.size} invoice{selectedIdSet.size > 1 ? "s" : ""}{" "}
              selected
            </span>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                size="sm"
                variant="primary"
                onPress={handleBatchPrintAction}
              >
                <IconPrinter size={15} />
                <span>Print Selected</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onPress={handleBatchSettleAction}
              >
                <IconCheck size={15} />
                <span>Mark Settled</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => setSelectedKeys(new Set())}
              >
                Deselect
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Invoices Data Table */}
      <div className="flex min-h-0 flex-1 p-[var(--pos-content-padding)]">
        <Table className="min-h-0 flex-1" variant="secondary">
          <Table.ScrollContainer className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <Table.Content
              aria-label="Invoices and receipts listing"
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              sortDescriptor={sortDescriptor}
              onSelectionChange={setSelectedKeys}
              onSortChange={setSortDescriptor}
            >
              <Table.Header className="sticky top-0 z-20">
                <Table.Column allowsSorting id="sequence" className="w-36">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Receipt
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column allowsSorting id="date" className="w-28">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Date
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column allowsSorting id="customer" className="min-w-36">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Customer
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column
                  allowsSorting
                  id="total"
                  className="w-24 text-end"
                >
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Total
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column
                  allowsSorting
                  id="status"
                  className="w-24 text-center"
                >
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Status
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column id="actions" className="w-28 text-end">
                  Actions
                </Table.Column>
              </Table.Header>

              <Table.Body
                items={paginatedInvoices}
                renderEmptyState={() => (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-sm text-muted">
                    <IconReceipt size={36} className="text-muted/50 mb-2" />
                    <p className="font-semibold text-foreground">
                      No invoices found
                    </p>
                    <p className="text-xs">
                      Try adjusting your search query or reset the filters.
                    </p>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={resetFilters}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              >
                {(inv) => {
                  const statusColor:
                    | "success"
                    | "danger"
                    | "warning"
                    | "default" =
                    inv.status === "paid"
                      ? "success"
                      : inv.status === "voided"
                        ? "danger"
                        : inv.status === "refunded"
                          ? "default"
                          : "warning";

                  return (
                    <Table.Row
                      key={inv.id}
                      id={inv.id}
                      textValue={`${inv.receiptNumber} ${inv.customer.name}`}
                      onClick={() => onInvoiceSelect(inv.id)}
                    >
                      {/* Receipt */}
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-semibold text-foreground">
                            {inv.receiptNumber}
                          </span>
                          <span className="text-[10px] text-muted">
                            {inv.orderCode}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Date */}
                      <Table.Cell>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium text-foreground">
                            {inv.date}
                          </span>
                          <span className="text-[10px] text-muted tabular-nums">
                            {inv.time}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Customer */}
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">
                            {inv.customer.name || "Walk-in"}
                          </span>
                          {inv.customer.phone && (
                            <span className="text-[10px] text-muted tabular-nums">
                              {inv.customer.phone}
                            </span>
                          )}
                        </div>
                      </Table.Cell>

                      {/* Total Amount */}
                      <Table.Cell className="text-end">
                        <span className="text-xs font-semibold tabular-nums text-foreground">
                          {formatUsd(inv.totalUsd)}
                        </span>
                      </Table.Cell>

                      {/* Status */}
                      <Table.Cell className="text-center">
                        <Chip
                          color={statusColor}
                          size="sm"
                          variant="soft"
                        >
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </Chip>
                      </Table.Cell>

                      {/* Actions */}
                      <Table.Cell className="text-end">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            variant="outline"
                            aria-label={`Print ${inv.receiptNumber}`}
                            onPress={() => {
                              onInvoiceSelect(inv.id);
                              toast.info(`Printing ${inv.receiptNumber}`);
                              window.print();
                            }}
                          >
                            <IconPrinter size={15} />
                          </Button>

                          {onQuickRefund && inv.status === "paid" && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="outline"
                              aria-label={`Refund ${inv.receiptNumber}`}
                              onPress={() => onQuickRefund(inv)}
                            >
                              <IconReceiptRefund size={15} />
                            </Button>
                          )}

                          {onQuickVoid &&
                            inv.status !== "voided" &&
                            inv.status !== "refunded" && (
                              <Button
                                isIconOnly
                                size="sm"
                                variant="outline"
                                aria-label={`Void ${inv.receiptNumber}`}
                                onPress={() => onQuickVoid(inv)}
                              >
                                <IconAlertTriangle size={15} />
                              </Button>
                            )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* 4. Table Pagination Footer */}
      <div className="flex w-full shrink-0 items-center justify-between gap-3 border-t border-border/80 bg-surface px-[var(--pos-content-padding)] py-2.5">
        <Select
          aria-label="Rows per page"
          className="w-28 shrink-0"
          value={String(pageSize)}
          variant="secondary"
          onChange={(value) => {
            const nextPageSize = Number(normalizeFilterValue(value));

            if (pageSizes.includes(nextPageSize as PageSize)) {
              setPageSize(nextPageSize as PageSize);
              setPage(1);
            }
          }}
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
                aria-label="Previous page"
                isDisabled={safePage === 1}
                onPress={() => setPage(Math.max(1, safePage - 1))}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={safePage === p}
                    onPress={() => setPage(p)}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ),
            )}

            <Pagination.Item>
              <Pagination.Next
                aria-label="Next page"
                isDisabled={safePage === totalPages}
                onPress={() => setPage(Math.min(totalPages, safePage + 1))}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  );
}

type InvoiceFilterOption<T extends string> = {
  id: T;
  label: string;
};

function InvoiceFilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  label: string;
  onChange: (value: T) => void;
  options: InvoiceFilterOption<T>[];
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
        const nextValue = normalizeFilterValue(value);

        if (nextValue) {
          onChange(nextValue as T);
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
              className="text-start"
              id={option.id}
              key={option.id}
              textValue={option.label}
            >
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function normalizeFilterValue(value: Key | Key[] | null): string {
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}
