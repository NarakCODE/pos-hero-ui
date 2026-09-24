import { Skeleton } from "@heroui/react";
import { POSPageLoading } from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-44" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={`dashboard-metric-${index}`}
                className="h-28 w-full"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,1fr)]">
            <Skeleton className="h-[23rem] w-full" />
            <Skeleton className="h-[23rem] w-full" />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,1fr)]">
            <Skeleton className="h-[29rem] w-full" />
            <div className="grid grid-cols-1 gap-4">
              <Skeleton className="h-[13rem] w-full" />
              <Skeleton className="h-[13rem] w-full" />
            </div>
          </div>
        </div>
      </div>
    </POSPageLoading>
  );
}
