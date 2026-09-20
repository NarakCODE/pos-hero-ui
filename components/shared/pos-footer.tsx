"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import type { IconComponent } from "reicon-react";
import {
  Logout,
  More2,
  Note2,
  Profile,
  Receipt2,
  Settings,
  Shop,
} from "reicon-react";
import { authSessionStorageKey } from "@/config/auth";
import { SignOutAlertDialog } from "@/components/order-panel";

type NavigationId = "sales" | "orders" | "table" | "customer" | "settings" | "more";

interface NavigationItem {
  id: NavigationId;
  href: string;
  icon: IconComponent;
}

const navigationItems: NavigationItem[] = [
  { id: "sales", href: "/sales", icon: Receipt2 },
  { id: "orders", href: "/orders", icon: Note2 },
  { id: "table", href: "/table", icon: Shop },
  { id: "customer", href: "/customer", icon: Profile },
  { id: "settings", href: "/settings", icon: Settings },
  { id: "more", href: "/more", icon: More2 },
];

export function POSFooter({ className = "" }: { className?: string }) {
  const t = useTranslations("SalesMenu");
  const pathname = usePathname();
  const router = useRouter();

  const currentNav = navigationItems.find((item) => pathname.startsWith(item.href));
  const activeId: NavigationId = currentNav?.id ?? "sales";

  const labels: Record<NavigationId, string> = {
    sales: t("navigation.sales"),
    orders: t("navigation.orders"),
    table: t("navigation.table"),
    customer: t("navigation.customer"),
    settings: t("navigation.settings"),
    more: t("navigation.more"),
  };

  const handleNavigate = (targetHref: string) => {
    if (pathname !== targetHref) {
      router.push(targetHref);
    }
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem(authSessionStorageKey);
    router.replace("/login");
  };

  return (
    <footer
      aria-label="POS Navigation"
      className={`sticky bottom-0 z-30 shrink-0 border-t border-border bg-background px-3 py-2 shadow-xs transition-colors sm:px-4 sm:py-2.5 ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <SignOutAlertDialog
          body={t("signOutDialog.body")}
          cancelLabel={t("signOutDialog.cancel")}
          confirmLabel={t("signOutDialog.confirm")}
          header={t("signOutDialog.header")}
          onSignOut={handleSignOut}
          trigger={
            <Button
              type="button"
              variant="danger-soft"
              size="lg"
              aria-label={t("signOut")}
              className="shrink-0"
            >
              <Logout aria-hidden="true" size={15} />
              <span className="hidden text-xs sm:inline">{t("signOut")}</span>
            </Button>
          }
        />

        <nav
          className="flex min-w-0 flex-1 items-center justify-around gap-1 overflow-x-auto sm:justify-center sm:gap-2"
          aria-label={t("navigation.label")}
        >
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href) || activeId === item.id;
            const Icon = item.icon;

            return (
              <Button
                key={item.id}
                size="lg"
                variant={isActive ? "primary" : "ghost"}
                onPress={() => handleNavigate(item.href)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" size={20} />
                <span>{labels[item.id]}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
