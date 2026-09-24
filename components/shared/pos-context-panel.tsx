"use client";

import { Button, Spinner, Surface } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  IconBox,
  IconBuildingStore,
  IconClipboardList,
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
  | "products";

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
  products: { href: "/sales", icon: IconBox },
};

export function POSContextPanel({
  kind,
  onAction,
}: {
  kind: POSContextPanelKind;
  onAction?: () => void;
}) {
  const t = useTranslations("SalesMenu");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { href, icon: Icon } = panelConfig[kind];
  const translationKey = `rightPanel.${kind}` as const;

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
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
          onPress={handleAction}
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
      <Surface variant="secondary">
        <div className="flex flex-col gap-2 p-4">
          <p className="text-sm font-semibold text-foreground">
            {t(`${translationKey}.summaryTitle`)}
          </p>
          <p className="text-sm leading-6 text-muted">
            {t(`${translationKey}.summary`)}
          </p>
        </div>
      </Surface>

      <div className="grid grid-cols-2 gap-3">
        <Surface>
          <div className="flex min-h-24 flex-col justify-between gap-3 p-4">
            <span className="text-sm text-muted">
              {t(`${translationKey}.metricOneLabel`)}
            </span>
            <strong className="text-2xl font-semibold tracking-tight text-foreground">
              {t(`${translationKey}.metricOneValue`)}
            </strong>
          </div>
        </Surface>
        <Surface>
          <div className="flex min-h-24 flex-col justify-between gap-3 p-4">
            <span className="text-sm text-muted">
              {t(`${translationKey}.metricTwoLabel`)}
            </span>
            <strong className="text-2xl font-semibold tracking-tight text-foreground">
              {t(`${translationKey}.metricTwoValue`)}
            </strong>
          </div>
        </Surface>
      </div>

      <Surface variant="secondary">
        <div className="flex flex-col gap-3 p-4">
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
        </div>
      </Surface>

    </POSAside>
  );
}
