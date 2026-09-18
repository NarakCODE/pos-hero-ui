"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Note2, Receipt2 } from "reicon-react";
import { POSLayout } from "@/components/shared/pos-layout";
import { POSPagePlaceholder } from "@/components/shared/pos-page-placeholder";

export default function OrdersPage() {
  const t = useTranslations("SalesMenu");
  const router = useRouter();

  return (
    <POSLayout showSearch={false} headerTitle={t("pages.orders.title")}>
      <POSPagePlaceholder
        title={t("pages.orders.title")}
        eyebrow={t("pages.orders.eyebrow")}
        emptyTitle={t("pages.orders.emptyTitle")}
        emptyDescription={t("pages.orders.emptyDescription")}
        icon={Note2}
        action={
          <Button
            type="button"
            variant="primary"
            size="md"
            onPress={() => router.push("/sales")}
            className="flex items-center gap-2 font-semibold"
          >
            <Receipt2 aria-hidden="true" size={18} />
            <span>{t("pages.orders.goToSales")}</span>
          </Button>
        }
      />
    </POSLayout>
  );
}
