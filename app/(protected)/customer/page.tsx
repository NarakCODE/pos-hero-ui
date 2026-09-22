import { getTranslations } from "next-intl/server";
import { CustomerPageClient } from "@/components/customer/customer-workspace";

export default async function CustomerPage() {
  const t = await getTranslations("Customer");

  return (
    <CustomerPageClient
      headerTitle={t("title")}
      rightPanelLabel={t("profilePanelLabel")}
    />
  );
}
