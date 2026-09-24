"use client";

import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import { IconCopy, IconUserCheck, IconUserOff } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import type { CustomerRecord, CustomerTier } from "./customer-data";

export type CustomerProfileAction =
  | "startOrder"
  | "editCustomer"
  | "payBack"
  | "reservation"
  | "callCustomer"
  | "messageCustomer"
  | "moreActions";

interface CustomerActionModalProps {
  action: CustomerProfileAction | null;
  customer: CustomerRecord;
  customerCode: string;
  onClose: () => void;
  onCustomerUpdate: (
    customerId: string,
    updates: Partial<CustomerRecord>,
  ) => void;
}

const actionDescriptionKeys = {
  startOrder: "actions.startOrderDescription",
  editCustomer: "actions.editDescription",
  payBack: "actions.payBackDescription",
  reservation: "actions.reservationDescription",
  callCustomer: "actions.callDescription",
  messageCustomer: "actions.messageDescription",
  moreActions: "actions.moreDescription",
} as const;

const tierOptions: ReadonlyArray<{
  id: CustomerTier;
  labelKey: "tierMember" | "tierGold" | "tierVip" | "tierBlack";
}> = [
  { id: "member", labelKey: "tierMember" },
  { id: "gold", labelKey: "tierGold" },
  { id: "vip", labelKey: "tierVip" },
  { id: "black", labelKey: "tierBlack" },
];

const genderOptions = [
  { id: "male", labelKey: "genderMale" },
  { id: "female", labelKey: "genderFemale" },
  { id: "other", labelKey: "genderOther" },
] as const;

const orderTypeOptions = [
  { id: "dine-in", labelKey: "actions.dineIn" },
  { id: "takeaway", labelKey: "actions.takeaway" },
  { id: "delivery", labelKey: "actions.delivery" },
] as const;

