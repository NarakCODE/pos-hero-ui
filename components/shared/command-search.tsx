"use client";

import { Button } from "@heroui/react";
import { IconSearch } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Command } from "@/components/shared/command";
import {
  morePageNavigation,
  type POSPage,
  primaryPageNavigation,
} from "@/components/shared/pos-page-navigation";

export function CommandSearch() {
  const router = useRouter();
  const t = useTranslations("SalesMenu");
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleOpenChange = (nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen);
    if (!nextIsOpen) setSearchValue("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        (!event.metaKey && !event.ctrlKey) ||
        event.key.toLowerCase() !== "k" ||
        event.altKey ||
        event.shiftKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      if (isOpen) setSearchValue("");
      setIsOpen((currentlyOpen) => !currentlyOpen);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const renderPageItem = (item: POSPage) => {
    const Icon = item.icon;
    const label = t(`navigation.${item.labelKey}`);

    return (
      <Command.Item
        key={item.id}
        id={item.href}
        textValue={`${label} ${item.id} ${item.href}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <Icon aria-hidden="true" className="shrink-0 text-muted" size={18} />
          <span className="truncate">{label}</span>
        </span>
      </Command.Item>
    );
  };

  return (
    <>
      <Button
        aria-label={t("commandSearch.triggerLabel")}
        aria-keyshortcuts="Control+K Meta+K"
        className="h-9 gap-2 px-2 sm:px-3"
        onPress={() => setIsOpen(true)}
        size="md"
        variant="ghost"
      >
        <IconSearch aria-hidden="true" size={18} />
        <span className="hidden text-xs lg:inline">
          {t("commandSearch.triggerLabel")}
        </span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] text-muted xl:inline-flex">
          {t("commandSearch.shortcut")}
        </kbd>
      </Button>

      <Command>
        <Command.Backdrop
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          variant="blur"
        >
          <Command.Container size="md">
            <Command.Dialog
              aria-label={t("commandSearch.dialogLabel")}
              inputValue={searchValue}
              onInputChange={setSearchValue}
            >
              <Command.Header>
                <h2 className="text-sm font-semibold text-foreground">
                  {t("commandSearch.heading")}
                </h2>
              </Command.Header>

              <Command.InputGroup>
                <Command.InputGroup.Prefix />
                <Command.InputGroup.Input
                  aria-label={t("commandSearch.inputLabel")}
                  placeholder={t("commandSearch.placeholder")}
                />
                <Command.InputGroup.ClearButton />
                <Command.InputGroup.Suffix>
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted">
                    Esc
                  </kbd>
                </Command.InputGroup.Suffix>
              </Command.InputGroup>

              <Command.List
                aria-label={t("commandSearch.resultsLabel")}
                onAction={(key) => router.push(String(key))}
                renderEmptyState={() => t("commandSearch.emptyState")}
              >
                <Command.Group heading={t("navigation.label")}>
                  {primaryPageNavigation.map(renderPageItem)}
                </Command.Group>
                <Command.Separator />
                <Command.Group heading={t("navigation.pages")}>
                  {morePageNavigation.map(renderPageItem)}
                </Command.Group>
              </Command.List>

              <Command.Footer>
                {t("commandSearch.keyboardHint")}
              </Command.Footer>
            </Command.Dialog>
          </Command.Container>
        </Command.Backdrop>
      </Command>
    </>
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.isContentEditable ||
    Boolean(target.closest("input, textarea, select, [role='textbox']"))
  );
}
