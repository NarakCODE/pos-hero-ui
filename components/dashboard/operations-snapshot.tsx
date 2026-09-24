"use client";

import { Card, Chip } from "@heroui/react";
import { useTranslations } from "next-intl";

export function OperationsSnapshot() {
  const t = useTranslations("Dashboard.operations");

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0">
              <Card.Description>{t("floorPlan")}</Card.Description>
              <Card.Title>{t("tableOccupancy")}</Card.Title>
            </div>
            <Chip color="warning" size="sm" variant="soft">
              {t("occupancyRate", { rate: 50 })}
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="flex flex-col gap-3">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
              {t("occupiedTables", { occupied: 8, total: 16 })}
            </p>
            <div
              aria-label={t("occupancyRate", { rate: 50 })}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={50}
              className="h-2 overflow-hidden rounded-full bg-surface-secondary"
              role="progressbar"
            >
              <span
                className="block h-full rounded-full bg-warning"
                style={{ width: "50%" }}
              />
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span>{t("guestsSeated", { count: 32 })}</span>
              <span>{t("availableTables", { count: 8 })}</span>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <div className="flex w-full items-start justify-between gap-3">
            <div className="min-w-0">
              <Card.Description>{t("membership")}</Card.Description>
              <Card.Title>{t("loyaltySignups")}</Card.Title>
            </div>
            <Chip color="success" size="sm" variant="soft">
              +18.5%
            </Chip>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {t("newMembers", { count: 28 })}
              </p>
              <span className="text-xs text-muted">
                {t("totalMembers", { count: "1,480" })}
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted">{t("dailyGoal", { count: 30 })}</span>
                <span className="font-semibold text-foreground">
                  {t("goalProgress", { rate: 93 })}
                </span>
              </div>
              <div
                aria-label={t("goalProgress", { rate: 93 })}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={93}
                className="h-2 overflow-hidden rounded-full bg-surface-secondary"
                role="progressbar"
              >
                <span
                  className="block h-full rounded-full bg-success"
                  style={{ width: "93%" }}
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span>{t("pointsRedeemed", { count: "1,240" })}</span>
              <span>{t("returnRate", { rate: 68 })}</span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
