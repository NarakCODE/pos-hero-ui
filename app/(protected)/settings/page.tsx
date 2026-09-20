import { getTranslations } from "next-intl/server";
import { SettingsWorkspace } from "@/components/settings/settings-workspace";
import { POSLayout } from "@/components/shared/pos-layout";

export default async function SettingsPage() {
  const t = await getTranslations("SalesMenu");

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("pages.settings.title")}
    >
      <SettingsWorkspace />
    </POSLayout>
  );
}
