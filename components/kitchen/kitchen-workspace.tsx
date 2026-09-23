"use client";

import { Button, Card, Chip, ScrollShadow } from "@heroui/react";
import { IconCheck, IconClock } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";

type DishStatus = "pending" | "completed" | "cancelled";
type TicketListOrientation = "horizontal" | "vertical";

interface KitchenDish {
  id: string;
  title: string;
  quantity: number;
  modifiers: string[];
  image: string;
  status: DishStatus;
}

interface KitchenTicket {
  id: string;
  orderCode: string;
  tableNumber: string;
  elapsedSeconds: number;
  dishes: KitchenDish[];
}

interface KitchenWorkspaceProps {
  asideLabel: string;
  headerTitle: string;
}

interface KitchenTicketListProps {
  onSelect: (ticketId: string) => void;
  orientation: TicketListOrientation;
  selectedTicketId: string;
  tickets: KitchenTicket[];
}

interface KitchenAsideProps extends Omit<KitchenTicketListProps, "orientation"> {
  elapsedTick: number;
  selectedTicket: KitchenTicket;
}

const initialTickets: KitchenTicket[] = [
  {
    id: "ticket-1082",
    orderCode: "ORD-1082",
    tableNumber: "Table 02/05",
    elapsedSeconds: 12 * 60 + 42,
    dishes: [
      {
        id: "lok-lak-1082",
        title: "Beef Lok Lak",
        quantity: 1,
        modifiers: ["Medium rare", "Pepper-lime sauce on the side"],
        image: "/kitchen/lok-lak.jpg",
        status: "completed",
      },
      {
        id: "curry-1082",
        title: "Khmer Chicken Curry",
        quantity: 2,
        modifiers: ["Mild spice", "Rice on the side"],
        image: "/kitchen/chicken-curry.jpg",
        status: "completed",
      },
      {
        id: "spring-rolls-1082",
        title: "Crispy Spring Rolls",
        quantity: 1,
        modifiers: ["Extra herbs", "Chili sauce on the side"],
        image: "/kitchen/spring-rolls.jpg",
        status: "completed",
      },
      {
        id: "mango-sticky-rice-1082",
        title: "Mango Sticky Rice",
        quantity: 1,
        modifiers: ["Coconut cream on the side", "No sesame"],
        image: "/kitchen/mango-sticky-rice.jpg",
        status: "pending",
      },
    ],
  },
  {
    id: "ticket-1086",
    orderCode: "ORD-1086",
    tableNumber: "Table 08/05",
    elapsedSeconds: 8 * 60 + 16,
    dishes: [
      {
        id: "lok-lak-1086",
        title: "Beef Lok Lak",
        quantity: 1,
        modifiers: ["Well done", "Extra pepper-lime sauce"],
        image: "/kitchen/lok-lak.jpg",
        status: "pending",
      },
      {
        id: "spring-rolls-1086",
        title: "Crispy Spring Rolls",
        quantity: 2,
        modifiers: ["Chili sauce on the side"],
        image: "/kitchen/spring-rolls.jpg",
        status: "pending",
      },
      {
        id: "curry-1086",
        title: "Khmer Chicken Curry",
        quantity: 1,
        modifiers: ["Extra mild", "Jasmine rice"],
        image: "/kitchen/chicken-curry.jpg",
        status: "pending",
      },
    ],
  },
  {
    id: "ticket-1088",
    orderCode: "ORD-1088",
    tableNumber: "Table 04/05",
    elapsedSeconds: 4 * 60 + 9,
    dishes: [
      {
        id: "mango-sticky-rice-1088",
        title: "Mango Sticky Rice",
        quantity: 1,
        modifiers: ["Coconut cream on the side"],
        image: "/kitchen/mango-sticky-rice.jpg",
        status: "pending",
      },
      {
        id: "lok-lak-1088",
        title: "Beef Lok Lak",
        quantity: 2,
        modifiers: ["Medium", "No fried egg"],
        image: "/kitchen/lok-lak.jpg",
        status: "pending",
      },
    ],
  },
];

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
        isHorizontal
          ? "flex w-max gap-2"
          : "flex w-full flex-col gap-2.5"
      }
    >
      {tickets.map((ticket) => {
        const isSelected = ticket.id === selectedTicketId;
        const isCompleted =
          ticket.dishes.length > 0 &&
          ticket.dishes.every((dish) => dish.status === "completed");

        return (
          <div
            className={isHorizontal ? "w-60 shrink-0" : "w-full"}
            key={ticket.id}
          >
            <Button
              aria-pressed={isSelected}
              fullWidth
              onPress={() => onSelect(ticket.id)}
              size="lg"
              type="button"
              variant={isSelected ? "primary" : "secondary"}
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-start font-semibold">
                    {ticket.tableNumber}
                  </span>
                  {isCompleted ? (
                    <>
                      <IconCheck aria-hidden="true" size={18} />
                      <span className="sr-only">{t("completed")}</span>
                    </>
                  ) : null}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {ticket.orderCode}
                </span>
              </span>
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

  return (
    <POSAside
      ariaLabelledBy="kitchen-aside-title"
      headerClassName="border-b border-border p-4"
      mainClassName="flex min-h-0 flex-col p-4"
      header={
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {t("selectedTicketLabel")}
          </p>
          <div className="flex items-center justify-between gap-3">
            <h2
              className="min-w-0 truncate text-lg font-semibold text-foreground"
              id="kitchen-aside-title"
            >
              {selectedTicket.tableNumber}
            </h2>
            <Chip color="accent" size="sm" variant="soft">
              {t("serviceTypeDineIn")}
            </Chip>
          </div>
          <p className="font-mono text-sm text-muted">
            {selectedTicket.orderCode}
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-surface-secondary px-3 py-2 text-sm text-muted">
            <IconClock aria-hidden="true" size={16} />
            <span>{t("prepTimerLabel")}</span>
            <time className="ms-auto font-semibold tabular-nums text-foreground">
              {formatElapsedTime(selectedTicket.elapsedSeconds + elapsedTick)}
            </time>
          </div>
        </div>
      }
    >
      <section
        aria-labelledby="kitchen-ticket-list-title"
        className="flex min-h-0 flex-1 flex-col gap-3"
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <h3
            className="text-sm font-semibold text-foreground"
            id="kitchen-ticket-list-title"
          >
            {t("ticketListLabel")}
          </h3>
          <Chip color="accent" size="sm" variant="soft">
            {t("ticketCount", { count: tickets.length })}
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
}: KitchenWorkspaceProps) {
  const t = useTranslations("SalesMenu.pages.kitchen");
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(
    initialTickets[0].id,
  );
  const [elapsedTick, setElapsedTick] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedTick((tick) => tick + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const selectedTicket =
    tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0];

  const updateDishStatus = (dishId: string, status: DishStatus) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === selectedTicket.id
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

  return (
    <POSLayout
      headerTitle={headerTitle}
      rightPanel={
        <KitchenTicketAside
          elapsedTick={elapsedTick}
          onSelect={setSelectedTicketId}
          selectedTicket={selectedTicket}
          selectedTicketId={selectedTicketId}
          tickets={tickets}
        />
      }
      rightPanelLabel={asideLabel}
      rightPanelWidth="24rem"
      rightPanelClassName="overflow-hidden"
      showSearch={false}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border p-3 lg:hidden">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-foreground">
              {t("ticketListLabel")}
            </h2>
            <Chip color="accent" size="sm" variant="soft">
              {t("ticketCount", { count: tickets.length })}
            </Chip>
          </div>
          <div className="overflow-x-auto pb-2">
            <KitchenTicketList
              onSelect={setSelectedTicketId}
              orientation="horizontal"
              selectedTicketId={selectedTicketId}
              tickets={tickets}
            />
          </div>
        </div>

        <section
          aria-label={t("ticketItemsLabel")}
          className="flex min-h-0 min-w-0 flex-1 flex-col"
        >
          <ScrollShadow className="min-h-0 min-w-0 flex-1 overscroll-contain">
            <div className="grid w-full grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 2xl:grid-cols-3 2xl:p-6">
              {selectedTicket.dishes.map((dish) => {
                const isCompleted = dish.status === "completed";
                const isCancelled = dish.status === "cancelled";
                const isResolved = isCompleted || isCancelled;

                return (
                  <div className="grid min-w-0" key={dish.id}>
                    <Card variant="default">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-secondary">
                        <Image
                          alt={dish.title}
                          className="object-cover"
                          fill
                          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 40vw, 30vw"
                          src={dish.image}
                        />
                        {isResolved ? (
                          <div
                            aria-hidden="true"
                            className={`absolute inset-0 ${isCompleted ? "bg-slate-950/45" : "bg-slate-950/55 grayscale"}`}
                          />
                        ) : null}
                        {isCompleted || isCancelled ? (
                          <div className="absolute end-3 top-3">
                            <Chip
                              color={isCompleted ? "success" : "danger"}
                              size="sm"
                              variant={isCompleted ? "primary" : "soft"}
                            >
                              {isCompleted ? t("completed") : t("cancelled")}
                            </Chip>
                          </div>
                        ) : null}
                      </div>

                      <Card.Header>
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <Card.Title>{dish.title}</Card.Title>
                          <Chip size="sm" variant="secondary">
                            x{dish.quantity}
                          </Chip>
                        </div>
                      </Card.Header>

                      <Card.Content>
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                            {t("modifiersLabel")}
                          </p>
                          {dish.modifiers.length > 0 ? (
                            <ul className="flex flex-col gap-1.5">
                              {dish.modifiers.map((modifier) => (
                                <li
                                  className="flex gap-2 text-sm leading-snug text-foreground/85"
                                  key={modifier}
                                >
                                  <span
                                    aria-hidden="true"
                                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent"
                                  />
                                  <span>{modifier}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-muted">
                              {t("noModifiers")}
                            </p>
                          )}
                        </div>
                      </Card.Content>

                      <Card.Footer>
                        <div className="grid w-full grid-cols-2 gap-2">
                          <Button
                            aria-label={t("completeItem", { item: dish.title })}
                            fullWidth
                            isDisabled={isResolved}
                            onPress={() =>
                              updateDishStatus(dish.id, "completed")
                            }
                            size="lg"
                            type="button"
                            variant="primary"
                          >
                            {t("complete")}
                          </Button>
                          <Button
                            aria-label={t("cancelItem", { item: dish.title })}
                            fullWidth
                            isDisabled={isResolved}
                            onPress={() =>
                              updateDishStatus(dish.id, "cancelled")
                            }
                            size="lg"
                            type="button"
                            variant="secondary"
                          >
                            {t("cancel")}
                          </Button>
                        </div>
                      </Card.Footer>
                    </Card>
                  </div>
                );
              })}
            </div>
          </ScrollShadow>
        </section>
      </div>
    </POSLayout>
  );
}
