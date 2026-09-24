"use client";

import { Avatar, Button, Label, ListBox, Modal } from "@heroui/react";
import { IconCheck, IconDots, type TablerIcon } from "@tabler/icons-react";
import { useState } from "react";

export interface POSMenuItem {
  id: string;
  href?: string;
  icon: TablerIcon;
  label: string;
  onPress: () => void;
}

interface POSMenuModalProps {
  actionItems: POSMenuItem[];
  activeItemId?: string;
  actionListLabel: string;
  pageItems: POSMenuItem[];
  pageListLabel: string;
  title: string;
}

export function POSMenuModal({
  actionItems,
  activeItemId,
  actionListLabel,
  pageItems,
  pageListLabel,
  title,
}: POSMenuModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allItems = [...pageItems, ...actionItems];

  const handleItemAction = (id: string) => {
    const item = allItems.find((menuItem) => menuItem.id === id);
    if (!item) return;

    setIsOpen(false);
    item.onPress();
  };

  return (
    <>
      <Button
        aria-haspopup="dialog"
        className="shrink-0"
        size="lg"
        variant="ghost"
        onPress={() => setIsOpen(true)}
      >
        <IconDots aria-hidden="true" size={20} />
        <span>{title}</span>
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={setIsOpen}
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog aria-labelledby="pos-menu-modal-heading">
            <div
              className="contents"
              onPointerCancel={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onPointerMove={(event) => event.stopPropagation()}
              onPointerUp={(event) => event.stopPropagation()}
            >
              <Modal.CloseTrigger />
              <Modal.Header className="shrink-0">
                <div className="pe-12">
                  <Modal.Heading id="pos-menu-modal-heading">
                    {title}
                  </Modal.Heading>
                </div>
              </Modal.Header>
              <Modal.Body className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                  <MenuList
                    activeItemId={activeItemId}
                    headingId="pos-menu-pages-heading"
                    items={pageItems}
                    label={pageListLabel}
                    onItemAction={handleItemAction}
                  />
                  <MenuList
                    activeItemId={activeItemId}
                    headingId="pos-menu-actions-heading"
                    items={actionItems}
                    label={actionListLabel}
                    onItemAction={handleItemAction}
                  />
                </div>
              </Modal.Body>
            </div>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

function MenuList({
  activeItemId,
  headingId,
  items,
  label,
  onItemAction,
}: {
  activeItemId?: string;
  headingId: string;
  items: POSMenuItem[];
  label: string;
  onItemAction: (id: string) => void;
}) {
  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-3">
      <h2
        className="text-sm font-semibold text-foreground"
        id={headingId}
      >
        {label}
      </h2>
      <div className="w-full rounded-xl border border-border/70 bg-surface-secondary/30 p-1">
        <ListBox
          aria-labelledby={headingId}
          className="w-full"
          selectionMode="none"
          onAction={(key) => onItemAction(String(key))}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeItemId === item.id;

            return (
              <ListBox.Item
                aria-current={isActive ? "page" : undefined}
                className="min-h-14"
                id={item.id}
                key={item.id}
                textValue={item.label}
              >
                <Avatar color="accent" size="sm" variant="default">
                  <Avatar.Fallback>
                    <Icon aria-hidden="true" size={19} />
                  </Avatar.Fallback>
                </Avatar>
                <Label className="min-w-0 flex-1 break-words whitespace-normal text-start">
                  {item.label}
                </Label>
                {isActive ? (
                  <IconCheck
                    aria-hidden="true"
                    className="ms-auto shrink-0 text-accent"
                    size={18}
                  />
                ) : null}
              </ListBox.Item>
            );
          })}
        </ListBox>
      </div>
    </section>
  );
}
