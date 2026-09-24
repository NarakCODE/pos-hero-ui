"use client";

import {
  Button,
  Calendar,
  Card,
  Chip,
  DateField,
  DatePicker,
  Description,
  Form,
  Input,
  Label,
  Modal,
  NumberField,
  Radio,
  RadioGroup,
  TextField,
  TimeField,
  toast,
} from "@heroui/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import {
  CalendarDate,
  getLocalTimeZone,
  Time,
  today,
  type DateValue,
} from "@internationalized/date";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { products, type Product } from "@/app/(protected)/sales/data";
import type { Locale } from "@/config/i18n";
import {
  type Reservation,
  type ReservationDish,
} from "./reservation-data";

interface AddReservationModalProps {
  reservations: Reservation[];
  onCreate: (reservation: CreateReservationInput) => void;
}

export interface CreateReservationInput {
  guestName: string;
  date: string;
  tableId: string;
  partySize: number;
  startTime: string;
  endTime: string;
  babyChair: boolean;
  dishes: ReservationDish[];
}

const wizardSteps = [
  { key: "stepReservationInfo", number: 1 },
  { key: "stepSelectTable", number: 2 },
  { key: "stepAddDishes", number: 3 },
  { key: "stepReservationSummary", number: 4 },
] as const;

interface TableOption {
  id: string;
  capacity: number;
  column: number;
  row: number;
  columnSpan?: number;
  status?: "reserved" | "unavailable";
  bookedAt?: string;
  isPartial?: boolean;
}

const tableOptions: TableOption[] = [
  { id: "A1", capacity: 4, column: 2, row: 1 },
  { id: "A2", capacity: 2, column: 2, row: 2 },
  {
    id: "A3",
    capacity: 8,
    column: 3,
    columnSpan: 2,
    row: 1,
    status: "unavailable",
  },
  { id: "A4", capacity: 4, column: 5, row: 1 },
  { id: "A5", capacity: 6, column: 6, row: 1 },
  {
    bookedAt: "17:00 PM",
    id: "A6",
    capacity: 4,
    column: 3,
    row: 2,
    status: "reserved",
  },
  {
    bookedAt: "17:00 PM",
    id: "A7",
    capacity: 4,
    column: 4,
    row: 2,
    status: "reserved",
  },
  { id: "A8", capacity: 6, column: 5, row: 2 },
  { id: "A9", capacity: 4, column: 3, row: 3 },
  { id: "A10", capacity: 2, column: 4, row: 3 },
  {
    bookedAt: "17:00 PM",
    id: "A11",
    capacity: 6,
    column: 1,
    row: 1,
    status: "reserved",
    isPartial: true,
  },
  { id: "A12", capacity: 8, column: 5, row: 3 },
  {
    bookedAt: "17:00 PM",
    id: "A13",
    capacity: 6,
    column: 1,
    row: 2,
    status: "reserved",
    isPartial: true,
  },
  {
    id: "A14",
    capacity: 12,
    column: 1,
    columnSpan: 2,
    row: 3,
    status: "unavailable",
  },
] as const;
const defaultReservationDate = new CalendarDate(2027, 2, 2);

const dishCategories = new Set<Product["category"]>([
  "breakfast",
  "sandwich",
  "bakery",
  "dessert",
  "snack",
]);
const dishOptions = products
  .filter(
    (product) =>
      dishCategories.has(product.category) &&
      product.status !== "inactive" &&
      product.inStock !== false,
  )
  .slice(0, 6);
const reservationDurationMinutes = 60;

function getTimeMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(time: Time | null) {
  if (!time) return "";
  return (
    String(time.hour).padStart(2, "0") +
    ":" +
    String(time.minute).padStart(2, "0")
  );
}

function addMinutes(time: string, minutesToAdd: number) {
  const totalMinutes = getTimeMinutes(time) + minutesToAdd;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return (
    String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0")
  );
}

function formatDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
  }).format(new Date(date + "T12:00:00Z"));
}

