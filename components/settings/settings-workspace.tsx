"use client";

import {
  Button,
  Card,
  Chip,
  Input,
  Label,
  ListBox,
  SearchField,
  Select,
  Surface,
  Switch,
  Tabs,
  TextField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  ArchiveBox,
  Barcode,
  Box,
  Building,
  CardPos,
  DeviceMessage,
  DollarCircle,
  Global,
  Lock,
  Monitor,
  Monitor3,
  Printer,
  Profile,
  Profile2user,
  Receipt2,
  Router,
  Setting2,
  Shop,
  TickCircle,
} from "reicon-react";

type SettingsCategory =
  | "company"
  | "userManagement"
  | "menuProducts"
  | "inventory"
  | "customer"
  | "reports"
  | "integrations";
type SettingsTileId =
  | "company"
  | "store"
  | "stations"
  | "currency"
  | "staff"
  | "menu"
  | "products"
  | "inventory"
  | "customer"
  | "reports"
  | "integrations";
type Currency = "usd" | "khr";
type Timezone = "phnomPenh" | "bangkok";

const settingsCategories: ReadonlyArray<{
  id: SettingsCategory;
  labelKey: string;
}> = [
  {
    id: "company",
    labelKey: "categoryCompany",
  },
  {
    id: "userManagement",
    labelKey: "categoryUserManagement",
  },
  {
    id: "menuProducts",
    labelKey: "categoryMenuProducts",
  },
  {
    id: "inventory",
    labelKey: "categoryInventory",
  },
  {
    id: "customer",
    labelKey: "categoryCustomer",
  },
  {
    id: "reports",
    labelKey: "categoryReports",
  },
  {
    id: "integrations",
    labelKey: "categoryIntegrations",
  },
];

const settingsTiles: ReadonlyArray<{
  id: SettingsTileId;
  category: SettingsCategory;
  icon: IconComponent;
  labelKey: string;
  descriptionKey: string;
}> = [
  {
    id: "company",
    category: "company",
    icon: Building,
    labelKey: "tileCompany",
    descriptionKey: "tileCompanyDescription",
  },
  {
    id: "store",
    category: "company",
    icon: Shop,
    labelKey: "tileStore",
    descriptionKey: "tileStoreDescription",
  },
  {
    id: "stations",
    category: "company",
    icon: DeviceMessage,
    labelKey: "tileStations",
    descriptionKey: "tileStationsDescription",
  },
  {
    id: "currency",
    category: "company",
    icon: DollarCircle,
    labelKey: "tileCurrency",
    descriptionKey: "tileCurrencyDescription",
  },
  {
    id: "staff",
    category: "userManagement",
    icon: Profile2user,
    labelKey: "tileStaff",
    descriptionKey: "tileStaffDescription",
  },
  {
    id: "menu",
    category: "menuProducts",
    icon: Receipt2,
    labelKey: "tileMenu",
    descriptionKey: "tileMenuDescription",
  },
  {
    id: "products",
    category: "menuProducts",
    icon: Box,
    labelKey: "tileProducts",
    descriptionKey: "tileProductsDescription",
  },
  {
    id: "inventory",
    category: "inventory",
    icon: ArchiveBox,
    labelKey: "tileInventory",
    descriptionKey: "tileInventoryDescription",
  },
  {
    id: "customer",
    category: "customer",
    icon: Profile,
    labelKey: "tileCustomer",
    descriptionKey: "tileCustomerDescription",
  },
  {
    id: "reports",
    category: "reports",
    icon: Receipt2,
    labelKey: "tileReports",
    descriptionKey: "tileReportsDescription",
  },
  {
    id: "integrations",
    category: "integrations",
    icon: Global,
    labelKey: "tileIntegrations",
    descriptionKey: "tileIntegrationsDescription",
  },
];

