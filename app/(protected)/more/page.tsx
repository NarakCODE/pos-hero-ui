"use client";

import { useTranslations } from "next-intl";
import { More2 } from "reicon-react";
import { POSContextPanel } from "@/components/shared/pos-context-panel";
import { POSLayout } from "@/components/shared/pos-layout";
import { POSPagePlaceholder } from "@/components/shared/pos-page-placeholder";

export default function MorePage() {
  const t = useTranslations("SalesMenu");

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("pages.more.title")}
      rightPanel={<POSContextPanel kind="more" />}
    >
      <POSPagePlaceholder
        title={t("pages.more.title")}
        eyebrow={t("pages.more.eyebrow")}
        emptyTitle={t("pages.more.emptyTitle")}
        emptyDescription={t("pages.more.emptyDescription")}
        icon={More2}
      />
    </POSLayout>
  );
}