export function CustomerActionModal({
  action,
  customer,
  customerCode,
  onClose,
  onCustomerUpdate,
}: CustomerActionModalProps) {
  const t = useTranslations("Customer");

  if (!action) return null;

  const formId = `customer-action-${action}-form`;
  const title = t(action);
  const balance = parseMoney(customer.payLater);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (action === "editCustomer") {
      const name = String(formData.get("name") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const gender = String(formData.get("gender") ?? "other");
      const tier = String(formData.get("tier") ?? "member") as CustomerTier;

      onCustomerUpdate(customer.id, {
        email: email || "--",
        gender: gender.charAt(0).toUpperCase() + gender.slice(1),
        initials: getCustomerInitials(name),
        name,
        phone,
        tier,
      });
      toast.success(t("actions.profileUpdatedTitle"), {
        description: t("actions.profileUpdatedDescription", { name }),
      });
      onClose();
      return;
    }

    if (action === "payBack") {
      const amount = Number.parseFloat(String(formData.get("amount") ?? ""));

      if (!Number.isFinite(amount) || amount <= 0 || amount > balance) {
        toast.warning(t("actions.paymentAmountError"));
        return;
      }

      const remainingBalance = Math.max(0, balance - amount);
      const formattedBalance = formatMoney(remainingBalance);

      onCustomerUpdate(customer.id, { payLater: formattedBalance });
      toast.success(t("actions.paymentRecorded"), {
        description: t("actions.paymentRecordedDescription", {
          balance: formattedBalance,
        }),
      });
      onClose();
      return;
    }

    if (action === "startOrder") {
      toast.success(t("actions.orderDraftSaved"), {
        description: t("actions.orderDraftDescription", {
          name: customer.name,
        }),
      });
      onClose();
      return;
    }

    if (action === "reservation") {
      toast.success(t("actions.reservationDraftSaved"), {
        description: t("actions.reservationDraftDescription", {
          name: customer.name,
        }),
      });
      onClose();
      return;
    }

    if (action === "messageCustomer") {
      toast.success(t("actions.messageDraftSaved"), {
        description: t("actions.messageDraftDescription", {
          name: customer.name,
        }),
      });
      onClose();
    }
  };

  const handleCopyCustomerId = () => {
    if (!navigator.clipboard?.writeText) {
      toast.warning(t("actions.copyFailed"));
      return;
    }

    void navigator.clipboard
      .writeText(customerCode)
      .then(() => toast.success(t("actions.customerIdCopied")))
      .catch(() => toast.warning(t("actions.copyFailed")));
  };

  const isActive = customer.status !== "inactive";
  const isFormAction =
    action === "startOrder" ||
    action === "editCustomer" ||
    action === "payBack" ||
    action === "reservation" ||
    action === "messageCustomer";

  return (
    <Modal.Backdrop
      isOpen
      variant="blur"
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <Modal.Container scroll="inside" size="cover">
        <Modal.Dialog
          aria-describedby="customer-action-description"
          aria-labelledby="customer-action-title"
          className="flex min-h-0 flex-col"
        >
          <Modal.CloseTrigger />
          <Modal.Header>
            <div className="flex flex-col gap-1">
              <Modal.Heading id="customer-action-title">{title}</Modal.Heading>
              <p
                className="text-sm text-muted"
                id="customer-action-description"
              >
                {t(actionDescriptionKeys[action])}
              </p>
            </div>
          </Modal.Header>

          <Modal.Body>
            <CustomerActionContent
              action={action}
              balance={balance}
              customer={customer}
              formId={formId}
              isActive={isActive}
              onCopyCustomerId={handleCopyCustomerId}
              onCustomerUpdate={onCustomerUpdate}
              onSubmit={handleSubmit}
              t={t}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button
              className="flex-1"
              size="lg"
              type="button"
              variant="secondary"
              onPress={onClose}
            >
              {isFormAction ? t("cancel") : t("actions.done")}
            </Button>
            {action === "callCustomer" ? (
              <Button
                className="flex-1"
                size="lg"
                type="button"
                variant="primary"
                onPress={() => {
                  window.location.href = `tel:${customer.phone.replace(/[^+\d]/g, "")}`;
                }}
              >
                {t("actions.callNow")}
              </Button>
            ) : isFormAction ? (
              <Button
                className="flex-1"
                form={formId}
                isDisabled={action === "payBack" && balance <= 0}
                size="lg"
                type="submit"
                variant="primary"
              >
                {getSubmitLabel(action, t)}
              </Button>
            ) : null}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

function CustomerActionContent({
  action,
  balance,
  customer,
  formId,
  isActive,
  onCopyCustomerId,
  onCustomerUpdate,
  onSubmit,
  t,
}: {
  action: CustomerProfileAction;
  balance: number;
  customer: CustomerRecord;
  formId: string;
  isActive: boolean;
  onCopyCustomerId: () => void;
  onCustomerUpdate: (
    customerId: string,
    updates: Partial<CustomerRecord>,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  t: ReturnType<typeof useTranslations<"Customer">>;
}) {
  if (action === "startOrder") {
    return (
      <form
        className="flex flex-col gap-6"
        id={formId}
        onSubmit={onSubmit}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DetailCard label={t("tier")} value={t(getTierLabelKey(customer.tier))} />
          <DetailCard label={t("profileVisits")} value={String(customer.visits)} />
          <DetailCard label={t("profilePoints")} value={String(customer.points)} />
        </div>
        <Select
          className="w-full"
          defaultValue="dine-in"
          name="orderType"
          variant="secondary"
        >
          <Label>{t("actions.orderType")}</Label>
          <Select.Trigger className="w-full">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover placement="bottom start">
            <ListBox>
              {orderTypeOptions.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={t(option.labelKey)}
                >
                  {t(option.labelKey)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <TextField fullWidth name="orderNote">
          <Label>{t("actions.orderNote")}</Label>
          <TextArea
            fullWidth
            placeholder={t("actions.orderNotePlaceholder")}
            rows={4}
            variant="secondary"
          />
        </TextField>
      </form>
    );
  }

  if (action === "editCustomer") {
    return (
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        id={formId}
        onSubmit={onSubmit}
      >
        <TextField fullWidth isRequired name="name" defaultValue={customer.name}>
          <Label>{t("name")}</Label>
          <Input autoComplete="name" variant="secondary" />
        </TextField>
        <TextField
          fullWidth
          isRequired
          name="phone"
          defaultValue={customer.phone}
        >
          <Label>{t("phone")}</Label>
          <Input autoComplete="tel" type="tel" variant="secondary" />
        </TextField>
        <TextField
          fullWidth
          name="email"
          defaultValue={customer.email === "--" ? "" : customer.email}
        >
          <Label>{t("email")}</Label>
          <Input autoComplete="email" type="email" variant="secondary" />
        </TextField>
        <Select
          className="w-full"
          defaultValue={customer.gender?.toLowerCase() ?? "other"}
          name="gender"
          variant="secondary"
        >
          <Label>{t("gender")}</Label>
          <Select.Trigger className="w-full">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover placement="bottom start">
            <ListBox>
              {genderOptions.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={t(option.labelKey)}
                >
                  {t(option.labelKey)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <Select
          className="w-full"
          defaultValue={customer.tier}
          name="tier"
          variant="secondary"
        >
          <Label>{t("membershipTier")}</Label>
          <Select.Trigger className="w-full">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover placement="bottom start">
            <ListBox>
              {tierOptions.map((option) => (
                <ListBox.Item
                  key={option.id}
                  id={option.id}
                  textValue={t(option.labelKey)}
                >
                  {t(option.labelKey)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </form>
    );
  }

  if (action === "payBack") {
    return balance > 0 ? (
      <form
        className="flex flex-col gap-5"
        id={formId}
        onSubmit={onSubmit}
      >
        <DetailCard
          label={t("actions.outstandingBalance")}
          value={formatMoney(balance)}
        />
        <TextField
          fullWidth
          isRequired
          name="amount"
          defaultValue={balance.toFixed(2)}
        >
          <Label>{t("actions.paymentAmount")}</Label>
          <Input
            inputMode="decimal"
            max={balance}
            min="0.01"
            step="0.01"
            type="number"
            variant="secondary"
          />
        </TextField>
      </form>
    ) : (
      <div className="rounded-2xl border border-border/60 bg-surface-secondary/50 p-5">
        <p className="text-base font-semibold text-foreground">
          {t("actions.noBalanceTitle")}
        </p>
        <p className="mt-1 text-sm text-muted">
          {t("actions.noBalanceDescription")}
        </p>
      </div>
    );
  }

  if (action === "reservation") {
    return (
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        id={formId}
        onSubmit={onSubmit}
      >
        <TextField fullWidth isRequired name="date">
          <Label>{t("actions.reservationDate")}</Label>
          <Input type="date" variant="secondary" />
        </TextField>
        <TextField fullWidth isRequired name="time">
          <Label>{t("actions.reservationTime")}</Label>
          <Input defaultValue="19:00" type="time" variant="secondary" />
        </TextField>
        <TextField fullWidth isRequired name="partySize">
          <Label>{t("actions.partySize")}</Label>
          <Input defaultValue="2" min="1" step="1" type="number" variant="secondary" />
        </TextField>
        <Select className="w-full" defaultValue="any" name="tablePreference" variant="secondary">
          <Label>{t("actions.tablePreference")}</Label>
          <Select.Trigger className="w-full">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover placement="bottom start">
            <ListBox>
              <ListBox.Item id="any" textValue={t("actions.anyTable")}>
                {t("actions.anyTable")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="window" textValue={t("actions.window") }>
                {t("actions.window")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </form>
    );
  }

  if (action === "callCustomer") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailCard label={t("name")} value={customer.name} />
        <DetailCard label={t("phone")} value={customer.phone} />
        <DetailCard label={t("email")} value={customer.email} />
        <DetailCard label={t("actions.accountStatus")} value={t(isActive ? "statusActive" : "statusInactive")} />
      </div>
    );
  }

  if (action === "messageCustomer") {
    return (
      <form
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        id={formId}
        onSubmit={onSubmit}
      >
        <DetailCard label={t("name")} value={customer.name} />
        <DetailCard label={t("phone")} value={customer.phone} />
        <TextField className="sm:col-span-2" fullWidth isRequired name="message">
          <Label>{t("actions.messageText")}</Label>
          <TextArea
            fullWidth
            minLength={2}
            placeholder={t("actions.messagePlaceholder")}
            rows={7}
            variant="secondary"
          />
        </TextField>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DetailCard label={t("profileVisits")} value={String(customer.visits)} />
        <DetailCard label={t("profilePoints")} value={String(customer.points)} />
        <DetailCard label={t("profileSpend")} value={customer.lifetimeSpend} />
      </div>
      <div className="rounded-2xl border border-border/60 bg-surface-secondary/50 p-4">
        <p className="text-xs font-medium text-muted">{t("profileFavorite")}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {customer.favorite}
        </p>
        <p className="mt-3 text-xs font-medium text-muted">{t("memberSince")}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          {customer.memberSince}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          fullWidth
          size="lg"
          type="button"
          variant="secondary"
          onPress={onCopyCustomerId}
        >
          <IconCopy aria-hidden="true" size={18} />
          {t("actions.copyCustomerId")}
        </Button>
        <Button
          fullWidth
          size="lg"
          type="button"
          variant={isActive ? "danger" : "secondary"}
          onPress={() => {
            const nextStatus = isActive ? "inactive" : "active";

            onCustomerUpdate(customer.id, { status: nextStatus });
            toast.success(
              t(isActive ? "actions.deactivatedTitle" : "actions.activatedTitle"),
              {
                description: t("actions.statusUpdateDescription"),
              },
            );
          }}
        >
          {isActive ? (
            <IconUserOff aria-hidden="true" size={18} />
          ) : (
            <IconUserCheck aria-hidden="true" size={18} />
          )}
          {t(isActive ? "actions.deactivateCustomer" : "actions.activateCustomer")}
        </Button>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border/60 bg-surface-secondary/50 p-4">
      <p className="truncate text-xs text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function getSubmitLabel(
  action: CustomerProfileAction,
  t: ReturnType<typeof useTranslations<"Customer">>,
) {
  switch (action) {
    case "startOrder":
      return t("actions.startDraftOrder");
    case "editCustomer":
      return t("actions.saveChanges");
    case "payBack":
      return t("actions.recordPayment");
    case "reservation":
      return t("actions.saveReservationDraft");
    case "messageCustomer":
      return t("actions.saveMessageDraft");
    default:
      return t("actions.done");
  }
}

function getTierLabelKey(tier: CustomerTier) {
  switch (tier) {
    case "vip":
      return "tierVip";
    case "gold":
      return "tierGold";
    case "black":
      return "tierBlack";
    case "member":
      return "tierMember";
  }
}

function getCustomerInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CU"
  );
}

function parseMoney(value?: string) {
  const amount = Number.parseFloat((value ?? "").replace(/[^\d.-]/g, ""));

  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}
