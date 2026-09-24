"use client";

import { Skeleton } from "@heroui/react";
import type { CSSProperties, ReactNode } from "react";
import { POSFooter } from "./pos-footer";

export const POS_LOADING_DURATION_MS = 600;

const contentPaddingClasses = {
  none: "[--pos-content-padding:0rem]",
  compact: "[--pos-content-padding:0.5rem] sm:[--pos-content-padding:0.75rem]",
  default: "[--pos-content-padding:0.75rem] sm:[--pos-content-padding:1rem]",
  comfortable: "[--pos-content-padding:1rem] sm:[--pos-content-padding:1.5rem]",
} as const;

export type POSPageLoadingPadding = keyof typeof contentPaddingClasses;

type POSPageLoadingStyle = CSSProperties & {
  "--pos-page-loading-aside-width": string;
};

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
      className="flex min-h-[29rem] w-full flex-col border border-border bg-surface p-3 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3 pb-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-7 w-10" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="size-5" />
      </div>

      <div className="flex flex-1 flex-col">
        {Array.from({ length: 15 }, (_, index) => (
          <div
            key={`table-slot-skeleton-${index}`}
            className="flex min-h-6 items-center gap-1.5 border-b border-border/40 last:border-b-0"
          >
            <Skeleton className="h-3 w-[3.6rem] shrink-0" />
            <Skeleton className="h-3 min-w-0 flex-1" />
            <Skeleton className="size-2 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableGridSkeleton({
  className = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
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
      className="flex min-h-24 w-full items-center gap-3 overflow-hidden border border-border bg-surface p-2 shadow-xs"
    >
      <Skeleton className="size-16 shrink-0 sm:size-[4.5rem]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pe-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
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
      <Skeleton className="h-4 w-8" />
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-8 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

export function OrdersTableSkeleton({ count = 8 }: { count?: number }) {
  const rowClassName =
    "grid-cols-[3rem_minmax(10rem,1.5fr)_minmax(8rem,1.2fr)_minmax(6rem,1fr)_minmax(6rem,0.9fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_minmax(6rem,0.8fr)]";

  return (
    <LoadingRegion
      className="min-w-[68rem] overflow-hidden border border-border bg-surface shadow-xs"
      label="Loading orders"
    >
      <div
        aria-hidden="true"
        className={`grid items-center gap-4 bg-surface-secondary/60 px-4 py-3 ${rowClassName}`}
      >
        {Array.from({ length: 9 }, (_, index) => (
          <Skeleton
            key={`orders-heading-skeleton-${index}`}
            className="h-3.5 w-full"
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
        <Skeleton className="size-8 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36" />
      </div>
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-8" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function CustomersTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <LoadingRegion
      className="min-w-[42rem] overflow-hidden border border-border bg-surface shadow-xs"
      label="Loading customers"
    >
      <div
        aria-hidden="true"
        className="grid grid-cols-[minmax(14rem,1.5fr)_minmax(12rem,1.25fr)_minmax(7rem,0.8fr)_5rem_minmax(8rem,0.9fr)] items-center gap-4 bg-surface-secondary/60 px-4 py-3"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton
            key={`customers-heading-skeleton-${index}`}
            className="h-3.5 w-full"
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
      className="flex w-full flex-col items-stretch overflow-hidden border border-border bg-surface shadow-xs sm:flex-row"
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
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-5 w-12" />
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
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>

      {/* Order Items List */}
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`order-aside-skeleton-${index}`}
            className="flex items-center justify-between gap-3 bg-surface-secondary/40 p-2.5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <Skeleton className="size-7 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
        ))}
      </div>

      {/* Footer Billing & Actions */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-col gap-2 bg-surface-secondary/50 p-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>

        <Skeleton className="h-12 w-full" />
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
        <Skeleton className="size-5" />
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden py-3">
        {/* Profile Card */}
        <div className="flex items-start justify-between gap-3 bg-surface-secondary/40 p-3.5">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 shrink-0 sm:size-14" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Basic Information Section */}
        <div className="flex flex-col gap-3 border border-border/60 p-3.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="size-4" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={`customer-aside-detail-skeleton-${index}`}
                className="flex flex-col gap-1.5"
              >
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={`customer-aside-stat-skeleton-${index}`}
              className="flex flex-col items-center gap-1.5 bg-surface-secondary/30 p-2.5 text-center"
            >
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="grid shrink-0 grid-cols-3 gap-2 border-t border-border/60 pt-3">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
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
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Form Fields */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden py-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={`settings-aside-skeleton-${index}`}
            className="flex flex-col gap-2"
          >
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex shrink-0 justify-end border-t border-border/60 pt-3">
        <Skeleton className="h-11 w-36" />
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
        <Skeleton className="size-10 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-hidden py-3">
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-col gap-2 bg-surface-secondary/40 p-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/60 pt-3">
        <Skeleton className="h-11 w-full" />
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
          <Skeleton className="size-8" />
          <Skeleton className="hidden h-5 w-24 sm:block" />
        </div>

        {/* Search Field (Centered) */}
        <div className="flex min-w-0 max-w-md flex-1">
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Right: Actions & Switchers */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="hidden h-8 w-24 sm:block" />
          <Skeleton className="size-8" />
        </div>
      </div>
    </header>
  );
}

export function POSFooterSkeleton({ className = "" }: { className?: string }) {
  return <POSFooter className={`w-full ${className}`} />;
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
          className="h-8 w-20 shrink-0 sm:w-24"
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
      <Skeleton className="h-10 flex-1" />
      {hasAction && <Skeleton className="size-10 shrink-0" />}
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
  asideWidth = "40%",
  children,
  className = "",
  contentPadding = "default",
  showFooter = true,
  showHeader = true,
}: {
  aside?: ReactNode;
  asideWidth?: CSSProperties["width"];
  children?: ReactNode;
  className?: string;
  contentPadding?: POSPageLoadingPadding;
  showFooter?: boolean;
  showHeader?: boolean;
}) {
  const asideWidthValue =
    typeof asideWidth === "number" ? `${asideWidth}px` : asideWidth;

  return (
    <div
      data-slot="pos-page-loading"
      className={`flex h-screen h-dvh w-full flex-col overflow-hidden bg-background text-foreground ${contentPaddingClasses[contentPadding]} ${className}`}
      style={
        {
          "--pos-page-loading-aside-width": asideWidthValue,
        } as POSPageLoadingStyle
      }
    >
      <div className="mx-auto grid min-h-0 w-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(20rem,var(--pos-page-loading-aside-width))]">
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

      {showFooter && <POSFooter className="w-full" />}
    </div>
  );
}
