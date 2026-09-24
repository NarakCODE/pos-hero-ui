"use client";

import {
  AlertDialog,
  Button,
  Card,
  Chip,
  Description,
  Input,
  Label,
  ListBox,
  SearchField,
  Select,
  Surface,
  Spinner,
  Switch,
  TextField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";
import { CreatePinModal } from "./create-pin-modal";
import {
  IconBell,
  IconBarcode,
  IconCreditCard,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconDevices,
  IconLock,
  IconPhoto,
  IconPrinter,
  IconRefresh,
  IconRouter,
  IconSettings,
  IconShieldLock,
  IconTruck,
  IconWorld,
  type TablerIcon,
} from "@tabler/icons-react";

type SettingsSectionId =
  | "general"
  | "notifications"
  | "privacySecurity"
  | "payment"
  | "shipping"
  | "mediaFiles"
  | "languages"
  | "system"
  | "reset";
type Currency = "usd" | "khr";
type Timezone = "phnomPenh" | "bangkok";
type Language = "en" | "km";

const settingsMenu: ReadonlyArray<{
  id: SettingsSectionId;
  icon: TablerIcon;
  labelKey: string;
}> = [
  {
    id: "general",
    icon: IconSettings,
    labelKey: "menuGeneral",
  },
  {
    id: "notifications",
    icon: IconBell,
    labelKey: "menuNotifications",
  },
  {
    id: "privacySecurity",
    icon: IconShieldLock,
    labelKey: "menuPrivacySecurity",
  },
  {
    id: "payment",
    icon: IconCreditCard,
    labelKey: "menuPayment",
  },
  {
    id: "shipping",
    icon: IconTruck,
    labelKey: "menuShipping",
  },
  {
    id: "mediaFiles",
    icon: IconPhoto,
    labelKey: "menuMediaFiles",
  },
  {
    id: "languages",
    icon: IconWorld,
    labelKey: "menuLanguages",
  },
  {
    id: "system",
    icon: IconDevices,
    labelKey: "menuSystem",
  },
  {
    id: "reset",
    icon: IconRefresh,
    labelKey: "menuReset",
  },
];

export function SettingsWorkspace() {
  const t = useTranslations("SalesMenu");
  const [selectedSection, setSelectedSection] =
    useState<SettingsSectionId | null>(null);
  const [settingsSearch, setSettingsSearch] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [storeName, setStoreName] = useState("RakPOS Café");
  const [storePhone, setStorePhone] = useState("+855 12 345 678");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [timezone, setTimezone] = useState<Timezone>("phnomPenh");
  const [language, setLanguage] = useState<Language>("en");
  const [autoLock, setAutoLock] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [inventoryNotifications, setInventoryNotifications] = useState(true);
  const [cashEnabled, setCashEnabled] = useState(true);
  const [khqrEnabled, setKhqrEnabled] = useState(true);
  const [bankCardEnabled, setBankCardEnabled] = useState(true);
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("2.50");
  const [mediaFileName, setMediaFileName] = useState("");
  const [requirePin, setRequirePin] = useState(true);
  const [managerApproval, setManagerApproval] = useState(false);
  const [accountName, setAccountName] = useState("Store Owner");
  const [accountEmail, setAccountEmail] = useState("owner@rakpos.example");
  const [pinEnabled, setPinEnabled] = useState(true);
  const [pinConfigured, setPinConfigured] = useState(false);
  const [multiFactorEnabled, setMultiFactorEnabled] = useState(false);
  const [multiFactorMethod, setMultiFactorMethod] = useState("authenticator");
  const [isSaving, startSaving] = useTransition();

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
  const selectSection = (sectionId: SettingsSectionId) => {
    setSelectedSection(sectionId);
    setIsSaved(false);
  };

  const visibleSettings = settingsMenu.filter((item) => {
    const search = settingsSearch.trim().toLocaleLowerCase();
    return t("pages.settings." + item.labelKey)
      .toLocaleLowerCase()
      .includes(search);
  });
  const selectedSettings = settingsMenu.find(
    (item) => item.id === selectedSection,
  );

  const resetSettings = () => {
    setStoreName("RakPOS Café");
    setStorePhone("+855 12 345 678");
    setCurrency("usd");
    setTimezone("phnomPenh");
    setLanguage("en");
    setAutoLock(true);
    setSoundFeedback(true);
    setOrderNotifications(true);
    setInventoryNotifications(true);
    setCashEnabled(true);
    setKhqrEnabled(true);
    setBankCardEnabled(true);
    setShippingEnabled(false);
    setDeliveryFee("2.50");
    setMediaFileName("");
    setRequirePin(true);
    setManagerApproval(false);
    setAccountName("Store Owner");
    setAccountEmail("owner@rakpos.example");
    setPinEnabled(true);
    setPinConfigured(false);
    setMultiFactorEnabled(false);
    setMultiFactorMethod("authenticator");
    setIsSaved(false);
  };

  return (
    <>
      <POSLayout
        showSearch={false}
        headerTitle={t("pages.settings.title")}
        rightPanelLabel={t("pages.settings.panelTitle")}
        rightPanel={
          <POSAside
            ariaLabelledBy="settings-detail-title"
            headerClassName="flex items-center gap-2 p-[var(--pos-content-padding)]"
            mainClassName="flex min-h-0 flex-col px-[var(--pos-content-padding)]"
            footerClassName="px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)] pt-3"
            footer={
              selectedSection && selectedSection !== "reset" ? (
                <div className="flex justify-end">
                  <Button
                    isDisabled={isSaved || isSaving}
                    isPending={isSaving}
                    size="lg"
                    type="button"
                    variant="primary"
                    onPress={() => startSaving(() => setIsSaved(true))}
                  >
                    {({ isPending }) =>
                      isPending ? (
                        <>
                          <Spinner color="current" size="sm" />
                          {t("pages.settings.saveChanges")}
                        </>
                      ) : (
                        t("pages.settings.saveChanges")
                      )
                    }
                  </Button>
                </div>
              ) : null
            }
            header={
              <h2
                id="settings-detail-title"
                className="text-base font-semibold text-foreground sm:text-lg"
              >
                {selectedSettings
                  ? t("pages.settings." + selectedSettings.labelKey)
                  : t("pages.settings.panelTitle")}
              </h2>
            }
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              {selectedSection === "general" ? (
                <GeneralSettings
                  onStoreNameChange={updateStoreName}
                  onStorePhoneChange={updateStorePhone}
                  onTimezoneChange={updateTimezone}
                  storeName={storeName}
                  storePhone={storePhone}
                  timezone={timezone}
                />
              ) : null}
              {selectedSection === "notifications" ? (
                <NotificationSettings
                  inventoryNotifications={inventoryNotifications}
                  onInventoryNotificationsChange={(value) => {
                    setInventoryNotifications(value);
                    markChanged();
                  }}
                  onOrderNotificationsChange={(value) => {
                    setOrderNotifications(value);
                    markChanged();
                  }}
                  onSoundFeedbackChange={(value) => {
                    setSoundFeedback(value);
                    markChanged();
                  }}
                  orderNotifications={orderNotifications}
                  soundFeedback={soundFeedback}
                />
              ) : null}
              {selectedSection === "privacySecurity" ? (
                <div className="grid gap-5">
                  <AccountSecuritySettings
                    accountEmail={accountEmail}
                    accountName={accountName}
                    onAccountEmailChange={(value) => {
                      setAccountEmail(value);
                      markChanged();
                    }}
                    onAccountNameChange={(value) => {
                      setAccountName(value);
                      markChanged();
                    }}
                  />
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
                  <PinSettings
                    isEnabled={pinEnabled}
                    isConfigured={pinConfigured}
                    onPinCreated={() => {
                      setPinConfigured(true);
                      markChanged();
                    }}
                    onEnabledChange={(value) => {
                      setPinEnabled(value);
                      markChanged();
                    }}
                  />
                  <MultiFactorSettings
                    isEnabled={multiFactorEnabled}
                    method={multiFactorMethod}
                    onEnabledChange={(value) => {
                      setMultiFactorEnabled(value);
                      markChanged();
                    }}
                    onMethodChange={(value) => {
                      setMultiFactorMethod(value);
                      markChanged();
                    }}
                  />
                </div>
              ) : null}
              {selectedSection === "payment" ? (
                <PaymentSettings
                  bankCardEnabled={bankCardEnabled}
                  cashEnabled={cashEnabled}
                  currency={currency}
                  khqrEnabled={khqrEnabled}
                  onBankCardEnabledChange={(value) => {
                    setBankCardEnabled(value);
                    markChanged();
                  }}
                  onCashEnabledChange={(value) => {
                    setCashEnabled(value);
                    markChanged();
                  }}
                  onCurrencyChange={updateCurrency}
                  onKhqrEnabledChange={(value) => {
                    setKhqrEnabled(value);
                    markChanged();
                  }}
                />
              ) : null}
              {selectedSection === "shipping" ? (
                <ShippingSettings
                  deliveryFee={deliveryFee}
                  isEnabled={shippingEnabled}
                  onDeliveryFeeChange={(value) => {
                    setDeliveryFee(value);
                    markChanged();
                  }}
                  onEnabledChange={(value) => {
                    setShippingEnabled(value);
                    markChanged();
                  }}
                />
              ) : null}
              {selectedSection === "mediaFiles" ? (
                <MediaFilesSettings
                  fileName={mediaFileName}
                  onFileChange={(value) => {
                    setMediaFileName(value);
                    markChanged();
                  }}
                />
              ) : null}
              {selectedSection === "languages" ? (
                <LanguageSettings
                  language={language}
                  onLanguageChange={(value) => {
                    setLanguage(value);
                    markChanged();
                  }}
                />
              ) : null}
              {selectedSection === "system" ? (
                <SystemSettings
                  autoLock={autoLock}
                  onAutoLockChange={(value) => {
                    setAutoLock(value);
                    markChanged();
                  }}
                />
              ) : null}
              {selectedSection === "reset" ? (
                <ResetSettings
                  onResetRequest={() => setIsResetDialogOpen(true)}
                />
              ) : null}
              {!selectedSection ? (
                <div className="flex min-h-full flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-default text-muted">
                    <IconSettings aria-hidden="true" size={40} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {t("pages.settings.emptyTitle")}
                  </h3>
                </div>
              ) : null}
            </div>
          </POSAside>
        }
      >
        <section className="min-h-0 flex-1 overflow-y-auto bg-background">
          <div className="flex min-w-0 flex-col gap-4 px-[var(--pos-content-padding)] pb-[var(--pos-content-padding)] pt-4">
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

            {visibleSettings.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {visibleSettings.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedSection === item.id;

                  return (
                    <Card
                      key={item.id}
                      aria-pressed={isSelected}
                      className="cursor-pointer transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      role="button"
                      tabIndex={0}
                      variant={isSelected ? "tertiary" : "default"}
                      onClick={() => selectSection(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectSection(item.id);
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
                            {t("pages.settings." + item.labelKey)}
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
        </section>
      </POSLayout>

      <AlertDialog.Backdrop
        isOpen={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                {t("pages.settings.resetDialogTitle")}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm leading-relaxed text-muted">
                {t("pages.settings.resetDialogDescription")}
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                {t("pages.settings.resetCancel")}
              </Button>
              <Button
                slot="close"
                variant="danger"
                onPress={resetSettings}
              >
                {t("pages.settings.resetConfirm")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
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

function AccountSecuritySettings({
  accountEmail,
  accountName,
  onAccountEmailChange,
  onAccountNameChange,
}: {
  accountEmail: string;
  accountName: string;
  onAccountEmailChange: (value: string) => void;
  onAccountNameChange: (value: string) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsSurfaceRow className="flex min-w-[320px] items-center gap-3 rounded-3xl p-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          SO
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{accountName}</p>
          <p className="text-xs text-muted">
            {t("pages.settings.accountSummaryDescription")}
          </p>
        </div>
      </SettingsSurfaceRow>

      <div className="grid gap-4">
        <SettingsSurfaceRow>
          <TextField
            fullWidth
            value={accountName}
            onChange={onAccountNameChange}
          >
            <Label>{t("pages.settings.accountName")}</Label>
            <Input autoComplete="name" variant="secondary" />
          </TextField>
        </SettingsSurfaceRow>
        <SettingsSurfaceRow>
          <TextField
            fullWidth
            value={accountEmail}
            onChange={onAccountEmailChange}
          >
            <Label>{t("pages.settings.accountEmail")}</Label>
            <Input autoComplete="email" type="email" variant="secondary" />
          </TextField>
        </SettingsSurfaceRow>
      </div>
    </SettingsSection>
  );
}

function PinSettings({
  isEnabled,
  isConfigured,
  onEnabledChange,
  onPinCreated,
}: {
  isEnabled: boolean;
  isConfigured: boolean;
  onEnabledChange: (value: boolean) => void;
  onPinCreated: () => void;
}) {
  const t = useTranslations("SalesMenu");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <SettingsSection>
      <SettingsToggle
        description={t("pages.settings.pinEnabledDescription")}
        isSelected={isEnabled}
        label={t("pages.settings.pinEnabled")}
        onChange={onEnabledChange}
      />

      {isEnabled ? (
        <>
          <SettingsSurfaceRow className="grid min-w-[320px] gap-4 rounded-3xl p-6">
            <div>
              <h3 className="font-semibold text-foreground">
                {t("pages.settings.pinChangeTitle")}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {t("pages.settings.pinChangeDescription")}
              </p>
            </div>
            <p className="text-sm text-muted" role="status">
              {t(
                isConfigured
                  ? "pages.settings.pinConfigured"
                  : "pages.settings.pinNotConfigured",
              )}
            </p>
            <Button
              fullWidth
              size="md"
              type="button"
              variant="secondary"
              onPress={() => setIsPinModalOpen(true)}
            >
              {t("pages.settings.changePin")}
            </Button>
          </SettingsSurfaceRow>
          <CreatePinModal
            isOpen={isPinModalOpen}
            onCreatePin={onPinCreated}
            onOpenChange={setIsPinModalOpen}
          />
        </>
      ) : null}
    </SettingsSection>
  );
}

function MultiFactorSettings({
  isEnabled,
  method,
  onEnabledChange,
  onMethodChange,
}: {
  isEnabled: boolean;
  method: string;
  onEnabledChange: (value: boolean) => void;
  onMethodChange: (value: string) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsToggle
        description={t("pages.settings.multiFactorDescription")}
        isSelected={isEnabled}
        label={t("pages.settings.multiFactorEnabled")}
        onChange={onEnabledChange}
      />

      {isEnabled ? (
        <SettingsSelect
          label={t("pages.settings.verificationMethod")}
          options={[
            {
              id: "authenticator",
              label: t("pages.settings.authenticatorApp"),
            },
            { id: "sms", label: t("pages.settings.sms") },
          ]}
          value={method}
          onChange={onMethodChange}
        />
      ) : null}
    </SettingsSection>
  );
}

function NotificationSettings({
  inventoryNotifications,
  onInventoryNotificationsChange,
  onOrderNotificationsChange,
  onSoundFeedbackChange,
  orderNotifications,
  soundFeedback,
}: {
  inventoryNotifications: boolean;
  onInventoryNotificationsChange: (value: boolean) => void;
  onOrderNotificationsChange: (value: boolean) => void;
  onSoundFeedbackChange: (value: boolean) => void;
  orderNotifications: boolean;
  soundFeedback: boolean;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsToggle
        description={t("pages.settings.orderNotificationsDescription")}
        isSelected={orderNotifications}
        label={t("pages.settings.orderNotifications")}
        onChange={onOrderNotificationsChange}
      />
      <SettingsToggle
        description={t("pages.settings.inventoryNotificationsDescription")}
        isSelected={inventoryNotifications}
        label={t("pages.settings.inventoryNotifications")}
        onChange={onInventoryNotificationsChange}
      />
      <SettingsToggle
        description={t("pages.settings.soundFeedbackDescription")}
        isSelected={soundFeedback}
        label={t("pages.settings.soundFeedback")}
        onChange={onSoundFeedbackChange}
      />
    </SettingsSection>
  );
}

function PaymentSettings({
  bankCardEnabled,
  cashEnabled,
  currency,
  khqrEnabled,
  onBankCardEnabledChange,
  onCashEnabledChange,
  onCurrencyChange,
  onKhqrEnabledChange,
}: {
  bankCardEnabled: boolean;
  cashEnabled: boolean;
  currency: Currency;
  khqrEnabled: boolean;
  onBankCardEnabledChange: (value: boolean) => void;
  onCashEnabledChange: (value: boolean) => void;
  onCurrencyChange: (value: Currency) => void;
  onKhqrEnabledChange: (value: boolean) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <CurrencySettings
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />
      <SettingsToggle
        description={t("pages.settings.cashDescription")}
        isSelected={cashEnabled}
        label={t("pages.settings.cash")}
        onChange={onCashEnabledChange}
      />
      <SettingsToggle
        description={t("pages.settings.khqrDescription")}
        isSelected={khqrEnabled}
        label={t("pages.settings.khqr")}
        onChange={onKhqrEnabledChange}
      />
      <SettingsToggle
        description={t("pages.settings.bankCardDescription")}
        isSelected={bankCardEnabled}
        label={t("pages.settings.bankCard")}
        onChange={onBankCardEnabledChange}
      />
    </SettingsSection>
  );
}

function ShippingSettings({
  deliveryFee,
  isEnabled,
  onDeliveryFeeChange,
  onEnabledChange,
}: {
  deliveryFee: string;
  isEnabled: boolean;
  onDeliveryFeeChange: (value: string) => void;
  onEnabledChange: (value: boolean) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsToggle
        description={t("pages.settings.shippingEnabledDescription")}
        isSelected={isEnabled}
        label={t("pages.settings.shippingEnabled")}
        onChange={onEnabledChange}
      />
      {isEnabled ? (
        <SettingsSurfaceRow>
          <TextField
            fullWidth
            value={deliveryFee}
            onChange={onDeliveryFeeChange}
          >
            <Label>{t("pages.settings.deliveryFee")}</Label>
            <Input
              min={0}
              placeholder={t("pages.settings.deliveryFeePlaceholder")}
              step="0.25"
              type="number"
              variant="secondary"
            />
            <Description>
              {t("pages.settings.deliveryFeeDescription")}
            </Description>
          </TextField>
        </SettingsSurfaceRow>
      ) : null}
    </SettingsSection>
  );
}

function MediaFilesSettings({
  fileName,
  onFileChange,
}: {
  fileName: string;
  onFileChange: (value: string) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
      <SettingsSection>
      <SettingsSurfaceRow>
        <div className="grid gap-3">
          <div>
            <h3 className="font-semibold text-foreground">
              {t("pages.settings.mediaUploadLabel")}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {t("pages.settings.mediaUploadDescription")}
            </p>
          </div>
          <Label htmlFor="settings-media-file">
            {t("pages.settings.mediaFile")}
          </Label>
          <Input
            accept="image/*,.pdf,.csv,.xlsx"
            id="settings-media-file"
            type="file"
            variant="secondary"
            onChange={(event) =>
              onFileChange(event.currentTarget.files?.[0]?.name ?? "")
            }
          />
          <p aria-live="polite" className="text-sm text-muted">
            {fileName || t("pages.settings.mediaNoSelection")}
          </p>
        </div>
      </SettingsSurfaceRow>
    </SettingsSection>
  );
}

function LanguageSettings({
  language,
  onLanguageChange,
}: {
  language: Language;
  onLanguageChange: (value: Language) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsSelect
        label={t("pages.settings.language")}
        options={[
          { id: "en", label: t("pages.settings.languageEnglish") },
          { id: "km", label: t("pages.settings.languageKhmer") },
        ]}
        value={language}
        onChange={(value) => onLanguageChange(value as Language)}
      />
    </SettingsSection>
  );
}

function SystemSettings({
  autoLock,
  onAutoLockChange,
}: {
  autoLock: boolean;
  onAutoLockChange: (value: boolean) => void;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsToggle
        description={t("pages.settings.autoLockDescription")}
        isSelected={autoLock}
        label={t("pages.settings.autoLock")}
        onChange={onAutoLockChange}
      />
      <DeviceSettings />
    </SettingsSection>
  );
}

function ResetSettings({ onResetRequest }: { onResetRequest: () => void }) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <SettingsSurfaceRow className="grid min-w-[320px] gap-4 rounded-3xl p-6">
        <div>
          <h3 className="font-semibold text-foreground">
            {t("pages.settings.resetPanelTitle")}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {t("pages.settings.resetPanelDescription")}
          </p>
        </div>
        <Button className="w-fit" variant="danger" onPress={onResetRequest}>
          {t("pages.settings.resetButton")}
        </Button>
      </SettingsSurfaceRow>
    </SettingsSection>
  );
}

function GeneralSettings({
  onStoreNameChange,
  onStorePhoneChange,
  onTimezoneChange,
  storeName,
  storePhone,
  timezone,
}: {
  onStoreNameChange: (value: string) => void;
  onStorePhoneChange: (value: string) => void;
  onTimezoneChange: (value: Timezone) => void;
  storeName: string;
  storePhone: string;
  timezone: Timezone;
}) {
  const t = useTranslations("SalesMenu");

  return (
    <SettingsSection>
      <div className="grid gap-4">
        <SettingsSurfaceRow>
          <TextField fullWidth value={storeName} onChange={onStoreNameChange}>
            <Label>{t("pages.settings.storeName")}</Label>
            <Input
              placeholder={t("pages.settings.storeNamePlaceholder")}
              variant="secondary"
            />
          </TextField>
        </SettingsSurfaceRow>
        <SettingsSurfaceRow>
          <TextField fullWidth value={storePhone} onChange={onStorePhoneChange}>
            <Label>{t("pages.settings.storePhone")}</Label>
            <Input
              placeholder={t("pages.settings.storePhonePlaceholder")}
              variant="secondary"
            />
          </TextField>
        </SettingsSurfaceRow>
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
      <div className="grid gap-3">
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

      <div className="grid gap-3">
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
          icon={IconPrinter}
          label={t("pages.settings.receiptPrinter")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={IconDeviceDesktop}
          label={t("pages.settings.customerDisplay")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={IconDevices}
          label={t("pages.settings.cashDrawer")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={IconDeviceTablet}
          label={t("pages.settings.kitchenDisplay")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={IconBarcode}
          label={t("pages.settings.barcodeScanner")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={IconCreditCard}
          label={t("pages.settings.paymentTerminal")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={IconPrinter}
          label={t("pages.settings.kitchenPrinter")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
        <DeviceRow
          icon={IconPrinter}
          label={t("pages.settings.labelPrinter")}
          status={t("pages.settings.notConnected")}
          statusColor="default"
        />
        <DeviceRow
          icon={IconRouter}
          label={t("pages.settings.storeNetwork")}
          status={t("pages.settings.connected")}
          statusColor="success"
        />
      </div>

      <SettingsSurfaceRow className="flex min-w-[320px] items-start gap-3 rounded-3xl p-6 text-sm">
        <IconWorld
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-accent"
          size={18}
        />
        <p className="font-semibold text-foreground">
          {t("pages.settings.deviceSyncTitle")}
        </p>
      </SettingsSurfaceRow>
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

function SettingsSurfaceRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Surface
      className={
        className ?? "flex min-w-[320px] flex-col gap-3 rounded-3xl p-6"
      }
      variant="secondary"
    >
      {children}
    </Surface>
  );
}

function SettingsToggle({
  description,
  isSelected,
  label,
  onChange,
}: {
  description?: string;
  isSelected: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <SettingsSurfaceRow>
      <Switch isSelected={isSelected} size="lg" onChange={onChange}>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          {label}
        </Switch.Content>
        {description ? <Description>{description}</Description> : null}
      </Switch>
    </SettingsSurfaceRow>
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
    <SettingsSurfaceRow>
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
    </SettingsSurfaceRow>
  );
}

function RoleCard({ label, value }: { label: string; value: string }) {
  return (
    <SettingsSurfaceRow className="flex min-w-[320px] items-center justify-between gap-3 rounded-3xl p-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <IconLock aria-hidden="true" size={19} />
        </div>
        <p className="font-semibold text-foreground">{label}</p>
      </div>
      <span className="text-xl font-bold tabular-nums text-foreground">
        {value}
      </span>
    </SettingsSurfaceRow>
  );
}

function DeviceRow({
  icon: Icon,
  label,
  status,
  statusColor,
}: {
  icon: TablerIcon;
  label: string;
  status: string;
  statusColor: "success" | "default";
}) {
  return (
    <SettingsSurfaceRow className="flex min-h-20 min-w-[320px] items-center justify-between gap-4 rounded-3xl p-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-muted">
          <Icon aria-hidden="true" size={20} />
        </div>
        <p className="font-semibold text-foreground">{label}</p>
      </div>
      <Chip color={statusColor} size="sm" variant="soft">
        {status}
      </Chip>
    </SettingsSurfaceRow>
  );
}
