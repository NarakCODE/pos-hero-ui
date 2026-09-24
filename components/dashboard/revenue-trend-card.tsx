"use client";

import { Card, Chip, Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useId, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardDataByRange, type TimeRange } from "./dashboard-data";

interface RevenueTrendCardProps {
  timeRange: TimeRange;
}

const emptySubscribe = () => () => {};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

  return `$${formatted}`;
}

export function RevenueTrendCard({ timeRange }: RevenueTrendCardProps) {
  const t = useTranslations("Dashboard");
  const data = dashboardDataByRange[timeRange];
  const gradientId = `dashboard-revenue-${useId().replace(/:/g, "")}`;
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-start justify-between gap-3">
          <div className="min-w-0">
            <Card.Title>{t("charts.revenueTrend")}</Card.Title>
            <Card.Description>{t("charts.revenueTrendDescription")}</Card.Description>
          </div>
          <Chip color="success" size="sm" variant="soft">
            +{data.revenueChange.toFixed(1)}%
          </Chip>
        </div>
      </Card.Header>

      <Card.Content>
        <div
          aria-label={t("charts.revenueTrendAccessibleLabel")}
          className="h-64 min-w-0 w-full"
          role="img"
        >
          {!isMounted ? (
            <div className="flex h-full w-full items-end gap-2 px-2 pb-7">
              {data.revenueTrend.map((point) => (
                <Skeleton
                  key={point.period}
                  className="flex-1"
                  style={{
                    height: `${Math.max(24, (point.revenue / data.revenue) * 100)}%`,
                  }}
                />
              ))}
            </div>
          ) : (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart
                data={data.revenueTrend}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--accent)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 5"
                />
                <XAxis
                  axisLine={false}
                  dataKey="period"
                  interval="preserveStartEnd"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "var(--muted)" }}
                  tickFormatter={formatCompactCurrency}
                  tickLine={false}
                  tickMargin={8}
                  width={46}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                  }}
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    t("charts.revenue"),
                  ]}
                  labelStyle={{
                    color: "var(--muted)",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                />
                <Area
                  activeDot={{
                    r: 4,
                    stroke: "var(--surface)",
                    strokeWidth: 2,
                    fill: "var(--accent)",
                  }}
                  dataKey="revenue"
                  fill={`url(#${gradientId})`}
                  name={t("charts.revenue")}
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}
