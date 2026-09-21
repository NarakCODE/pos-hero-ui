import { getTranslations } from "next-intl/server";
import { CustomerPageClient } from "@/components/customer/customer-workspace";

export default async function CustomerPage() {
  const t = await getTranslations("SalesMenu");

  return (
    <CustomerPageClient
      headerTitle={t("pages.customer.title")}
      rightPanelLabel={t("pages.customer.profilePanelLabel")}
    />
  );
}
