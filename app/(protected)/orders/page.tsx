"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { OrdersAside } from "@/components/orders/orders-aside";
import { orderRecords } from "@/components/orders/orders-data";
import { OrdersDataGrid } from "@/components/orders/orders-data-grid";
import { POSLayout } from "@/components/shared/pos-layout";

export default function OrdersPage() {
  const t = useTranslations("SalesMenu");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orderRecords[0]?.id ?? null,
  );

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("pages.orders.title")}
      rightPanel={
        <OrdersAside
          selectedOrderId={selectedOrderId}
        />
      }
    >
      <OrdersDataGrid
        onOrderSelect={setSelectedOrderId}
        selectedOrderId={selectedOrderId}
      />
    </POSLayout>
  );
}
