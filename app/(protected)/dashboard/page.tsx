"use client";

import { ScrollShadow } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChannelTenderCard } from "@/components/dashboard/channel-tender-card";
import { DailyGuestsCard } from "@/components/dashboard/daily-guests-card";
import { DashboardSummaryCards } from "@/components/dashboard/dashboard-summary-cards";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { OperationsSnapshot } from "@/components/dashboard/operations-snapshot";
import { RevenueTrendCard } from "@/components/dashboard/revenue-trend-card";
import { TopProductsSurface } from "@/components/dashboard/top-products-surface";
import type { TimeRange } from "@/components/dashboard/dashboard-data";
import { POSLayout } from "@/components/shared/pos-layout";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [selectedRange, setSelectedRange] = useState<TimeRange>("Today");

  return (
    <POSLayout
      contentPadding="comfortable"
      headerTitle={t("title")}
      showSearch={false}
    >
      <ScrollShadow className="flex h-full w-full flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:p-6">
          <DashboardToolbar
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />

          <section aria-label={t("sections.performanceSummary")}>
            <DashboardSummaryCards timeRange={selectedRange} />
          </section>

          <section
            aria-label={t("sections.salesAnalysis")}
            className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(20rem,1fr)]"
          >
            <RevenueTrendCard timeRange={selectedRange} />
            <ChannelTenderCard timeRange={selectedRange} />
          </section>

          <section
            aria-label={t("sections.productAndOperations")}
            className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,1fr)]"
          >
            <TopProductsSurface timeRange={selectedRange} />
            <div className="flex flex-col gap-4">
              <DailyGuestsCard />
              <OperationsSnapshot />
            </div>
          </section>
        </div>
      </ScrollShadow>
    </POSLayout>
  );
}
