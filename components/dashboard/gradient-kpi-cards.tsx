"use client";

import { Card, Chip } from "@heroui/react";
import { IconTable, IconUsers } from "@tabler/icons-react";

export function GradientKpiCards() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Card 1: Table Floor Plan & Dine-In Occupancy */}
      <Card>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-muted">
                Floor Plan & Dining Zones
              </div>
              <div className="text-base font-bold text-foreground">
                Dine-In Table Occupancy
              </div>
            </div>
            <Chip color="warning" size="sm" variant="soft">
              50% Occupied
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="relative overflow-hidden pt-1 pb-2">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-3xl">
                  8 / 16 Tables
                </span>
                <span className="text-xs font-medium text-muted">
                  (32 Guests Dining)
                </span>
              </div>

              {/* Occupancy Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Main Room & Patio</span>
                  <span className="font-semibold text-foreground">
                    8 Tables Available
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className="h-full rounded-full bg-warning"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>
                  Avg Seated Time:{" "}
                  <strong className="text-foreground">42 min</strong>
                </span>
                <span>·</span>
                <span>
                  Turnover Rate:{" "}
                  <strong className="text-foreground">2.4x / shift</strong>
                </span>
              </div>
            </div>

            {/* Faint watermark glyph in the background of card body */}
            <IconTable
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-3 text-foreground/5 dark:text-foreground/5"
              size={110}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Card 2: Customer Loyalty Club */}
      <Card>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-muted">
                Membership & Retention
              </div>
              <div className="text-base font-bold text-foreground">
                Loyalty Club Signups
              </div>
            </div>
            <Chip color="success" size="sm" variant="soft">
              +18.5% Growth
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="relative overflow-hidden pt-1 pb-2">
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-3xl">
                  28 New Members
                </span>
                <span className="text-xs font-medium text-muted">
                  (1,480 Total Enrolled)
                </span>
              </div>

              {/* Goal Progress bar */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Daily Goal: 30 Signups</span>
                  <span className="font-semibold text-foreground">
                    93% Achieved
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: "93%" }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>
                  Points Redeemed:{" "}
                  <strong className="text-foreground">1,240 pts</strong>
                </span>
                <span>·</span>
                <span>
                  Return Customer Rate:{" "}
                  <strong className="text-foreground">68%</strong>
                </span>
              </div>
            </div>

            {/* Faint watermark glyph in the background of card body */}
            <IconUsers
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-5 -right-3 text-foreground/5 dark:text-foreground/5"
              size={110}
            />
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

export default GradientKpiCards;
