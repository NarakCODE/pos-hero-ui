"use client";

import { Chip, Surface } from "@heroui/react";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

export interface KpiTrend {
  direction: "up" | "down";
  value: string;
}

export interface KpiItem {
  title: string;
  value: string | number;
  trend: KpiTrend;
}

export interface KpiGroupProps {
  items: KpiItem[];
  className?: string;
  /** Optional wrapper width / styling */
  containerClassName?: string;
  /** Whether to render in compact mode with reduced padding (defaults to true) */
  compact?: boolean;
}

export function KpiGroup({
  items,
  className,
  containerClassName = "w-full",
  compact = true,
}: KpiGroupProps) {
  return (
    <div className={containerClassName}>
      <dl
        className={`flex flex-col sm:flex-row items-stretch overflow-hidden rounded-xl bg-surface ${className ?? ""}`}
      >
        {items.map((kpi, index) => (
          <div key={`${kpi.title}-${index}`} className="contents">
            {index > 0 && (
              <div
                aria-hidden="true"
                className="h-px w-full shrink-0 bg-border sm:h-auto sm:w-px"
              />
            )}

            <Surface
              className={`flex min-w-0 flex-1 flex-col ${
                compact
                  ? "gap-1 px-3.5 py-2 sm:gap-1.5 sm:px-4 sm:py-2.5"
                  : "gap-2 p-4 sm:gap-3 sm:p-5"
              }`}
              variant="default"
            >
              <dt
                className={`font-medium text-muted ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {kpi.title}
              </dt>

              <dd className="flex items-center gap-2">
                <span
                  className={`font-semibold tabular-nums tracking-tight ${
                    compact ? "text-xl sm:text-2xl" : "text-2xl"
                  }`}
                >
                  {kpi.value}
                </span>

                <Chip
                  className="gap-1"
                  color={kpi.trend.direction === "up" ? "success" : "danger"}
                  size="sm"
                  variant="soft"
                >
                  {kpi.trend.direction === "up" ? (
                    <IconArrowUp aria-hidden="true" className="size-3.5" />
                  ) : (
                    <IconArrowDown aria-hidden="true" className="size-3.5" />
                  )}
                  <span>{kpi.trend.value}</span>
                </Chip>
              </dd>
            </Surface>
          </div>
        ))}
      </dl>
    </div>
  );
}
