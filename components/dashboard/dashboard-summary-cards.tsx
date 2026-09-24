"use client";

import { Card, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import { dashboardDataByRange, type TimeRange } from "./dashboard-data";

interface DashboardSummaryCardsProps {
  timeRange: TimeRange;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function DashboardSummaryCards({
  timeRange,
}: DashboardSummaryCardsProps) {
  const t = useTranslations("Dashboard");
  const data = dashboardDataByRange[timeRange];
  const metrics = [
    {
      title: t("metrics.grossSales"),
      value: formatCurrency(data.revenue),
      change: data.revenueChange,
    },
    {
      title: t("metrics.orders"),
      value: new Intl.NumberFormat("en-US").format(data.orders),
      change: data.ordersChange,
    },
    {
      title: t("metrics.averageTicket"),
      value: formatCurrency(data.averageTicket),
      change: data.averageTicketChange,
    },
    {
      title: t("metrics.estimatedTax"),
      value: formatCurrency(data.estimatedTax),
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <Card.Header>
            <div className="flex items-center justify-between gap-2">
              <Card.Description>{metric.title}</Card.Description>
              {metric.change === null ? (
                <Chip color="default" size="sm" variant="soft">
                  {t("metrics.estimate")}
                </Chip>
              ) : (
                <Chip color="success" size="sm" variant="soft">
                  +{metric.change.toFixed(1)}%
                </Chip>
              )}
            </div>
            <Card.Title>
              <span className="text-2xl font-bold tabular-nums tracking-tight">
                {metric.value}
              </span>
            </Card.Title>
            {metric.change !== null ? (
              <Card.Description>
                {t("metrics.vsPreviousPeriod")}
              </Card.Description>
            ) : null}
          </Card.Header>
        </Card>
      ))}
    </div>
  );
}
