"use client";

import {
  AlertDialog,
  Avatar,
  Button,
  Chip,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  SearchField,
  Switch,
  Table,
  Tabs,
  TextArea,
  TextField,
  toast,
} from "@heroui/react";
import type { Selection, SortDescriptor } from "@heroui/react";
import {
  IconAlertTriangle,
  IconCategory,
  IconCoffee,
  IconCookie,
  IconCup,
  IconEgg,
  IconBurger,
  IconBread,
  IconCake,
  IconGlassFull,
  IconLeaf,
  IconMilkshake,
  IconPencil,
  IconPlus,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, type FormEvent } from "react";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import { getProductImage } from "@/components/product/product-images";
import { EmptyState } from "@/components/shared/empty-state";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";
import { products, type Product, type ProductCategory } from "../sales/data";

type CategoryStatus = "active" | "inactive";
type CategoryStatusFilter = "all" | CategoryStatus;
type CategoryLocaleFields = { name: string; description: string };
type CategoryRecord = {
  id: string;
  productCategory?: ProductCategory;
  localized: Partial<Record<Locale, CategoryLocaleFields>>;
  status: CategoryStatus;
};
type CategoryDefinition = {
  id: ProductCategory;
  labelKey: string;
  descriptionKey: string;
};

const categoryDefinitions = [
  { id: "signature", labelKey: "categorySignature", descriptionKey: "descriptionSignature" },
  { id: "icedCoffee", labelKey: "categoryIcedCoffee", descriptionKey: "descriptionIcedCoffee" },
  { id: "hotCoffee", labelKey: "categoryHotCoffee", descriptionKey: "descriptionHotCoffee" },
  { id: "tea", labelKey: "categoryTea", descriptionKey: "descriptionTea" },
  { id: "smoothie", labelKey: "categorySmoothie", descriptionKey: "descriptionSmoothie" },
  { id: "juice", labelKey: "categoryJuice", descriptionKey: "descriptionJuice" },
  { id: "breakfast", labelKey: "categoryBreakfast", descriptionKey: "descriptionBreakfast" },
  { id: "sandwich", labelKey: "categorySandwich", descriptionKey: "descriptionSandwich" },
  { id: "bakery", labelKey: "categoryBakery", descriptionKey: "descriptionBakery" },
  { id: "dessert", labelKey: "categoryDessert", descriptionKey: "descriptionDessert" },
  { id: "snack", labelKey: "categorySnack", descriptionKey: "descriptionSnack" },
] as const satisfies CategoryDefinition[];

const initialCategories: CategoryRecord[] = categoryDefinitions.map(({ id }) => ({
  id,
  productCategory: id,
  localized: {},
  status: "active",
}));

const categoryStatusFilters: CategoryStatusFilter[] = [
  "all",
  "active",
  "inactive",
];

