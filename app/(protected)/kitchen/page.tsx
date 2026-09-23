import { getTranslations } from "next-intl/server";
import { KitchenWorkspace } from "@/components/kitchen/kitchen-workspace";

export default async function KitchenPage() {
  const t = await getTranslations("SalesMenu.pages.kitchen");

  return (
    <KitchenWorkspace
      asideLabel={t("ticketListLabel")}
      headerTitle={t("title")}
    />
  );
}
