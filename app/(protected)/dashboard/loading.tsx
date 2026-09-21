import { Skeleton } from "@heroui/react";
import { KpiGroupSkeleton } from "@/components/shared/pos-loading";

export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground sm:p-10">
      <div className="mx-auto flex w-full max-w-full flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-56 rounded-md" />
          <Skeleton className="h-5 w-96 max-w-full rounded-md" />
        </div>
        <KpiGroupSkeleton count={4} />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-24 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
