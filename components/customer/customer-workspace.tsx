"use client";

import {
  Avatar,
  Button,
  Chip,
  Disclosure,
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
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  Banknote,
  Calendar,
  Call,
  Cart,
  Edit2,
  More2,
  Profile,
  Sliders,
  Sms,
} from "reicon-react";
import { POSLayout } from "@/components/shared/pos-layout";
import {
  customerRecords,
  type CustomerRecord,
  type CustomerTier,
  getCustomerAvatarUrl,
} from "./customer-data";

type CustomerSegment = "all" | "vip" | "gold" | "black" | "regular";
type ActivityFilter = "all" | "frequent" | "recent";
type PageSize = 25 | 50 | 100;

const customerSegments: ReadonlyArray<{
  id: CustomerSegment;
  labelKey: string;
}> = [
  { id: "all", labelKey: "segmentAll" },
  { id: "vip", labelKey: "segmentVip" },
  { id: "gold", labelKey: "segmentGold" },
  { id: "black", labelKey: "segmentBlack" },
  { id: "regular", labelKey: "segmentRegular" },
];

const activityFilterOptions: ReadonlyArray<{
  id: ActivityFilter;
  labelKey: string;
}> = [
  { id: "all", labelKey: "filterAllActivity" },
  { id: "frequent", labelKey: "filterFrequent" },
  { id: "recent", labelKey: "filterRecent" },
];

const pageSizes: PageSize[] = [25, 50, 100];
const linkClass = "text-muted hover:bg-surface hover:text-foreground";
const activeClass = "bg-accent text-accent-foreground hover:bg-accent-hover";

const tierLabels: Record<CustomerTier, string> = {
  vip: "tierVip",
  gold: "tierGold",
  member: "tierMember",
  black: "tierBlack",
};

const tierColors: Record<
  CustomerTier,
  "accent" | "warning" | "default"
> = {
  vip: "accent",
  gold: "warning",
  member: "default",
  black: "default",
};

export function CustomerPageClient({
  headerTitle,
  rightPanelLabel,
}: {
  headerTitle: string;
  rightPanelLabel: string;
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    customerRecords[0]?.id ?? null,
  );

  return (
    <POSLayout
      showSearch={false}
      headerTitle={headerTitle}
      rightPanelLabel={rightPanelLabel}
      rightPanel={<CustomerAside selectedCustomerId={selectedCustomerId} />}
    >
      <CustomerWorkspace
        onCustomerSelect={setSelectedCustomerId}
        selectedCustomerId={selectedCustomerId}
      />
    </POSLayout>
  );
}

