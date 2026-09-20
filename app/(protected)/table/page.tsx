import { useTranslations } from "next-intl";
import { POSLayout } from "@/components/shared/pos-layout";
import { TableAside } from "@/components/tables/table-aside";
import { TableFloor } from "@/components/tables/table-floor";

export default function TablePage() {
  const t = useTranslations("SalesMenu");

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("pages.table.title")}
      rightPanelLabel={t("pages.table.asideAriaLabel")}
      rightPanelClassName="overflow-hidden"
      rightPanel={<TableAside />}
    >
      <TableFloor />
    </POSLayout>
  );
}
