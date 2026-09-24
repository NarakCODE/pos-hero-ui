"use client";

import { Button, Card, Chip, InputGroup, ScrollShadow } from "@heroui/react";
import { IconCheck, IconClock, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";

import type {
  DishStatus,
  KitchenTicket,
} from "./kitchen-data";
import { kitchenTickets as defaultTickets } from "./kitchen-data";

type TicketListOrientation = "horizontal" | "vertical";
type KitchenFilter = "all" | "active" | "rush" | "completed";

interface KitchenWorkspaceProps {
  asideLabel: string;
  headerTitle: string;
  tickets?: KitchenTicket[];
}

interface KitchenTicketListProps {
  onSelect: (ticketId: string) => void;
  orientation: TicketListOrientation;
  selectedTicketId: string;
  tickets: KitchenTicket[];
}

interface KitchenAsideProps extends Omit<
  KitchenTicketListProps,
  "orientation"
> {
  elapsedTick: number;
  selectedTicket: KitchenTicket;
}

function formatElapsedTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return hours > 0
    ? `${hours}:${formattedMinutes}:${formattedSeconds}`
    : `${minutes}:${formattedSeconds}`;
}

function KitchenTicketList({
  onSelect,
  orientation,
  selectedTicketId,
  tickets,
}: KitchenTicketListProps) {
  const isHorizontal = orientation === "horizontal";
  const t = useTranslations("SalesMenu.pages.kitchen");

  return (
    <div
      className={
        isHorizontal ? "flex w-max gap-2" : "flex w-full flex-col gap-2"
      }
    >
      {tickets.map((ticket) => {
        const isSelected = ticket.id === selectedTicketId;
        const isCompleted =
          ticket.dishes.length > 0 &&
          ticket.dishes.every((dish) => dish.status === "completed");
        const completedCount = ticket.dishes.filter(
          (d) => d.status === "completed",
        ).length;

        return (
          <div
            className={isHorizontal ? "w-64 shrink-0" : "w-full"}
            data-ticket-nav-id={ticket.id}
            key={ticket.id}
          >
            <Button
              aria-pressed={isSelected}
              className="h-auto px-3 py-2.5"
              fullWidth
              onPress={() => onSelect(ticket.id)}
              size="lg"
              type="button"
              variant={isSelected ? "primary" : "secondary"}
            >
              <div className="flex w-full flex-col gap-1 text-start">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {ticket.tableNumber}
                  </span>
                  <span className="shrink-0 font-mono text-xs opacity-75">
                    {ticket.orderCode}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 text-xs opacity-80">
                  <span className="flex items-center gap-1.5">
                    {ticket.priority === "rush" && (
                      <span className="rounded bg-danger/20 px-1 py-0.5 text-[10px] font-bold text-danger">
                        RUSH
                      </span>
                    )}
                    <span>
                      {t("readyCount", {
                        completed: completedCount,
                        total: ticket.dishes.length,
                      })}
                    </span>
                  </span>
                  {isCompleted && (
                    <IconCheck
                      aria-hidden="true"
                      className="text-success"
                      size={15}
                    />
                  )}
                </div>
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function KitchenTicketAside({
  elapsedTick,
  onSelect,
  selectedTicket,
  selectedTicketId,
  tickets,
}: KitchenAsideProps) {
  const t = useTranslations("SalesMenu.pages.kitchen");

  const serviceBadgeLabel =
    selectedTicket.serviceType === "takeaway"
      ? "Takeaway"
      : selectedTicket.serviceType === "delivery"
        ? (selectedTicket.channel ?? "Delivery")
        : t("serviceTypeDineIn");

  return (
    <POSAside
      ariaLabelledBy="kitchen-aside-title"
      headerClassName="border-b border-border p-4"
      mainClassName="flex min-h-0 flex-col p-4"
      header={
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <h2
              className="min-w-0 truncate text-base font-semibold text-foreground"
              id="kitchen-aside-title"
            >
              {selectedTicket.tableNumber}
            </h2>
            <div className="flex items-center gap-1.5 shrink-0">
              {selectedTicket.priority === "rush" && (
                <Chip color="danger" size="sm" variant="soft">
                  Rush
                </Chip>
              )}
              <Chip color="accent" size="sm" variant="soft">
                {serviceBadgeLabel}
              </Chip>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-mono text-foreground/80">
              {selectedTicket.orderCode}
            </span>
            <div className="flex items-center gap-1.5">
              <IconClock aria-hidden="true" size={14} />
              <time className="font-mono font-medium text-foreground">
                {formatElapsedTime(selectedTicket.elapsedSeconds + elapsedTick)}
              </time>
            </div>
          </div>
          {selectedTicket.notes && (
            <p className="rounded-md bg-surface-secondary px-2.5 py-1.5 text-xs text-muted">
              <span className="font-medium text-foreground">
                {t("notesLabel")}{" "}
              </span>
              {selectedTicket.notes}
            </p>
          )}
        </div>
      }
    >
      <section
        aria-labelledby="kitchen-ticket-list-title"
        className="flex min-h-0 flex-1 flex-col gap-3"
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <h3
            className="text-sm font-medium text-foreground"
            id="kitchen-ticket-list-title"
          >
            {t("ticketListLabel")}
          </h3>
          <Chip size="sm" variant="secondary">
            {tickets.length}
          </Chip>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <KitchenTicketList
            onSelect={onSelect}
            orientation="vertical"
            selectedTicketId={selectedTicketId}
            tickets={tickets}
          />
        </div>
      </section>
    </POSAside>
  );
}

export function KitchenWorkspace({
  asideLabel,
  headerTitle,
  tickets: initialTicketsProp,
}: KitchenWorkspaceProps) {
  const t = useTranslations("SalesMenu.pages.kitchen");
  const [tickets, setTickets] = useState(initialTicketsProp ?? defaultTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(
    (initialTicketsProp ?? defaultTickets)[0]?.id ?? "",
  );
  const [elapsedTick, setElapsedTick] = useState(0);
  const [filter, setFilter] = useState<KitchenFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isClickScrollingRef = useRef(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedTick((tick) => tick + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const counts = useMemo(() => {
    let active = 0;
    let rush = 0;
    let completed = 0;

    for (const ticket of tickets) {
      const isDone =
        ticket.dishes.length > 0 &&
        ticket.dishes.every((d) => d.status === "completed");
      if (isDone) {
        completed++;
      } else {
        active++;
        if (ticket.priority === "rush") rush++;
      }
    }

    return { all: tickets.length, active, rush, completed };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const isCompleted =
        ticket.dishes.length > 0 &&
        ticket.dishes.every((d) => d.status === "completed");

      if (filter === "active" && isCompleted) return false;
      if (filter === "rush" && ticket.priority !== "rush") return false;
      if (filter === "completed" && !isCompleted) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTable = ticket.tableNumber.toLowerCase().includes(q);
        const matchOrder = ticket.orderCode.toLowerCase().includes(q);
        const matchServer = ticket.serverName?.toLowerCase().includes(q);
        const matchDish = ticket.dishes.some((d) =>
          d.title.toLowerCase().includes(q),
        );
        if (!matchTable && !matchOrder && !matchServer && !matchDish) {
          return false;
        }
      }

      return true;
    });
  }, [tickets, filter, searchQuery]);

  const selectedTicket =
    filteredTickets.find((ticket) => ticket.id === selectedTicketId) ??
    tickets.find((ticket) => ticket.id === selectedTicketId) ??
    tickets[0];

  const updateDishStatus = (
    ticketId: string,
    dishId: string,
    status: DishStatus,
  ) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              dishes: ticket.dishes.map((dish) =>
                dish.id === dishId ? { ...dish, status } : dish,
              ),
            }
          : ticket,
      ),
    );
  };

  const toggleCompleteAll = (ticketId: string) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        const allCompleted = ticket.dishes.every(
          (d) => d.status === "completed",
        );
        const nextStatus: DishStatus = allCompleted ? "pending" : "completed";
        return {
          ...ticket,
          dishes: ticket.dishes.map((dish) => ({
            ...dish,
            status: nextStatus,
          })),
        };
      }),
    );
  };

  const scrollToTicket = useCallback((ticketId: string) => {
    setSelectedTicketId(ticketId);
    isClickScrollingRef.current = true;

    const targetEl = document.getElementById(`ticket-${ticketId}`);
    if (targetEl && scrollContainerRef.current) {
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 600);
  }, []);

  // Scroll spy: track the active ticket section based on scroll position
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const ticketEls =
        container.querySelectorAll<HTMLElement>("[data-ticket-id]");
      if (!ticketEls.length) return;

      const containerRect = container.getBoundingClientRect();
      const targetY = containerRect.top + 120;

      let activeId = "";
      let closestDistance = Infinity;

      for (let i = 0; i < ticketEls.length; i++) {
        const el = ticketEls[i];
        const rect = el.getBoundingClientRect();

        if (rect.top <= targetY && rect.bottom > containerRect.top + 60) {
          activeId = el.getAttribute("data-ticket-id") ?? "";
          break;
        }

        const dist = Math.abs(rect.top - targetY);
        if (dist < closestDistance) {
          closestDistance = dist;
          activeId = el.getAttribute("data-ticket-id") ?? "";
        }
      }

      if (activeId && activeId !== selectedTicketId) {
        setSelectedTicketId(activeId);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedTicketId]);

  // Keep active ticket button in view inside sidebar / horizontal rail
  useEffect(() => {
    const navItems = document.querySelectorAll<HTMLElement>(
      `[data-ticket-nav-id="${selectedTicketId}"]`,
    );
    navItems.forEach((item) => {
      item.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });
  }, [selectedTicketId]);

  return (
    <POSLayout
      rightPanel={
        <KitchenTicketAside
          elapsedTick={elapsedTick}
          onSelect={scrollToTicket}
          selectedTicket={selectedTicket}
          selectedTicketId={selectedTicketId}
          tickets={filteredTickets}
        />
      }
      rightPanelClassName="overflow-hidden"
      rightPanelLabel={asideLabel}
      rightPanelWidth="24rem"
      showSearch={false}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Kitchen Filter Toolbar */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-border/60 bg-background/95 p-3.5 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-bold text-foreground sm:text-lg">
              {headerTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                size="sm"
                variant={filter === "all" ? "primary" : "secondary"}
                onPress={() => setFilter("all")}
              >
                {t("filterAll")} ({counts.all})
              </Button>
              <Button
                size="sm"
                variant={filter === "active" ? "primary" : "secondary"}
                onPress={() => setFilter("active")}
              >
                {t("filterActive")} ({counts.active})
              </Button>
              <Button
                size="sm"
                variant={filter === "rush" ? "primary" : "secondary"}
                onPress={() => setFilter("rush")}
              >
                {t("filterRush")} ({counts.rush})
              </Button>
              <Button
                size="sm"
                variant={filter === "completed" ? "primary" : "secondary"}
                onPress={() => setFilter("completed")}
              >
                {t("filterCompleted")} ({counts.completed})
              </Button>
            </div>
          </div>

          <div className="w-full sm:w-56">
            <InputGroup className="h-8" variant="secondary">
              <InputGroup.Prefix>
                <IconSearch
                  aria-hidden="true"
                  className="text-muted"
                  size={15}
                />
              </InputGroup.Prefix>
              <InputGroup.Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Mobile ticket rail */}
        <div className="shrink-0 border-b border-border p-3 lg:hidden">
          <div className="overflow-x-auto pb-1">
            <KitchenTicketList
              onSelect={scrollToTicket}
              orientation="horizontal"
              selectedTicketId={selectedTicketId}
              tickets={filteredTickets}
            />
          </div>
        </div>

        {/* Continuous Card Listing */}
        <section
          aria-label={t("ticketItemsLabel")}
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <ScrollShadow
            ref={scrollContainerRef}
            className="min-h-0 min-w-0 flex-1 overscroll-contain"
          >
            <div className="flex flex-col gap-4 p-4 sm:p-5 2xl:p-6">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                  <IconCheck
                    aria-hidden="true"
                    className="text-success"
                    size={36}
                  />
                  <p className="text-base font-semibold text-foreground">
                    {t("noTicketsFound")}
                  </p>
                  <p className="text-sm text-muted">
                    {t("noTicketsMatchingFilter")}
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const completedCount = ticket.dishes.filter(
                    (d) => d.status === "completed",
                  ).length;
                  const isAllCompleted =
                    ticket.dishes.length > 0 &&
                    completedCount === ticket.dishes.length;
                  const isOverdue =
                    ticket.elapsedSeconds + elapsedTick > 20 * 60;

                  return (
                    <Card
                      className={`overflow-hidden rounded scroll-mt-4 transition-all duration-200 ${
                        isAllCompleted
                          ? "border-success/30 bg-success/5"
                          : ticket.priority === "rush"
                            ? "border-danger/30"
                            : ""
                      }`}
                      data-ticket-id={ticket.id}
                      id={`ticket-${ticket.id}`}
                      key={ticket.id}
                    >
                      <Card.Header className="flex flex-col gap-3 border-b border-border/60 bg-surface-secondary/20 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                        <div className="flex min-w-0 flex-1 flex-col items-start gap-1 text-start">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-start">
                            <Card.Title className="text-base font-bold text-foreground text-start">
                              {ticket.tableNumber}
                            </Card.Title>
                            <span className="font-mono text-xs text-muted">
                              {ticket.orderCode}
                            </span>
                            {ticket.priority === "rush" && (
                              <Chip color="danger" size="sm" variant="soft">
                                Rush
                              </Chip>
                            )}
                            {ticket.priority === "vip" && (
                              <Chip color="warning" size="sm" variant="soft">
                                VIP
                              </Chip>
                            )}
                            {ticket.serviceType &&
                              ticket.serviceType !== "dineIn" && (
                                <Chip color="accent" size="sm" variant="soft">
                                  {ticket.serviceType === "takeaway"
                                    ? "Takeaway"
                                    : (ticket.channel ?? "Delivery")}
                                </Chip>
                              )}
                            {ticket.guestCount ? (
                              <span className="text-xs text-muted">
                                · {ticket.guestCount} guests
                              </span>
                            ) : null}
                            {ticket.serverName ? (
                              <span className="text-xs text-muted">
                                · {ticket.serverName}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:self-start sm:pt-0.5">
                          <span className="text-xs text-muted">
                            {t("readyCount", {
                              completed: completedCount,
                              total: ticket.dishes.length,
                            })}
                          </span>

                          <div
                            className={`flex items-center gap-1.5 text-xs ${
                              isOverdue
                                ? "text-danger font-semibold"
                                : "text-muted"
                            }`}
                          >
                            <IconClock aria-hidden="true" size={14} />
                            <time className="font-mono font-medium text-foreground">
                              {formatElapsedTime(
                                ticket.elapsedSeconds + elapsedTick,
                              )}
                            </time>
                          </div>

                          <Button
                            className={
                              isAllCompleted
                                ? "border border-success/30 bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover active:bg-success-soft/90 [--button-bg:var(--success-soft)] [--button-fg:var(--success-soft-foreground)] [--button-bg-hover:var(--success-soft-hover)] [--button-bg-pressed:var(--success-soft-hover)]"
                                : "bg-success text-white hover:bg-success/90 active:bg-success/80 [--button-bg:var(--success)] [--button-fg:white] [--button-bg-hover:color-mix(in_oklab,var(--success)_90%,black)] [--button-bg-pressed:color-mix(in_oklab,var(--success)_80%,black)]"
                            }
                            size="sm"
                            variant="ghost"
                            onPress={() => toggleCompleteAll(ticket.id)}
                          >
                            <IconCheck aria-hidden="true" size={15} />
                            <span>
                              {isAllCompleted
                                ? t("allReady")
                                : t("completeAll")}
                            </span>
                          </Button>
                        </div>
                      </Card.Header>

                      {ticket.notes && (
                        <div className="border-b border-border/40 bg-surface-secondary/30 px-4 py-2 text-xs text-muted sm:px-5">
                          <span className="font-medium text-foreground">
                            {t("notesLabel")}{" "}
                          </span>
                          {ticket.notes}
                        </div>
                      )}

                      <Card.Content className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                          {ticket.dishes.map((dish) => {
                            const isDishCompleted = dish.status === "completed";

                            return (
                              <div
                                key={dish.id}
                                className={`flex flex-col justify-between overflow-hidden rounded border border-border/60 bg-surface-secondary/20 p-3 transition-opacity ${
                                  isDishCompleted ? "opacity-60" : ""
                                }`}
                              >
                                <div className="flex gap-3">
                                  <div className="relative size-16 shrink-0 overflow-hidden rounded bg-surface-secondary">
                                    <Image
                                      alt={dish.title}
                                      className="object-cover"
                                      fill
                                      sizes="64px"
                                      src={dish.image}
                                    />
                                    {isDishCompleted && (
                                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                                        <IconCheck
                                          className="text-white"
                                          size={18}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <h4
                                        className={`truncate text-sm font-medium leading-snug ${
                                          isDishCompleted
                                            ? "text-muted line-through"
                                            : "text-foreground"
                                        }`}
                                      >
                                        {dish.title}
                                      </h4>
                                      <span className="shrink-0 rounded bg-surface-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                                        ×{dish.quantity}
                                      </span>
                                    </div>

                                    {dish.modifiers.length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {dish.modifiers.map((modifier) => (
                                          <span
                                            className="max-w-full truncate rounded bg-surface-secondary px-1.5 py-0.5 text-[11px] text-muted"
                                            key={modifier}
                                          >
                                            {modifier}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end border-t border-border/40 pt-2.5">
                                  <Button
                                    className={
                                      isDishCompleted
                                        ? "border border-success/30 bg-success-soft text-success-soft-foreground hover:bg-success-soft-hover active:bg-success-soft/90 [--button-bg:var(--success-soft)] [--button-fg:var(--success-soft-foreground)] [--button-bg-hover:var(--success-soft-hover)] [--button-bg-pressed:var(--success-soft-hover)]"
                                        : "bg-success text-white hover:bg-success/90 active:bg-success/80 [--button-bg:var(--success)] [--button-fg:white] [--button-bg-hover:color-mix(in_oklab,var(--success)_90%,black)] [--button-bg-pressed:color-mix(in_oklab,var(--success)_80%,black)]"
                                    }
                                    size="sm"
                                    variant="ghost"
                                    onPress={() =>
                                      updateDishStatus(
                                        ticket.id,
                                        dish.id,
                                        isDishCompleted
                                          ? "pending"
                                          : "completed",
                                      )
                                    }
                                  >
                                    <IconCheck aria-hidden="true" size={15} />
                                    <span>
                                      {isDishCompleted
                                        ? t("completed")
                                        : t("complete")}
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card.Content>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollShadow>
        </section>
      </div>
    </POSLayout>
  );
}