export function AddReservationModal({
  onCreate,
  reservations,
}: AddReservationModalProps) {
  const t = useTranslations("SalesMenu.pages.reservation");
  const locale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [guestName, setGuestName] = useState("Eva");
  const [reservationDate, setReservationDate] = useState<DateValue | null>(
    () => defaultReservationDate,
  );
  const [reservationTime, setReservationTime] = useState<Time | null>(
    () => new Time(15, 0),
  );
  const [partySize, setPartySize] = useState(4);
  const [babyChair, setBabyChair] = useState<"no" | "yes">("no");
  const [selectedTable, setSelectedTable] = useState("");
  const [dishQuantities, setDishQuantities] = useState<Record<string, number>>(
    {},
  );

  const dateValue = reservationDate?.toString().slice(0, 10) ?? "";
  const timeValue = formatTime(reservationTime);
  const selectedDishes = dishOptions.flatMap((product) => {
    const quantity = dishQuantities[product.id] ?? 0;
    return quantity > 0
      ? [
          {
            id: product.id,
            name: product.name[locale],
            quantity,
            unitPrice: product.price,
          },
        ]
      : [];
  });
  const dishSubtotal = selectedDishes.reduce(
    (total, dish) => total + dish.quantity * dish.unitPrice,
    0,
  );
  const currentDate = today(getLocalTimeZone()).toString();
  const reservationsForDate = reservations.filter(
    (reservation) =>
      reservation.date === dateValue ||
      (!reservation.date && dateValue === currentDate),
  );
  const proposedStart = getTimeMinutes(timeValue);
  const proposedEnd = proposedStart + reservationDurationMinutes;

  const tableStatuses = tableOptions.map((table) => {
    const hasCapacity = table.capacity >= partySize;
    const isBusy =
      table.status === "reserved" ||
      reservationsForDate.some((reservation) => {
        if (reservation.tableId !== table.id) {
          return false;
        }

        return (
          proposedStart < getTimeMinutes(reservation.endTime) &&
          proposedEnd > getTimeMinutes(reservation.startTime)
        );
      });
    const isUnavailable =
      table.status === "unavailable" || !hasCapacity || isBusy;
    const isSelected = selectedTable === table.id;

    return {
      ...table,
      hasCapacity,
      isBusy,
      isUnavailable,
      isSelected,
    };
  });

  const sortedTables = [...tableStatuses].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
  const selectedTableInfo = tableStatuses.find((t) => t.id === selectedTable);

  function resetWizard() {
    setStep(0);
    setGuestName("Eva");
    setReservationDate(defaultReservationDate);
    setReservationTime(new Time(15, 0));
    setPartySize(4);
    setBabyChair("no");
    setSelectedTable("");
    setDishQuantities({});
  }

  function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen);
    if (!nextIsOpen) resetWizard();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 0) {
      if (!guestName.trim() || !dateValue || !timeValue) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!selectedTable) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (!selectedTable || !dateValue || !timeValue) return;

    onCreate({
      babyChair: babyChair === "yes",
      date: dateValue,
      dishes: selectedDishes,
      endTime: addMinutes(timeValue, reservationDurationMinutes),
      guestName: guestName.trim(),
      partySize,
      startTime: timeValue,
      tableId: selectedTable,
    });
    toast.success(t("createdTitle"), {
      description: t("createdDescription", { guest: guestName.trim() }),
    });
    handleOpenChange(false);
  }

  function adjustDishQuantity(productId: string, adjustment: number) {
    setDishQuantities((current) => {
      const nextQuantity = Math.max(0, (current[productId] ?? 0) + adjustment);
      const next = { ...current };
      if (nextQuantity === 0) {
        delete next[productId];
      } else {
        next[productId] = nextQuantity;
      }
      return next;
    });
  }

  return (
    <Modal>
      <Button
        fullWidth
        onPress={() => setIsOpen(true)}
        size="sm"
        type="button"
        variant="primary"
      >
        <IconPlus aria-hidden="true" size={18} />
        {t("addReservation")}
      </Button>

      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        variant="blur"
      >
        <Modal.Container scroll="inside" size="cover">
          <Modal.Dialog
            aria-describedby="add-reservation-description"
            aria-labelledby="add-reservation-title"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex flex-col items-stretch gap-5">
                <div className="pr-8">
                  <Modal.Heading id="add-reservation-title">
                    {t("addReservation")}
                  </Modal.Heading>
                  <p
                    className="mt-1 text-sm text-muted"
                    id="add-reservation-description"
                  >
                    {t("wizardDescription")}
                  </p>
                </div>

                <ol
                  aria-label={t("workflowLabel")}
                  className="grid grid-cols-4 gap-2"
                >
                  {wizardSteps.map((wizardStep, index) => {
                    const isCurrent = index === step;
                    const isComplete = index < step;

                    return (
                      <li
                        aria-current={isCurrent ? "step" : undefined}
                        className="flex min-w-0 flex-col items-center gap-2 text-center"
                        key={wizardStep.key}
                      >
                        <span
                          className={
                            "flex size-8 items-center justify-center rounded-full text-xs font-semibold " +
                            (isCurrent
                              ? "bg-accent text-accent-foreground"
                              : isComplete
                                ? "bg-success-soft text-success-soft-foreground"
                                : "bg-surface-secondary text-muted")
                          }
                        >
                          {isComplete ? (
                            <IconCheck aria-hidden="true" size={16} />
                          ) : (
                            wizardStep.number
                          )}
                        </span>
                        <span
                          className={
                            "text-[11px] leading-tight sm:text-xs " +
                            (isCurrent
                              ? "font-semibold text-foreground"
                              : "text-muted")
                          }
                        >
                          {t(wizardStep.key)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Modal.Header>

            <Form
              aria-labelledby="add-reservation-title"
              className="contents"
              id="add-reservation-form"
              onSubmit={handleSubmit}
            >
              <Modal.Body className="min-h-72">
                {step === 0 ? (
                  <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <TextField
                      fullWidth
                      isRequired
                      minLength={2}
                      name="guestName"
                      validate={(value) =>
                        value.trim().length < 2 ? t("guestNameError") : null
                      }
                      value={guestName}
                      onChange={(value) => {
                        setGuestName(value);
                        setSelectedTable("");
                      }}
                    >
                      <Label>{t("customerName")}</Label>
                      <Input
                        autoComplete="name"
                        placeholder={t("customerNamePlaceholder")}
                        variant="secondary"
                      />
                    </TextField>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <DatePicker
                        className="w-full"
                        isRequired
                        minValue={today(getLocalTimeZone())}
                        name="reservationDate"
                        value={reservationDate}
                        onChange={(value) => {
                          setReservationDate(value);
                          setSelectedTable("");
                        }}
                      >
                        <Label>{t("date")}</Label>
                        <DateField.Group fullWidth variant="secondary">
                          <DateField.Input>
                            {(segment) => (
                              <DateField.Segment segment={segment} />
                            )}
                          </DateField.Input>
                          <DateField.Suffix>
                            <DatePicker.Trigger>
                              <DatePicker.TriggerIndicator />
                            </DatePicker.Trigger>
                          </DateField.Suffix>
                        </DateField.Group>
                        <DatePicker.Popover>
                          <Calendar aria-label={t("date")}>
                            <Calendar.Header>
                              <Calendar.YearPickerTrigger>
                                <Calendar.YearPickerTriggerHeading />
                                <Calendar.YearPickerTriggerIndicator />
                              </Calendar.YearPickerTrigger>
                              <Calendar.NavButton slot="previous" />
                              <Calendar.NavButton slot="next" />
                            </Calendar.Header>
                            <Calendar.Grid>
                              <Calendar.GridHeader>
                                {(day) => (
                                  <Calendar.HeaderCell>
                                    {day}
                                  </Calendar.HeaderCell>
                                )}
                              </Calendar.GridHeader>
                              <Calendar.GridBody>
                                {(calendarDate) => (
                                  <Calendar.Cell date={calendarDate} />
                                )}
                              </Calendar.GridBody>
                            </Calendar.Grid>
                          </Calendar>
                        </DatePicker.Popover>
                      </DatePicker>

                      <TimeField
                        className="w-full"
                        granularity="minute"
                        hourCycle={24}
                        isRequired
                        maxValue={new Time(17, 0)}
                        minValue={new Time(10, 0)}
                        name="reservationTime"
                        value={reservationTime}
                        onChange={(value) => {
                          setReservationTime(
                            value ? new Time(value.hour, value.minute) : null,
                          );
                          setSelectedTable("");
                        }}
                      >
                        <Label>{t("time")}</Label>
                        <TimeField.Group fullWidth variant="secondary">
                          <TimeField.Input>
                            {(segment) => (
                              <TimeField.Segment segment={segment} />
                            )}
                          </TimeField.Input>
                        </TimeField.Group>
                      </TimeField>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <NumberField
                        fullWidth
                        maxValue={8}
                        minValue={1}
                        name="partySize"
                        variant="secondary"
                        value={partySize}
                        onChange={(value) => {
                          if (value !== undefined) {
                            setPartySize(value);
                            setSelectedTable("");
                          }
                        }}
                      >
                        <Label>{t("partySize")}</Label>
                        <NumberField.Group>
                          <NumberField.DecrementButton
                            aria-label={t("decreasePartySize")}
                          >
                            <IconMinus aria-hidden="true" size={16} />
                          </NumberField.DecrementButton>
                          <NumberField.Input />
                          <NumberField.IncrementButton
                            aria-label={t("increasePartySize")}
                          >
                            <IconPlus aria-hidden="true" size={16} />
                          </NumberField.IncrementButton>
                        </NumberField.Group>
                      </NumberField>

                      <RadioGroup
                        aria-label={t("babyChair")}
                        className="sm:col-span-2"
                        name="babyChair"
                        value={babyChair}
                        onChange={(value) =>
                          setBabyChair(value as "no" | "yes")
                        }
                      >
                        <Label>{t("babyChair")}</Label>
                        <Description>{t("babyChairDescription")}</Description>
                        <Radio value="no">
                          <Radio.Content>
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            {t("no")}
                          </Radio.Content>
                          <Description>
                            {t("babyChairNoDescription")}
                          </Description>
                        </Radio>
                        <Radio value="yes">
                          <Radio.Content>
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            {t("yes")}
                          </Radio.Content>
                          <Description>
                            {t("babyChairYesDescription")}
                          </Description>
                        </Radio>
                      </RadioGroup>
                    </div>
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
                    <RadioGroup
                      aria-label={t("chooseTableTitle")}
                      name="selectedTable"
                      value={selectedTable}
                      variant="secondary"
                      onChange={setSelectedTable}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                        <div>
                          <Label>{t("chooseTableTitle")}</Label>
                          <Description>
                            {t("chooseTableDescription", {
                              guests: partySize,
                              time: timeValue,
                            })}
                          </Description>
                        </div>

                        <div className="flex items-center gap-2">
                          <Chip color="success" size="sm" variant="soft">
                            {t("tableAvailable")}
                          </Chip>
                          <Chip color="warning" size="sm" variant="soft">
                            {t("tableReserved")}
                          </Chip>
                          <Chip color="accent" size="sm" variant="soft">
                            Selected
                          </Chip>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {sortedTables.map((table) => {
                          const statusText = table.isBusy
                            ? t("tableReserved")
                            : !table.hasCapacity
                              ? t("tableTooSmall")
                              : table.status === "unavailable"
                                ? t("tableUnavailable")
                                : t("tableAvailable");

                          return (
                            <Radio
                              key={table.id}
                              isDisabled={table.isUnavailable}
                              value={table.id}
                            >
                              <Radio.Content>
                                <Radio.Control>
                                  <Radio.Indicator />
                                </Radio.Control>
                                {t("tableName", { table: table.id })}
                              </Radio.Content>
                              <Description>
                                {t("tableCapacity", { count: table.capacity })} · {statusText}
                              </Description>
                            </Radio>
                          );
                        })}
                      </div>
                    </RadioGroup>

                    {selectedTableInfo ? (
                      <Card variant="secondary">
                        <Card.Header>
                          <div className="flex items-center justify-between">
                            <div>
                              <Card.Title>
                                {t("tableName", { table: selectedTableInfo.id })}
                              </Card.Title>
                              <Card.Description>
                                {t("tableCapacity", { count: selectedTableInfo.capacity })}
                              </Card.Description>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onPress={() => setSelectedTable("")}
                            >
                              Change
                            </Button>
                          </div>
                        </Card.Header>
                      </Card>
                    ) : null}
                  </div>
                ) : null}


                {step === 2 ? (
                  <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {t("addDishesTitle")}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {t("addDishesDescription")}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {dishOptions.map((product) => {
                        const quantity = dishQuantities[product.id] ?? 0;
                        return (
                          <div
                            className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                            key={product.id}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {product.name[locale]}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {"$" + product.price.toFixed(2)}
                              </p>
                            </div>
                            {quantity === 0 ? (
                              <Button
                                aria-label={t("addDish", {
                                  dish: product.name[locale],
                                })}
                                isIconOnly
                                onPress={() =>
                                  adjustDishQuantity(product.id, 1)
                                }
                                size="sm"
                                type="button"
                                variant="secondary"
                              >
                                <IconPlus aria-hidden="true" size={16} />
                              </Button>
                            ) : (
                              <div className="flex shrink-0 items-center gap-1">
                                <Button
                                  aria-label={t("removeDish", {
                                    dish: product.name[locale],
                                  })}
                                  isIconOnly
                                  onPress={() =>
                                    adjustDishQuantity(product.id, -1)
                                  }
                                  size="sm"
                                  type="button"
                                  variant="secondary"
                                >
                                  <IconMinus aria-hidden="true" size={16} />
                                </Button>
                                <span
                                  aria-label={t("dishQuantity", {
                                    count: quantity,
                                    dish: product.name[locale],
                                  })}
                                  className="w-6 text-center text-sm font-semibold tabular-nums"
                                >
                                  {quantity}
                                </span>
                                <Button
                                  aria-label={t("addDish", {
                                    dish: product.name[locale],
                                  })}
                                  isIconOnly
                                  onPress={() =>
                                    adjustDishQuantity(product.id, 1)
                                  }
                                  size="sm"
                                  type="button"
                                  variant="secondary"
                                >
                                  <IconPlus aria-hidden="true" size={16} />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="flex items-center justify-between border-t border-border/70 pt-3 text-sm">
                      <span className="text-muted">{t("dishSubtotal")}</span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {"$" + dishSubtotal.toFixed(2)}
                      </span>
                    </p>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {t("summaryTitle")}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        {t("summaryDescription")}
                      </p>
                    </div>
                    <dl className="grid gap-3 rounded-xl bg-surface-secondary p-4 sm:grid-cols-2">
                      <SummaryItem
                        label={t("customerName")}
                        value={guestName}
                      />
                      <SummaryItem
                        label={t("date")}
                        value={formatDate(dateValue, locale)}
                      />
                      <SummaryItem
                        label={t("time")}
                        value={
                          timeValue +
                          "–" +
                          addMinutes(timeValue, reservationDurationMinutes)
                        }
                      />
                      <SummaryItem
                        label={t("partySize")}
                        value={t("guestCount", { count: partySize })}
                      />
                      <SummaryItem
                        label={t("tableLabel")}
                        value={t("tableName", { table: selectedTable })}
                      />
                      <SummaryItem
                        label={t("babyChair")}
                        value={babyChair === "yes" ? t("yes") : t("no")}
                      />
                    </dl>

                    <section aria-label={t("selectedDishesLabel")}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground">
                          {t("selectedDishesLabel")}
                        </h4>
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {"$" + dishSubtotal.toFixed(2)}
                        </span>
                      </div>
                      {selectedDishes.length > 0 ? (
                        <ul className="divide-y divide-border/70 rounded-xl border border-border px-3">
                          {selectedDishes.map((dish) => (
                            <li
                              className="flex items-center justify-between gap-3 py-2 text-sm"
                              key={dish.id}
                            >
                              <span className="min-w-0 truncate text-foreground">
                                {dish.name}{" "}
                                <span className="text-muted">
                                  × {dish.quantity}
                                </span>
                              </span>
                              <span className="shrink-0 tabular-nums text-muted">
                                {"$" +
                                  (dish.unitPrice * dish.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted">
                          {t("noDishesAdded")}
                        </p>
                      )}
                    </section>
                  </div>
                ) : null}
              </Modal.Body>
            </Form>

            <Modal.Footer>
              {step === 0 ? (
                <Button
                  fullWidth
                  slot="close"
                  onPress={resetWizard}
                  size="lg"
                  type="button"
                  variant="secondary"
                >
                  {t("cancel")}
                </Button>
              ) : (
                <Button
                  fullWidth
                  onPress={() => setStep((currentStep) => currentStep - 1)}
                  size="lg"
                  type="button"
                  variant="secondary"
                >
                  <IconArrowLeft aria-hidden="true" size={18} />
                  {t("back")}
                </Button>
              )}
              <Button
                form="add-reservation-form"
                fullWidth
                isDisabled={step === 1 && !selectedTable}
                size="lg"
                type="submit"
                variant="primary"
              >
                {step === 3 ? (
                  <>
                    <IconCheck aria-hidden="true" size={18} />
                    {t("createReservation")}
                  </>
                ) : (
                  <>
                    {t("continue")}
                    <IconArrowRight aria-hidden="true" size={18} />
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

