import {
  OrderAsideSkeleton,
  POSPageLoading,
  POSSearchBarSkeleton,
  POSTabsSkeleton,
  TableGridSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<OrderAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={6} />
        <POSSearchBarSkeleton />
        <div className="min-h-0 flex-1 overflow-hidden px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
          <TableGridSkeleton count={12} />
        </div>
      </div>
    </POSPageLoading>
  );
}
