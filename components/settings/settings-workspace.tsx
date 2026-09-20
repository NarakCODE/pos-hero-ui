"use client";

import {
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  Surface,
  Switch,
  Tabs,
  TextArea,
  TextField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  Card as CardIcon,
  DeviceMessage,
  Global,
  Lock,
  Mobile,
  Monitor,
  Printer,
  Profile,
  Receipt2,
  Setting2,
  Shop,
  TickCircle,
  Wallet,
  Wifi,
} from "reicon-react";

type SettingsSection = "general" | "receipt" | "payments" | "staff" | "devices";
type Currency = "usd" | "khr";
type Timezone = "phnomPenh" | "bangkok";

const settingsSections: ReadonlyArray<{
  id: SettingsSection;
  icon: IconComponent;
  labelKey: string;
  descriptionKey: string;
}> = [
  {
    id: "general",
    icon: Setting2,
    labelKey: "sectionGeneral",
    descriptionKey: "sectionGeneralDescription",
  },
  {
    id: "receipt",
    icon: Receipt2,
    labelKey: "sectionReceipt",
    descriptionKey: "sectionReceiptDescription",
  },
  {
    id: "payments",
    icon: Wallet,
    labelKey: "sectionPayments",
    descriptionKey: "sectionPaymentsDescription",
  },
  {
    id: "staff",
    icon: Profile,
    labelKey: "sectionStaff",
    descriptionKey: "sectionStaffDescription",
  },
  {
    id: "devices",
    icon: DeviceMessage,
    labelKey: "sectionDevices",
    descriptionKey: "sectionDevicesDescription",
  },
];

