"use client";

import {
  Avatar,
  Button,
  InputGroup,
  Modal,
  ScrollShadow,
  Tabs,
  TextField,
} from "@heroui/react";
import { IconBell, IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Notification, NotificationType } from "./notification-popover";
import { typeColorMap, typeIconMap } from "./notification-popover";

export interface NotificationCenterModalProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  trigger?: React.ReactNode;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

type CategoryFilter = "all" | "unread" | NotificationType;

const filterOptions: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "order", label: "Orders" },
  { id: "payment", label: "Payments" },
  { id: "alert", label: "Alerts" },
  { id: "user", label: "Staff" },
];

export function NotificationCenterModal({
  isOpen,
  onOpenChange,
  trigger,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationCenterModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");

  const hasUnread = useMemo(
    () => notifications.some((n) => !n.read),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeFilter === "unread" && item.read) return false;
      if (
        activeFilter !== "all" &&
        activeFilter !== "unread" &&
        item.type !== activeFilter
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [notifications, activeFilter, searchQuery]);

  const handleItemAction = (id: string) => {
    onMarkAsRead(id);
    const item = notifications.find((n) => n.id === id);
    if (item?.link) {
      onOpenChange?.(false);
      router.push(item.link);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger}
      <Modal.Backdrop
        isOpen={isOpen}
        variant="blur"
        onOpenChange={onOpenChange}
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog aria-labelledby="notification-center-title">
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex w-full items-center justify-between pe-8">
                <Modal.Heading id="notification-center-title">
                  Notification Center
                </Modal.Heading>

                <Button
                  isDisabled={!hasUnread}
                  size="sm"
                  variant="ghost"
                  onPress={onMarkAllAsRead}
                >
                  Mark all read
                </Button>
              </div>
            </Modal.Header>

            <Modal.Body className="flex flex-col">
              <div className="flex min-h-0 flex-1 flex-col gap-4">
                {/* Search Input */}
                <TextField
                  aria-label="Search notifications"
                  value={searchQuery}
                  onChange={setSearchQuery}
                >
                  <InputGroup fullWidth variant="secondary">
                    <InputGroup.Prefix>
                      <IconSearch
                        aria-hidden="true"
                        className="text-muted"
                        size={16}
                      />
                    </InputGroup.Prefix>
                    <InputGroup.Input placeholder="Search by order, staff, or keyword..." />
                  </InputGroup>
                </TextField>

                <Tabs
                  className="flex min-h-0 flex-1 flex-col"
                  selectedKey={activeFilter}
                  variant="secondary"
                  onSelectionChange={(key) =>
                    setActiveFilter(String(key) as CategoryFilter)
                  }
                >
                  <Tabs.ListContainer className="shrink-0">
                    <Tabs.List aria-label="Notification categories">
                      {filterOptions.map((option) => (
                        <Tabs.Tab key={option.id} id={option.id}>
                          {option.label}
                          <Tabs.Indicator />
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                  </Tabs.ListContainer>
                  <Tabs.Panel
                    className="min-h-0 flex-1"
                    id={activeFilter}
                  >
                    <ScrollShadow className="h-full min-h-0">
                      {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                          <IconBell
                            aria-hidden="true"
                            className="text-muted"
                            size={32}
                          />
                          <p className="text-sm font-medium text-foreground">
                            No notifications found
                          </p>
                          <p className="text-xs text-muted">
                            {searchQuery.trim()
                              ? "Try adjusting your search or filters"
                              : "You're all caught up with your notifications"}
                          </p>
                        </div>
                      ) : (
                        <ul className="flex flex-col gap-1">
                          {filteredNotifications.map((item) => {
                            const Icon = typeIconMap[item.type];

                            return (
                              <li key={item.id}>
                                <Button
                                  fullWidth
                                  className="h-auto justify-start"
                                  variant="ghost"
                                  onPress={() => handleItemAction(item.id)}
                                >
                                  <div className="flex w-full items-center gap-3 px-2.5 py-2 text-start whitespace-normal">
                                    <Avatar
                                      color={typeColorMap[item.type]}
                                      size="sm"
                                      variant="soft"
                                    >
                                      {item.avatarUrl ? (
                                        <Avatar.Image alt="" src={item.avatarUrl} />
                                      ) : null}
                                      <Avatar.Fallback>
                                        <Icon aria-hidden="true" size={16} />
                                      </Avatar.Fallback>
                                    </Avatar>

                                    <div className="flex min-w-0 flex-1 flex-col">
                                      <div className="flex items-start justify-between gap-2">
                                        <p
                                          className={`text-sm leading-tight text-foreground ${
                                            item.read
                                              ? "font-medium"
                                              : "font-semibold"
                                          }`}
                                        >
                                          {item.title}
                                        </p>
                                        <div className="flex shrink-0 items-center gap-2">
                                          <span className="text-[11px] text-muted">
                                            {item.time}
                                          </span>
                                          {!item.read && (
                                            <span className="size-2 rounded-full bg-accent" />
                                          )}
                                        </div>
                                      </div>
                                      <p className="mt-1 line-clamp-2 text-xs text-muted">
                                        {item.description}
                                      </p>
                                    </div>
                                  </div>
                                </Button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </ScrollShadow>
                  </Tabs.Panel>
                </Tabs>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex w-full items-center justify-between">
                <p className="text-xs text-muted">
                  {notifications.length} total notifications
                </p>
                <Button size="lg" slot="close" variant="primary">
                  Done
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default NotificationCenterModal;
