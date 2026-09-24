"use client";

import { Button, Card, Chip, Table } from "@heroui/react";
import {
  IconArmchair,
  IconCalendar,
  IconClock,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useLocale, useTranslations } from "next-intl";
import {
  AddReservationModal,
  type CreateReservationInput,
} from "./add-reservation-modal";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";
import {
  reservationTables,
  reservations,
  type Reservation,
} from "./reservation-data";

const timelineStartMinutes = 10 * 60;
const slotDurationMinutes = 30;
const timelineEndMinutes = 18 * 60;
const timelineTimes = Array.from(
  { length: (timelineEndMinutes - timelineStartMinutes) / slotDurationMinutes },
  (_, index) => {
    const minutes = timelineStartMinutes + index * slotDurationMinutes;
    return (
      String(Math.floor(minutes / 60)).padStart(2, "0") +
      ":" +
      String(minutes % 60).padStart(2, "0")
    );
  },
);
const reservationTableRows = reservationTables.map((tableId) => ({
  id: tableId,
}));

interface ReservationWorkspaceProps {
  asideLabel: string;
  headerTitle: string;
}

function getMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getReservationStyle(reservation: Reservation): CSSProperties {
  const startSlot =
    (getMinutes(reservation.startTime) - timelineStartMinutes) /
    slotDurationMinutes;
  const durationSlots =
    (getMinutes(reservation.endTime) - getMinutes(reservation.startTime)) /
    slotDurationMinutes;

  return {
    insetInlineStart: `${(startSlot / timelineTimes.length) * 100}%`,
    width: `${(durationSlots / timelineTimes.length) * 100}%`,
  };
}

function getNextReservationId(currentReservations: Reservation[]) {
  const highestNumber = currentReservations.reduce((highest, reservation) => {
    const suffix = Number(reservation.id.match(/\d+$/)?.[0] ?? 0);
    return Math.max(highest, suffix);
  }, 0);

  return "RV" + String(highestNumber + 1).padStart(3, "0");
}

function formatReservationDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date + "T12:00:00Z"));
}

export function ReservationWorkspace({
  asideLabel,
  headerTitle,
}: ReservationWorkspaceProps) {
  const [selectedReservationId, setSelectedReservationId] = useState(
    reservations[0]?.id ?? "",
  );
  const [reservationRecords, setReservationRecords] = useState(reservations);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const currentDate = today(getLocalTimeZone()).toString();
  const visibleReservations = activeDate
    ? reservationRecords.filter(
        (reservation) =>
          reservation.date === activeDate ||
          (!reservation.date && activeDate === currentDate),
      )
    : reservationRecords.filter((reservation) => !reservation.date);
  const selectedReservation =
    visibleReservations.find(({ id }) => id === selectedReservationId) ??
    visibleReservations[0];

  function handleCreateReservation(input: CreateReservationInput) {
    const id = getNextReservationId(reservationRecords);
    const reservation: Reservation = { ...input, id };
    setReservationRecords((currentReservations) => [
      ...currentReservations,
      reservation,
    ]);
    setSelectedReservationId(id);
    setActiveDate(input.date);
  }

  return (
    <POSLayout
      headerTitle={headerTitle}
      rightPanelLabel={asideLabel}
      rightPanelWidth="28rem"
      rightPanelClassName="overflow-hidden"
      rightPanel={
        selectedReservation ? (
          <ReservationAside reservation={selectedReservation} />
        ) : null
      }
      showSearch={false}
    >
      <ReservationTimeline
        activeDate={activeDate}
        allReservations={reservationRecords}
        onCreateReservation={handleCreateReservation}
        onReturnToToday={() => {
          setActiveDate(null);
          setSelectedReservationId(reservations[0]?.id ?? "");
        }}
        reservations={visibleReservations}
        selectedReservationId={selectedReservation?.id ?? ""}
        onReservationSelect={setSelectedReservationId}
      />
    </POSLayout>
  );
}

