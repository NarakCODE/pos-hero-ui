"use client";

import { Card, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  dashboardDataByRange,
  type SalesChannelKey,
  type TenderKey,
  type TimeRange,
} from "./dashboard-data";

interface ChannelTenderCardProps {
  timeRange: TimeRange;
}

const channelColors: Record<SalesChannelKey, string> = {
  dineIn: "var(--accent)",
  takeaway: "var(--success)",
  delivery: "var(--warning)",
};

const channelLabelKeys: Record<SalesChannelKey, string> = {
  dineIn: "channels.dineIn",
  takeaway: "channels.takeaway",
  delivery: "channels.delivery",
};

const tenderLabelKeys: Record<TenderKey, string> = {
  cash: "tenders.cash",
  khqr: "tenders.khqr",
  card: "tenders.card",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function ChannelTenderCard({ timeRange }: ChannelTenderCardProps) {
  const t = useTranslations("Dashboard");
  const data = dashboardDataByRange[timeRange];
  const channelData = data.channels.map((channel) => ({
    ...channel,
    name: t(channelLabelKeys[channel.key]),
  }));

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-start justify-between gap-3">
          <div className="min-w-0">
            <Card.Title>{t("charts.salesChannels")}</Card.Title>
            <Card.Description>{t("charts.salesChannelsDescription")}</Card.Description>
          </div>
          <Chip color="accent" size="sm" variant="soft">
            {t("charts.ordersCount", { count: data.orders })}
          </Chip>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="h-48 min-w-0 w-full" role="img" aria-label={t("charts.salesChannelsAccessibleLabel")}>
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={channelData}
                dataKey="revenue"
                endAngle={-270}
                innerRadius={58}
                nameKey="name"
                outerRadius={86}
                paddingAngle={3}
                startAngle={90}
                stroke="var(--surface)"
                strokeWidth={3}
              >
                {channelData.map((channel) => (
                  <Cell
                    key={channel.key}
                    fill={channelColors[channel.key]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface)",
                  color: "var(--foreground)",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                }}
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{
                  color: "var(--muted)",
                  fontWeight: 600,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          aria-label={t("charts.salesChannelsAccessibleLabel")}
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          role="list"
        >
          {channelData.map((channel) => (
            <div
              key={channel.key}
              className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-surface-secondary/60 px-3 py-2 text-xs"
              role="listitem"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: channelColors[channel.key] }}
                />
                <span className="truncate text-muted">{channel.name}</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-foreground">
                {formatCurrency(channel.revenue)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {data.tenders.map((tender) => (
            <Chip key={tender.key} color="default" size="sm" variant="soft">
              {t(tenderLabelKeys[tender.key])} · {formatCurrency(tender.revenue)}
            </Chip>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
}
