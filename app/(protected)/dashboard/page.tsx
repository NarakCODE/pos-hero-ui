"use client";

import { ScrollShadow } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChannelTenderCard } from "@/components/dashboard/channel-tender-card";
import { DashboardHeroBanner } from "@/components/dashboard/dashboard-hero-banner";
import {
  DashboardToolbar,
  type TimeRange,
} from "@/components/dashboard/dashboard-toolbar";
import { GradientKpiCards } from "@/components/dashboard/gradient-kpi-cards";
import { TopProductsSurface } from "@/components/dashboard/top-products-surface";
import { MonthlyRevenueCard } from "@/components/shared/montly-revenue-card";
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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
          {/* Color Admin v4 Section 1: Dashboard Toolbar (Time Range & Actions) */}
          <section aria-label="Dashboard toolbar and filters">
            <DashboardToolbar
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </section>

          {/* Color Admin v4 Section 2: Executive Revenue Hero Overview Banner */}
          <section aria-label="Executive revenue banner">
            <DashboardHeroBanner timeRange={selectedRange} />
          </section>

          {/* Color Admin v4 Section 3: Vibrant Gradient KPI Metric Cards with Background Watermarks */}
          <section aria-label="Occupancy and loyalty metric cards">
            <GradientKpiCards />
          </section>

          {/* Color Admin v4 Section 4: Performance Trends & Channel Distribution */}
          <section
            aria-label="Performance trends and channel distribution"
            className="grid grid-cols-1 gap-5 lg:grid-cols-2"
          >
            {/* Monthly Revenue Chart */}
            <MonthlyRevenueCard
              currency="USD"
              title="Monthly Sales Trend"
              total={86400}
              trend={{ direction: "up", value: "14.2%" }}
            />

            {/* Channel & Tender Distribution */}
            <ChannelTenderCard />
          </section>

          {/* Color Admin v4 Section 5: Top Selling Products */}
          <section aria-label="Top selling products">
            <TopProductsSurface />
          </section>
        </div>
      </ScrollShadow>
    </POSLayout>
  );
}
