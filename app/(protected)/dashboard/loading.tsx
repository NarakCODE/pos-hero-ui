import { Skeleton } from "@heroui/react";
import { POSPageLoading } from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading>
      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
          {/* Toolbar Skeleton */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-6 w-48 rounded-md" />
              <Skeleton className="h-4 w-72 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-48 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          {/* Hero Revenue Banner Skeleton */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-56 rounded-md" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
            <Skeleton className="h-36 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          </div>

          {/* Gradient KPI Cards Skeleton */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>

          {/* Charts & Products Grid Skeleton */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Skeleton className="h-72 w-full rounded-2xl" />
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>

          {/* Channel & Tender Skeleton */}
          <Skeleton className="h-52 w-full rounded-2xl" />

          {/* Quick Modules Skeleton */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-44 rounded-md" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton
                  key={`module-skeleton-${index}`}
                  className="h-28 w-full rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </POSPageLoading>
  );
}