export function SettingsWorkspace() {
  const t = useTranslations("SalesMenu");
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("general");
  const [isSaved, setIsSaved] = useState(false);
  const [storeName, setStoreName] = useState("RakPOS Café");
  const [storePhone, setStorePhone] = useState("+855 12 345 678");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [timezone, setTimezone] = useState<Timezone>("phnomPenh");
  const [autoLock, setAutoLock] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [printAfterPayment, setPrintAfterPayment] = useState(true);
  const [customerCopy, setCustomerCopy] = useState(false);
  const [receiptFooter, setReceiptFooter] = useState(
    "Thank you for visiting RakPOS Café.",
  );
  const [cashEnabled, setCashEnabled] = useState(true);
  const [khqrEnabled, setKhqrEnabled] = useState(true);
  const [bankCardEnabled, setBankCardEnabled] = useState(true);
  const [requirePin, setRequirePin] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);

  const markChanged = () => setIsSaved(false);
  const updateStoreName = (value: string) => {
    setStoreName(value);
    markChanged();
  };
  const updateStorePhone = (value: string) => {
    setStorePhone(value);
    markChanged();
  };
  const updateCurrency = (value: Currency) => {
    setCurrency(value);
    markChanged();
  };
  const updateTimezone = (value: Timezone) => {
    setTimezone(value);
    markChanged();
  };
  const updateReceiptFooter = (value: string) => {
    setReceiptFooter(value);
    markChanged();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)] text-foreground">
      <header className="flex shrink-0 flex-col gap-4 rounded-2xl bg-surface-secondary/60 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {t("pages.settings.eyebrow")}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("pages.settings.title")}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted">
            {t("pages.settings.description")}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Chip color="success" size="lg" variant="soft">
            <TickCircle aria-hidden="true" size={16} />
            {isSaved
              ? t("pages.settings.saved")
              : t("pages.settings.registerReady")}
          </Chip>
          <Button
            isDisabled={isSaved}
            size="lg"
            type="button"
            variant="primary"
            onPress={() => setIsSaved(true)}
          >
            {t("pages.settings.saveChanges")}
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="min-w-0 md:hidden">
          <SettingsNavigation
            activeSection={activeSection}
            orientation="horizontal"
            onSelectionChange={setActiveSection}
          />
        </div>

        <aside className="hidden min-w-0 self-start md:sticky md:top-0 md:block">
          <Surface className="p-2" variant="secondary">
            <SettingsNavigation
              activeSection={activeSection}
              orientation="vertical"
              onSelectionChange={setActiveSection}
            />
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent/5 p-3 text-xs leading-5 text-muted">
              <Mobile aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={16} />
              <p>{t("pages.settings.touchHint")}</p>
            </div>
          </Surface>
        </aside>

        <main className="min-w-0">
          {activeSection === "general" ? (
            <GeneralSettings
              autoLock={autoLock}
              currency={currency}
              onAutoLockChange={(value) => {
                setAutoLock(value);
                markChanged();
              }}
              onCurrencyChange={updateCurrency}
              onSoundFeedbackChange={(value) => {
                setSoundFeedback(value);
                markChanged();
              }}
              onStoreNameChange={updateStoreName}
              onStorePhoneChange={updateStorePhone}
              onTimezoneChange={updateTimezone}
              soundFeedback={soundFeedback}
              storeName={storeName}
              storePhone={storePhone}
              timezone={timezone}
            />
          ) : null}
          {activeSection === "receipt" ? (
            <ReceiptSettings
              customerCopy={customerCopy}
              onCustomerCopyChange={(value) => {
                setCustomerCopy(value);
                markChanged();
              }}
              onPrintAfterPaymentChange={(value) => {
                setPrintAfterPayment(value);
                markChanged();
              }}
              onReceiptFooterChange={updateReceiptFooter}
              onSave={setIsSaved}
              printAfterPayment={printAfterPayment}
              receiptFooter={receiptFooter}
            />
          ) : null}
          {activeSection === "payments" ? (
            <PaymentSettings
              bankCardEnabled={bankCardEnabled}
              cashEnabled={cashEnabled}
              khqrEnabled={khqrEnabled}
              onBankCardChange={(value) => {
                setBankCardEnabled(value);
                markChanged();
              }}
              onCashChange={(value) => {
                setCashEnabled(value);
                markChanged();
              }}
              onKhqrChange={(value) => {
                setKhqrEnabled(value);
                markChanged();
              }}
            />
          ) : null}
          {activeSection === "staff" ? (
            <StaffSettings
              managerApproval={managerApproval}
              onManagerApprovalChange={(value) => {
                setManagerApproval(value);
                markChanged();
              }}
              onRequirePinChange={(value) => {
                setRequirePin(value);
                markChanged();
              }}
              requirePin={requirePin}
            />
          ) : null}
          {activeSection === "devices" ? <DeviceSettings /> : null}
        </main>
      </div>
    </div>
  );
}

