"use client";

import {
  Avatar,
  Badge,
  Button,
  Chip,
  Description,
  Label,
  ListBox,
  Popover,
  ScrollShadow,
  Separator,
} from "@heroui/react";
import {
  IconBell,
  IconPackage,
  IconCreditCard,
  IconAlertTriangle,
  IconUserPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NotificationCenterModal } from "./notification-center-modal";

export type NotificationType = "order" | "payment" | "alert" | "user";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatarUrl?: string;
  link?: string;
}

export const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New order received",
    description: "Order #15306 • Table 12 • $42.50",
    time: "2 min ago",
    read: false,
    link: "/orders",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment successful",
    description: "Wing Pay • Order #15302 • $28.00",
    time: "15 min ago",
    read: false,
    link: "/orders",
  },
  {
    id: "3",
    type: "alert",
    title: "Low stock warning",
    description: "Chicken Wings is running low (4 left)",
    time: "1 hour ago",
    read: true,
    link: "/products",
  },
  {
    id: "4",
    type: "user",
    title: "New staff joined",
    description: "Sokha has been added to the team",
    time: "3 hours ago",
    read: true,
    link: "/settings",
  },
  {
    id: "5",
    type: "order",
    title: "Order completed",
    description: "Order #15299 • Table 5 • $64.00",
    time: "4 hours ago",
    read: true,
    link: "/orders",
  },
  {
    id: "6",
    type: "alert",
    title: "Printer offline",
    description: "Kitchen printer #2 disconnected",
    time: "5 hours ago",
    read: true,
    link: "/settings",
  },
  {
    id: "7",
    type: "payment",
    title: "Refund processed",
    description: "Cash refund • Order #15291 • $14.50",
    time: "Yesterday",
    read: true,
    link: "/orders",
  },
  {
    id: "8",
    type: "user",
    title: "Shift started",
    description: "Dara clocked in for Afternoon shift",
    time: "Yesterday",
    read: true,
    link: "/settings",
  },
];

export const typeIconMap = {
  order: IconPackage,
  payment: IconCreditCard,
  alert: IconAlertTriangle,
  user: IconUserPlus,
};

export const typeColorMap: Record<
  NotificationType,
  "accent" | "success" | "warning" | "default"
> = {
  order: "accent",
  payment: "success",
  alert: "warning",
  user: "default",
};

export interface NotificationPopoverProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "secondary" | "tertiary";
}

export function NotificationPopover({
  className = "",
  size,
  variant = "outline",
}: NotificationPopoverProps = {}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasUnread = notifications.some((n) => !n.read);

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleItemAction = (id: string) => {
    markAsRead(id);
    const item = notifications.find((n) => n.id === id);
    if (item?.link) {
      setIsPopoverOpen(false);
      router.push(item.link);
    }
  };

  return (
    <>
      <Popover isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <Badge.Anchor>
          <Button
            aria-label="Notifications"
            className={className}
            isIconOnly
            size={size}
            variant={variant}
          >
            <IconBell aria-hidden="true" size={size === "sm" ? 18 : 20} />
          </Button>
          {hasUnread ? (
            <Badge
              color="danger"
              size="sm"
            />
          ) : null}
        </Badge.Anchor>

        <Popover.Content
          className="w-95 max-w-[95vw]"
          placement="bottom end"
        >
          <Popover.Dialog className="flex w-full flex-col text-start">
            {/* Header - No icons on header per requirement */}
            <div className="flex items-center justify-between px-4 py-3">
              <Popover.Heading>
                Notifications
              </Popover.Heading>

              <Button
                isDisabled={!hasUnread}
                size="sm"
                variant="ghost"
                onPress={markAllAsRead}
              >
                Mark all read
              </Button>
            </div>

            <Separator />

            {/* Filter tabs */}
            <div className="flex gap-1 px-3 py-2">
              <button
                className="rounded-full focus-visible:outline-none"
                type="button"
                onClick={() => setFilter("all")}
              >
                <Chip
                  className="cursor-pointer"
                  color={filter === "all" ? "accent" : "default"}
                  size="sm"
                  variant={filter === "all" ? "soft" : "tertiary"}
                >
                  All
                </Chip>
              </button>
              <button
                className="rounded-full focus-visible:outline-none"
                type="button"
                onClick={() => setFilter("unread")}
              >
                <Chip
                  className="cursor-pointer"
                  color={filter === "unread" ? "accent" : "default"}
                  size="sm"
                  variant={filter === "unread" ? "soft" : "tertiary"}
                >
                  Unread
                </Chip>
              </button>
            </div>

            <Separator />

            {/* Notification list */}
            <ScrollShadow className="max-h-90">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                  <IconBell
                    aria-hidden="true"
                    className="text-muted"
                    size={28}
                  />
                  <p className="text-sm text-muted">No notifications</p>
                </div>
              ) : (
                <ListBox
                  aria-label="Notifications"
                  className="w-full"
                  items={filtered}
                  selectionMode="none"
                  onAction={(key) => handleItemAction(String(key))}
                >
                  {(item) => {
                    const Icon = typeIconMap[item.type];

                    return (
                      <ListBox.Item
                        className="items-start"
                        id={item.id}
                        textValue={item.title}
                      >
                        <Avatar
                          className="mt-0.5 shrink-0"
                          color={typeColorMap[item.type]}
                          size="sm"
                          variant="soft"
                        >
                          {item.avatarUrl ? (
                            <Avatar.Image
                              alt={item.title}
                              src={item.avatarUrl}
                            />
                          ) : null}
                          <Avatar.Fallback>
                            <Icon aria-hidden="true" size={16} />
                          </Avatar.Fallback>
                        </Avatar>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <Label>
                              {item.title}
                            </Label>
                            {!item.read && (
                              <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
                            )}
                          </div>
                          <Description className="mt-0.5">
                            <span className="line-clamp-2">
                              {item.description}
                            </span>
                          </Description>
                          <span className="mt-1 text-[11px] text-muted">
                            {item.time}
                          </span>
                        </div>
                      </ListBox.Item>
                    );
                  }}
                </ListBox>
              )}
            </ScrollShadow>

            <Separator />

            {/* Footer */}
            <div className="p-2">
              <Button
                fullWidth
                size="sm"
                variant="ghost"
                onPress={() => {
                  setIsPopoverOpen(false);
                  setIsModalOpen(true);
                }}
              >
                View all notifications
              </Button>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>

      <NotificationCenterModal
        isOpen={isModalOpen}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onMarkAsRead={markAsRead}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
