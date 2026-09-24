import { Skeleton } from "@heroui/react";
import {
  CustomerAsideSkeleton,
  CustomersTableSkeleton,
  POSPageLoading,
  POSSearchBarSkeleton,
  POSTabsSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<CustomerAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={5} />
        <POSSearchBarSkeleton />
        <div className="min-h-0 flex-1 overflow-auto p-[var(--pos-content-padding)] pt-0">
          <CustomersTableSkeleton count={8} />
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-8 w-48" />
        </div>
      </div>
    </POSPageLoading>
  );
}
