import { Skeleton } from "@heroui/react";
import type { ReactNode } from "react";

export const POS_LOADING_DURATION_MS = 600;

const contentPaddingClasses = {
  none: "[--pos-content-padding:0rem]",
  compact: "[--pos-content-padding:0.5rem] sm:[--pos-content-padding:0.75rem]",
  default: "[--pos-content-padding:0.75rem] sm:[--pos-content-padding:1rem]",
  comfortable: "[--pos-content-padding:1rem] sm:[--pos-content-padding:1.5rem]",
} as const;

export type POSPageLoadingPadding = keyof typeof contentPaddingClasses;

interface LoadingRegionProps {
  children: ReactNode;
  label: string;
  className?: string;
}

function LoadingRegion({
  children,
  className = "",
  label,
}: LoadingRegionProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
      className={`[--pos-content-padding:0.75rem] sm:[--pos-content-padding:1rem] ${className}`}
      role="status"
    >
      {children}
    </div>
  );
}

export function TableCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-44 w-full flex-col justify-between rounded-xl border border-border bg-surface p-4 shadow-xs"
    >
      {/* Table Label, Section & Status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Table Meta Chips (Server, Guests, Items) */}
      <div className="my-4 flex flex-wrap items-center gap-2">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-14 rounded-md" />
      </div>

      {/* Footer (Start Time & Running Total) */}
      <div className="flex items-end justify-between gap-3 border-t border-border/60 pt-3">
        <Skeleton className="h-3.5 w-24 rounded-md" />
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-2.5 w-10 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function TableGridSkeleton({
  className = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  count = 12,
}: {
  className?: string;
  count?: number;
} = {}) {
  return (
    <LoadingRegion
      className={className}
      label="Loading tables"
    >
      {Array.from({ length: count }, (_, index) => (
        <TableCardSkeleton key={`table-skeleton-${index}`} />
      ))}
    </LoadingRegion>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-24 w-full items-center gap-3 overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-xs"
    >
      <Skeleton className="size-16 shrink-0 rounded-lg sm:size-[4.5rem]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pe-1">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <LoadingRegion
      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4"
      label="Loading products"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={`product-skeleton-${index}`} />
      ))}
    </LoadingRegion>
  );
}

function TableRowSkeleton({ rowClassName }: { rowClassName: string }) {
  return (
    <div
      aria-hidden="true"
      className={`grid items-center gap-4 border-t border-border/60 px-4 py-3.5 ${rowClassName}`}
    >
      <Skeleton className="h-4 w-8 rounded-md" />
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="h-4 w-16 rounded-md" />
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-4 w-16 rounded-md" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function OrdersTableSkeleton({ count = 8 }: { count?: number }) {
  const rowClassName =
    "grid-cols-[3rem_minmax(10rem,1.5fr)_minmax(8rem,1.2fr)_minmax(6rem,1fr)_minmax(6rem,0.9fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(6rem,0.8fr)]";

  return (
    <LoadingRegion
      className="min-w-[68rem] overflow-hidden rounded-xl border border-border bg-surface shadow-xs"
      label="Loading orders"
    >
      <div
        aria-hidden="true"
        className={`grid items-center gap-4 bg-surface-secondary/60 px-4 py-3 ${rowClassName}`}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton
            key={`orders-heading-skeleton-${index}`}
            className="h-3.5 w-full rounded-md"
          />
        ))}
      </div>
      {Array.from({ length: count }, (_, index) => (
        <TableRowSkeleton
          key={`orders-row-skeleton-${index}`}
          rowClassName={rowClassName}
        />
      ))}
    </LoadingRegion>
  );
}

function CustomerRowSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-[minmax(14rem,1.5fr)_minmax(12rem,1.25fr)_minmax(7rem,0.8fr)_5rem_minmax(8rem,0.9fr)] items-center gap-4 border-t border-border/60 px-4 py-3.5"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-3 w-36 rounded-md" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-8 rounded-md" />
      <Skeleton className="h-4 w-20 rounded-md" />
    </div>
  );
}