export function CustomerWorkspace({
  onCustomerSelect,
  selectedCustomerId,
}: {
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId: string | null;
}) {
  const t = useTranslations("SalesMenu");
  const [activeSegment, setActiveSegment] = useState<CustomerSegment>("all");
  const [activityFilter, setActivityFilter] =
    useState<ActivityFilter>("all");
  const [query, setQuery] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "customer",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);

  const activeFilterCount = activityFilter === "all" ? 0 : 1;

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customerRecords.filter((customer) => {
      const matchesSegment =
        activeSegment === "all" ||
        (activeSegment === "regular"
          ? customer.tier === "member"
          : customer.tier === activeSegment);
      const matchesActivity = matchesCustomerActivity(
        customer,
        activityFilter,
      );
      const searchableContent = [
        customer.name,
        customer.phone,
        customer.email,
        customer.favorite,
        customer.lastVisit,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesSegment &&
        matchesActivity &&
        searchableContent.includes(normalizedQuery)
      );
    });
  }, [activeSegment, activityFilter, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize),
  );
  const safePage = Math.min(page, totalPages);
  const sortedCustomers = useMemo(
    () =>
      [...filteredCustomers].sort((first, second) =>
        compareCustomers(first, second, sortDescriptor),
      ),
    [filteredCustomers, sortDescriptor],
  );
  const paginatedCustomers = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return sortedCustomers.slice(start, start + pageSize);
  }, [pageSize, safePage, sortedCustomers]);

  const selectedKeys = useMemo<Selection>(
    () => (selectedCustomerId ? new Set([selectedCustomerId]) : new Set()),
    [selectedCustomerId],
  );

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") {
      return;
    }

    const selectedKey = Array.from(selection)[0];

    if (selectedKey !== undefined) {
      onCustomerSelect(String(selectedKey));
    }
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const updateSegment = (key: Key) => {
    setActiveSegment(String(key) as CustomerSegment);
    setPage(1);
  };

  const updateActivityFilter = (value: ActivityFilter) => {
    setActivityFilter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setActivityFilter("all");
    setPage(1);
  };

  const updatePageSize = (value: Key | Key[] | null) => {
    setPageSize(Number(normalizeFilterValue(value)) as PageSize);
    setPage(1);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden text-foreground">
      <CustomerToolbar
        activityFilter={activityFilter}
        activeFilterCount={activeFilterCount}
        query={query}
        selectedSegment={activeSegment}
        t={t}
        onActivityFilterChange={updateActivityFilter}
        onResetFilters={resetFilters}
        onSearchChange={updateQuery}
        onSegmentChange={updateSegment}
      />

      <div className="flex min-h-0 flex-1 p-[var(--pos-content-padding)]">
        <Table className="min-h-0 flex-1" variant="secondary">
          <Table.ScrollContainer className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <Table.Content
              aria-label={t("pages.customer.tableLabel")}
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              onSelectionChange={handleSelectionChange}
              onSortChange={setSortDescriptor}
            >
              <Table.Header className="sticky top-0 z-20 bg-surface text-foreground">
                <Table.Column allowsSorting id="customer" isRowHeader>
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      sortDirection={sortDirection}
                    >
                      {t("pages.customer.tableCustomer")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="contact">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      sortDirection={sortDirection}
                    >
                      {t("pages.customer.tableContact")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="tier">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      sortDirection={sortDirection}
                    >
                      {t("pages.customer.tableTier")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="visits" className="text-end">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-end"
                      sortDirection={sortDirection}
                    >
                      {t("pages.customer.tableVisits")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="spend" className="text-end">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-end"
                      sortDirection={sortDirection}
                    >
                      {t("pages.customer.tableSpend")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
              </Table.Header>
              <Table.Body
                items={paginatedCustomers}
                renderEmptyState={() => (
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-default text-muted">
                      <Profile aria-hidden="true" size={24} />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-foreground">
                      {t("pages.customer.noResultsTitle")}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {t("pages.customer.noResultsDescription")}
                    </p>
                  </div>
                )}
              >
                {(customer) => (
                  <CustomerTableRow
                    key={customer.id}
                    customer={customer}
                    t={t}
                  />
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <div className="shrink-0 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
        <CustomerPagination
          page={safePage}
          pageSize={pageSize}
          t={t}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={updatePageSize}
        />
      </div>
    </div>
  );
}

function CustomerToolbar({
  activityFilter,
  activeFilterCount,
  onActivityFilterChange,
  onResetFilters,
  onSearchChange,
  onSegmentChange,
  query,
  selectedSegment,
  t,
}: {
  activityFilter: ActivityFilter;
  activeFilterCount: number;
  onActivityFilterChange: (value: ActivityFilter) => void;
  onResetFilters: () => void;
  onSearchChange: (value: string) => void;
  onSegmentChange: (key: Key) => void;
  query: string;
  selectedSegment: CustomerSegment;
  t: ReturnType<typeof useTranslations<"SalesMenu">>;
}) {
  return (
    <div className="flex shrink-0 flex-col">
      <Tabs
        className="min-w-0"
        selectedKey={selectedSegment}
        variant="secondary"
        onSelectionChange={onSegmentChange}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("pages.customer.segmentLabel")}>
            {customerSegments.map((segment) => (
              <Tabs.Tab
                key={segment.id}
                id={segment.id}
                className="w-auto shrink-0 whitespace-nowrap"
              >
                {t(`pages.customer.${segment.labelKey}`)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="flex w-full shrink-0 items-center gap-2 px-[var(--pos-content-padding)] py-3">
        <SearchField
          aria-label={t("pages.customer.searchLabel")}
          className="flex-1"
          fullWidth
          value={query}
          variant="secondary"
          onChange={onSearchChange}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input
              placeholder={t("pages.customer.searchPlaceholder")}
            />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Popover>
          <Button
            aria-label={t("pages.customer.filters")}
            className="relative h-10 w-10 min-w-10 shrink-0"
            isIconOnly
            variant="secondary"
          >
            <Sliders aria-hidden="true" size={18} />
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
            className="w-[340px] max-w-[95vw] rounded-2xl border-0 bg-surface p-0 shadow-2xl sm:w-[420px]"
            placement="bottom end"
          >
            <Popover.Dialog className="flex w-full flex-col p-0 text-start outline-none">
              <div className="flex w-full items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <Popover.Heading className="text-start text-sm font-semibold text-foreground">
                    {t("pages.customer.filters")}
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
                    {t("pages.customer.filterReset")}
                  </Button>
                ) : null}
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 text-start text-sm">
                <CustomerFilterSelect
                  ariaLabel={t("pages.customer.filterActivityLabel")}
                  label={t("pages.customer.filterActivityLabel")}
                  options={activityFilterOptions.map((option) => ({
                    id: option.id,
                    label: t(`pages.customer.${option.labelKey}`),
                  }))}
                  selectedValue={activityFilter}
                  onChange={onActivityFilterChange}
                />
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}

type CustomerFilterOption<T extends string> = {
  id: T;
  label: string;
};

function CustomerFilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  label: string;
  onChange: (value: T) => void;
  options: CustomerFilterOption<T>[];
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
      <Label className="text-start text-xs font-semibold text-muted">
        {label}
      </Label>
      <Select.Trigger className="w-full justify-start text-start">
        <Select.Value>
          {({ defaultChildren, isPlaceholder }) =>
            isPlaceholder || !currentOption ? (
              defaultChildren
            ) : (
              <span>{currentOption.label}</span>
            )}
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

function CustomerTableRow({
  customer,
  t,
}: {
  customer: CustomerRecord;
  t: ReturnType<typeof useTranslations<"SalesMenu">>;
}) {
  return (
    <Table.Row
      id={customer.id}
      textValue={`${customer.name} ${customer.phone} ${customer.email}`}
      className="cursor-pointer hover:bg-surface-secondary/50 data-[selected=true]:bg-accent/10 [&>td]:py-3"
    >
      <Table.Cell textValue={customer.name}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar color="accent" size="sm" variant="soft">
            <Avatar.Image
              alt=""
              src={getCustomerAvatarUrl(customer.id)}
            />
            <Avatar.Fallback>{customer.initials}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="whitespace-normal text-sm font-semibold text-foreground">
              {customer.name}
            </p>
            <p className="truncate text-xs text-muted">
              {t(`pages.customer.${tierLabels[customer.tier]}`)} · {customer.lastVisit}
            </p>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell textValue={`${customer.phone} ${customer.email}`}>
        <div className="flex min-w-0 flex-col text-sm">
          <span className="truncate font-medium text-foreground">
            {customer.phone}
          </span>
          <span className="truncate text-xs text-muted">{customer.email}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <Chip color={tierColors[customer.tier]} size="sm" variant="soft">
          {t(`pages.customer.${tierLabels[customer.tier]}`)}
        </Chip>
      </Table.Cell>
      <Table.Cell className="text-end text-sm tabular-nums text-foreground">
        {customer.visits}
      </Table.Cell>
      <Table.Cell className="text-end">
        <span className="text-base font-semibold tabular-nums text-foreground">
          {customer.lifetimeSpend}
        </span>
      </Table.Cell>
    </Table.Row>
  );
}

export function CustomerAside({
  selectedCustomerId,
}: {
  selectedCustomerId: string | null;
}) {
  const t = useTranslations("SalesMenu");
  const [isBasicInformationExpanded, setIsBasicInformationExpanded] =
    useState(true);
  const customer =
    customerRecords.find((record) => record.id === selectedCustomerId) ??
    customerRecords[0];

  if (!customer) {
    return null;
  }

  return (
    <section
      aria-labelledby="customer-aside-title"
      className="flex h-full min-h-0 flex-col bg-background"
    >
      <header className="flex shrink-0 items-center gap-2 p-[var(--pos-content-padding)]">
        <Profile aria-hidden="true" className="text-muted" size={20} />
        <h2
          id="customer-aside-title"
          className="text-base font-bold tracking-tight text-foreground"
        >
          {t("pages.customer.profileTitle")}
        </h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar color="accent" size="lg" variant="soft">
              <Avatar.Image
                alt={`${customer.name} avatar`}
                src={getCustomerAvatarUrl(customer.id)}
              />
              <Avatar.Fallback>{customer.initials}</Avatar.Fallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-foreground">
                {customer.name}
              </h3>
              <p className="text-xs text-muted">
                {t("pages.customer.customerId")}: {getCustomerCode(customer)}
              </p>
              <p className="text-xs text-muted">
                {t("pages.customer.telephone")}: {customer.phone}
              </p>
            </div>
          </div>
          <Chip color="success" size="sm" variant="soft">
            {t("pages.customer.statusActive")}
          </Chip>
        </div>

        <Disclosure
          className="mt-6"
          isExpanded={isBasicInformationExpanded}
          onExpandedChange={setIsBasicInformationExpanded}
        >
          <Disclosure.Heading>
            <Disclosure.Trigger className="flex w-full items-center justify-between gap-3 py-3 text-start">
              <span className="text-sm font-semibold text-foreground">
                {t("pages.customer.basicInformation")}
              </span>
              <Disclosure.Indicator />
            </Disclosure.Trigger>
          </Disclosure.Heading>
          <Disclosure.Content className="border-t border-border/60 pt-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <CustomerDetail
                label={t("pages.customer.email")}
                value={customer.email}
              />
              <CustomerDetail
                label={t("pages.customer.gender")}
                value={customer.gender ?? "--"}
              />
              <CustomerDetail
                label={t("pages.customer.dateOfBirth")}
                value={customer.dateOfBirth ?? "--"}
              />
              <CustomerDetail
                label={t("pages.customer.tier")}
                value={t(`pages.customer.${tierLabels[customer.tier]}`)}
              />
              <CustomerDetail
                label={t("pages.customer.payLater")}
                value={customer.payLater ?? "--"}
              />
              <CustomerDetail
                label={t("pages.customer.payLaterLimit")}
                value={customer.payLaterLimit ?? "--"}
              />
              <CustomerDetail
                label={t("pages.customer.joinedDate")}
                value={customer.joinedDate ?? customer.memberSince}
              />
              <CustomerDetail
                label={t("pages.customer.tags")}
                value={customer.tags?.join(", ") || "--"}
              />
            </div>
          </Disclosure.Content>
        </Disclosure>
      </div>

      <div className="shrink-0 p-[var(--pos-content-padding)] pt-0">
        <div className="grid grid-cols-3 gap-2">
          <Button
            className="min-w-0 rounded-full px-2 text-xs"
            fullWidth
            size="lg"
            type="button"
            variant="secondary"
          >
            <Cart aria-hidden="true" size={17} />
            {t("pages.customer.startOrder")}
          </Button>
          <Button
            className="min-w-0 rounded-full px-2 text-xs"
            fullWidth
            size="lg"
            type="button"
            variant="secondary"
          >
            <Edit2 aria-hidden="true" size={17} />
            {t("pages.customer.editCustomer")}
          </Button>
          <Button
            className="min-w-0 rounded-full px-2 text-xs"
            fullWidth
            size="lg"
            type="button"
            variant="secondary"
          >
            <Banknote aria-hidden="true" size={17} />
            {t("pages.customer.payBack")}
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-surface-secondary/60 p-2">
          <Button
            className="min-w-0 flex-1 rounded-full"
            size="lg"
            type="button"
            variant="secondary"
          >
            <Calendar aria-hidden="true" size={18} />
            {t("pages.customer.reservation")}
          </Button>
          <Button
            aria-label={t("pages.customer.callCustomer")}
            className="shrink-0 rounded-full"
            isIconOnly
            size="lg"
            type="button"
            variant="ghost"
          >
            <Call aria-hidden="true" size={18} />
          </Button>
          <Button
            aria-label={t("pages.customer.messageCustomer")}
            className="shrink-0 rounded-full"
            isIconOnly
            size="lg"
            type="button"
            variant="ghost"
          >
            <Sms aria-hidden="true" size={18} />
          </Button>
          <Button
            aria-label={t("pages.customer.moreActions")}
            className="shrink-0 rounded-full"
            isIconOnly
            size="lg"
            type="button"
            variant="ghost"
          >
            <More2 aria-hidden="true" size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}

function CustomerDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function getCustomerCode(customer: CustomerRecord) {
  if (customer.customerCode) {
    return customer.customerCode;
  }

  const index = customerRecords.findIndex((record) => record.id === customer.id);

  return `C${String(index + 1).padStart(3, "0")}`;
}

function CustomerPagination({
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
  t: ReturnType<typeof useTranslations<"SalesMenu">>;
  totalPages: number;
}) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between gap-3">
      <Select
        aria-label={t("pages.customer.paginationRows")}
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
              aria-label={t("pages.customer.paginationPrevious")}
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
              aria-label={t("pages.customer.paginationNext")}
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

function matchesCustomerActivity(
  customer: CustomerRecord,
  filter: ActivityFilter,
) {
  if (filter === "frequent") {
    return customer.visits >= 20;
  }

  if (filter === "recent") {
    return (
      customer.lastVisit.startsWith("Today") ||
      customer.lastVisit.startsWith("Yesterday")
    );
  }

  return true;
}

function compareCustomers(
  first: CustomerRecord,
  second: CustomerRecord,
  descriptor: SortDescriptor,
) {
  const column = String(descriptor.column ?? "customer");
  const firstValue = getCustomerSortValue(first, column);
  const secondValue = getCustomerSortValue(second, column);
  const comparison =
    typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue));

  return descriptor.direction === "descending" ? comparison * -1 : comparison;
}

function getCustomerSortValue(customer: CustomerRecord, column: string) {
  switch (column) {
    case "contact":
      return customer.phone;
    case "tier":
      return customer.tier;
    case "visits":
      return customer.visits;
    case "spend":
      return numericSpend(customer.lifetimeSpend);
    case "customer":
    default:
      return customer.name;
  }
}

function numericSpend(value: string) {
  const amount = Number.parseFloat(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(amount) ? amount : 0;
}

function normalizeFilterValue(value: Key | Key[] | null) {
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}
