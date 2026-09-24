import { getTranslations } from "next-intl/server";
import { KitchenWorkspace } from "@/components/kitchen/kitchen-workspace";
import { kitchenTickets } from "@/components/kitchen/kitchen-data";

export default async function KitchenPage() {
  const t = await getTranslations("SalesMenu.pages.kitchen");

  return (
    <KitchenWorkspace
      asideLabel={t("ticketListLabel")}
      headerTitle={t("title")}
      tickets={kitchenTickets}
    />
  );
}