export function CustomersTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <LoadingRegion
      className="min-w-[42rem] overflow-hidden rounded-xl border border-border bg-surface shadow-xs"
      label="Loading customers"
    >
      <div
        aria-hidden="true"
        className="grid grid-cols-[minmax(14rem,1.5fr)_minmax(12rem,1.25fr)_minmax(7rem,0.8fr)_5rem_minmax(8rem,0.9fr)] items-center gap-4 bg-surface-secondary/60 px-4 py-3"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={`customers-heading-skeleton-${index}`}
            className="h-3.5 w-full rounded-md"
          />
        ))}
      </div>
      {Array.from({ length: count }, (_, index) => (
        <CustomerRowSkeleton key={`customers-row-skeleton-${index}`} />
      ))}
    </LoadingRegion>
  );
}

export function KpiGroupSkeleton({ count = 4 }: { count?: number }) {
  return (
    <LoadingRegion
      className="flex w-full flex-col items-stretch overflow-hidden rounded-xl border border-border bg-surface shadow-xs sm:flex-row"
      label="Loading metrics"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={`kpi-skeleton-${index}`} className="contents">
          {index > 0 && (
            <div
              aria-hidden="true"
              className="h-px w-full shrink-0 bg-border sm:h-auto sm:w-px"
            />
          )}
          <div
            aria-hidden="true"
            className="flex min-w-0 flex-1 flex-col justify-between gap-2 p-3.5 sm:p-4"
          >
            <Skeleton className="h-3 w-20 rounded-md" />
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-7 w-20 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </LoadingRegion>
  );
}

export function OrderAsideSkeleton() {
  return (
    <LoadingRegion
      className="flex h-full min-h-0 flex-col justify-between overflow-hidden p-[var(--pos-content-padding)]"
      label="Loading order details"
    >
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-3.5 w-20 rounded-md" />
        </div>
      </div>

      {/* Order Items List */}
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`order-aside-skeleton-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg bg-surface-secondary/40 p-2.5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Skeleton className="size-7 shrink-0 rounded-md" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 shrink-0 rounded-md" />
          </div>
        ))}
      </div>

      {/* Footer Billing & Actions */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-col gap-2 rounded-xl bg-surface-secondary/50 p-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-14 rounded-md" />
            <Skeleton className="h-3 w-12 rounded-md" />
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </LoadingRegion>
  );
}

export function CustomerAsideSkeleton() {
  return (
    <LoadingRegion
      className="flex h-full min-h-0 flex-col justify-between overflow-hidden p-[var(--pos-content-padding)]"
      label="Loading customer details"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-border/60 pb-3">
        <Skeleton className="size-5 rounded-md" />
        <Skeleton className="h-5 w-32 rounded-md" />
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden py-3">
        {/* Profile Card */}
        <div className="flex items-start justify-between gap-3 rounded-xl bg-surface-secondary/40 p-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 rounded-full sm:size-14" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Basic Information Section */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-3.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="size-4 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`customer-aside-detail-skeleton-${index}`}
                className="flex flex-col gap-1.5"
              >
                <Skeleton className="h-2.5 w-16 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={`customer-aside-stat-skeleton-${index}`}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-surface-secondary/30 p-2.5 text-center"
            >
              <Skeleton className="h-2.5 w-12 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="grid shrink-0 grid-cols-3 gap-2 border-t border-border/60 pt-3">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
    </LoadingRegion>
  );
}

export function SettingsAsideSkeleton() {
  return (
    <LoadingRegion
      className="flex h-full min-h-0 flex-col justify-between overflow-hidden p-[var(--pos-content-padding)]"
      label="Loading settings"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 pb-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Form Fields */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`settings-aside-skeleton-${index}`}
            className="flex flex-col gap-2"
          >
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex shrink-0 justify-end border-t border-border/60 pt-3">
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </LoadingRegion>
  );
}

export function ContextAsideSkeleton() {
  return (
    <LoadingRegion
      className="flex h-full min-h-0 flex-col justify-between overflow-hidden p-[var(--pos-content-padding)]"
      label="Loading panel"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border/60 pb-3">
        <Skeleton className="size-10 shrink-0 rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden py-3">
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex flex-col gap-2 rounded-xl bg-surface-secondary/40 p-3">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-3 w-40 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/60 pt-3">
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </LoadingRegion>
  );
}

export function POSHeaderSkeleton({ className = "" }: { className?: string }) {
  return (
    <header
      aria-hidden="true"
      className={`shrink-0 border-b border-border bg-background px-[var(--pos-content-padding)] py-2.5 shadow-xs transition-colors sm:py-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex shrink-0 items-center gap-3">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="hidden h-5 w-24 rounded-md sm:block" />
        </div>

        {/* Search Field (Centered) */}
        <div className="flex min-w-0 max-w-md flex-1">
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>

        {/* Right: Switchers */}
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="hidden h-8 w-24 rounded-xl sm:block" />
          <Skeleton className="size-8 rounded-xl" />
        </div>
      </div>
    </header>
  );
}

