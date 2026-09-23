"use client";

import { Card, Chip, Skeleton } from "@heroui/react";
import { useSyncExternalStore } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface MonthlyRevenueCardProps {
  title?: string;
  total: number;
  trend: {
    direction: "up" | "down";
    value: string; // e.g. "12.5%"
  };
  data?: MonthlyRevenuePoint[];
  currency?: string;
  className?: string;
  height?: number;
}

export const defaultMonthlyRevenueData: MonthlyRevenuePoint[] = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6300 },
  { month: "May", revenue: 5900 },
  { month: "Jun", revenue: 7200 },
  { month: "Jul", revenue: 6800 },
  { month: "Aug", revenue: 7500 },
  { month: "Sep", revenue: 8100 },
  { month: "Oct", revenue: 7800 },
  { month: "Nov", revenue: 9200 },
  { month: "Dec", revenue: 10500 },
];

function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

const emptySubscribe = () => () => {};

export function MonthlyRevenueCard({
  title = "Monthly Revenue",
  total,
  trend,
  data = defaultMonthlyRevenueData,
  currency = "USD",
  className = "w-full",
  height = 180,
}: MonthlyRevenueCardProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isUp = trend.direction === "up";

  return (
    <div className={className}>
      <Card variant="default">
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0">
              <Card.Description>{title}</Card.Description>
              <Card.Title className="text-2xl font-bold tabular-nums tracking-tight">
                {formatCurrency(total, currency)}
              </Card.Title>
            </div>

            <div className="shrink-0">
              <Chip
                color={isUp ? "success" : "danger"}
                size="sm"
                variant="soft"
              >
                <span>{trend.value}</span>
              </Chip>
            </div>
          </div>
        </Card.Header>

      <Card.Content>
        <div className="pt-2" style={{ height: `${height}px`, width: "100%" }}>
          {!isMounted ? (
            <div className="flex h-full w-full items-end gap-2 pb-2">
              {Array.from({ length: 12 }, (_, index) => (
                <Skeleton
                  key={`revenue-skeleton-${index}`}
                  className="flex-1 rounded-t-md"
                  style={{ height: `${30 + (index % 5) * 14}%` }}
                />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 8, right: 6, left: 6, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--accent)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  interval="preserveStartEnd"
                />

                <Tooltip
                  cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{
                    color: "var(--muted)",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                  formatter={(value) => [
                    typeof value === "number"
                      ? formatCurrency(value, currency)
                      : String(value ?? 0),
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                  activeDot={{
                    r: 4.5,
                    stroke: "var(--surface)",
                    strokeWidth: 2,
                    fill: "var(--accent)",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card.Content>
    </Card>
  </div>
);
}

export default MonthlyRevenueCard;
