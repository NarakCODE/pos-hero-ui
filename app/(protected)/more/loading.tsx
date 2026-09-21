import { Skeleton } from "@heroui/react";
import {
  ContextAsideSkeleton,
  POSPageLoading,
} from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <POSPageLoading aside={<ContextAsideSkeleton />}>
      <div className="flex h-full min-h-0 flex-col gap-4 p-[var(--pos-content-padding)]">
        <Skeleton className="h-8 w-36 rounded-md" />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-surface-secondary/40 p-8">
          <Skeleton className="size-16 rounded-2xl" />
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-4 w-64 max-w-full rounded-md" />
        </div>
      </div>
    </POSPageLoading>
  );
}
