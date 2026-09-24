"use client";

import {
  AlertDialog,
  Button,
  Chip,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  Radio,
  RadioGroup,
  SearchField,
  Switch,
  Table,
  Tabs,
  TextField,
  toast,
} from "@heroui/react";
import type { Selection, SortDescriptor } from "@heroui/react";
import {
  IconAlertTriangle,
  IconFlask,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import { EmptyState } from "@/components/shared/empty-state";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";
import { addOnIds, type AddOnId } from "../sales/data";

type AddOnStatus = "active" | "inactive";
type AddOnStatusFilter = "all" | AddOnStatus;
type AddOnGroup = "milk" | "syrup" | "topping" | "extra";
type AddOnRecord = {
  id: string;
  addOnId?: AddOnId;
  nameOverrides: Partial<Record<Locale, string>>;
  group: AddOnGroup;
  price: number;
  status: AddOnStatus;
};
type AddOnFields = {
  name: string;
  group: AddOnGroup;
  price: number;
  status: AddOnStatus;
};

const groupIds: AddOnGroup[] = ["milk", "syrup", "topping", "extra"];
const addOnDetails: Record<AddOnId, { group: AddOnGroup; price: number }> = {
  espressoShot: { group: "extra", price: 0.75 },
  oatMilk: { group: "milk", price: 0.5 },
  almondMilk: { group: "milk", price: 0.5 },
  soyMilk: { group: "milk", price: 0.5 },
  whippedCream: { group: "topping", price: 0.5 },
  caramelDrizzle: { group: "syrup", price: 0.5 },
  vanillaSyrup: { group: "syrup", price: 0.5 },
  hazelnutSyrup: { group: "syrup", price: 0.5 },
  bobaPearls: { group: "topping", price: 0.75 },
  cheeseFoam: { group: "topping", price: 0.75 },
  grassJelly: { group: "topping", price: 0.5 },
  coconutJelly: { group: "topping", price: 0.5 },
};
const initialAddOns: AddOnRecord[] = addOnIds.map((id) => ({
  id,
  addOnId: id,
  nameOverrides: {},
  group: addOnDetails[id].group,
  price: addOnDetails[id].price,
  status: "active",
}));
const statusFilterIds: AddOnStatusFilter[] = ["all", "active", "inactive"];

export function AddonsPageContent() {
  const t = useTranslations("Addon");
  const salesT = useTranslations("SalesMenu");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;
  const [addOnList, setAddOnList] = useState(initialAddOns);
  const [selectedAddOnId, setSelectedAddOnId] = useState(
    initialAddOns[0]?.id ?? "",
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorAddOnId, setEditorAddOnId] = useState<string | null>(null);
  const [editorSession, setEditorSession] = useState(0);
  const addOnLabels = useMemo(
    () =>
      Object.fromEntries(
        addOnIds.map((id) => [id, salesT(`modifiers.${id}`)]),
      ) as Record<AddOnId, string>,
    [salesT],
  );
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "km" ? "km-KH" : "en-US", {
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
      }),
    [locale],
  );
  const editorAddOn = addOnList.find(({ id }) => id === editorAddOnId);
  const selectedAddOn = addOnList.find(({ id }) => id === selectedAddOnId);

  const openEditor = (addOn?: AddOnRecord) => {
    setEditorAddOnId(addOn?.id ?? null);
    setEditorSession((current) => current + 1);
    setIsEditorOpen(true);
  };

  const saveAddOn = (fields: AddOnFields) => {
    if (editorAddOn) {
      setAddOnList((current) =>
        current.map((addOn) =>
          addOn.id === editorAddOn.id
            ? {
                ...addOn,
                nameOverrides: {
                  ...addOn.nameOverrides,
                  [locale]: fields.name,
                },
                group: fields.group,
                price: fields.price,
                status: fields.status,
              }
            : addOn,
        ),
      );
      toast.success(t("updated"), {
        description: t("updatedDescription", { name: fields.name }),
      });
    } else {
      const id = createAddOnId(fields.name);
      setAddOnList((current) => [
        ...current,
        {
          id,
          nameOverrides: { en: fields.name, km: fields.name },
          group: fields.group,
          price: fields.price,
          status: fields.status,
        },
      ]);
      setSelectedAddOnId(id);
      toast.success(t("created"), {
        description: t("createdDescription", { name: fields.name }),
      });
    }

    setIsEditorOpen(false);
  };

  const deleteAddOn = (addOnId: string) => {
    const addOn = addOnList.find(({ id }) => id === addOnId);
    if (!addOn) return;

    const addOnName = getAddOnName(addOn, locale, addOnLabels);
    const nextAddOns = addOnList.filter(({ id }) => id !== addOnId);
    setAddOnList(nextAddOns);
    if (selectedAddOnId === addOnId) {
      setSelectedAddOnId(nextAddOns[0]?.id ?? "");
    }
    toast.success(t("deleted"), {
      description: t("deletedDescription", { name: addOnName }),
    });
  };

  const statusOptions = statusFilterIds.map((id) => ({
    id,
    label: t(id === "all" ? "allAddOns" : id),
  }));

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("title")}
      rightPanel={
        <AddOnAside
          addOn={selectedAddOn}
          addOnLabels={addOnLabels}
          formatter={formatter}
          locale={locale}
          onDeleteAddOn={deleteAddOn}
          onEditAddOn={openEditor}
        />
      }
      rightPanelLabel={t("asideLabel")}
    >
      <AddOnsDataGrid
        addOns={addOnList}
        addOnLabels={addOnLabels}
        formatter={formatter}
        locale={locale}
        onAddAddOn={() => openEditor()}
        onAddOnSelect={setSelectedAddOnId}
        selectedAddOnId={selectedAddOnId}
        statusOptions={statusOptions}
      />
      {isEditorOpen ? (
        <AddOnEditorModal
          key={editorSession}
          addOn={editorAddOn}
          addOnLabels={addOnLabels}
          formatter={formatter}
          locale={locale}
          onOpenChange={setIsEditorOpen}
          onSave={saveAddOn}
        />
      ) : null}
    </POSLayout>
  );
}

