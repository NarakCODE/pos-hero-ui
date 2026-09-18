"use client";

import { useTranslations } from "next-intl";
import { Profile } from "reicon-react";
import { POSLayout } from "@/components/shared/pos-layout";
import { POSPagePlaceholder } from "@/components/shared/pos-page-placeholder";

export default function CustomerPage() {
  const t = useTranslations("SalesMenu");

  return (
    <POSLayout showSearch={false} headerTitle={t("pages.customer.title")}>
      <POSPagePlaceholder
        title={t("pages.customer.title")}
        eyebrow={t("pages.customer.eyebrow")}
        emptyTitle={t("pages.customer.emptyTitle")}
        emptyDescription={t("pages.customer.emptyDescription")}
        icon={Profile}
      />
    </POSLayout>
  );
}