function SettingsNavigation({
  activeSection,
  onSelectionChange,
  orientation,
}: {
  activeSection: SettingsSection;
  onSelectionChange: (section: SettingsSection) => void;
  orientation: "horizontal" | "vertical";
}) {
  const t = useTranslations("SalesMenu");

  return (
    <Tabs
      align="start"
      className={orientation === "vertical" ? "w-full" : "min-w-max"}
      orientation={orientation}
      selectedKey={activeSection}
      variant="secondary"
      onSelectionChange={(key) =>
        onSelectionChange(String(key) as SettingsSection)
      }
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={t("pages.settings.sectionLabel")}>
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <Tabs.Tab
                key={section.id}
                id={section.id}
                className={
                  orientation === "vertical"
                    ? "w-full justify-start whitespace-nowrap"
                    : "shrink-0 whitespace-nowrap"
                }
              >
                <Icon aria-hidden="true" size={18} />
                <span>{t(`pages.settings.${section.labelKey}`)}</span>
                <Tabs.Indicator />
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}

function GeneralSettings({
  autoLock,
  currency,
  onAutoLockChange,
  onCurrencyChange,
  onSoundFeedbackChange,
  onStoreNameChange,
  onStorePhoneChange,
  onTimezoneChange,
  soundFeedback,
  storeName,
  storePhone,
  timezone,
}: {
  autoLock: boolean;
  currency: Currency;
  onAutoLockChange: (value: boolean) => void;
  onCurrencyChange: (value: Currency) => void;
  onSoundFeedbackChange: (value: boolean) => void;
  onStoreNameChange: (value: string) => void;
  onStorePhoneChange: (value: string) => void;
  onTimezoneChange: (value: Timezone) => void;
  soundFeedback: boolean;
  storeName: string;
  storePhone: string;
  timezone: Timezone;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsCard
      description={t("pages.settings.generalDescription")}
      title={t("pages.settings.generalTitle")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField fullWidth value={storeName} onChange={onStoreNameChange}>
          <Label>{t("pages.settings.storeName")}</Label>
          <Input
            placeholder={t("pages.settings.storeNamePlaceholder")}
            variant="secondary"
          />
          <Description>{t("pages.settings.storeNameDescription")}</Description>
        </TextField>
        <TextField fullWidth value={storePhone} onChange={onStorePhoneChange}>
          <Label>{t("pages.settings.storePhone")}</Label>
          <Input
            placeholder={t("pages.settings.storePhonePlaceholder")}
            variant="secondary"
          />
        </TextField>
        <SettingsSelect
          label={t("pages.settings.currency")}
          options={[
            { id: "usd", label: t("pages.settings.currencyUsd") },
            { id: "khr", label: t("pages.settings.currencyKhr") },
          ]}
          value={currency}
          onChange={(value) => onCurrencyChange(value as Currency)}
        />
        <SettingsSelect
          label={t("pages.settings.timezone")}
          options={[
            { id: "phnomPenh", label: t("pages.settings.timezonePhnomPenh") },
            { id: "bangkok", label: t("pages.settings.timezoneBangkok") },
          ]}
          value={timezone}
          onChange={(value) => onTimezoneChange(value as Timezone)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SettingsToggle
          description={t("pages.settings.autoLockDescription")}
          isSelected={autoLock}
          label={t("pages.settings.autoLock")}
          onChange={onAutoLockChange}
        />
        <SettingsToggle
          description={t("pages.settings.soundFeedbackDescription")}
          isSelected={soundFeedback}
          label={t("pages.settings.soundFeedback")}
          onChange={onSoundFeedbackChange}
        />
      </div>
    </SettingsCard>
  );
}

function ReceiptSettings({
  customerCopy,
  onCustomerCopyChange,
  onPrintAfterPaymentChange,
  onReceiptFooterChange,
  onSave,
  printAfterPayment,
  receiptFooter,
}: {
  customerCopy: boolean;
  onCustomerCopyChange: (value: boolean) => void;
  onPrintAfterPaymentChange: (value: boolean) => void;
  onReceiptFooterChange: (value: string) => void;
  onSave: (value: boolean) => void;
  printAfterPayment: boolean;
  receiptFooter: string;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsCard
      description={t("pages.settings.receiptDescription")}
      title={t("pages.settings.receiptTitle")}
      footer={
        <Button
          size="lg"
          type="button"
          variant="secondary"
          onPress={() => onSave(true)}
        >
          <Printer aria-hidden="true" size={18} />
          {t("pages.settings.testPrint")}
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsSelect
          label={t("pages.settings.receiptPrinter")}
          options={[
            { id: "frontCounter", label: t("pages.settings.frontCounterPrinter") },
            { id: "notConnected", label: t("pages.settings.notConnected") },
          ]}
          value="frontCounter"
          onChange={() => undefined}
        />
        <div className="flex items-end rounded-xl bg-success/10 p-3 text-sm text-success">
          <div className="flex items-center gap-2">
            <Wifi aria-hidden="true" size={17} />
            <span>{t("pages.settings.printerConnected")}</span>
          </div>
        </div>
      </div>

      <TextField fullWidth>
        <Label>{t("pages.settings.receiptFooter")}</Label>
        <TextArea
          value={receiptFooter}
          placeholder={t("pages.settings.receiptFooterPlaceholder")}
          variant="secondary"
          onChange={(event) => onReceiptFooterChange(event.target.value)}
        />
        <Description>{t("pages.settings.receiptFooterDescription")}</Description>
      </TextField>

      <div className="grid gap-3 md:grid-cols-2">
        <SettingsToggle
          description={t("pages.settings.printAfterPaymentDescription")}
          isSelected={printAfterPayment}
          label={t("pages.settings.printAfterPayment")}
          onChange={onPrintAfterPaymentChange}
        />
        <SettingsToggle
          description={t("pages.settings.customerCopyDescription")}
          isSelected={customerCopy}
          label={t("pages.settings.customerCopy")}
          onChange={onCustomerCopyChange}
        />
      </div>
    </SettingsCard>
  );
}

function PaymentSettings({
  bankCardEnabled,
  cashEnabled,
  khqrEnabled,
  onBankCardChange,
  onCashChange,
  onKhqrChange,
}: {
  bankCardEnabled: boolean;
  cashEnabled: boolean;
  khqrEnabled: boolean;
  onBankCardChange: (value: boolean) => void;
  onCashChange: (value: boolean) => void;
  onKhqrChange: (value: boolean) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsCard
      description={t("pages.settings.paymentsDescription")}
      title={t("pages.settings.paymentsTitle")}
      footer={
        <Button size="lg" type="button" variant="secondary">
          <Wallet aria-hidden="true" size={18} />
          {t("pages.settings.addPaymentMethod")}
        </Button>
      }
    >
      <div className="grid gap-3">
        <PaymentMethodRow
          description={t("pages.settings.cashDescription")}
          icon={Wallet}
          isSelected={cashEnabled}
          label={t("pages.settings.cash")}
          status={t("pages.settings.connected")}
          onChange={onCashChange}
        />
        <PaymentMethodRow
          description={t("pages.settings.khqrDescription")}
          icon={Shop}
          isSelected={khqrEnabled}
          label={t("pages.settings.khqr")}
          status={t("pages.settings.connected")}
          onChange={onKhqrChange}
        />
        <PaymentMethodRow
          description={t("pages.settings.bankCardDescription")}
          icon={CardIcon}
          isSelected={bankCardEnabled}
          label={t("pages.settings.bankCard")}
          status={t("pages.settings.needsSetup")}
          onChange={onBankCardChange}
        />
      </div>
    </SettingsCard>
  );
}

function StaffSettings({
  managerApproval,
  onManagerApprovalChange,
  onRequirePinChange,
  requirePin,
}: {
  managerApproval: boolean;
  onManagerApprovalChange: (value: boolean) => void;
  onRequirePinChange: (value: boolean) => void;
  requirePin: boolean;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsCard
      description={t("pages.settings.staffDescription")}
      title={t("pages.settings.staffTitle")}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <SettingsToggle
          description={t("pages.settings.requirePinDescription")}
          isSelected={requirePin}
          label={t("pages.settings.requirePin")}
          onChange={onRequirePinChange}
        />
        <SettingsToggle
          description={t("pages.settings.managerApprovalDescription")}
          isSelected={managerApproval}
          label={t("pages.settings.managerApproval")}
          onChange={onManagerApprovalChange}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <RoleCard
          description={t("pages.settings.cashierRoleDescription")}
          label={t("pages.settings.cashierRole")}
          value="4"
        />
        <RoleCard
          description={t("pages.settings.managerRoleDescription")}
          label={t("pages.settings.managerRole")}
          value="2"
        />
        <RoleCard
          description={t("pages.settings.ownerRoleDescription")}
          label={t("pages.settings.ownerRole")}
          value="1"
        />
      </div>
    </SettingsCard>
  );
}

function DeviceSettings() {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsCard
      description={t("pages.settings.devicesDescription")}
      title={t("pages.settings.devicesTitle")}
    >
      <div className="grid gap-3">
        <DeviceRow
          icon={Printer}
          label={t("pages.settings.receiptPrinter")}
          detail={t("pages.settings.frontCounterPrinter")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={Monitor}
          label={t("pages.settings.customerDisplay")}
          detail={t("pages.settings.customerDisplayDetail")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={DeviceMessage}
          label={t("pages.settings.cashDrawer")}
          detail={t("pages.settings.cashDrawerDetail")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-surface-secondary/65 p-4 text-sm">
        <Global aria-hidden="true" className="mt-0.5 shrink-0 text-accent" size={18} />
        <div>
          <p className="font-semibold text-foreground">
            {t("pages.settings.deviceSyncTitle")}
          </p>
          <p className="mt-1 leading-5 text-muted">
            {t("pages.settings.deviceSyncDescription")}
          </p>
        </div>
      </div>
    </SettingsCard>
  );
}

function SettingsCard({
  children,
  description,
  footer,
  title,
}: {
  children: React.ReactNode;
  description: string;
  footer?: React.ReactNode;
  title: string;
}) {
  return (
    <Card className="w-full" variant="default">
      <Card.Header className="gap-1 p-4 pb-0 sm:p-5 sm:pb-0">
        <Card.Title>{title}</Card.Title>
        <Card.Description>{description}</Card.Description>
      </Card.Header>
      <Card.Content className="grid gap-5 p-4 sm:p-5">{children}</Card.Content>
      {footer ? (
        <Card.Footer className="flex flex-wrap justify-end gap-2 p-4 pt-0 sm:p-5 sm:pt-0">
          {footer}
        </Card.Footer>
      ) : null}
    </Card>
  );
}

function SettingsToggle({
  description,
  isSelected,
  label,
  onChange,
}: {
  description: string;
  isSelected: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <Surface className="p-3.5 sm:p-4" variant="secondary">
      <Switch isSelected={isSelected} size="lg" onChange={onChange}>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Label>{label}</Label>
        </Switch.Content>
        <Description>{description}</Description>
      </Switch>
    </Surface>
  );
}

function SettingsSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ id: string; label: string }>;
  value: string;
}) {
  return (
    <Select
      className="w-full"
      value={value}
      variant="secondary"
      onChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onChange(nextValue);
        }
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger className="min-h-12 w-full justify-start text-start">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom start">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function PaymentMethodRow({
  description,
  icon: Icon,
  isSelected,
  label,
  onChange,
  status,
}: {
  description: string;
  icon: IconComponent;
  isSelected: boolean;
  label: string;
  onChange: (value: boolean) => void;
  status: string;
}) {
  return (
    <Surface className="flex items-center justify-between gap-4 p-4" variant="secondary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-foreground">{label}</p>
            <Chip
              color={isSelected ? "success" : "default"}
              size="sm"
              variant="soft"
            >
              {status}
            </Chip>
          </div>
          <p className="mt-0.5 text-sm leading-5 text-muted">{description}</p>
        </div>
      </div>
      <Switch
        aria-label={label}
        isSelected={isSelected}
        size="lg"
        onChange={onChange}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
    </Surface>
  );
}

function RoleCard({
  description,
  label,
  value,
}: {
  description: string;
  label: string;
  value: string;
}) {
  return (
    <Surface className="flex items-center justify-between gap-3 p-4" variant="secondary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <Lock aria-hidden="true" size={19} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        </div>
      </div>
      <span className="text-xl font-bold tabular-nums text-foreground">{value}</span>
    </Surface>
  );
}

function DeviceRow({
  detail,
  icon: Icon,
  label,
  status,
  statusColor,
}: {
  detail: string;
  icon: IconComponent;
  label: string;
  status: string;
  statusColor: "success" | "default";
}) {
  return (
    <Surface className="flex min-h-20 items-center justify-between gap-4 p-4" variant="secondary">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <Icon aria-hidden="true" size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{label}</p>
          <p className="truncate text-sm text-muted">{detail}</p>
        </div>
      </div>
      <Chip color={statusColor} size="sm" variant="soft">
        {status}
      </Chip>
    </Surface>
  );
}
