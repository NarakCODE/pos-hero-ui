"use client";

import { Card, Chip } from "@heroui/react";
import {
  IconArrowUpRight,
  IconAward,
  IconDeviceDesktop,
  IconPaperclip,
} from "@tabler/icons-react";
import type { TimeRange } from "./dashboard-toolbar";

export interface DashboardHeroBannerProps {
  timeRange: TimeRange;
}

interface RangeAnalytics {
  revenue: string;
  trend: string;
  orders: number;
  avgTicket: string;
  tax: string;
  topProduct: {
    name: string;
    category: string;
    sold: number;
    revenue: string;
  };
  channelMix: {
    dineIn: string;
    takeaway: string;
    delivery: string;
    primaryPercent: string;
  };
  registerStatus: {
    station: string;
    uptime: string;
    status: string;
  };
}

const analyticsDataByRange: Record<TimeRange, RangeAnalytics> = {
  Today: {
    revenue: "$2,480.50",
    trend: "+33.2% vs yesterday",
    orders: 48,
    avgTicket: "$51.68",
    tax: "$248.05",
    topProduct: {
      name: "Iced Latte",
      category: "Iced Coffee",
      sold: 142,
      revenue: "$497.00",
    },
    channelMix: {
      dineIn: "$1,340.00",
      takeaway: "$795.00",
      delivery: "$345.50",
      primaryPercent: "54%",
    },
    registerStatus: {
      station: "Station #1 Active",
      uptime: "99.98% Uptime",
      status: "Synced & Ready",
    },
  },
  "7D": {
    revenue: "$18,420.00",
    trend: "+24.6% vs prev 7d",
    orders: 342,
    avgTicket: "$53.86",
    tax: "$1,842.00",
    topProduct: {
      name: "Caramel Macchiato",
      category: "Iced Coffee",
      sold: 840,
      revenue: "$3,570.00",
    },
    channelMix: {
      dineIn: "$10,131.00",
      takeaway: "$5,526.00",
      delivery: "$2,763.00",
      primaryPercent: "55%",
    },
    registerStatus: {
      station: "2 Stations Online",
      uptime: "99.95% Uptime",
      status: "Synced & Ready",
    },
  },
  "1M": {
    revenue: "$86,400.00",
    trend: "+14.2% vs prev month",
    orders: 1620,
    avgTicket: "$53.33",
    tax: "$8,640.00",
    topProduct: {
      name: "Iced Latte",
      category: "Iced Coffee",
      sold: 3650,
      revenue: "$12,775.00",
    },
    channelMix: {
      dineIn: "$47,520.00",
      takeaway: "$25,920.00",
      delivery: "$12,960.00",
      primaryPercent: "55%",
    },
    registerStatus: {
      station: "All Hardware Active",
      uptime: "99.99% Uptime",
      status: "Audited & Synced",
    },
  },
  MTD: {
    revenue: "$64,250.00",
    trend: "+18.9% MTD pacing",
    orders: 1180,
    avgTicket: "$54.45",
    tax: "$6,425.00",
    topProduct: {
      name: "Pandan Coconut Cloud",
      category: "Signature",
      sold: 2140,
      revenue: "$9,630.00",
    },
    channelMix: {
      dineIn: "$35,337.00",
      takeaway: "$19,275.00",
      delivery: "$9,638.00",
      primaryPercent: "55%",
    },
    registerStatus: {
      station: "Stations #1 & #2",
      uptime: "99.97% Uptime",
      status: "Active Shift",
    },
  },
};

export function DashboardHeroBanner({
  timeRange,
}: DashboardHeroBannerProps) {
  const data = analyticsDataByRange[timeRange] ?? analyticsDataByRange.Today;

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Executive Revenue Overview
            </div>
            <div className="text-base font-bold text-foreground sm:text-lg">
              Sales Telemetry & Register Performance
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip color="success" size="sm" variant="soft">
              Active Shift #1
            </Chip>
            <Chip color="accent" size="sm" variant="soft">
              {timeRange}
            </Chip>
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-4 pt-1">
          {/* Main Hero Gradient Panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-accent to-accent-hover p-5 text-accent-foreground shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                  Total Gross Sales ({timeRange})
                </span>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold tabular-nums tracking-tight sm:text-4xl">
                    {data.revenue}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-foreground/20 px-2.5 py-0.5 text-xs font-bold text-accent-foreground backdrop-blur-xs">
                    <IconArrowUpRight aria-hidden="true" size={14} />
                    {data.trend}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium opacity-95">
                <div className="flex flex-col">
                  <span className="text-[11px] opacity-80">Tickets Completed</span>
                  <span className="text-base font-bold tabular-nums">
                    {data.orders}
                  </span>
                </div>
                <div className="h-8 w-px bg-accent-foreground/20" />
                <div className="flex flex-col">
                  <span className="text-[11px] opacity-80">Average Ticket</span>
                  <span className="text-base font-bold tabular-nums">
                    {data.avgTicket}
                  </span>
                </div>
                <div className="h-8 w-px bg-accent-foreground/20" />
                <div className="flex flex-col">
                  <span className="text-[11px] opacity-80">Estimated Tax</span>
                  <span className="text-base font-bold tabular-nums">
                    {data.tax}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Color Admin v4 Sub-Widgets */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Widget 1: Top Product */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-secondary/40 p-3.5 transition-colors hover:bg-surface-secondary/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Best Seller Volume
                </span>
                <IconAward aria-hidden="true" className="text-accent" size={16} />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-foreground">
                  {data.topProduct.name}
                </div>
                <div className="text-xs text-muted">
                  {data.topProduct.sold} sold · {data.topProduct.revenue}
                </div>
              </div>
            </div>

            {/* Widget 2: Channel Mix */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-secondary/40 p-3.5 transition-colors hover:bg-surface-secondary/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Dining Channel Mix
                </span>
                <IconPaperclip aria-hidden="true" className="text-success" size={16} />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-foreground">
                  Dine-In {data.channelMix.primaryPercent} ({data.channelMix.dineIn})
                </div>
                <div className="text-xs text-muted">
                  Takeaway {data.channelMix.takeaway} · Deliv {data.channelMix.delivery}
                </div>
              </div>
            </div>

            {/* Widget 3: POS Hardware Telemetry */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-surface-secondary/40 p-3.5 transition-colors hover:bg-surface-secondary/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">
                  Hardware Status
                </span>
                <IconDeviceDesktop aria-hidden="true" className="text-warning" size={16} />
              </div>
              <div className="mt-2">
                <div className="text-sm font-bold text-foreground">
                  {data.registerStatus.station}
                </div>
                <div className="text-xs text-muted">
                  {data.registerStatus.uptime} · {data.registerStatus.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

export default DashboardHeroBanner;
