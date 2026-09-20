import { getTranslations } from "next-intl/server";
import { CustomerWorkspace } from "@/components/customer/customer-workspace";
import { POSLayout } from "@/components/shared/pos-layout";

export default async function CustomerPage() {
  const t = await getTranslations("SalesMenu");

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("pages.customer.title")}
    >
      <CustomerWorkspace />
    </POSLayout>
  );
}
