import { Skeleton } from "@heroui/react";
import {
  OrderAsideSkeleton,
  OrdersTableSkeleton,
  POSPageLoading,
  POSSearchBarSkeleton,
  POSTabsSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<OrderAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={6} />
        <POSSearchBarSkeleton />
        <div className="min-h-0 flex-1 overflow-auto p-[var(--pos-content-padding)] pt-0">
          <OrdersTableSkeleton count={8} />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    </POSPageLoading>
  );
}
