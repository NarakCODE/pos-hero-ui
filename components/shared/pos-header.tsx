"use client";

import { Button, InputGroup, TextField } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Logout, Search } from "reicon-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { authSessionStorageKey } from "@/config/auth";

interface POSHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  title?: string;
  className?: string;
}

export function POSHeader({
  className = "",
  onSearchChange,
  searchPlaceholder,
  searchQuery,
  showSearch = true,
  title,
}: POSHeaderProps) {
  const t = useTranslations("SalesMenu");
  const router = useRouter();

  const handleSignOut = () => {
    window.sessionStorage.removeItem(authSessionStorageKey);
    router.replace("/login");
  };

  return (
    <header
      aria-label="POS Header"
      className={`shrink-0 border-b border-border bg-background px-3.5 py-2.5 shadow-xs transition-colors sm:px-4 sm:py-3 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <Logo name={t("brandName")} size="sm" />
          {title ? (
            <span className="hidden text-sm font-semibold text-foreground md:inline border-s border-border ps-3">
              {title}
            </span>
          ) : null}
        </div>

        {/* Search Field (Centered in Left Main Header) */}
        {showSearch && onSearchChange ? (
          <div className="flex flex-1 max-w-md min-w-0">
            <TextField
              aria-label={t("searchLabel")}
              fullWidth
              value={searchQuery ?? ""}
              onChange={onSearchChange}
            >
              <InputGroup fullWidth variant="secondary" className="h-9">
                <InputGroup.Prefix>
                  <Search aria-hidden="true" size={16} className="text-muted" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  placeholder={searchPlaceholder ?? t("searchPlaceholder")}
                  className="text-xs sm:text-sm"
                />
              </InputGroup>
            </TextField>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        {/* Right: Switchers, Sign Out */}
        <div className="flex items-center gap-1.5 shrink-0 sm:gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher className="w-28" />
          </div>
          <ThemeSwitcher />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onPress={handleSignOut}
            aria-label={t("signOut")}
            className="flex items-center gap-1.5 text-muted hover:border-danger/30 hover:bg-danger/10 hover:text-danger focus-visible:text-danger"
          >
            <Logout aria-hidden="true" size={15} />
            <span className="hidden xl:inline text-xs">{t("signOut")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
