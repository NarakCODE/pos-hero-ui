"use client";

import { Button, ScrollShadow, toast } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconBox,
  IconCashRegister,
  IconChefHat,
  IconClipboardList,
  IconClock,
  IconLock,
  IconLogout,
  IconMotorbike,
  IconPrinter,
  IconReceipt,
  IconScale,
  IconSettings,
  IconTable,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react";
import { authSessionStorageKey } from "@/config/auth";
import { SignOutAlertDialog } from "@/components/order-panel";
import { CashInOutModal } from "@/components/more/cash-in-out-modal";
import { CloseShiftModal } from "@/components/more/close-shift-modal";
import { LockRegisterModal } from "@/components/more/lock-register-modal";

type NavigationId =
  | "sales"
  | "orders"
  | "table"
  | "customer"
  | "settings";

interface NavigationItem {
  id: NavigationId;
  href: string;
  icon: TablerIcon;
}

const navigationItems: NavigationItem[] = [
  { id: "sales", href: "/sales", icon: IconCashRegister },
  { id: "orders", href: "/orders", icon: IconClipboardList },
  { id: "table", href: "/table", icon: IconTable },
  { id: "customer", href: "/customer", icon: IconUsers },
  { id: "settings", href: "/settings", icon: IconSettings },
];

export function POSFooter({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("SalesMenu");
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Quick action state
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date());

    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentNav = navigationItems.find((item) =>
    pathname.startsWith(item.href),
  );
  const activeId = currentNav?.id;
  const timeLabel = currentTime
    ? new Intl.DateTimeFormat(locale === "km" ? "km-KH" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(currentTime)
    : "—";

  const labels: Record<NavigationId, string> = {
    sales: t("navigation.sales"),
    orders: t("navigation.orders"),
    table: t("navigation.table"),
    customer: t("navigation.customer"),
    settings: t("navigation.settings"),
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

  const handleOpenCashDrawer = () => {
    toast.success("Cash drawer kicked open", {
      description: "Manual drawer kick (No sale recorded).",
    });
  };

  const handleReprintReceipt = () => {
    toast.success("Reprinting last receipt", {
      description: "Order #ORD-1082 sent to 80mm thermal receipt printer.",
    });
  };

  const handleTestPrinter = () => {
    toast.info("Test slip printed", {
      description: "Receipt printer online and operating normally.",
    });
  };

  const handleKitchenQueue = () => {
    toast.info("Kitchen queue synced", {
      description: "4 active orders currently on the kitchen line.",
    });
  };

  const handleDeliveryStatus = () => {
    toast.info("Delivery aggregators active", {
      description: "Wownow & Foodpanda online · 5 pending orders.",
    });
  };

  const menuItems = [
    {
      id: "products",
      icon: IconBox,
      label: "Products",
      onPress: () => handleNavigate("/products"),
    },
    {
      id: "drawer-kick",
      icon: IconCashRegister,
      label: "Open Drawer",
      onPress: handleOpenCashDrawer,
    },
    {
      id: "reprint",
      icon: IconReceipt,
      label: "Reprint Receipt",
      onPress: handleReprintReceipt,
    },
    {
      id: "cash-in-out",
      icon: IconScale,
      label: "Cash In / Out",
      onPress: () => {
        setIsCashModalOpen(true);
      },
    },
    {
      id: "close-shift",
      icon: IconClock,
      label: "End Shift",
      onPress: () => {
        setIsCloseShiftOpen(true);
      },
    },
    {
      id: "lock",
      icon: IconLock,
      label: "Lock Register",
      onPress: () => {
        setIsLockModalOpen(true);
      },
    },
    {
      id: "test-printer",
      icon: IconPrinter,
      label: "Test Printer",
      onPress: handleTestPrinter,
    },
    {
      id: "kitchen-queue",
      icon: IconChefHat,
      label: "Kitchen Queue",
      onPress: handleKitchenQueue,
    },
    {
      id: "delivery-status",
      icon: IconMotorbike,
      label: "Delivery Status",
      onPress: handleDeliveryStatus,
    },
  ];

  return (
    <>
      <footer
        aria-label="POS Navigation"
        className={`sticky bottom-0 z-30 shrink-0 border-t border-border bg-card px-[var(--pos-content-padding)] py-2 shadow-xs transition-colors sm:py-2.5 ${className}`}
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
                <IconLogout aria-hidden="true" size={15} />
                <span className="hidden text-xs sm:inline">{t("signOut")}</span>
              </Button>
            }
          />

          <ScrollShadow
            className="min-w-0 flex-1"
            hideScrollBar
            orientation="horizontal"
            size={24}
          >
            <nav
              aria-label={t("navigation.label")}
              className="flex min-w-full w-max items-center justify-start gap-1 px-1 sm:gap-2"
            >
              {navigationItems.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) || activeId === item.id;
                const Icon = item.icon;

                return (
                  <Button
                    key={item.id}
                    size="lg"
                    variant={isActive ? "primary" : "ghost"}
                    onPress={() => handleNavigate(item.href)}
                    aria-current={isActive ? "page" : undefined}
                    className="shrink-0"
                  >
                    <Icon aria-hidden="true" size={20} />
                    <span>{labels[item.id]}</span>
                  </Button>
                );
              })}

              <span
                aria-hidden="true"
                className="mx-1 h-6 w-px shrink-0 bg-border/70"
              />

              {menuItems.map((menuItem) => {
                const MenuIcon = menuItem.icon;
                const isActive =
                  menuItem.id === "products" && pathname.startsWith("/products");

                return (
                  <Button
                    key={menuItem.id}
                    size="lg"
                    variant={isActive ? "primary" : "ghost"}
                    onPress={menuItem.onPress}
                    aria-current={isActive ? "page" : undefined}
                    className="shrink-0 transition-colors hover:bg-surface-hover"
                  >
                    <MenuIcon aria-hidden="true" size={20} />
                    <span>{menuItem.label}</span>
                  </Button>
                );
              })}
            </nav>
          </ScrollShadow>

          <div
            aria-label={t("ticketSummary.dateTime")}
            className="hidden shrink-0 items-center border-s border-border/70 ps-3 text-end text-xs lg:flex"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground">
                {t("cashier")} · {t("shiftOpen")}
              </span>
              <time className="text-muted">{timeLabel}</time>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals triggered from quick actions */}
      <CashInOutModal
        isOpen={isCashModalOpen}
        onOpenChange={setIsCashModalOpen}
      />
      <CloseShiftModal
        isOpen={isCloseShiftOpen}
        onOpenChange={setIsCloseShiftOpen}
      />
      <LockRegisterModal
        isOpen={isLockModalOpen}
        onOpenChange={setIsLockModalOpen}
      />
    </>
  );
}