function ReservationTimeline({
  activeDate,
  allReservations,
  onCreateReservation,
  onReservationSelect,
  onReturnToToday,
  reservations: visibleReservations,
  selectedReservationId,
}: {
  activeDate: string | null;
  allReservations: Reservation[];
  onCreateReservation: (reservation: CreateReservationInput) => void;
  onReservationSelect: (reservationId: string) => void;
  onReturnToToday: () => void;
  reservations: Reservation[];
  selectedReservationId: string;
}) {
  const t = useTranslations("SalesMenu.pages.reservation");
  const locale = useLocale();

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-(--pos-content-padding)">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted">
          <IconCalendar aria-hidden="true" size={16} />
          <Chip color="accent" size="sm" variant="soft">
            {activeDate ? formatReservationDate(activeDate, locale) : t("today")}
          </Chip>
          {activeDate ? (
            <Button
              onPress={onReturnToToday}
              size="sm"
              type="button"
              variant="secondary"
            >
              {t("returnToToday")}
            </Button>
          ) : null}
          <span className="flex items-center gap-1.5">
            <IconClock aria-hidden="true" size={16} />
            <span>{t("serviceHours")}: 10:00–18:00</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-muted">
            {t("reservationCount", { count: visibleReservations.length })}
          </p>
          <AddReservationModal
            onCreate={onCreateReservation}
            reservations={allReservations}
          />
        </div>
      </div>

      <Table className="min-h-0 min-w-0 flex-1" variant="secondary">
        <Table.ScrollContainer className="min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
          <Table.Content
            aria-label={t("timelineLabel")}
            className="min-w-[1880px] table-fixed"
          >
            <Table.Header className="sticky top-0 z-20">
              <Table.Column
                className="sticky left-0 z-30 w-[5.25rem] min-w-[5.25rem]"
                id="table"
                isRowHeader
              >
                <div className="bg-foreground px-3 text-xs font-semibold uppercase tracking-wide text-background">
                  {t("tableAxisLabel")}
                </div>
              </Table.Column>
              <Table.Column
                className="min-w-[1792px]"
                id="schedule"
              >
                <div
                  aria-label={t("timeRangeLabel")}
                  className="relative grid min-h-12 grid-cols-[repeat(16,minmax(7rem,1fr))] bg-surface-secondary text-xs font-semibold text-muted"
                >
                  {timelineTimes.map((time) => (
                    <div
                      className="flex items-center border-s border-border/70 px-3 first:border-s-0"
                      key={time}
                    >
                      {time}
                    </div>
                  ))}
                  <span className="absolute inset-y-0 right-0 flex items-center border-s border-border/70 bg-surface-secondary px-2 font-mono text-[11px]">
                    18:00
                  </span>
                </div>
              </Table.Column>
            </Table.Header>
            <Table.Body items={reservationTableRows}>
              {({ id: tableId }) => (
                <Table.Row id={tableId} key={tableId}>
                  <Table.Cell className="sticky left-0 z-10 w-[5.25rem] min-w-[5.25rem]">
                    <div className="flex h-24 items-center justify-center border-t border-border/40 bg-foreground text-sm font-bold text-background">
                      {tableId}
                    </div>
                  </Table.Cell>
                  <Table.Cell
                    className="min-w-[1792px]"
                    textValue={t("tableScheduleLabel", { table: tableId })}
                  >
                    <div className="relative h-24 overflow-hidden border-t border-border bg-background">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 grid grid-cols-[repeat(16,minmax(0,1fr))]"
                      >
                        {timelineTimes.map((time) => (
                          <span
                            className="border-s border-border/70 last:border-e"
                            key={`${tableId}-${time}`}
                          />
                        ))}
                      </div>

                      {visibleReservations
                        .filter((reservation) => reservation.tableId === tableId)
                        .map((reservation) => (
                          <ReservationBookingCard
                            isSelected={
                              reservation.id === selectedReservationId
                            }
                            key={reservation.id}
                            onPress={() =>
                              onReservationSelect(reservation.id)
                            }
                            reservation={reservation}
                          />
                        ))}
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}

function ReservationBookingCard({
  isSelected,
  onPress,
  reservation,
}: {
  isSelected: boolean;
  onPress: () => void;
  reservation: Reservation;
}) {
  const t = useTranslations("SalesMenu.pages.reservation");

  return (
    <Button
      aria-label={t("reservationCardLabel", {
        id: reservation.id,
        guest: reservation.guestName,
        guests: reservation.partySize,
        table: reservation.tableId,
        start: reservation.startTime,
        end: reservation.endTime,
      })}
      aria-pressed={isSelected}
      className={
        "absolute top-2 bottom-2 z-10 h-auto min-w-0 max-w-full items-stretch justify-center overflow-hidden rounded-lg border border-accent/30 bg-accent-soft px-2 py-1.5 text-start text-accent-soft-foreground shadow-xs hover:bg-accent-soft-hover " +
        (isSelected ? "ring-2 ring-accent ring-offset-1" : "")
      }
      onPress={onPress}
      size="sm"
      style={getReservationStyle(reservation)}
      variant="secondary"
    >
      <span className="flex w-full min-w-0 flex-col gap-0.5">
        <span className="flex min-w-0 items-center justify-between gap-1">
          <span className="truncate font-mono text-[10px] font-semibold">
            ID# {reservation.id}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-medium">
            <IconUser aria-hidden="true" size={13} />
            {reservation.partySize}
          </span>
        </span>
        <span className="truncate text-xs font-semibold">
          {reservation.guestName}
        </span>
      </span>
    </Button>
  );
}

function ReservationAside({ reservation }: { reservation: Reservation }) {
  const t = useTranslations("SalesMenu.pages.reservation");
  const locale = useLocale();
  const dateLabel = reservation.date
    ? formatReservationDate(reservation.date, locale)
    : t("today");

  return (
    <POSAside
      ariaLabelledBy="reservation-aside-title"
      header={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            className="min-w-0 flex-1 text-base font-semibold leading-snug text-foreground"
            id="reservation-aside-title"
          >
            {t("detailsTitle")}
          </h2>
          <Chip color="accent" size="sm" variant="soft">
            <span className="font-mono">ID# {reservation.id}</span>
          </Chip>
        </div>
      }
      headerClassName="shrink-0 border-b border-border/70 p-[var(--pos-content-padding)]"
      mainClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-[var(--pos-content-padding)]"
    >
      <Card variant="default">
        <Card.Header>
          <div className="flex flex-row items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-lg font-semibold text-accent-soft-foreground"
            >
              {reservation.guestName.slice(0, 1)}
            </span>
            <div className="min-w-0">
              <Card.Description>{t("guestLabel")}</Card.Description>
              <Card.Title>
                <span className="break-words text-base font-semibold leading-snug text-foreground">
                  {reservation.guestName}
                </span>
              </Card.Title>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <dl className="grid grid-cols-2 gap-2 border-t border-border/70 pt-3">
            <ReservationDetail
              icon={<IconArmchair aria-hidden="true" size={16} />}
              label={t("tableLabel")}
              value={reservation.tableId}
            />
            <ReservationDetail
              icon={<IconUsers aria-hidden="true" size={16} />}
              label={t("partySizeLabel")}
              value={t("guestCount", { count: reservation.partySize })}
            />
          </dl>
        </Card.Content>
      </Card>

      <Card variant="transparent">
        <Card.Content>
          <div className="flex flex-col gap-3 rounded-2xl bg-accent-soft p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-accent-soft-foreground">
              <IconCalendar aria-hidden="true" size={16} />
              <span>{dateLabel}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <Card.Description>
                  <span className="text-xs text-accent-soft-foreground">
                    {t("timeLabel")}
                  </span>
                </Card.Description>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xl font-semibold leading-tight text-foreground">
                  <time dateTime={reservation.startTime}>{reservation.startTime}</time>
                  <span aria-hidden="true" className="text-accent-soft-foreground">
                    –
                  </span>
                  <time dateTime={reservation.endTime}>{reservation.endTime}</time>
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/70 text-accent-soft-foreground"
              >
                <IconClock size={18} />
              </span>
            </div>
          </div>
        </Card.Content>
      </Card>
    </POSAside>
  );
}

function ReservationDetail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-surface-secondary p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        {icon}
        <span className="min-w-0 break-words">{label}</span>
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}