export function POSFooterSkeleton({ className = "" }: { className?: string }) {
  return (
    <footer
      aria-hidden="true"
      className={`sticky bottom-0 z-30 shrink-0 border-t border-border bg-card px-[var(--pos-content-padding)] py-2 shadow-xs transition-colors sm:py-2.5 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Sign out button */}
        <Skeleton className="h-9 w-20 shrink-0 rounded-lg sm:w-24" />

        {/* Navigation items */}
        <div className="flex min-w-0 flex-1 items-center justify-around gap-1 sm:justify-center sm:gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton
              key={`pos-nav-skeleton-${index}`}
              className="h-9 w-16 rounded-lg sm:w-20 md:w-24"
            />
          ))}
        </div>

        {/* Cashier status info */}
        <div className="hidden shrink-0 items-center border-s border-border/70 ps-3 lg:flex">
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-2.5 w-14 rounded-md" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export function POSTabsSkeleton({
  className = "",
  count = 6,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center gap-2 overflow-hidden border-b border-border px-[var(--pos-content-padding)] py-2 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <Skeleton
          key={`tab-skeleton-${index}`}
          className="h-8 w-20 shrink-0 rounded-lg sm:w-24"
        />
      ))}
    </div>
  );
}

export function POSSearchBarSkeleton({
  className = "",
  hasAction = true,
}: {
  className?: string;
  hasAction?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center gap-2 px-[var(--pos-content-padding)] py-3 ${className}`}
    >
      <Skeleton className="h-10 flex-1 rounded-xl" />
      {hasAction && <Skeleton className="size-10 shrink-0 rounded-xl" />}
    </div>
  );
}

function DefaultPageContentSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <POSTabsSkeleton count={6} />
      <POSSearchBarSkeleton />
      <div className="min-h-0 flex-1 overflow-hidden p-[var(--pos-content-padding)] pt-0">
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductCardSkeleton key={`default-product-skeleton-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function POSPageLoading({
  aside,
  children,
  className = "",
  contentPadding = "default",
  showFooter = true,
  showHeader = true,
}: {
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
  contentPadding?: POSPageLoadingPadding;
  showFooter?: boolean;
  showHeader?: boolean;
}) {
  return (
    <div
      data-slot="pos-page-loading"
      className={`flex h-screen h-dvh w-full flex-col overflow-hidden bg-background text-foreground ${contentPaddingClasses[contentPadding]} ${className}`}
    >
      <div className="mx-auto grid min-h-0 w-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(20rem,40%)]">
        <main
          className={`flex min-h-0 min-w-0 flex-col overflow-hidden bg-background ${
            aside ? "border-e border-border" : ""
          }`}
        >
          {showHeader && <POSHeaderSkeleton />}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {children ?? <DefaultPageContentSkeleton />}
          </div>
        </main>

        {aside ? (
          <aside className="hidden min-h-0 min-w-0 flex-col overflow-hidden bg-surface lg:flex">
            {aside}
          </aside>
        ) : null}
      </div>

      {showFooter && <POSFooterSkeleton />}
    </div>
  );
}
