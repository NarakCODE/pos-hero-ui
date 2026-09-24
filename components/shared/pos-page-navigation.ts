import {
  IconCalendar,
  IconCashRegister,
  IconCategory,
  IconChefHat,
  IconClipboardList,
  IconFileInvoice,
  IconLayoutDashboard,
  IconPackage,
  IconPuzzle,
  IconSettings,
  IconTable,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react";

type POSPageLabelKey =
  | "sales"
  | "orders"
  | "table"
  | "reservation"
  | "customer"
  | "settings"
  | "dashboard"
  | "products"
  | "categories"
  | "addons"
  | "kitchen"
  | "invoicing";

interface POSPageNavigationItem {
  id: string;
  href: string;
  icon: TablerIcon;
  labelKey: POSPageLabelKey;
}

export const primaryPageNavigation = [
  { id: "sales", href: "/sales", icon: IconCashRegister, labelKey: "sales" },
  {
    id: "orders",
    href: "/orders",
    icon: IconClipboardList,
    labelKey: "orders",
  },
  { id: "table", href: "/table", icon: IconTable, labelKey: "table" },
  {
    id: "reservation",
    href: "/reservation",
    icon: IconCalendar,
    labelKey: "reservation",
  },
  { id: "customer", href: "/customer", icon: IconUsers, labelKey: "customer" },
  { id: "settings", href: "/settings", icon: IconSettings, labelKey: "settings" },
] as const satisfies readonly POSPageNavigationItem[];

export const morePageNavigation = [
  {
    id: "dashboard",
    href: "/dashboard",
    icon: IconLayoutDashboard,
    labelKey: "dashboard",
  },
  { id: "products", href: "/products", icon: IconPackage, labelKey: "products" },
  {
    id: "categories",
    href: "/categories",
    icon: IconCategory,
    labelKey: "categories",
  },
  { id: "addons", href: "/addons", icon: IconPuzzle, labelKey: "addons" },
  { id: "kitchen", href: "/kitchen", icon: IconChefHat, labelKey: "kitchen" },
  {
    id: "invoicing",
    href: "/invoicing",
    icon: IconFileInvoice,
    labelKey: "invoicing",
  },
] as const satisfies readonly POSPageNavigationItem[];

export type POSPage =
  | (typeof primaryPageNavigation)[number]
  | (typeof morePageNavigation)[number];
