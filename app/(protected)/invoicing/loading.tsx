import { Skeleton } from "@heroui/react";
import {
  ContextAsideSkeleton,
  OrdersTableSkeleton,
  POSPageLoading,
  POSTabsSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading
      aside={<ContextAsideSkeleton label="Loading invoice details" />}
      asideWidth="38%"
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={5} />

        <div className="flex w-full shrink-0 flex-wrap items-center gap-2 px-[var(--pos-content-padding)] py-2.5">
          <Skeleton className="h-10 min-w-0 flex-1 basis-56" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={`invoice-filter-skeleton-${index}`}
              className="size-10 shrink-0"
            />
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-[var(--pos-content-padding)] pt-0">
          <OrdersTableSkeleton count={8} label="Loading invoices and receipts" />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    </POSPageLoading>
  );
}