export function CategoriesPageContent() {
  const t = useTranslations("Category");
  const productT = useTranslations("Product");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState("signature");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorCategoryId, setEditorCategoryId] = useState<string | null>(null);
  const [editorSession, setEditorSession] = useState(0);
  const categoryLabels = useMemo(
    () =>
      Object.fromEntries(
        categoryDefinitions.map(({ id, labelKey }) => [id, productT(labelKey)]),
      ) as Record<ProductCategory, string>,
    [productT],
  );
  const categoryDescriptionLabels = useMemo(
    () =>
      Object.fromEntries(
        categoryDefinitions.map(({ id, descriptionKey }) => [
          id,
          t(descriptionKey),
        ]),
      ) as Record<ProductCategory, string>,
    [t],
  );
  const productCounts = useMemo(() => {
    const counts = new Map<ProductCategory, number>();

    for (const product of products) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    }

    return counts;
  }, []);
  const editorCategory = categoryList.find(
    (category) => category.id === editorCategoryId,
  );
  const selectedCategory = categoryList.find(
    (category) => category.id === selectedCategoryId,
  );

  const openEditor = (category?: CategoryRecord) => {
    setEditorCategoryId(category?.id ?? null);
    setEditorSession((current) => current + 1);
    setIsEditorOpen(true);
  };

  const saveCategory = (fields: CategoryLocaleFields & { status: CategoryStatus }) => {
    if (editorCategory) {
      setCategoryList((current) =>
        current.map((category) =>
          category.id === editorCategory.id
            ? {
                ...category,
                localized: {
                  ...category.localized,
                  [locale]: {
                    name: fields.name,
                    description: fields.description,
                  },
                },
                status: fields.status,
              }
            : category,
        ),
      );
      toast.success(t("categoryUpdated"), {
        description: t("categoryUpdatedDescription", { name: fields.name }),
      });
    } else {
      const id = createCategoryId(fields.name);
      setCategoryList((current) => [
        ...current,
        {
          id,
          localized: {
            en: { name: fields.name, description: fields.description },
            km: { name: fields.name, description: fields.description },
          },
          status: fields.status,
        },
      ]);
      setSelectedCategoryId(id);
      toast.success(t("categoryCreated"), {
        description: t("categoryCreatedDescription", { name: fields.name }),
      });
    }

    setIsEditorOpen(false);
  };

  const deleteCategory = (categoryId: string) => {
    const categoryToDelete = categoryList.find(({ id }) => id === categoryId);
    if (!categoryToDelete || getProductCount(categoryToDelete, productCounts) > 0) {
      return;
    }

    const categoryName = getCategoryName(categoryToDelete, locale, categoryLabels);
    const nextCategories = categoryList.filter(({ id }) => id !== categoryId);
    setCategoryList(nextCategories);
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(nextCategories[0]?.id ?? "");
    }
    toast.success(t("categoryDeleted"), {
      description: t("categoryDeletedDescription", { name: categoryName }),
    });
  };

  const translatedStatusFilters = categoryStatusFilters.map((id) => ({
    id,
    label: t(id === "all" ? "allCategories" : id),
  }));

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("title")}
      rightPanel={
        <CategoryAside
          category={selectedCategory}
          categoryDescriptionLabels={categoryDescriptionLabels}
          categoryLabels={categoryLabels}
          locale={locale}
          productCounts={productCounts}
          onDeleteCategory={deleteCategory}
          onEditCategory={openEditor}
        />
      }
      rightPanelLabel={t("asideLabel")}
    >
      <CategoriesDataGrid
        categories={categoryList}
        categoryDescriptionLabels={categoryDescriptionLabels}
        categoryLabels={categoryLabels}
        locale={locale}
        onAddCategory={() => openEditor()}
        onCategorySelect={setSelectedCategoryId}
        productCounts={productCounts}
        selectedCategoryId={selectedCategoryId}
        statusOptions={translatedStatusFilters}
      />
      {isEditorOpen ? (
        <CategoryEditorModal
          key={editorSession}
          category={editorCategory}
          categoryDescriptionLabels={categoryDescriptionLabels}
          categoryLabels={categoryLabels}
          locale={locale}
          onOpenChange={setIsEditorOpen}
          onSave={saveCategory}
        />
      ) : null}
    </POSLayout>
  );
}

