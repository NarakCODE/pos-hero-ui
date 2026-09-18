"use client";

import { useTranslations } from "next-intl";
import { Shop } from "reicon-react";
import { POSLayout } from "@/components/shared/pos-layout";
import { POSPagePlaceholder } from "@/components/shared/pos-page-placeholder";

export default function TablePage() {
  const t = useTranslations("SalesMenu");

  return (
    <POSLayout showSearch={false} headerTitle={t("pages.table.title")}>
      <POSPagePlaceholder
        title={t("pages.table.title")}
        eyebrow={t("pages.table.eyebrow")}
        emptyTitle={t("pages.table.emptyTitle")}
        emptyDescription={t("pages.table.emptyDescription")}
        icon={Shop}
      />
    </POSLayout>
  );
}
