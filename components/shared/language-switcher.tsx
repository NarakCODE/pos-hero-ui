"use client";

import type { Key } from "@heroui/react";

import {  Label, ListBox, Select } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Globe } from "reicon-react";
import { isLocale, type Locale, locales } from "@/config/i18n";

const languageOptions: Array<{
  id: Locale;
  label: string;
}> = [
  { id: "en", label: "English", },
  { id: "km", label: "ខ្មែរ", },
];

export function LanguageSwitcher({
  className = "w-36",
}: {
  className?: string;
} = {}) {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    isLocale(currentLocale) ? currentLocale : locales[0],
  );

  const handleLocaleChange = (value: Key | null) => {
    if (typeof value !== "string" || !isLocale(value)) {
      return;
    }

    setSelectedLocale(value);
    document.cookie = `locale=${value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  };

  return (
    <Select
      aria-label={t("label")}
      className={className}
      value={selectedLocale}
      onChange={handleLocaleChange}
    >
      <Label className="sr-only">{t("label")}</Label>
      <Select.Trigger className="flex items-center gap-2">
        <Globe aria-hidden="true" className="size-4 shrink-0 text-muted" />
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom end">
        <ListBox>
          {languageOptions.map((language) => (
            <ListBox.Item
              key={language.id}
              id={language.id}
              textValue={language.label}
            >
              <Label>{language.label}</Label>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
