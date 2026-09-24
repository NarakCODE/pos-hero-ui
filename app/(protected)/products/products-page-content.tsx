"use client";

import {
  Avatar,
  Button,
  Chip,
  Label,
  ListBox,
  Pagination,
  Popover,
  SearchField,
  Select,
  Table,
  Tabs,
  toast,
} from "@heroui/react";
import type { Key, Selection, SortDescriptor } from "@heroui/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconAdjustmentsHorizontal,
  IconCategory,
  IconPackage,
  IconRefresh,
} from "@tabler/icons-react";
import { DeleteProductAlertDialog } from "@/components/product/delete-product-alert-dialog";
import { ProductFormModal } from "@/components/product/product-form-modal";
import { getProductImage } from "@/components/product/product-images";
import { Carousel } from "@/components/shared/carousel";
import { EmptyState } from "@/components/shared/empty-state";
import { POSAside } from "@/components/shared/pos-aside";
import { POSLayout } from "@/components/shared/pos-layout";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";
import {
  products,
  sizeIds,
  type Product,
  type ProductCategory,
  type SizeId,
} from "../sales/data";

type ProductStatus = "active" | "inactive";
type ProductStatusFilter = "all" | ProductStatus;
type StockFilter = "all" | "inStock" | "outOfStock";
type CategoryFilter = "all" | ProductCategory;
type PageSize = 25 | 50 | 100;

const managedProducts = products;
const pageSizes: PageSize[] = [25, 50, 100];
const productVariantDetails = {
  extraSmall: {
    labelKey: "variantSizeExtraSmall",
    skuSuffix: "XS",
    priceAdjustment: -0.75,
  },
  small: {
    labelKey: "variantSizeSmall",
    skuSuffix: "S",
    priceAdjustment: -0.25,
  },
  medium: {
    labelKey: "variantSizeMedium",
    skuSuffix: "M",
    priceAdjustment: 0,
  },
  large: {
    labelKey: "variantSizeLarge",
    skuSuffix: "L",
    priceAdjustment: 0.75,
  },
} as const satisfies Record<
  SizeId,
  { labelKey: string; skuSuffix: string; priceAdjustment: number }
>;

export function ProductsPageContent() {
  const t = useTranslations("Product");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;
  const [productList, setProductList] = useState<Product[]>(managedProducts);
  const [selectedProductId, setSelectedProductId] = useState(
    managedProducts[0]?.id ?? "",
  );
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "km" ? "km-KH" : "en-US", {
        currency: "USD",
        maximumFractionDigits: 2,
        style: "currency",
      }),
    [locale],
  );
  const categoryLabels: Record<ProductCategory, string> = {
    signature: t("categorySignature"),
    icedCoffee: t("categoryIcedCoffee"),
    hotCoffee: t("categoryHotCoffee"),
    tea: t("categoryTea"),
    smoothie: t("categorySmoothie"),
    juice: t("categoryJuice"),
    breakfast: t("categoryBreakfast"),
    sandwich: t("categorySandwich"),
    bakery: t("categoryBakery"),
    dessert: t("categoryDessert"),
    snack: t("categorySnack"),
  };

  const handleDeleteProduct = (productId: string) => {
    const targetProduct = productList.find((p) => p.id === productId);
    const productName = targetProduct ? targetProduct.name[locale] : "";
    setProductList((current) => {
      const updated = current.filter((p) => p.id !== productId);
      if (selectedProductId === productId) {
        setSelectedProductId(updated[0]?.id ?? "");
      }
      return updated;
    });
    toast.success(t("productDeleted"), {
      description: t("productDeletedDescription", { name: productName }),
    });
  };

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("title")}
      rightPanel={
        <ProductAside
          allProducts={productList}
          categoryLabels={categoryLabels}
          formatter={formatter}
          onDeleteProduct={handleDeleteProduct}
          selectedProductId={selectedProductId}
        />
      }
      rightPanelLabel={t("asideLabel")}
    >
      <ProductsDataGrid
        allProducts={productList}
        categoryLabels={categoryLabels}
        formatter={formatter}
        locale={locale}
        onProductSelect={setSelectedProductId}
        selectedProductId={selectedProductId}
      />
    </POSLayout>
  );
}