function CategoriesDataGrid({
  categories,
  categoryDescriptionLabels,
  categoryLabels,
  locale,
  onAddCategory,
  onCategorySelect,
  productCounts,
  selectedCategoryId,
  statusOptions,
}: {
  categories: CategoryRecord[];
  categoryDescriptionLabels: Record<ProductCategory, string>;
  categoryLabels: Record<ProductCategory, string>;
  locale: Locale;
  onAddCategory: () => void;
  onCategorySelect: (categoryId: string) => void;
  productCounts: Map<ProductCategory, number>;
  selectedCategoryId: string;
  statusOptions: Array<{ id: CategoryStatusFilter; label: string }>;
}) {
  const t = useTranslations("Category");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return categories.filter((category) => {
      const name = getCategoryName(category, locale, categoryLabels);
      const description = getCategoryDescription(
        category,
        locale,
        categoryDescriptionLabels,
      );
      const matchesSearch =
        !normalizedQuery ||
        `${name} ${category.id} ${description}`
          .toLocaleLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    categories,
    categoryDescriptionLabels,
    categoryLabels,
    locale,
    query,
    statusFilter,
  ]);

  const sortedCategories = useMemo(() => {
    const column = String(sortDescriptor.column ?? "name");
    const sorted = [...filteredCategories].sort((first, second) => {
      const firstValue = getCategorySortValue(
        first,
        column,
        locale,
        categoryLabels,
        productCounts,
      );
      const secondValue = getCategorySortValue(
        second,
        column,
        locale,
        categoryLabels,
        productCounts,
      );
      const comparison =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue));

      return sortDescriptor.direction === "descending" ? -comparison : comparison;
    });

    return sorted;
  }, [
    categoryLabels,
    filteredCategories,
    locale,
    productCounts,
    sortDescriptor,
  ]);

  const visibleSelectedId = sortedCategories.some(
    (category) => category.id === selectedCategoryId,
  )
    ? selectedCategoryId
    : (sortedCategories[0]?.id ?? "");
  const selectedKeys = useMemo<Selection>(
    () => (visibleSelectedId ? new Set([visibleSelectedId]) : new Set()),
    [visibleSelectedId],
  );

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") {
      return;
    }

    const selectedKey = Array.from(selection)[0];
    if (selectedKey !== undefined) {
      onCategorySelect(String(selectedKey));
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col space-y-3 overflow-hidden p-(--pos-content-padding) text-foreground">
      <CategoriesToolbar
        onAddCategory={onAddCategory}
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
              className="min-w-[520px]"
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              onSelectionChange={handleSelectionChange}
              onSortChange={setSortDescriptor}
            >
              <Table.Header className="sticky top-0 z-20">
                <Table.Column allowsSorting id="name" isRowHeader>
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableCategory")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="products" className="text-center">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-center"
                      sortDirection={sortDirection}
                    >
                      {t("tableProducts")}
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
                items={sortedCategories}
                renderEmptyState={() => (
                  <EmptyState className="p-10">
                    <EmptyState.Media>
                      <IconCategory aria-hidden="true" size={24} />
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
                {(category) => (
                  <CategoryTableRow
                    category={category}
                    categoryLabels={categoryLabels}
                    key={category.id}
                    locale={locale}
                    productCount={getProductCount(category, productCounts)}
                    onCategorySelect={onCategorySelect}
                  />
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <p aria-live="polite" className="shrink-0 text-xs text-muted">
        {t("categorySummary", {
          visible: sortedCategories.length,
          total: categories.length,
        })}
      </p>
    </div>
  );
}

function CategoriesToolbar({
  onAddCategory,
  onSearchChange,
  onStatusFilterChange,
  query,
  statusFilter,
  statusOptions,
}: {
  onAddCategory: () => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: CategoryStatusFilter) => void;
  query: string;
  statusFilter: CategoryStatusFilter;
  statusOptions: Array<{ id: CategoryStatusFilter; label: string }>;
}) {
  const t = useTranslations("Category");

  return (
    <div className="flex shrink-0 flex-col space-y-3">
      <Tabs
        className="min-w-0"
        selectedKey={statusFilter}
        variant="secondary"
        onSelectionChange={(key) =>
          onStatusFilterChange(String(key) as CategoryStatusFilter)
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
          aria-label={t("addCategory")}
          className="shrink-0"
          isIconOnly
          size="sm"
          type="button"
          onPress={onAddCategory}
        >
          <IconPlus aria-hidden="true" size={18} />
        </Button>
      </div>
    </div>
  );
}

function CategoryTableRow({
  category,
  categoryLabels,
  locale,
  productCount,
  onCategorySelect,
}: {
  category: CategoryRecord;
  categoryLabels: Record<ProductCategory, string>;
  locale: Locale;
  productCount: number;
  onCategorySelect: (categoryId: string) => void;
}) {
  const t = useTranslations("Category");
  const name = getCategoryName(category, locale, categoryLabels);

  return (
    <Table.Row
      id={category.id}
      textValue={`${name} ${category.id}`}
      onPress={() => onCategorySelect(category.id)}
    >
      <Table.Cell textValue={name}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar color="accent" size="sm" variant="default">
            <Avatar.Fallback>
              <CategoryGlyph category={category} size={18} />
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted">
              {category.productCategory ? t("standardCategory") : t("customCategory")}
            </p>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="text-center">
        <span className="text-sm font-medium tabular-nums text-foreground">
          {productCount}
        </span>
      </Table.Cell>
      <Table.Cell className="text-center">
        <CategoryStatusChip status={category.status} />
      </Table.Cell>
    </Table.Row>
  );
}

function CategoryAside({
  category,
  categoryDescriptionLabels,
  categoryLabels,
  locale,
  productCounts,
  onDeleteCategory,
  onEditCategory,
}: {
  category?: CategoryRecord;
  categoryDescriptionLabels: Record<ProductCategory, string>;
  categoryLabels: Record<ProductCategory, string>;
  locale: Locale;
  productCounts: Map<ProductCategory, number>;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (category: CategoryRecord) => void;
}) {
  const t = useTranslations("Category");

  if (!category) {
    return (
      <POSAside
        ariaLabelledBy="category-aside-title"
        headerClassName="p-[var(--pos-content-padding)]"
        mainClassName="flex min-h-0 flex-1 flex-col items-center justify-center p-[var(--pos-content-padding)] text-center text-muted"
        header={
          <h2
            id="category-aside-title"
            className="text-base font-bold tracking-tight text-foreground"
          >
            {t("detailsTitle")}
          </h2>
        }
      >
        <EmptyState className="p-10">
          <EmptyState.Media>
            <IconCategory aria-hidden="true" size={24} />
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

  const categoryName = getCategoryName(category, locale, categoryLabels);
  const categoryDescription = getCategoryDescription(
    category,
    locale,
    categoryDescriptionLabels,
  );
  const productCount = getProductCount(category, productCounts);
  const categoryProducts = category.productCategory
    ? products.filter((product) => product.category === category.productCategory)
    : [];

  return (
    <POSAside
      ariaLabelledBy="category-aside-title"
      headerClassName="p-[var(--pos-content-padding)]"
      mainClassName="flex min-h-0 flex-col gap-5 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)]"
      header={
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="category-aside-title"
              className="text-base font-bold tracking-tight text-foreground"
            >
              {t("detailsTitle")}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button
              aria-label={t("editCategory")}
              isIconOnly
              size="sm"
              type="button"
              variant="secondary"
              onPress={() => onEditCategory(category)}
            >
              <IconPencil aria-hidden="true" size={18} />
            </Button>
            <DeleteCategoryAlertDialog
              categoryName={categoryName}
              isDisabled={productCount > 0}
              onDelete={() => onDeleteCategory(category.id)}
            />
          </div>
        </div>
      }
    >
      <section aria-labelledby="selected-category-title" className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 shrink-0" color="accent" variant="default">
            <Avatar.Fallback>
              <CategoryGlyph category={category} size={22} />
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className="min-w-0 text-lg font-semibold tracking-tight text-foreground"
                id="selected-category-title"
              >
                {categoryName}
              </h3>
            </div>
            <p className="mt-1 text-sm leading-5 text-muted">
              {categoryDescription || t("noDescription")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CategoryMetadata
            label={t("productCount")}
            value={t("productCountValue", { count: productCount })}
          />
          <CategoryMetadata
            label={t("categoryType")}
            value={
              category.productCategory
                ? t("standardCategory")
                : t("customCategory")
            }
          />
        </div>
      </section>

      <section
        aria-labelledby="category-products-title"
        className="space-y-3 border-t border-border/70 pt-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-sm font-semibold text-foreground"
            id="category-products-title"
          >
            {t("productsInCategory")}
          </h3>
          <span className="text-xs tabular-nums text-muted">{productCount}</span>
        </div>
        {categoryProducts.length > 0 ? (
          <div className="space-y-2">
            {categoryProducts.slice(0, 4).map((product) => (
              <CategoryProductRow key={product.id} locale={locale} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-surface-secondary/50 px-3 py-3 text-sm text-muted">
            {t("noProducts")}
          </p>
        )}
        {productCount > 0 ? (
          <p className="text-xs leading-5 text-muted">
            {t("deleteRestriction")}
          </p>
        ) : null}
      </section>
    </POSAside>
  );
}

function CategoryProductRow({
  locale,
  product,
}: {
  locale: Locale;
  product: Product;
}) {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "km" ? "km-KH" : "en-US", {
        currency: "USD",
        maximumFractionDigits: 2,
        style: "currency",
      }),
    [locale],
  );

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="shrink-0" color="accent" size="sm" variant="default">
          <Avatar.Image alt="" src={getProductImage(product.id)} />
          <Avatar.Fallback>{product.name[locale].charAt(0)}</Avatar.Fallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {product.name[locale]}
          </p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
            {product.sku ?? product.id}
          </p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {formatter.format(product.price)}
      </span>
    </div>
  );
}

function CategoryMetadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-surface-secondary/50 p-3">
      <p className="truncate text-[10px] font-medium text-muted">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function CategoryStatusChip({ status }: { status: CategoryStatus }) {
  const t = useTranslations("Category");

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

function CategoryEditorModal({
  category,
  categoryDescriptionLabels,
  categoryLabels,
  locale,
  onOpenChange,
  onSave,
}: {
  category?: CategoryRecord;
  categoryDescriptionLabels: Record<ProductCategory, string>;
  categoryLabels: Record<ProductCategory, string>;
  locale: Locale;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (fields: CategoryLocaleFields & { status: CategoryStatus }) => void;
}) {
  const t = useTranslations("Category");
  const [name, setName] = useState(
    category ? getCategoryName(category, locale, categoryLabels) : "",
  );
  const [description, setDescription] = useState(
    category
      ? getCategoryDescription(category, locale, categoryDescriptionLabels)
      : "",
  );
  const [isActive, setIsActive] = useState(category?.status !== "inactive");
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const isEditMode = Boolean(category);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setIsNameInvalid(true);
      document.getElementById("category-name")?.focus();
      return;
    }

    onSave({
      name: cleanName,
      description: description.trim(),
      status: isActive ? "active" : "inactive",
    });
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen
        variant="blur"
        onOpenChange={onOpenChange}
      >
        <Modal.Container scroll="inside">
          <Modal.Dialog
            aria-describedby="category-editor-description"
            aria-labelledby="category-editor-title"
          >
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="space-y-1">
                <Modal.Heading id="category-editor-title">
                  {isEditMode ? t("editTitle") : t("createTitle")}
                </Modal.Heading>
                <p
                  className="text-sm text-muted"
                  id="category-editor-description"
                >
                  {isEditMode ? t("editDescription") : t("createDescription")}
                </p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Form
                id="category-editor-form"
                className="flex flex-col"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-5">
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
                      id="category-name"
                      maxLength={48}
                      placeholder={t("namePlaceholder")}
                    />
                    <FieldError>{t("nameRequired")}</FieldError>
                  </TextField>
                  <TextField
                    className="w-full"
                    name="description"
                    value={description}
                    variant="secondary"
                    onChange={setDescription}
                  >
                    <Label>{t("descriptionLabel")}</Label>
                    <TextArea
                      maxLength={160}
                      placeholder={t("descriptionPlaceholder")}
                      rows={3}
                    />
                  </TextField>
                  <div className="w-full rounded-xl border border-border/70 bg-surface-secondary/40 p-3">
                    <Switch
                      className="w-full"
                      isSelected={isActive}
                      onChange={setIsActive}
                    >
                      <Switch.Content className="flex w-full items-center justify-between">
                        <div>
                          <Label>
                            {t("activeCategory")}
                          </Label>
                          <p className="mt-0.5 text-xs text-muted">
                            {t("activeCategoryDescription")}
                          </p>
                        </div>
                        <Switch.Control className="shrink-0">
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Content>
                    </Switch>
                  </div>
                </div>
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
              <Button form="category-editor-form" type="submit">
                {isEditMode ? t("saveChanges") : t("createCategory")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function DeleteCategoryAlertDialog({
  categoryName,
  isDisabled,
  onDelete,
}: {
  categoryName: string;
  isDisabled: boolean;
  onDelete: () => void;
}) {
  const t = useTranslations("Category");

  return (
    <AlertDialog>
      <Button
        aria-label={t("deleteCategory")}
        isDisabled={isDisabled}
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
                {t("deleteHeading", { name: categoryName })}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="text-center">
              <p>{t("deleteDescription")}</p>
            </AlertDialog.Body>
            <AlertDialog.Footer className="flex-col-reverse">
              <Button className="w-full" slot="close" variant="secondary">
                {t("cancel")}
              </Button>
              <Button
                className="w-full"
                slot="close"
                variant="danger"
                onPress={onDelete}
              >
                {t("deleteCategory")}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

function getCategoryName(
  category: CategoryRecord,
  locale: Locale,
  categoryLabels: Record<ProductCategory, string>,
) {
  return (
    category.localized[locale]?.name ??
    (category.productCategory
      ? categoryLabels[category.productCategory]
      : category.localized.en?.name ?? category.id)
  );
}

function getCategoryDescription(
  category: CategoryRecord,
  locale: Locale,
  categoryDescriptionLabels: Record<ProductCategory, string>,
) {
  return (
    category.localized[locale]?.description ??
    (category.productCategory
      ? categoryDescriptionLabels[category.productCategory]
      : category.localized.en?.description ?? "")
  );
}

function CategoryGlyph({
  category,
  size,
}: {
  category: CategoryRecord;
  size: number;
}) {
  switch (category.productCategory) {
    case "signature":
      return <IconSparkles aria-hidden="true" size={size} />;
    case "icedCoffee":
      return <IconCup aria-hidden="true" size={size} />;
    case "hotCoffee":
      return <IconCoffee aria-hidden="true" size={size} />;
    case "tea":
      return <IconLeaf aria-hidden="true" size={size} />;
    case "smoothie":
      return <IconMilkshake aria-hidden="true" size={size} />;
    case "juice":
      return <IconGlassFull aria-hidden="true" size={size} />;
    case "breakfast":
      return <IconEgg aria-hidden="true" size={size} />;
    case "sandwich":
      return <IconBurger aria-hidden="true" size={size} />;
    case "bakery":
      return <IconBread aria-hidden="true" size={size} />;
    case "dessert":
      return <IconCake aria-hidden="true" size={size} />;
    case "snack":
      return <IconCookie aria-hidden="true" size={size} />;
    default:
      return <IconCategory aria-hidden="true" size={size} />;
  }
}

function getProductCount(
  category: CategoryRecord,
  productCounts: Map<ProductCategory, number>,
) {
  return category.productCategory
    ? (productCounts.get(category.productCategory) ?? 0)
    : 0;
}

function getCategorySortValue(
  category: CategoryRecord,
  column: string,
  locale: Locale,
  categoryLabels: Record<ProductCategory, string>,
  productCounts: Map<ProductCategory, number>,
) {
  switch (column) {
    case "products":
      return getProductCount(category, productCounts);
    case "status":
      return category.status;
    case "name":
    default:
      return getCategoryName(category, locale, categoryLabels);
  }
}

function createCategoryId(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `custom-${slug || "category"}-${Date.now().toString(36)}`;
}
