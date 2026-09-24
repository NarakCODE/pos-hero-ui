"use client";

import { AlertDialog, Button } from "@heroui/react";
import { IconAlertTriangle, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export interface DeleteProductAlertDialogProps {
  productName: string;
  onDelete: () => void;
  trigger?: ReactNode;
  triggerClassName?: string;
  isIconOnly?: boolean;
}

export function DeleteProductAlertDialog({
  isIconOnly = false,
  onDelete,
  productName,
  trigger,
  triggerClassName = "",
}: DeleteProductAlertDialogProps) {
  const t = useTranslations("Product");

  const defaultTrigger = isIconOnly ? (
    <Button
      aria-label={t("deleteProduct")}
      className={triggerClassName}
      isIconOnly
      size="sm"
      type="button"
      variant="danger-soft"
    >
      <IconTrash aria-hidden="true" size={18} />
    </Button>
  ) : (
    <Button
      className={`w-full ${triggerClassName}`.trim()}
      type="button"
      variant="danger"
    >
      <IconTrash aria-hidden="true" size={18} />
      <span>{t("deleteProduct")}</span>
    </Button>
  );

  return (
    <AlertDialog>
      {trigger ?? defaultTrigger}
      <AlertDialog.Backdrop
        className="bg-linear-to-t from-red-950/90 via-red-950/50 to-transparent dark:from-red-950/95 dark:via-red-950/60"
        variant="blur"
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-105">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header className="items-center text-center">
              <AlertDialog.Icon status="danger">
                <IconAlertTriangle aria-hidden="true" />
              </AlertDialog.Icon>
              <AlertDialog.Heading>
                {productName
                  ? t("deleteProductHeading", { name: productName })
                  : t("deleteProductTitle")}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="text-center">
              <p>{t("deleteProductBody")}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse gap-2">
              <Button className="w-full" slot="close" variant="tertiary">
                {t("deleteProductCancel")}
              </Button>
              <Button
                className="w-full"
                slot="close"
                variant="danger"
                onPress={onDelete}
              >
                {t("deleteProductConfirm")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
