import { useTranslations } from "next-intl";
import { TableWorkspace } from "@/components/tables/table-workspace";

export default function TablePage() {
  const t = useTranslations("SalesMenu");

  return (
    <TableWorkspace
      asideLabel={t("pages.table.asideAriaLabel")}
      headerTitle={t("pages.table.title")}
    />
  );
}
