import { Skeleton } from "@heroui/react";
import {
  POSPageLoading,
  POSSearchBarSkeleton,
  POSTabsSkeleton,
  SettingsAsideSkeleton,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<SettingsAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <POSTabsSkeleton count={5} />
        <POSSearchBarSkeleton hasAction={false} />
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-auto p-[var(--pos-content-padding)] pt-0 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton
              key={`settings-tile-skeleton-${index}`}
              className="min-h-32 rounded-xl"
            />
          ))}
        </div>
      </div>
    </POSPageLoading>
  );
}
