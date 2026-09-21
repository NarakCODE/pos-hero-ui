"use client";

import { Button, Spinner, Surface } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  IconBuildingStore,
  IconClipboardList,
  IconDots,
  IconSettings,
  IconUser,
  type TablerIcon,
} from "@tabler/icons-react";
import { POSAside } from "./pos-aside";

export type POSContextPanelKind =
  | "orders"
  | "table"
  | "customer"
  | "settings"
  | "more";

type ContextPanelIcon = TablerIcon;

interface POSContextPanelConfig {
  icon: ContextPanelIcon;
  href: string;
}

const panelConfig: Record<POSContextPanelKind, POSContextPanelConfig> = {
  orders: { href: "/sales", icon: IconClipboardList },
  table: { href: "/sales", icon: IconBuildingStore },
  customer: { href: "/customer", icon: IconUser },
  settings: { href: "/settings", icon: IconSettings },
  more: { href: "/more", icon: IconDots },
};

export function POSContextPanel({ kind }: { kind: POSContextPanelKind }) {
  const t = useTranslations("SalesMenu");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { href, icon: Icon } = panelConfig[kind];
  const translationKey = `rightPanel.${kind}` as const;

  const handleNavigate = () => {
    startTransition(() => router.push(href));
  };

  return (
    <POSAside
      ariaLabelledBy={`${kind}-context-panel-title`}
      headerClassName="p-[var(--pos-content-padding)]"
      mainClassName="flex flex-col gap-4 overflow-y-auto px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]"
      footerClassName="px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]"
      header={
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
      }
      footer={
        <Button
          fullWidth
          isPending={isPending}
          size="lg"
          type="button"
          variant="secondary"
          onPress={handleNavigate}
        >
          {({ isPending: buttonPending }) =>
            buttonPending ? (
              <>
                <Spinner color="current" size="sm" />
                {t(`${translationKey}.action`)}
              </>
            ) : (
              t(`${translationKey}.action`)
            )}
        </Button>
      }
    >
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

    </POSAside>
  );
}
