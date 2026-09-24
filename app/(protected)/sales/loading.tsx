import { Skeleton } from "@heroui/react";
import {
  OrderAsideSkeleton,
  POSPageLoading,
  POSSearchBarSkeleton,
  POSTabsSkeleton,
  ProductGridSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<OrderAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={6} />
        <POSSearchBarSkeleton />
        <div className="min-h-0 flex-1 overflow-hidden p-[var(--pos-content-padding)] pt-0">
          <ProductGridSkeleton count={8} />
        </div>
        <div className="flex shrink-0 flex-col gap-2 border-t border-border px-[var(--pos-content-padding)] py-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={`modifier-skeleton-${index}`} className="flex items-center gap-3">
              <Skeleton className="h-4 w-20 shrink-0" />
              <Skeleton className="h-10 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </POSPageLoading>
  );
}
