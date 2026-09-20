"use client";

import { Button, Card, Chip, SearchField, Surface, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  Add,
  ArrowRight2,
  Award,
  Call,
  Crown,
  Import,
  Profile,
  Receipt2,
  Sms,
} from "reicon-react";
import {
  customerRecords,
  type CustomerRecord,
  type CustomerTier,
} from "./customer-data";

type CustomerSegment = "all" | "vip" | "gold" | "regular";

const customerSegments: ReadonlyArray<{
  id: CustomerSegment;
  labelKey: string;
}> = [
  { id: "all", labelKey: "segmentAll" },
  { id: "vip", labelKey: "segmentVip" },
  { id: "gold", labelKey: "segmentGold" },
  { id: "regular", labelKey: "segmentRegular" },
];

const tierLabels: Record<CustomerTier, string> = {
  vip: "tierVip",
  gold: "tierGold",
  member: "tierMember",
};

const tierColors: Record<CustomerTier, "accent" | "warning" | "default"> = {
  vip: "accent",
  gold: "warning",
  member: "default",
};

export function CustomerWorkspace() {
  const t = useTranslations("SalesMenu");
  const [activeSegment, setActiveSegment] = useState<CustomerSegment>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customerRecords[0]?.id ?? "",
  );

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return customerRecords.filter((customer) => {
      const matchesSegment =
        activeSegment === "all" ||
        (activeSegment === "regular"
          ? customer.tier === "member"
          : customer.tier === activeSegment);
      const searchableContent = [
        customer.name,
        customer.phone,
        customer.email,
        customer.favorite,
      ]
        .join(" ")
        .toLowerCase();

      return matchesSegment && searchableContent.includes(normalizedQuery);
    });
  }, [activeSegment, searchQuery]);

  const selectedCustomer =
    customerRecords.find((customer) => customer.id === selectedCustomerId) ??
    filteredCustomers[0] ??
    customerRecords[0];

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)] text-foreground">
      <header className="flex shrink-0 flex-col gap-4 rounded-2xl bg-surface-secondary/60 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {t("pages.customer.eyebrow")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("pages.customer.title")}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
            {t("pages.customer.description")}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button size="lg" type="button" variant="secondary">
            <Import aria-hidden="true" size={19} />
            {t("pages.customer.importCustomers")}
          </Button>
          <Button size="lg" type="button" variant="primary">
            <Add aria-hidden="true" size={20} />
            {t("pages.customer.addCustomer")}
          </Button>
        </div>
      </header>

      <section
        aria-label={t("pages.customer.summaryLabel")}
        className="grid shrink-0 gap-3 sm:grid-cols-3"
      >
        <CustomerMetric
          icon={Profile}
          label={t("pages.customer.totalCustomers")}
          value="1,248"
          detail={t("pages.customer.totalCustomersDetail")}
        />
        <CustomerMetric
          icon={Crown}
          label={t("pages.customer.activeMembers")}
          value="864"
          detail={t("pages.customer.activeMembersDetail")}
        />
        <CustomerMetric
          icon={Award}
          label={t("pages.customer.rewardsIssued")}
          value="12,480"
          detail={t("pages.customer.rewardsIssuedDetail")}
        />
      </section>

      <div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="min-h-0 overflow-hidden" variant="default">
          <Card.Header className="gap-4 p-4 pb-3 sm:p-5 sm:pb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <Card.Title>{t("pages.customer.directoryTitle")}</Card.Title>
                <Card.Description>
                  {t("pages.customer.customerCount", {
                    count: filteredCustomers.length,
                  })}
                </Card.Description>
              </div>

              <SearchField
                aria-label={t("pages.customer.searchLabel")}
                className="w-full sm:max-w-xs"
                value={searchQuery}
                variant="secondary"
                onChange={setSearchQuery}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input
                    placeholder={t("pages.customer.searchPlaceholder")}
                  />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </div>

            <Tabs
              align="start"
              className="min-w-0"
              selectedKey={activeSegment}
              variant="secondary"
              onSelectionChange={(key) =>
                setActiveSegment(String(key) as CustomerSegment)
              }
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label={t("pages.customer.segmentLabel")}>
                  {customerSegments.map((segment) => (
                    <Tabs.Tab
                      key={segment.id}
                      id={segment.id}
                      className="shrink-0 whitespace-nowrap"
                    >
                      {t(`pages.customer.${segment.labelKey}`)}
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </Card.Header>

          <Card.Content className="min-h-0 overflow-y-auto p-0">
            <div className="hidden grid-cols-[minmax(0,1.55fr)_minmax(9rem,1fr)_7rem_6rem_7rem] gap-3 border-y border-border/60 bg-surface-secondary/45 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted md:grid md:px-5">
              <span>{t("pages.customer.tableCustomer")}</span>
              <span>{t("pages.customer.tableContact")}</span>
              <span>{t("pages.customer.tableTier")}</span>
              <span className="text-end">{t("pages.customer.tableVisits")}</span>
              <span className="text-end">{t("pages.customer.tableSpend")}</span>
            </div>

            {filteredCustomers.length > 0 ? (
              <div className="divide-y divide-border/60">
                {filteredCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    isSelected={customer.id === selectedCustomer?.id}
                    onPress={() => setSelectedCustomerId(customer.id)}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-default text-muted">
                  <Profile aria-hidden="true" size={24} />
                </div>
                <h2 className="mt-4 text-base font-semibold text-foreground">
                  {t("pages.customer.noResultsTitle")}
                </h2>
                <p className="mt-1 max-w-sm text-sm text-muted">
                  {t("pages.customer.noResultsDescription")}
                </p>
              </div>
            )}
          </Card.Content>
        </Card>

        {selectedCustomer ? (
          <CustomerProfile customer={selectedCustomer} />
        ) : null}
      </div>
    </div>
  );
}

function CustomerMetric({
  detail,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  icon: IconComponent;
  label: string;
  value: string;
}) {
  return (
    <Surface className="flex min-h-28 items-start justify-between gap-4 p-4 sm:p-5">
      <div className="min-w-0">
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted">{detail}</p>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon aria-hidden="true" size={21} />
      </div>
    </Surface>
  );
}

function CustomerRow({
  customer,
  isSelected,
  onPress,
  t,
}: {
  customer: CustomerRecord;
  isSelected: boolean;
  onPress: () => void;
  t: ReturnType<typeof useTranslations<"SalesMenu">>;
}) {
  return (
    <Button
      aria-pressed={isSelected}
      className={`h-auto min-h-20 w-full justify-start rounded-none px-4 py-3.5 text-start sm:px-5 ${
        isSelected ? "bg-default" : "hover:bg-default-hover"
      }`}
      fullWidth
      size="lg"
      type="button"
      variant="ghost"
      onPress={onPress}
    >
      <div className="grid w-full min-w-0 items-center gap-3 md:grid-cols-[minmax(0,1.55fr)_minmax(9rem,1fr)_7rem_6rem_7rem]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
            {customer.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {customer.name}
            </p>
            <p className="truncate text-xs text-muted">
              {t(`pages.customer.${tierLabels[customer.tier]}`)} · {customer.lastVisit}
            </p>
          </div>
          <ArrowRight2
            aria-hidden="true"
            className="ms-auto shrink-0 text-muted md:hidden"
            size={18}
          />
        </div>

        <div className="hidden min-w-0 flex-col gap-0.5 text-xs md:flex">
          <span className="truncate text-foreground">{customer.phone}</span>
          <span className="truncate text-muted">{customer.email}</span>
        </div>

        <div className="hidden md:block">
          <Chip color={tierColors[customer.tier]} size="sm" variant="soft">
            {t(`pages.customer.${tierLabels[customer.tier]}`)}
          </Chip>
        </div>

        <span className="hidden text-end text-sm tabular-nums text-foreground md:block">
          {customer.visits}
        </span>
        <span className="hidden text-end text-sm font-medium tabular-nums text-foreground md:block">
          {customer.lifetimeSpend}
        </span>

        <div className="flex items-center gap-2 text-xs md:hidden">
          <Chip color={tierColors[customer.tier]} size="sm" variant="soft">
            {t(`pages.customer.${tierLabels[customer.tier]}`)}
          </Chip>
          <span className="text-muted">
            {customer.visits} {t("pages.customer.visitsShort")}
          </span>
          <span className="ms-auto font-semibold tabular-nums text-foreground">
            {customer.lifetimeSpend}
          </span>
        </div>
      </div>
    </Button>
  );
}

function CustomerProfile({ customer }: { customer: CustomerRecord }) {
  const t = useTranslations("SalesMenu");

  return (
    <Card className="h-fit xl:sticky xl:top-0" variant="secondary">
      <Card.Header className="gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-base font-bold text-accent">
              {customer.initials}
            </div>
            <div className="min-w-0">
              <Card.Title className="truncate">{customer.name}</Card.Title>
              <Card.Description>
                {t("pages.customer.memberSince")} {customer.memberSince}
              </Card.Description>
            </div>
          </div>
          <Chip color={tierColors[customer.tier]} size="sm" variant="soft">
            {t(`pages.customer.${tierLabels[customer.tier]}`)}
          </Chip>
        </div>
      </Card.Header>

      <Card.Content className="grid gap-4 p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="grid gap-2 rounded-xl bg-surface-secondary/65 p-3 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <Call aria-hidden="true" size={16} />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Sms aria-hidden="true" size={16} />
            <span className="truncate">{customer.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ProfileStat
            label={t("pages.customer.profileVisits")}
            value={String(customer.visits)}
          />
          <ProfileStat
            label={t("pages.customer.profilePoints")}
            value={customer.points.toLocaleString()}
          />
          <ProfileStat
            label={t("pages.customer.profileSpend")}
            value={customer.lifetimeSpend}
          />
          <ProfileStat
            label={t("pages.customer.profileFavorite")}
            value={customer.favorite}
          />
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-accent/5 p-3 text-sm">
          <Receipt2 aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={17} />
          <p className="leading-5 text-muted">
            {t("pages.customer.profileNote")}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
          <Button fullWidth size="lg" type="button" variant="secondary">
            <Call aria-hidden="true" size={18} />
            {t("pages.customer.callCustomer")}
          </Button>
          <Button fullWidth size="lg" type="button" variant="ghost">
            <Receipt2 aria-hidden="true" size={18} />
            {t("pages.customer.viewHistory")}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-surface-secondary/65 p-3">
      <p className="truncate text-xs text-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}
