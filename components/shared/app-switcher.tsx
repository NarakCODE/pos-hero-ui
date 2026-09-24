"use client";

import { Avatar, Button, Label, ListBox, Popover } from "@heroui/react";
import {
  IconApps,
  IconBuildingStore,
  IconCash,
  IconChartBar,
  IconClipboardList,
  IconFileInvoice,
  IconPackage,
  IconPhone,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

type AppKey =
  | "pos"
  | "inventory"
  | "orders"
  | "analytics"
  | "customers"
  | "staff"
  | "invoicing"
  | "marketing"
  | "store";

interface AppItem {
  id: AppKey;
  href: string;
  icon: React.ComponentType<{
    "aria-hidden"?: "true" | "false";
    size?: number;
  }>;
}

const apps: AppItem[] = [
  { id: "pos", href: "/pos", icon: IconCash },
  { id: "inventory", href: "/inventory", icon: IconPackage },
  { id: "orders", href: "/orders", icon: IconClipboardList },
  { id: "analytics", href: "/analytics", icon: IconChartBar },
  { id: "customers", href: "/customers", icon: IconUsers },
  { id: "staff", href: "/staff", icon: IconUserStar },
  { id: "invoicing", href: "/invoicing", icon: IconFileInvoice },
  { id: "marketing", href: "/marketing", icon: IconPhone },
  { id: "store", href: "/store", icon: IconBuildingStore },
];

export interface AppLauncherProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "secondary" | "tertiary";
}

export function AppLauncher({
  className = "",
  size,
  variant = "outline",
}: AppLauncherProps = {}) {
  const router = useRouter();
  const t = useTranslations("AppLauncher");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label={t("triggerLabel")}
        className={className}
        isIconOnly
        size={size}
        variant={variant}
      >
        <IconApps aria-hidden="true" size={size === "sm" ? 18 : 20} />
      </Button>

      <Popover.Content
        className="w-[min(20rem,calc(100vw-1rem))]"
        placement="bottom end"
      >
        <Popover.Dialog className="flex max-h-[calc(100dvh-1rem)] w-full min-w-0 flex-col overflow-y-auto ">
          <div className="mb-3">
            <Popover.Heading>{t("title")}</Popover.Heading>
          </div>

          <ListBox
            aria-label={t("title")}
            className="w-full"
            selectionMode="none"
            onAction={(key) => {
              const selectedApp = apps.find((app) => app.id === String(key));

              if (!selectedApp) {
                return;
              }

              setIsOpen(false);
              router.push(selectedApp.href);
            }}
          >
            {apps.map((app) => {
              const Icon = app.icon;
              const label = t(`apps.${app.id}`);

              return (
                <ListBox.Item id={app.id} key={app.id} textValue={label}>
                  <Avatar size="sm">
                    <Avatar.Fallback>
                      <Icon aria-hidden="true" size={18} />
                    </Avatar.Fallback>
                  </Avatar>
                  <Label>{label}</Label>
                </ListBox.Item>
              );
            })}
          </ListBox>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

export const AppSwitcher = AppLauncher;
