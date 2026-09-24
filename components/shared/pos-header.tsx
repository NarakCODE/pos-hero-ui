"use client";

import { InputGroup, TextField } from "@heroui/react";
import { useTranslations } from "next-intl";
import { IconSearch } from "@tabler/icons-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { NotificationPopover } from "@/components/shared/notification-popover";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { AppSwitcher } from "@/components/shared/app-switcher";
import { CommandSearch } from "@/components/shared/command-search";

interface POSHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showAppSwitcher?: boolean;
  title?: string;
  className?: string;
}

export function POSHeader({
  className = "",
  onSearchChange,
  searchPlaceholder,
  searchQuery,
  showAppSwitcher = true,
  showNotifications = true,
  showSearch = true,
  title,
}: POSHeaderProps) {
  const t = useTranslations("SalesMenu");

  return (
    <header
      aria-label="POS Header"
      className={`shrink-0 border-b border-border bg-background px-(--pos-content-padding) py-2.5 shadow-xs transition-colors sm:py-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:flex-nowrap sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <Logo name={t("brandName")} size="sm" />
          {title ? (
            <span className="hidden text-sm font-semibold text-foreground md:inline border-s border-border ps-3">
              {title}
            </span>
          ) : null}
        </div>

        {/* Search Field (Centered in Left Main Header) */}
        {showSearch && onSearchChange ? (
          <div className="order-last flex w-full min-w-0 max-w-md flex-1 sm:order-none sm:w-auto">
            <TextField
              aria-label={t("searchLabel")}
              fullWidth
              value={searchQuery ?? ""}
              onChange={onSearchChange}
            >
              <InputGroup fullWidth variant="secondary" className="h-9">
                <InputGroup.Prefix>
                  <IconSearch
                    aria-hidden="true"
                    size={16}
                    className="text-muted"
                  />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder={searchPlaceholder ?? t("searchPlaceholder")}
                />
              </InputGroup>
            </TextField>
          </div>
        ) : (
          <div className="hidden flex-1 sm:block" />
        )}

        {/* Right: Actions & Switchers */}
        <div className="flex items-center gap-1.5 shrink-0 sm:gap-2">
          <CommandSearch />
          <div className="hidden sm:block">
            <LanguageSwitcher className="w-28" />
          </div>
          {showAppSwitcher ? <AppSwitcher /> : null}
          {showNotifications ? <NotificationPopover /> : null}

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
