"use client";

import { useTranslations } from "next-intl";
import { Settings } from "reicon-react";
import { POSLayout } from "@/components/shared/pos-layout";
import { POSPagePlaceholder } from "@/components/shared/pos-page-placeholder";

export default function SettingsPage() {
  const t = useTranslations("SalesMenu");

  return (
    <POSLayout showSearch={false} headerTitle={t("pages.settings.title")}>
      <POSPagePlaceholder
        title={t("pages.settings.title")}
        eyebrow={t("pages.settings.eyebrow")}
        emptyTitle={t("pages.settings.emptyTitle")}
        emptyDescription={t("pages.settings.emptyDescription")}
        icon={Settings}
      />
    </POSLayout>
  );
}
