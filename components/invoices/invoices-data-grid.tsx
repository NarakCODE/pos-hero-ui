"use client";

import { useMemo, useState } from "react";
import type { Selection, SortDescriptor } from "@heroui/react";
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
  Tabs,
  toast,
} from "@heroui/react";
import {
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconDownload,
  IconFilter,
  IconPrinter,
  IconQrcode,
  IconReceipt,
  IconReceiptRefund,
  IconRotateClockwise,
  IconWallet,
} from "@tabler/icons-react";
import { getOrderChannelAvatarSrc } from "@/components/order-channel-select";
import {
  formatKhr,
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
type PageSize = 10 | 25 | 50;

const pageSizes: PageSize[] = [10, 25, 50];

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
  selectedInvoiceId: string | null;
  onInvoiceSelect: (invoiceId: string) => void;
  onBatchPrint?: (invoiceIds: string[]) => void;
  onBatchSettle?: (invoiceIds: string[]) => void;
  onQuickRefund?: (invoice: InvoiceRecord) => void;
  onQuickVoid?: (invoice: InvoiceRecord) => void;
}

export function InvoicesDataGrid({
  invoices,
  selectedInvoiceId,
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
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "descending",
  });

  // Active filters count
  const activeFiltersCount =
    (statusFilter !== "all" ? 1 : 0) +
    (shiftFilter !== "all" ? 1 : 0) +
    (tenderFilter !== "all" ? 1 : 0) +
    (channelFilter !== "all" ? 1 : 0) +
    (query.trim() ? 1 : 0);

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
            selectedKey={statusFilter}
            variant="secondary"
            onSelectionChange={(key) => {
              setStatusFilter(key as StatusFilter);
              setPage(1);
            }}
            className="min-w-0 flex-1"
          >
            <Tabs.ListContainer className="min-w-0">
              <Tabs.List aria-label="Filter receipts by status">
                {statusFilterTabs.map((tab) => {
                  const count =
                    tab.id === "all"
                      ? invoices.length
                      : invoices.filter((i) => i.status === tab.id).length;

                  return (
                    <Tabs.Tab
                      key={tab.id}
                      id={tab.id}
                      className="w-auto shrink-0 whitespace-nowrap"
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] tabular-nums font-semibold ${
                          statusFilter === tab.id
                            ? "bg-accent text-accent-foreground"
                            : "bg-surface-secondary text-muted"
                        }`}
                      >
                        {count}
                      </span>
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

        {/* Search Bar & Smart Filter Popovers */}
        <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center gap-2 px-[var(--pos-content-padding)] py-2.5">
          <SearchField
            aria-label="Search invoices and receipts"
            className="min-w-0 flex-1 basis-56"
            fullWidth
            value={query}
            variant="secondary"
            onChange={(val) => {
              setQuery(val);
              setPage(1);
            }}
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search receipts, orders, customers, or tables..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {/* Shift / Date Popover Filter */}
          <Popover>
            <Button
              aria-label={`Filter by date or shift: ${shiftFilterOptions.find((option) => option.id === shiftFilter)?.label ?? "All dates"}`}
              size="md"
              variant={shiftFilter !== "all" ? "primary" : "secondary"}
            >
              <IconClock aria-hidden="true" size={16} />
              <span className="hidden max-w-48 truncate xl:inline">
                {shiftFilterOptions.find((o) => o.id === shiftFilter)?.label ||
                  "Date/Shift"}
              </span>
            </Button>
            <Popover.Content placement="bottom end">
              <Popover.Dialog className="w-56">
                <div className="p-2 text-xs">
                  <div className="mb-2 px-2 py-1 font-semibold text-foreground">
                    Filter by Shift / Date
                  </div>
                  <div className="space-y-1">
                    {shiftFilterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setShiftFilter(opt.id);
                          setPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-start transition-colors ${
                          shiftFilter === opt.id
                            ? "bg-accent font-semibold text-accent-foreground"
                            : "text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {shiftFilter === opt.id && <IconCheck size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>

          {/* Payment Tender Popover Filter */}
          <Popover>
            <Button
              aria-label={`Filter by payment tender: ${tenderFilterOptions.find((option) => option.id === tenderFilter)?.label ?? "All payment tenders"}`}
              size="md"
              variant={tenderFilter !== "all" ? "primary" : "secondary"}
            >
              <IconWallet aria-hidden="true" size={16} />
              <span className="hidden max-w-48 truncate xl:inline">
                {tenderFilterOptions.find((o) => o.id === tenderFilter)?.label ||
                  "Tender"}
              </span>
            </Button>
            <Popover.Content placement="bottom end">
              <Popover.Dialog className="w-56">
                <div className="p-2 text-xs">
                  <div className="mb-2 px-2 py-1 font-semibold text-foreground">
                    Payment Tender
                  </div>
                  <div className="space-y-1">
                    {tenderFilterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setTenderFilter(opt.id);
                          setPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-start transition-colors ${
                          tenderFilter === opt.id
                            ? "bg-accent font-semibold text-accent-foreground"
                            : "text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {tenderFilter === opt.id && <IconCheck size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>

          {/* Channel Popover Filter */}
          <Popover>
            <Button
              aria-label={`Filter by service channel: ${channelFilterOptions.find((option) => option.id === channelFilter)?.label ?? "All channels"}`}
              size="md"
              variant={channelFilter !== "all" ? "primary" : "secondary"}
            >
              <IconFilter aria-hidden="true" size={16} />
              <span className="hidden max-w-48 truncate xl:inline">
                {channelFilterOptions.find((o) => o.id === channelFilter)
                  ?.label || "Channel"}
              </span>
            </Button>
            <Popover.Content placement="bottom end">
              <Popover.Dialog className="w-52">
                <div className="p-2 text-xs">
                  <div className="mb-2 px-2 py-1 font-semibold text-foreground">
                    Service Channel
                  </div>
                  <div className="space-y-1">
                    {channelFilterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setChannelFilter(opt.id);
                          setPage(1);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-start transition-colors ${
                          channelFilter === opt.id
                            ? "bg-accent font-semibold text-accent-foreground"
                            : "text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {channelFilter === opt.id && <IconCheck size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <Button
              aria-label="Reset filters"
              size="md"
              variant="outline"
              onPress={resetFilters}
            >
              <IconRotateClockwise aria-hidden="true" size={16} />
              <span className="hidden xl:inline">Reset</span>
            </Button>
          )}
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
                <Table.Column allowsSorting id="sequence" className="w-24">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Receipt #
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column allowsSorting id="date" className="w-32">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Time / Date
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column allowsSorting id="customer">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Customer & Member
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>

                <Table.Column id="channel" className="w-36">
                  Table / Channel
                </Table.Column>

                <Table.Column id="cashier" className="w-32">
                  Station / Cashier
                </Table.Column>

                <Table.Column id="items">Items Summary</Table.Column>

                <Table.Column id="tender" className="w-36">
                  Payment Tender
                </Table.Column>

                <Table.Column
                  allowsSorting
                  id="total"
                  className="w-28 text-end"
                >
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      Total Bill
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

                <Table.Column id="actions" className="w-20 text-center">
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
                  const isSelected = selectedInvoiceId === inv.id;
                  const channelAvatar = getOrderChannelAvatarSrc(inv.channel);

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

                  const totalItemsCount = inv.items.reduce(
                    (sum, i) => sum + i.quantity,
                    0,
                  );

                  return (
                    <Table.Row
                      key={inv.id}
                      id={inv.id}
                      textValue={`${inv.receiptNumber} ${inv.customer.name}`}
                      onClick={() => onInvoiceSelect(inv.id)}
                    >
                      {/* Receipt & Sequence */}
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {inv.receiptNumber}
                          </span>
                          <span className="text-[10px] text-muted tabular-nums">
                            Seq #{inv.sequence} • {inv.orderCode}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Date & Time */}
                      <Table.Cell>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium text-foreground tabular-nums">
                            {inv.time}
                          </span>
                          <span className="text-[10px] text-muted">
                            {inv.date}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Customer */}
                      <Table.Cell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground text-xs">
                              {inv.customer.name}
                            </span>
                            {inv.customer.loyaltyTier && (
                              <span className="rounded bg-surface-secondary px-1 py-0.2 text-[9px] font-semibold uppercase text-accent">
                                {inv.customer.loyaltyTier}
                              </span>
                            )}
                          </div>
                          {inv.customer.phone && (
                            <span className="text-[10px] text-muted tabular-nums">
                              {inv.customer.phone}
                            </span>
                          )}
                        </div>
                      </Table.Cell>

                      {/* Table / Channel */}
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          {inv.channel !== "pos" && channelAvatar ? (
                            <Avatar size="sm">
                              <Avatar.Image src={channelAvatar} alt={inv.channel} />
                              <Avatar.Fallback>
                                {inv.channel.slice(0, 2).toUpperCase()}
                              </Avatar.Fallback>
                            </Avatar>
                          ) : null}
                          <div className="flex flex-col text-xs">
                            <span className="font-medium text-foreground">
                              {inv.orderType === "dineIn"
                                ? inv.tableNumber
                                : inv.orderType === "takeaway"
                                  ? "Takeaway"
                                  : `Delivery (${inv.channel})`}
                            </span>
                            <span className="text-[10px] text-muted capitalize">
                              {inv.channel}
                            </span>
                          </div>
                        </div>
                      </Table.Cell>

                      {/* Station / Cashier */}
                      <Table.Cell>
                        <div className="flex flex-col text-xs">
                          <span className="text-foreground">
                            {inv.cashierName}
                          </span>
                          <span className="text-[10px] text-muted">
                            {inv.registerId} • {inv.shift}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Items Summary */}
                      <Table.Cell>
                        <div className="max-w-[180px] truncate text-xs">
                          <span className="font-medium text-foreground">
                            {totalItemsCount} item{totalItemsCount > 1 ? "s" : ""}:{" "}
                          </span>
                          <span className="text-muted">
                            {inv.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Payment Tender */}
                      <Table.Cell>
                        <div className="flex items-center gap-1.5 text-xs">
                          {inv.paymentMethod === "cash" ? (
                            <IconWallet size={16} className="text-emerald-500" />
                          ) : inv.paymentMethod === "khqr" ? (
                            <IconQrcode size={16} className="text-accent" />
                          ) : (
                            <IconCreditCard size={16} className="text-blue-500" />
                          )}
                          <span className="font-medium text-foreground">
                            {inv.tenderLabel}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Total Amount */}
                      <Table.Cell className="text-end">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold tabular-nums text-foreground">
                            {formatUsd(inv.totalUsd)}
                          </span>
                          <span className="text-[10px] tabular-nums text-muted">
                            {formatKhr(inv.totalKhr)}
                          </span>
                        </div>
                      </Table.Cell>

                      {/* Status */}
                      <Table.Cell className="text-center">
                        <Chip
                          color={statusColor}
                          size="sm"
                          variant="soft"
                        >
                          {inv.status.toUpperCase()}
                        </Chip>
                      </Table.Cell>

                      {/* Actions */}
                      <Table.Cell className="text-center">
                        <div
                          className="flex items-center justify-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
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
                              variant="ghost"
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
                                variant="danger"
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
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/80 bg-surface px-[var(--pos-content-padding)] py-2.5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>Rows per page:</span>
          <Select
            aria-label="Rows per page"
            className="w-20"
            value={String(pageSize)}
            variant="secondary"
            onChange={(val) => {
              if (val) {
                setPageSize(Number(val) as PageSize);
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

          <span className="hidden sm:inline">
            Showing {(safePage - 1) * pageSize + 1}–
            {Math.min(safePage * pageSize, sortedInvoices.length)} of{" "}
            {sortedInvoices.length} invoices
          </span>
        </div>

        <Pagination className="justify-end" size="sm">
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
                    aria-label={`Page ${p}`}
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