function AddOnsDataGrid({
  addOns,
  addOnLabels,
  formatter,
  locale,
  onAddAddOn,
  onAddOnSelect,
  selectedAddOnId,
  statusOptions,
}: {
  addOns: AddOnRecord[];
  addOnLabels: Record<AddOnId, string>;
  formatter: Intl.NumberFormat;
  locale: Locale;
  onAddAddOn: () => void;
  onAddOnSelect: (addOnId: string) => void;
  selectedAddOnId: string;
  statusOptions: Array<{ id: AddOnStatusFilter; label: string }>;
}) {
  const t = useTranslations("Addon");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AddOnStatusFilter>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const groupLabels = useMemo(
    () => Object.fromEntries(groupIds.map((id) => [id, t(`groups.${id}`)])) as Record<AddOnGroup, string>,
    [t],
  );

  const filteredAddOns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return addOns.filter((addOn) => {
      const name = getAddOnName(addOn, locale, addOnLabels);
      const group = groupLabels[addOn.group];
      const matchesSearch =
        !normalizedQuery ||
        `${name} ${group} ${addOn.id}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || addOn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [addOnLabels, addOns, groupLabels, locale, query, statusFilter]);

  const sortedAddOns = useMemo(() => {
    const column = String(sortDescriptor.column ?? "name");

    return [...filteredAddOns].sort((first, second) => {
      const firstValue = getAddOnSortValue(
        first,
        column,
        locale,
        addOnLabels,
        groupLabels,
      );
      const secondValue = getAddOnSortValue(
        second,
        column,
        locale,
        addOnLabels,
        groupLabels,
      );
      const comparison =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue));

      return sortDescriptor.direction === "descending" ? -comparison : comparison;
    });
  }, [
    addOnLabels,
    filteredAddOns,
    groupLabels,
    locale,
    sortDescriptor,
  ]);

  const visibleSelectedId = sortedAddOns.some(
    (addOn) => addOn.id === selectedAddOnId,
  )
    ? selectedAddOnId
    : (sortedAddOns[0]?.id ?? "");
  const selectedKeys = useMemo<Selection>(
    () => (visibleSelectedId ? new Set([visibleSelectedId]) : new Set()),
    [visibleSelectedId],
  );

  useEffect(() => {
    if (selectedAddOnId !== visibleSelectedId) {
      onAddOnSelect(visibleSelectedId);
    }
  }, [onAddOnSelect, selectedAddOnId, visibleSelectedId]);

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") return;
    const selectedKey = Array.from(selection)[0];
    if (selectedKey !== undefined) onAddOnSelect(String(selectedKey));
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col space-y-3 overflow-hidden p-(--pos-content-padding) text-foreground">
      <AddOnsToolbar
        onAddAddOn={onAddAddOn}
        onSearchChange={setQuery}
        onStatusFilterChange={setStatusFilter}
        query={query}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
      />

      <div className="flex min-h-0 flex-1">
        <Table className="min-h-0 flex-1" variant="secondary">
          <Table.ScrollContainer className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <Table.Content
              aria-label={t("tableLabel")}
              className="min-w-[600px]"
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              onSelectionChange={handleSelectionChange}
              onSortChange={setSortDescriptor}
            >
              <Table.Header className="sticky top-0 z-20 bg-surface text-foreground">
                <Table.Column allowsSorting id="name" isRowHeader>
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableAddOn")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="group">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableGroup")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="price" className="text-end">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-end"
                      sortDirection={sortDirection}
                    >
                      {t("tablePrice")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="status" className="text-center">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-center"
                      sortDirection={sortDirection}
                    >
                      {t("tableStatus")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
              </Table.Header>
              <Table.Body
                items={sortedAddOns}
                renderEmptyState={() => (
                  <EmptyState className="p-10">
                    <EmptyState.Media>
                      <IconFlask aria-hidden="true" size={24} />
                    </EmptyState.Media>
                    <EmptyState.Header>
                      <EmptyState.Title>{t("emptyTitle")}</EmptyState.Title>
                      <EmptyState.Description>
                        {t("emptyDescription")}
                      </EmptyState.Description>
                    </EmptyState.Header>
                  </EmptyState>
                )}
              >
                {(addOn) => (
                  <AddOnTableRow
                    addOn={addOn}
                    addOnLabels={addOnLabels}
                    formatter={formatter}
                    groupLabels={groupLabels}
                    key={addOn.id}
                    locale={locale}
                    onAddOnSelect={onAddOnSelect}
                  />
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <p aria-live="polite" className="shrink-0 text-xs text-muted">
        {t("summary", { visible: sortedAddOns.length, total: addOns.length })}
      </p>
    </div>
  );
}

function AddOnsToolbar({
  onAddAddOn,
  onSearchChange,
  onStatusFilterChange,
  query,
  statusFilter,
  statusOptions,
}: {
  onAddAddOn: () => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: AddOnStatusFilter) => void;
  query: string;
  statusFilter: AddOnStatusFilter;
  statusOptions: Array<{ id: AddOnStatusFilter; label: string }>;
}) {
  const t = useTranslations("Addon");

  return (
    <div className="flex shrink-0 flex-col space-y-3">
      <Tabs
        className="min-w-0"
        selectedKey={statusFilter}
        variant="secondary"
        onSelectionChange={(key) =>
          onStatusFilterChange(String(key) as AddOnStatusFilter)
        }
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label={t("statusLabel")}>
            {statusOptions.map((option) => (
              <Tabs.Tab
                key={option.id}
                className="w-auto shrink-0 whitespace-nowrap"
                id={option.id}
              >
                {option.label}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>

      <div className="flex w-full shrink-0 items-center gap-2">
        <SearchField
          aria-label={t("searchLabel")}
          className="flex-1"
          fullWidth
          value={query}
          variant="secondary"
          onChange={onSearchChange}
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={t("searchPlaceholder")} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
        <Button
          aria-label={t("addAddOn")}
          className="shrink-0"
          isIconOnly
          size="sm"
          type="button"
          onPress={onAddAddOn}
        >
          <IconPlus aria-hidden="true" size={18} />
        </Button>
      </div>
    </div>
  );
}

function AddOnTableRow({
  addOn,
  addOnLabels,
  formatter,
  groupLabels,
  locale,
  onAddOnSelect,
}: {
  addOn: AddOnRecord;
  addOnLabels: Record<AddOnId, string>;
  formatter: Intl.NumberFormat;
  groupLabels: Record<AddOnGroup, string>;
  locale: Locale;
  onAddOnSelect: (addOnId: string) => void;
}) {
  const t = useTranslations("Addon");
  const name = getAddOnName(addOn, locale, addOnLabels);

  return (
    <Table.Row
      id={addOn.id}
      textValue={`${name} ${groupLabels[addOn.group]}`}
      className="cursor-pointer hover:bg-surface-secondary/50 data-[selected=true]:bg-accent/10 [&>td]:py-3"
      onPress={() => onAddOnSelect(addOn.id)}
    >
      <Table.Cell textValue={name}>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {name}
          </p>
          <p className="truncate text-xs text-muted">{t("menuModifier")}</p>
        </div>
      </Table.Cell>
      <Table.Cell className="text-sm text-muted">
        {groupLabels[addOn.group]}
      </Table.Cell>
      <Table.Cell className="text-end text-sm font-semibold tabular-nums text-foreground">
        {formatter.format(addOn.price)}
      </Table.Cell>
      <Table.Cell className="text-center">
        <AddOnStatusChip status={addOn.status} />
      </Table.Cell>
    </Table.Row>
  );
}

function AddOnAside({
  addOn,
  addOnLabels,
  formatter,
  locale,
  onDeleteAddOn,
  onEditAddOn,
}: {
  addOn?: AddOnRecord;
  addOnLabels: Record<AddOnId, string>;
  formatter: Intl.NumberFormat;
  locale: Locale;
  onDeleteAddOn: (addOnId: string) => void;
  onEditAddOn: (addOn: AddOnRecord) => void;
}) {
  const t = useTranslations("Addon");

  if (!addOn) {
    return (
      <POSAside
        ariaLabelledBy="addon-aside-title"
        headerClassName="p-[var(--pos-content-padding)]"
        mainClassName="flex min-h-0 flex-1 flex-col items-center justify-center p-[var(--pos-content-padding)] text-center text-muted"
        header={
          <h2
            id="addon-aside-title"
            className="text-base font-bold tracking-tight text-foreground"
          >
            {t("detailsTitle")}
          </h2>
        }
      >
        <EmptyState className="p-10">
          <EmptyState.Media>
            <IconFlask aria-hidden="true" size={24} />
          </EmptyState.Media>
          <EmptyState.Header>
            <EmptyState.Title>{t("noSelectionTitle")}</EmptyState.Title>
            <EmptyState.Description>
              {t("noSelectionDescription")}
            </EmptyState.Description>
          </EmptyState.Header>
        </EmptyState>
      </POSAside>
    );
  }

  const name = getAddOnName(addOn, locale, addOnLabels);

  return (
    <POSAside
      ariaLabelledBy="addon-aside-title"
      headerClassName="p-[var(--pos-content-padding)]"
      mainClassName="flex min-h-0 flex-col gap-5 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)]"
      header={
        <div className="flex items-center justify-between gap-3">
          <h2
            id="addon-aside-title"
            className="text-base font-bold tracking-tight text-foreground"
          >
            {t("detailsTitle")}
          </h2>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              aria-label={t("editAddOn")}
              isIconOnly
              size="sm"
              type="button"
              variant="secondary"
              onPress={() => onEditAddOn(addOn)}
            >
              <IconPencil aria-hidden="true" size={18} />
            </Button>
            <DeleteAddOnAlertDialog
              addOnName={name}
              onDelete={() => onDeleteAddOn(addOn.id)}
            />
          </div>
        </div>
      }
    >
      <section aria-labelledby="selected-addon-title" className="space-y-4">
        <div className="min-w-0">
          <h3
            className="text-lg font-semibold tracking-tight text-foreground"
            id="selected-addon-title"
          >
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {t(`groups.${addOn.group}`)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <AddOnMetadata
            label={t("priceLabel")}
            value={formatter.format(addOn.price)}
          />
          <AddOnMetadata
            label={t("availability")}
            value={t(addOn.status)}
          />
        </div>
      </section>
    </POSAside>
  );
}

function AddOnMetadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-surface-secondary/50 p-3">
      <p className="truncate text-[10px] font-medium text-muted">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function AddOnStatusChip({ status }: { status: AddOnStatus }) {
  const t = useTranslations("Addon");

  return (
    <Chip
      color={status === "active" ? "success" : "default"}
      size="sm"
      variant="soft"
    >
      {t(status)}
    </Chip>
  );
}

function AddOnEditorModal({
  addOn,
  addOnLabels,
  formatter,
  locale,
  onOpenChange,
  onSave,
}: {
  addOn?: AddOnRecord;
  addOnLabels: Record<AddOnId, string>;
  formatter: Intl.NumberFormat;
  locale: Locale;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (fields: AddOnFields) => void;
}) {
  const t = useTranslations("Addon");
  const [name, setName] = useState(
    addOn ? getAddOnName(addOn, locale, addOnLabels) : "",
  );
  const [group, setGroup] = useState<AddOnGroup>(addOn?.group ?? "extra");
  const [price, setPrice] = useState(addOn?.price.toFixed(2) ?? "0.50");
  const [isActive, setIsActive] = useState(addOn?.status !== "inactive");
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);
  const isEditMode = Boolean(addOn);
  const groupOptions = groupIds.map((id) => ({
    id,
    label: t(`groups.${id}`),
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    const numericPrice = Number(price);
    let isValid = true;

    if (!cleanName) {
      setIsNameInvalid(true);
      document.getElementById("addon-name")?.focus();
      isValid = false;
    }
    if (!price.trim() || !Number.isFinite(numericPrice) || numericPrice < 0) {
      setIsPriceInvalid(true);
      if (isValid) document.getElementById("addon-price")?.focus();
      isValid = false;
    }
    if (!isValid) return;

    onSave({
      name: cleanName,
      group,
      price: numericPrice,
      status: isActive ? "active" : "inactive",
    });
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen variant="blur" onOpenChange={onOpenChange}>
        <Modal.Container scroll="inside">
          <Modal.Dialog
            aria-describedby="addon-editor-description"
            aria-labelledby="addon-editor-title"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="space-y-1">
                <Modal.Heading id="addon-editor-title">
                  {isEditMode ? t("editTitle") : t("createTitle")}
                </Modal.Heading>
                <p className="text-sm text-muted" id="addon-editor-description">
                  {t(isEditMode ? "editDescription" : "createDescription")}
                </p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Form
                id="addon-editor-form"
                className="flex flex-col gap-5"
                onSubmit={handleSubmit}
              >
                <TextField
                  className="w-full"
                  isInvalid={isNameInvalid}
                  isRequired
                  name="name"
                  value={name}
                  variant="secondary"
                  onChange={(value) => {
                    setName(value);
                    if (value.trim()) setIsNameInvalid(false);
                  }}
                >
                  <Label>{t("nameLabel")}</Label>
                  <Input
                    autoComplete="off"
                    id="addon-name"
                    maxLength={48}
                    placeholder={t("namePlaceholder")}
                  />
                  <FieldError>{t("nameRequired")}</FieldError>
                </TextField>

                <RadioGroup
                  className="w-full gap-3"
                  name="addon-group"
                  value={group}
                  variant="secondary"
                  onChange={(value) => {
                    const nextGroup = value as AddOnGroup;
                    if (groupIds.includes(nextGroup)) {
                      setGroup(nextGroup);
                    }
                  }}
                >
                  <Label>{t("groupLabel")}</Label>
                  <Description>{t("groupDescription")}</Description>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {groupOptions.map((option) => (
                      <Radio key={option.id} value={option.id}>
                        <Radio.Content className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-default bg-surface p-3 data-[selected=true]:bg-surface-secondary">
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          {option.label}
                        </Radio.Content>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <TextField
                  className="w-full"
                  isInvalid={isPriceInvalid}
                  isRequired
                  name="price"
                  type="number"
                  value={price}
                  variant="secondary"
                  onChange={(value) => {
                    setPrice(value);
                    if (value.trim() && Number.isFinite(Number(value)) && Number(value) >= 0) {
                      setIsPriceInvalid(false);
                    }
                  }}
                >
                  <Label>{t("priceLabel")}</Label>
                  <Input
                    id="addon-price"
                    min="0"
                    placeholder={formatter.format(0.5)}
                    step="0.25"
                  />
                  <FieldError>{t("priceInvalid")}</FieldError>
                </TextField>

                <Switch
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-border/70 bg-surface-secondary/40 p-3"
                  isSelected={isActive}
                  onChange={setIsActive}
                >
                  <Switch.Content>
                    <Label className="text-sm font-medium text-foreground">
                      {t("activeAddOn")}
                    </Label>
                    <p className="mt-0.5 text-xs text-muted">
                      {t("activeDescription")}
                    </p>
                  </Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="button"
                variant="secondary"
                onPress={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button form="addon-editor-form" type="submit">
                {isEditMode ? t("saveChanges") : t("createAddOn")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function DeleteAddOnAlertDialog({
  addOnName,
  onDelete,
}: {
  addOnName: string;
  onDelete: () => void;
}) {
  const t = useTranslations("Addon");

  return (
    <AlertDialog>
      <Button
        aria-label={t("deleteAddOn")}
        isIconOnly
        size="sm"
        type="button"
        variant="danger-soft"
      >
        <IconTrash aria-hidden="true" size={18} />
      </Button>
      <AlertDialog.Backdrop variant="blur">
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px]">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header className="items-center text-center">
              <AlertDialog.Icon status="danger">
                <IconAlertTriangle aria-hidden="true" size={20} />
              </AlertDialog.Icon>
              <AlertDialog.Heading>
                {t("deleteHeading", { name: addOnName })}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="text-center">
              <p>{t("deleteDescription")}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse gap-2">
              <Button className="w-full" slot="close" variant="secondary">
                {t("cancel")}
              </Button>
              <Button
                className="w-full"
                slot="close"
                variant="danger"
                onPress={onDelete}
              >
                {t("deleteAddOn")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

function getAddOnName(
  addOn: AddOnRecord,
  locale: Locale,
  addOnLabels: Record<AddOnId, string>,
) {
  return (
    addOn.nameOverrides[locale] ??
    (addOn.addOnId
      ? addOnLabels[addOn.addOnId]
      : addOn.nameOverrides.en ?? addOn.id)
  );
}

function getAddOnSortValue(
  addOn: AddOnRecord,
  column: string,
  locale: Locale,
  addOnLabels: Record<AddOnId, string>,
  groupLabels: Record<AddOnGroup, string>,
) {
  switch (column) {
    case "group":
      return groupLabels[addOn.group];
    case "price":
      return addOn.price;
    case "status":
      return addOn.status;
    case "name":
    default:
      return getAddOnName(addOn, locale, addOnLabels);
  }
}

function createAddOnId(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `custom-${slug || "addon"}-${Date.now().toString(36)}`;
}
