import { getTranslations } from "next-intl/server";
import { ReservationWorkspace } from "@/components/reservation/reservation-workspace";

export default async function ReservationPage() {
  const t = await getTranslations("SalesMenu.pages.reservation");

  return (
    <ReservationWorkspace
      asideLabel={t("asideLabel")}
      headerTitle={t("title")}
    />
  );
}
