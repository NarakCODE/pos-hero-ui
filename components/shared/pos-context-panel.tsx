"use client";

import { Button, Surface } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { IconComponent } from "reicon-react";
import {
  More2,
  Note2,
  Profile,
  Settings,
  Shop,
} from "reicon-react";

export type POSContextPanelKind =
  | "orders"
  | "table"
  | "customer"
  | "settings"
  | "more";

interface POSContextPanelConfig {
  icon: IconComponent;
  href: string;
}

const panelConfig: Record<POSContextPanelKind, POSContextPanelConfig> = {
  orders: { href: "/sales", icon: Note2 },
  table: { href: "/sales", icon: Shop },
  customer: { href: "/customer", icon: Profile },
  settings: { href: "/settings", icon: Settings },
  more: { href: "/more", icon: More2 },
};

export function POSContextPanel({ kind }: { kind: POSContextPanelKind }) {
  const t = useTranslations("SalesMenu");
  const router = useRouter();
  const { href, icon: Icon } = panelConfig[kind];
  const translationKey = `rightPanel.${kind}` as const;

  return (
    <section
      aria-labelledby={`${kind}-context-panel-title`}
      className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon aria-hidden="true" size={22} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {t(`${translationKey}.eyebrow`)}
          </p>
          <h2
            id={`${kind}-context-panel-title`}
            className="truncate text-lg font-semibold text-foreground"
          >
            {t(`${translationKey}.title`)}
          </h2>
        </div>
      </div>

      <Surface className="flex flex-col gap-2 p-4" variant="secondary">
        <p className="text-sm font-semibold text-foreground">
          {t(`${translationKey}.summaryTitle`)}
        </p>
        <p className="text-sm leading-6 text-muted">
          {t(`${translationKey}.summary`)}
        </p>
      </Surface>

      <div className="grid grid-cols-2 gap-3">
        <Surface className="flex min-h-24 flex-col justify-between gap-3 p-4">
          <span className="text-sm text-muted">
            {t(`${translationKey}.metricOneLabel`)}
          </span>
          <strong className="text-2xl font-semibold tracking-tight text-foreground">
            {t(`${translationKey}.metricOneValue`)}
          </strong>
        </Surface>
        <Surface className="flex min-h-24 flex-col justify-between gap-3 p-4">
          <span className="text-sm text-muted">
            {t(`${translationKey}.metricTwoLabel`)}
          </span>
          <strong className="text-2xl font-semibold tracking-tight text-foreground">
            {t(`${translationKey}.metricTwoValue`)}
          </strong>
        </Surface>
      </div>

      <Surface className="flex flex-col gap-3 p-4" variant="secondary">
        <p className="text-sm font-semibold text-foreground">
          {t(`${translationKey}.detailsTitle`)}
        </p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">
            {t(`${translationKey}.detailOneLabel`)}
          </span>
          <span className="font-medium text-foreground">
            {t(`${translationKey}.detailOneValue`)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">
            {t(`${translationKey}.detailTwoLabel`)}
          </span>
          <span className="font-medium text-foreground">
            {t(`${translationKey}.detailTwoValue`)}
          </span>
        </div>
      </Surface>

      <div className="mt-auto pt-2">
        <Button
          fullWidth
          size="lg"
          type="button"
          variant="secondary"
          onPress={() => router.push(href)}
        >
          {t(`${translationKey}.action`)}
        </Button>
      </div>
    </section>
  );
}