function ProductsDataGrid({
  allProducts = managedProducts,
  categoryLabels,
  formatter,
  locale,
  onProductSelect,
  selectedProductId,
}: {
  allProducts?: Product[];
  categoryLabels: Record<ProductCategory, string>;
  formatter: Intl.NumberFormat;
  locale: Locale;
  onProductSelect: (productId: string) => void;
  selectedProductId: string;
}) {
  const t = useTranslations("Product");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "product",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(25);

  const categoryOptions: Array<{ id: CategoryFilter; label: string }> = [
    { id: "all", label: t("categoryAll") },
    { id: "signature", label: categoryLabels.signature },
    { id: "icedCoffee", label: categoryLabels.icedCoffee },
    { id: "hotCoffee", label: categoryLabels.hotCoffee },
    { id: "tea", label: categoryLabels.tea },
    { id: "smoothie", label: categoryLabels.smoothie },
    { id: "juice", label: categoryLabels.juice },
    { id: "breakfast", label: categoryLabels.breakfast },
    { id: "sandwich", label: categoryLabels.sandwich },
    { id: "bakery", label: categoryLabels.bakery },
    { id: "dessert", label: categoryLabels.dessert },
    { id: "snack", label: categoryLabels.snack },
  ];
  const statusOptions: Array<{ id: ProductStatusFilter; label: string }> = [
    { id: "all", label: t("statusAll") },
    { id: "active", label: t("statusActive") },
    { id: "inactive", label: t("statusInactive") },
  ];
  const stockOptions: Array<{ id: StockFilter; label: string }> = [
    { id: "all", label: t("stockAll") },
    { id: "inStock", label: t("stockInStock") },
    { id: "outOfStock", label: t("stockOutOfStock") },
  ];

  const activeFilterCount =
    Number(categoryFilter !== "all") + Number(stockFilter !== "all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allProducts.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        [product.name.en, product.name.km, product.sku ?? ""].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const matchesStatus =
        statusFilter === "all" || getProductStatus(product) === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock =
        stockFilter === "all" || getStockStatus(product) === stockFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesStock;
    });
  }, [allProducts, categoryFilter, query, statusFilter, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const sortedProducts = useMemo(
    () =>
      [...filteredProducts].sort((first, second) =>
        compareProducts(first, second, sortDescriptor, categoryLabels),
      ),
    [categoryLabels, filteredProducts, sortDescriptor],
  );
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    return sortedProducts.slice(start, start + pageSize);
  }, [pageSize, safePage, sortedProducts]);
  const selectedKeys = useMemo<Selection>(
    () => (selectedProductId ? new Set([selectedProductId]) : new Set()),
    [selectedProductId],
  );

  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const updateStatusFilter = (value: ProductStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const updateCategoryFilter = (value: CategoryFilter) => {
    setCategoryFilter(value);
    setPage(1);
  };

  const updateStockFilter = (value: StockFilter) => {
    setStockFilter(value);
    setPage(1);
  };

  const updatePageSize = (value: Key | Key[] | null) => {
    const nextPageSize = Number(normalizeFilterValue(value));

    if (pageSizes.includes(nextPageSize as PageSize)) {
      setPageSize(nextPageSize as PageSize);
      setPage(1);
    }
  };

  const handleSelectionChange = (selection: Selection) => {
    if (selection === "all") {
      return;
    }

    const selectedKey = Array.from(selection)[0];

    if (selectedKey !== undefined) {
      onProductSelect(String(selectedKey));
    }
  };

  const handleResetFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setStockFilter("all");
    setPage(1);
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col space-y-3 overflow-hidden p-(--pos-content-padding) text-foreground">
      <ProductsToolbar
        activeFilterCount={activeFilterCount}
        categoryFilter={categoryFilter}
        categoryOptions={categoryOptions}
        onCategoryFilterChange={updateCategoryFilter}
        onResetFilters={handleResetFilters}
        onSearchChange={updateQuery}
        onStatusFilterChange={updateStatusFilter}
        onStockFilterChange={updateStockFilter}
        query={query}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        stockFilter={stockFilter}
        stockOptions={stockOptions}
      />

      <div className="flex min-h-0 flex-1">
        <Table className="min-h-0 flex-1" variant="secondary">
          <Table.ScrollContainer className="min-h-0 flex-1 overflow-auto overscroll-contain">
            <Table.Content
              aria-label={t("tableLabel")}
              className="min-w-[720px]"
              selectedKeys={selectedKeys}
              selectionMode="single"
              sortDescriptor={sortDescriptor}
              onSelectionChange={handleSelectionChange}
              onSortChange={setSortDescriptor}
            >
              <Table.Header className="sticky top-0 z-20">
                <Table.Column allowsSorting id="product" isRowHeader>
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableProduct")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="sku">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableSku")}
                    </Table.SortableColumnHeader>
                  )}
                </Table.Column>
                <Table.Column allowsSorting id="category">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader sortDirection={sortDirection}>
                      {t("tableCategory")}
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
                <Table.Column allowsSorting id="stock" className="text-center">
                  {({ sortDirection }) => (
                    <Table.SortableColumnHeader
                      className="justify-center"
                      sortDirection={sortDirection}
                    >
                      {t("tableStock")}
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
                items={paginatedProducts}
                renderEmptyState={() => (
                  <EmptyState className="p-10">
                    <EmptyState.Media>
                      <IconPackage aria-hidden="true" size={24} />
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
                {(product) => (
                  <ProductTableRow
                    categoryLabels={categoryLabels}
                    formatter={formatter}
                    key={product.id}
                    locale={locale}
                    product={product}
                    onProductSelect={onProductSelect}
                  />
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      <div className="shrink-0">
        <ProductsPagination
          page={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={updatePageSize}
        />
      </div>
    </div>
  );
}

function ProductsToolbar({
  activeFilterCount,
  categoryFilter,
  categoryOptions,
  onCategoryFilterChange,
  onResetFilters,
  onSearchChange,
  onStatusFilterChange,
  onStockFilterChange,
  query,
  statusFilter,
  statusOptions,
  stockFilter,
  stockOptions,
}: {
  activeFilterCount: number;
  categoryFilter: CategoryFilter;
  categoryOptions: Array<{ id: CategoryFilter; label: string }>;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  onResetFilters: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: ProductStatusFilter) => void;
  onStockFilterChange: (value: StockFilter) => void;
  query: string;
  statusFilter: ProductStatusFilter;
  statusOptions: Array<{ id: ProductStatusFilter; label: string }>;
  stockFilter: StockFilter;
  stockOptions: Array<{ id: StockFilter; label: string }>;
}) {
  const t = useTranslations("Product");
  const router = useRouter();

  return (
    <div className="flex shrink-0 flex-col space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Tabs
          className="min-w-0"
          selectedKey={statusFilter}
          variant="secondary"
          onSelectionChange={(key) =>
            onStatusFilterChange(String(key) as ProductStatusFilter)
          }
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label={t("statusLabel")}>
              {statusOptions.map((option) => (
                <Tabs.Tab
                  key={option.id}
                  id={option.id}
                  className="w-auto shrink-0 whitespace-nowrap"
                >
                  {option.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>

        <Button
          aria-label={t("manageCategories")}
          className="shrink-0"
          size="sm"
          type="button"
          variant="secondary"
          onPress={() => router.push("/categories")}
        >
          <IconCategory aria-hidden="true" size={18} />
          <span className="hidden sm:inline">{t("manageCategories")}</span>
        </Button>
      </div>

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

        <ProductFormModal mode="create" />

        <Popover>
          <Button
            aria-label={t("filters")}
            className="relative shrink-0"
            isIconOnly
            variant="secondary"
          >
            <IconAdjustmentsHorizontal aria-hidden="true" size={18} />
            {activeFilterCount > 0 ? (
              <Chip
                className="absolute -inset-e-1 -top-1"
                color="accent"
                size="sm"
                variant="soft"
              >
                {activeFilterCount}
              </Chip>
            ) : null}
          </Button>

          <Popover.Content
            className="w-[340px] max-w-[95vw] sm:w-[420px]"
            placement="bottom end"
          >
            <Popover.Dialog className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Popover.Heading>
                    {t("filters")}
                  </Popover.Heading>
                  {activeFilterCount > 0 ? (
                    <Chip
                      color="accent"
                      size="sm"
                      variant="soft"
                    >
                      {activeFilterCount}
                    </Chip>
                  ) : null}
                </div>
                {activeFilterCount > 0 ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={onResetFilters}
                  >
                    <IconRefresh aria-hidden="true" size={14} />
                    {t("filterReset")}
                  </Button>
                ) : null}
              </div>

              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4 text-start text-sm">
                <ProductFilterSelect
                  ariaLabel={t("filterCategoryLabel")}
                  label={t("filterCategoryLabel")}
                  options={categoryOptions}
                  selectedValue={categoryFilter}
                  onChange={onCategoryFilterChange}
                />
                <ProductFilterSelect
                  ariaLabel={t("filterStockLabel")}
                  label={t("filterStockLabel")}
                  options={stockOptions}
                  selectedValue={stockFilter}
                  onChange={onStockFilterChange}
                />
              </div>
            </Popover.Dialog>
          </Popover.Content>
        </Popover>
      </div>
    </div>
  );
}

type ProductFilterOption<T extends string> = {
  id: T;
  label: string;
};

function ProductFilterSelect<T extends string>({
  ariaLabel,
  label,
  onChange,
  options,
  selectedValue,
}: {
  ariaLabel: string;
  label: string;
  onChange: (value: T) => void;
  options: ProductFilterOption<T>[];
  selectedValue: T;
}) {
  const currentOption = options.find((option) => option.id === selectedValue);

  return (
    <Select
      aria-label={ariaLabel}
      className="w-full"
      value={selectedValue}
      variant="secondary"
      onChange={(value) => {
        const nextValue = normalizeFilterValue(value);

        if (nextValue) {
          onChange(nextValue as T);
        }
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger className="w-full justify-start text-start">
        <Select.Value>
          {({ defaultChildren, isPlaceholder }) =>
            isPlaceholder || !currentOption ? (
              defaultChildren
            ) : (
              <span>{currentOption.label}</span>
            )
          }
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover placement="bottom start">
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              className="text-start"
              id={option.id}
              key={option.id}
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

function ProductTableRow({
  categoryLabels,
  formatter,
  locale,
  onProductSelect,
  product,
}: {
  categoryLabels: Record<ProductCategory, string>;
  formatter: Intl.NumberFormat;
  locale: Locale;
  onProductSelect: (productId: string) => void;
  product: Product;
}) {
  const t = useTranslations("Product");

  const productName = product.name[locale];
  const productStatus = getProductStatus(product);
  const stockStatus = getStockStatus(product);

  return (
    <Table.Row
      id={product.id}
      textValue={`${productName} ${product.sku ?? ""}`}
      onPress={() => onProductSelect(product.id)}
    >
      <Table.Cell textValue={productName}>
        <div className="flex min-w-0 items-center gap-3">
          <Avatar color="accent" size="sm" variant="soft">
            <Avatar.Image alt="" src={getProductImage(product.id)} />
            <Avatar.Fallback>{productName.charAt(0)}</Avatar.Fallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {productName}
            </p>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="text-sm tabular-nums text-muted">
          {product.sku ?? "--"}
        </span>
      </Table.Cell>
      <Table.Cell>{categoryLabels[product.category]}</Table.Cell>
      <Table.Cell className="text-end">
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatter.format(product.price)}
        </span>
      </Table.Cell>
      <Table.Cell className="text-center">
        <Chip
          color={stockStatus === "inStock" ? "success" : "danger"}
          size="sm"
          variant={stockStatus === "inStock" ? "secondary" : "soft"}
        >
          {stockStatus === "inStock" ? t("inStock") : t("outOfStock")}
        </Chip>
      </Table.Cell>
      <Table.Cell className="text-center">
        <Chip
          color={productStatus === "active" ? "accent" : "default"}
          size="sm"
          variant="soft"
        >
          {productStatus === "active" ? t("active") : t("inactive")}
        </Chip>
      </Table.Cell>
    </Table.Row>
  );
}

function ProductAside({
  allProducts,
  categoryLabels,
  formatter,
  onDeleteProduct,
  selectedProductId,
}: {
  allProducts: Product[];
  categoryLabels: Record<ProductCategory, string>;
  formatter: Intl.NumberFormat;
  onDeleteProduct?: (productId: string) => void;
  selectedProductId: string;
}) {
  const t = useTranslations("Product");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;
  const selectedProduct =
    allProducts.find((product) => product.id === selectedProductId) ??
    allProducts[0];

  if (!selectedProduct) {
    return (
      <POSAside
        ariaLabelledBy="products-aside-title"
        headerClassName="p-[var(--pos-content-padding)]"
        mainClassName="flex min-h-0 flex-1 flex-col items-center justify-center p-[var(--pos-content-padding)] text-center text-muted"
        header={
          <div className="flex items-center gap-3">
            <h2
              id="products-aside-title"
              className="text-base font-bold tracking-tight text-foreground"
            >
              {t("asideTitle")}
            </h2>
          </div>
        }
      >
        <EmptyState className="p-10">
          <EmptyState.Media>
            <IconPackage aria-hidden="true" size={24} />
          </EmptyState.Media>
          <EmptyState.Header>
            <EmptyState.Title>{t("emptyTitle")}</EmptyState.Title>
            <EmptyState.Description>
              {t("emptyDescription")}
            </EmptyState.Description>
          </EmptyState.Header>
        </EmptyState>
      </POSAside>
    );
  }

  const variantSkuPrefix =
    selectedProduct.sku ?? selectedProduct.id.slice(0, 8).toUpperCase();

  return (
    <POSAside
      ariaLabelledBy="products-aside-title"
      headerClassName="p-[var(--pos-content-padding)]"
      mainClassName="flex min-h-0 flex-col gap-5 overflow-y-auto px-[var(--pos-content-padding)] py-[var(--pos-content-padding)]"
      header={
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h2
                  id="products-aside-title"
                  className="truncate text-base font-bold tracking-tight text-foreground"
                >
                  {t("asideTitle")}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <ProductFormModal
                mode="edit"
                product={selectedProduct}
              />
              {onDeleteProduct ? (
                <DeleteProductAlertDialog
                  isIconOnly
                  productName={selectedProduct.name[locale]}
                  onDelete={() => onDeleteProduct(selectedProduct.id)}
                />
              ) : null}
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">
            {t("asideDescription")}
          </p>
        </>
      }
    >
      <section aria-labelledby="selected-product-title" className="space-y-4">
        <Carousel
          aria-label={t("galleryLabel")}
          getSlideLabel={(index, count) =>
            t("gallerySlideLabel", { current: index + 1, total: count })
          }
          nextLabel={t("galleryNext")}
          previousLabel={t("galleryPrevious")}
        >
          <Carousel.Content aria-label={t("gallerySlides")}>
            {sizeIds.map((sizeId) => {
              const variantLabel = t(productVariantDetails[sizeId].labelKey);

              return (
                <Carousel.Item
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-default"
                  key={sizeId}
                >
                  <div
                    aria-label={`${selectedProduct.name[locale]} · ${variantLabel}`}
                    className="absolute inset-0 bg-cover bg-center outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
                    role="img"
                    style={{
                      backgroundImage: `url("${getProductImage(`${selectedProduct.id}-${sizeId}`)}")`,
                    }}
                  />
                </Carousel.Item>
              );
            })}
          </Carousel.Content>
          <Carousel.Previous />
          <Carousel.Next />
          <Carousel.Dots aria-label={t("galleryPagination")} />
          <Carousel.Thumbnails
            aria-label={t("galleryThumbnails")}
            className="mt-2"
          >
            {sizeIds.map((sizeId) => {
              const variantLabel = t(productVariantDetails[sizeId].labelKey);

              return (
                <Carousel.Thumbnail
                  aria-label={t("galleryShowVariant", {
                    variant: variantLabel,
                  })}
                  key={sizeId}
                  src={getProductImage(`${selectedProduct.id}-${sizeId}`)}
                />
              );
            })}
          </Carousel.Thumbnails>
        </Carousel>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate text-lg font-semibold tracking-tight text-foreground"
              id="selected-product-title"
            >
              {selectedProduct.name[locale]}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {categoryLabels[selectedProduct.category]}
            </p>
          </div>
          <p className="shrink-0 text-base font-semibold tabular-nums text-foreground">
            {formatter.format(selectedProduct.price)}
          </p>
        </div>

        {selectedProduct.description?.[locale] ? (
          <p className="line-clamp-3 text-sm leading-5 text-muted">
            {selectedProduct.description[locale]}
          </p>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <ProductMetadata
            label={t("sku")}
            value={selectedProduct.sku ?? "--"}
          />
          <ProductMetadata
            label={t("stock")}
            value={t("stockAmount", {
              count: getStockAmount(selectedProduct),
            })}
          />
        </div>
      </section>

      <section
        aria-labelledby="product-variants-title"
        className="space-y-3 border-t border-border/70 pt-4"
      >
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-sm font-semibold text-foreground"
            id="product-variants-title"
          >
            {t("variants")}
          </h3>
          <span className="text-xs tabular-nums text-muted">
            {t("variantCount", { count: sizeIds.length })}
          </span>
        </div>
        <div className="space-y-2">
          {sizeIds.map((sizeId) => {
            const variant = productVariantDetails[sizeId];
            const variantLabel = t(variant.labelKey);

            return (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2.5"
                key={sizeId}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    aria-hidden="true"
                    className="shrink-0"
                    color="accent"
                    size="sm"
                    variant="soft"
                  >
                    <Avatar.Image
                      alt=""
                      src={getProductImage(`${selectedProduct.id}-${sizeId}`)}
                    />
                    <Avatar.Fallback>{variantLabel.charAt(0)}</Avatar.Fallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {variantLabel}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
                      {variantSkuPrefix}-{variant.skuSuffix}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {sizeId === "medium" ? (
                    <Chip color="accent" size="sm" variant="soft">
                      {t("variantDefault")}
                    </Chip>
                  ) : null}
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {formatter.format(
                      Math.max(
                        0,
                        selectedProduct.price + variant.priceAdjustment,
                      ),
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </POSAside>
  );
}

function ProductMetadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-surface-secondary/50 p-3">
      <p className="truncate text-[10px] font-medium tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function ProductsPagination({
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  totalPages,
}: {
  onPageChange: (page: number) => void;
  onPageSizeChange: (value: Key | Key[] | null) => void;
  page: number;
  pageSize: PageSize;
  totalPages: number;
}) {
  const t = useTranslations("Product");

  return (
    <div className="flex w-full shrink-0 items-center justify-between gap-3">
      <Select
        aria-label={t("paginationRows")}
        className="w-28 shrink-0"
        value={String(pageSize)}
        variant="secondary"
        onChange={onPageSizeChange}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {pageSizes.map((size) => (
              <ListBox.Item
                key={size}
                id={String(size)}
                textValue={String(size)}
              >
                {size}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Pagination className="justify-end">
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              aria-label={t("paginationPrevious")}
              isDisabled={page === 1}
              onPress={() => onPageChange(Math.max(1, page - 1))}
            >
              <Pagination.PreviousIcon />
            </Pagination.Previous>
          </Pagination.Item>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Pagination.Item key={pageNumber}>
                <Pagination.Link
                  isActive={pageNumber === page}
                  onPress={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}
          <Pagination.Item>
            <Pagination.Next
              aria-label={t("paginationNext")}
              isDisabled={page === totalPages}
              onPress={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}

function getProductStatus(product: Product): ProductStatus {
  return product.status ?? "active";
}

function getStockStatus(product: Product): Exclude<StockFilter, "all"> {
  return getStockAmount(product) > 0 ? "inStock" : "outOfStock";
}

function getStockAmount(product: Product): number {
  return product.stock ?? (product.inStock === false ? 0 : 50);
}

function compareProducts(
  first: Product,
  second: Product,
  descriptor: SortDescriptor,
  categoryLabels: Record<ProductCategory, string>,
) {
  const column = String(descriptor.column ?? "product");
  const firstValue = getProductSortValue(first, column, categoryLabels);
  const secondValue = getProductSortValue(second, column, categoryLabels);
  const comparison =
    typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue));

  return descriptor.direction === "descending" ? comparison * -1 : comparison;
}

function getProductSortValue(
  product: Product,
  column: string,
  categoryLabels: Record<ProductCategory, string>,
) {
  switch (column) {
    case "sku":
      return product.sku ?? "";
    case "category":
      return categoryLabels[product.category];
    case "price":
      return product.price;
    case "stock":
      return getStockStatus(product);
    case "status":
      return getProductStatus(product);
    case "product":
    default:
      return product.name.en;
  }
}

function normalizeFilterValue(value: Key | Key[] | null) {
  return Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
}