export function SettingsWorkspace() {
  const t = useTranslations("SalesMenu");
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategory>("company");
  const [selectedTile, setSelectedTile] = useState<SettingsTileId | null>(null);
  const [settingsSearch, setSettingsSearch] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [storeName, setStoreName] = useState("RakPOS Café");
  const [storePhone, setStorePhone] = useState("+855 12 345 678");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [timezone, setTimezone] = useState<Timezone>("phnomPenh");
  const [autoLock, setAutoLock] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
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

  const visibleTiles = settingsTiles.filter((tile) => {
    if (tile.category !== activeCategory) {
      return false;
    }

    const search = settingsSearch.trim().toLocaleLowerCase();

    if (!search) {
      return true;
    }

    return `${t(`pages.settings.${tile.labelKey}`)} ${t(
      `pages.settings.${tile.descriptionKey}`,
    )}`
      .toLocaleLowerCase()
      .includes(search);
  });

  const selectedTileData = settingsTiles.find(
    (tile) => tile.id === selectedTile,
  );

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden text-foreground">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(20rem,var(--app-layout-aside-width))]">
        <section className="min-h-0 overflow-y-auto border-e border-border/60 bg-background">
          <div className="flex min-w-0 flex-col">
            <Tabs
              className="min-w-0"
              selectedKey={activeCategory}
              variant="secondary"
              onSelectionChange={(key) => {
                setActiveCategory(String(key) as SettingsCategory);
                setSelectedTile(null);
              }}
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label={t("pages.settings.categoryLabel")}>
                  {settingsCategories.map((category) => {
                    return (
                      <Tabs.Tab
                        key={category.id}
                        id={category.id}
                        className="w-auto shrink-0 whitespace-nowrap"
                      >
                        <span>{t(`pages.settings.${category.labelKey}`)}</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    );
                  })}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>

            <div className="flex min-w-0 flex-col gap-4 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)] pt-3">
              <SearchField
                aria-label={t("pages.settings.searchLabel")}
                className="w-full"
                fullWidth
                value={settingsSearch}
                variant="secondary"
                onChange={setSettingsSearch}
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input
                    placeholder={t("pages.settings.searchPlaceholder")}
                  />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>

              {visibleTiles.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {visibleTiles.map((tile) => {
                    const Icon = tile.icon;
                    const isSelected = selectedTile === tile.id;

                    return (
                      <Card
                        key={tile.id}
                        aria-pressed={isSelected}
                        role="button"
                        tabIndex={0}
                        variant={isSelected ? "default" : "secondary"}
                        onClick={() => setSelectedTile(tile.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedTile(tile.id);
                          }
                        }}
                      >
                        <Card.Content>
                          <span className="flex min-h-32 flex-col items-center justify-center gap-3 text-center">
                            <Icon
                              aria-hidden="true"
                              className="size-8"
                              size={32}
                            />
                            <span className="font-semibold">
                              {t(`pages.settings.${tile.labelKey}`)}
                            </span>
                          </span>
                        </Card.Content>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Surface className="p-4 text-sm text-muted" variant="secondary">
                  {t("pages.settings.noResults")}
                </Surface>
              )}
            </div>
          </div>
        </section>

        <section className="flex h-full min-h-0 flex-col bg-background">
          <header className="flex shrink-0 items-center gap-2 p-[var(--pos-content-padding)]">
            <h2 className="text-base font-semibold text-foreground sm:text-lg">
              {selectedTileData
                ? t(`pages.settings.${selectedTileData.labelKey}`)
                : t("pages.settings.panelTitle")}
            </h2>
            {selectedTile ? (
              <div className="ms-auto flex shrink-0 items-center">
                <Chip color="success" size="sm" variant="soft">
                  <TickCircle aria-hidden="true" size={15} />
                  {isSaved
                    ? t("pages.settings.saved")
                    : t("pages.settings.registerReady")}
                </Chip>
              </div>
            ) : null}
          </header>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)]">
            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedTile === "company" || selectedTile === "store" ? (
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
              {selectedTile === "currency" ? (
                <CurrencySettings
                  currency={currency}
                  onCurrencyChange={updateCurrency}
                />
              ) : null}
              {selectedTile === "stations" ? <DeviceSettings /> : null}
              {selectedTile === "staff" ? (
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
              {selectedTileData &&
              selectedTile !== "company" &&
              selectedTile !== "store" &&
              selectedTile !== "currency" &&
              selectedTile !== "stations" &&
              selectedTile !== "staff" ? (
                <SettingsPlaceholder />
              ) : null}
              {!selectedTile ? (
                <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-default text-muted">
                    <Setting2 aria-hidden="true" size={40} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {t("pages.settings.emptyTitle")}
                  </h3>
                </div>
              ) : null}
            </div>

            {selectedTile ? (
              <div className="flex shrink-0 justify-end pt-3">
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
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

function CurrencySettings({
  currency,
  onCurrencyChange,
}: {
  currency: Currency;
  onCurrencyChange: (value: Currency) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsSelect
        label={t("pages.settings.currency")}
        options={[
          { id: "usd", label: t("pages.settings.currencyUsd") },
          { id: "khr", label: t("pages.settings.currencyKhr") },
        ]}
        value={currency}
        onChange={(value) => onCurrencyChange(value as Currency)}
      />
    </SettingsSection>
  );
}

function SettingsPlaceholder() {
  return (
    <SettingsSection>
      <Surface
        className="flex min-h-40 items-center justify-center p-6"
        variant="secondary"
      >
        <Setting2 aria-hidden="true" className="text-muted" size={28} />
      </Surface>
    </SettingsSection>
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
    <SettingsSection>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField fullWidth value={storeName} onChange={onStoreNameChange}>
          <Label>{t("pages.settings.storeName")}</Label>
          <Input
            placeholder={t("pages.settings.storeNamePlaceholder")}
            variant="secondary"
          />
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
          isSelected={autoLock}
          label={t("pages.settings.autoLock")}
          onChange={onAutoLockChange}
        />
        <SettingsToggle
          isSelected={soundFeedback}
          label={t("pages.settings.soundFeedback")}
          onChange={onSoundFeedbackChange}
        />
      </div>
    </SettingsSection>
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
    <SettingsSection>
      <div className="grid gap-3 md:grid-cols-2">
        <SettingsToggle
          isSelected={requirePin}
          label={t("pages.settings.requirePin")}
          onChange={onRequirePinChange}
        />
        <SettingsToggle
          isSelected={managerApproval}
          label={t("pages.settings.managerApproval")}
          onChange={onManagerApprovalChange}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <RoleCard label={t("pages.settings.cashierRole")} value="4" />
        <RoleCard label={t("pages.settings.managerRole")} value="2" />
        <RoleCard label={t("pages.settings.ownerRole")} value="1" />
      </div>
    </SettingsSection>
  );
}

function DeviceSettings() {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <div className="grid gap-3">
        <DeviceRow
          icon={Printer}
          label={t("pages.settings.receiptPrinter")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={Monitor}
          label={t("pages.settings.customerDisplay")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={DeviceMessage}
          label={t("pages.settings.cashDrawer")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={Monitor3}
          label={t("pages.settings.kitchenDisplay")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={Barcode}
          label={t("pages.settings.barcodeScanner")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={CardPos}
          label={t("pages.settings.paymentTerminal")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={Printer}
          label={t("pages.settings.kitchenPrinter")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={Printer}
          label={t("pages.settings.labelPrinter")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={Router}
          label={t("pages.settings.storeNetwork")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-surface-secondary/65 p-4 text-sm">
        <Global
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-accent"
          size={18}
        />
        <p className="font-semibold text-foreground">
          {t("pages.settings.deviceSyncTitle")}
        </p>
      </div>
    </SettingsSection>
  );
}

function SettingsSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex w-full flex-col">
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

function SettingsToggle({
  isSelected,
  label,
  onChange,
}: {
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
      <Select.Trigger className="w-full justify-start text-start">
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom start">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              key={option.id}
              id={option.id}
              textValue={option.label}
            >
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

function RoleCard({ label, value }: { label: string; value: string }) {
  return (
    <Surface
      className="flex items-center justify-between gap-3 p-4"
      variant="secondary"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <Lock aria-hidden="true" size={19} />
        </div>
        <p className="font-semibold text-foreground">{label}</p>
      </div>
      <span className="text-xl font-bold tabular-nums text-foreground">
        {value}
      </span>
    </Surface>
  );
}

function DeviceRow({
  icon: Icon,
  label,
  status,
  statusColor,
}: {
  icon: IconComponent;
  label: string;
  status: string;
  statusColor: "success" | "default";
}) {
  return (
    <Surface
      className="flex min-h-20 items-center justify-between gap-4 p-4"
      variant="secondary"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <Icon aria-hidden="true" size={20} />
        </div>
        <p className="font-semibold text-foreground">{label}</p>
      </div>
      <Chip color={statusColor} size="sm" variant="soft">
        {status}
      </Chip>
    </Surface>
  );
}
