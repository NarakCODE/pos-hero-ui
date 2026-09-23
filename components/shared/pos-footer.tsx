"use client";

import { Button, ScrollShadow, toast } from "@heroui/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconBox,
  IconCashRegister,
  IconChefHat,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardList,
  IconClock,
  IconLayoutDashboard,
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
  const t = useTranslations("SalesMenu");
  const pathname = usePathname();
  const router = useRouter();

  // Quick action state
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  // Desktop horizontal scroll & drag-to-slide state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Convert vertical mousewheel scroll to horizontal scroll on desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY !== 0 && Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          const target = el.scrollLeft + event.deltaY;
          if (
            (event.deltaY > 0 && el.scrollLeft < maxScroll) ||
            (event.deltaY < 0 && el.scrollLeft > 0)
          ) {
            event.preventDefault();
            el.scrollLeft = Math.max(0, Math.min(maxScroll, target));
          }
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Monitor resize and scroll to toggle left/right scroll buttons
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons, { passive: true });

    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);
    if (el.firstElementChild) {
      observer.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      observer.disconnect();
    };
  }, [updateScrollButtons]);

  // Smoothly scroll active destination into view when route changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeEl = el.querySelector<HTMLElement>('[aria-current="page"]');
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [pathname]);

  // Mouse drag-to-slide handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = scrollRef.current?.scrollLeft ?? 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 4) {
      if (!isDraggingRef.current) {
        isDraggingRef.current = true;
        setIsDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore if capture fails
        }
      }
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    if (isDraggingRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setTimeout(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
      }, 50);
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const currentNav = navigationItems.find((item) =>
    pathname.startsWith(item.href),
  );
  const activeId = currentNav?.id;

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
      id: "dashboard",
      icon: IconLayoutDashboard,
      label: t("navigation.dashboard"),
      href: "/dashboard",
      onPress: () => handleNavigate("/dashboard"),
    },
    {
      id: "products",
      icon: IconBox,
      label: "Products",
      href: "/products",
      onPress: () => handleNavigate("/products"),
    },
    {
      id: "kitchen",
      icon: IconChefHat,
      label: t("navigation.kitchen"),
      href: "/kitchen",
      onPress: () => handleNavigate("/kitchen"),
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

          {canScrollLeft && (
            <Button
              aria-label="Scroll navigation left"
              className="hidden shrink-0 sm:inline-flex"
              isIconOnly
              onPress={() => scrollByAmount(-240)}
              size="md"
              variant="secondary"
            >
              <IconChevronLeft aria-hidden="true" size={18} />
            </Button>
          )}

          <ScrollShadow
            ref={scrollRef}
            className={`min-w-0 flex-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            hideScrollBar
            orientation="horizontal"
            size={24}
            onDragStart={(e) => e.preventDefault()}
            onPointerCancel={handlePointerUp}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClickCapture={handleClickCapture}
          >
            <nav
              aria-label={t("navigation.label")}
              className={`flex min-w-full w-max items-center justify-start gap-1 px-1 sm:gap-2 ${isDragging ? "pointer-events-none" : ""}`}
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
                const isActive = Boolean(
                  menuItem.href && pathname.startsWith(menuItem.href),
                );

                return (
                  <Button
                    key={menuItem.id}
                    size="lg"
                    variant={isActive ? "primary" : "ghost"}
                    onPress={menuItem.onPress}
                    aria-current={isActive ? "page" : undefined}
                    className="shrink-0"
                  >
                    <MenuIcon aria-hidden="true" size={20} />
                    <span>{menuItem.label}</span>
                  </Button>
                );
              })}
            </nav>
          </ScrollShadow>

          {canScrollRight && (
            <Button
              aria-label="Scroll navigation right"
              className="hidden shrink-0 sm:inline-flex"
              isIconOnly
              onPress={() => scrollByAmount(240)}
              size="md"
              variant="secondary"
            >
              <IconChevronRight aria-hidden="true" size={18} />
            </Button>
          )}

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
