"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  Add,
  Card,
  Scan,
  Wallet,
} from "reicon-react";
import { ProductCard } from "@/components/product-card";
import { OrderPanel, type OrderPanelItem } from "@/components/order-panel";
import { Button, SearchField, Tabs } from "@heroui/react";
import { POSLayout } from "@/components/shared/pos-layout";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";

import {
  type AddOnId,
  addOnIds,
  type CategoryId,
  categoryIds,
  getProduct,
  type IceId,
  iceIds,
  initialOrderItems,
  type OrderItem,
  type PaymentMethodId,
  type Product,
  products,
  type SizeId,
  sizeIds,
  type SweetnessId,
  sweetnessIds,
} from "./data";

export default function SalesPage() {
  const t = useTranslations("SalesMenu");
  const currentLocale = useLocale();
  const locale: Locale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("favourites");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<SizeId>("medium");
  const [selectedIce, setSelectedIce] = useState<IceId>("regularIce");
  const [selectedSweetness, setSelectedSweetness] = useState<SweetnessId>("lessSugar");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>("cash");
  const [orderType, setOrderType] = useState<"takeaway" | "dineIn">("takeaway");
  const [isPaid, setIsPaid] = useState(false);

  const categoryOptions: Array<{ id: CategoryId; label: string }> = useMemo(
    () => categoryIds.map((id) => ({ id, label: t(`categories.${id}`) })),
    [t],
  );

  const sizeOptions: Array<{ id: SizeId; label: string }> = useMemo(
    () => sizeIds.map((id) => ({ id, label: t(`modifiers.${id}`) })),
    [t],
  );

  const iceOptions: Array<{ id: IceId; label: string }> = useMemo(
    () => iceIds.map((id) => ({ id, label: t(`modifiers.${id}`) })),
    [t],
  );

  const sweetnessOptions: Array<{ id: SweetnessId; label: string }> = useMemo(
    () => sweetnessIds.map((id) => ({ id, label: t(`modifiers.${id}`) })),
    [t],
  );

  const addOnOptions: Array<{ id: AddOnId; label: string }> = useMemo(
    () => addOnIds.map((id) => ({ id, label: t(`modifiers.${id}`) })),
    [t],
  );

  const sizeLabels: Record<SizeId, string> = useMemo(
    () => ({
      extraSmall: t("modifiers.extraSmall"),
      small: t("modifiers.small"),
      medium: t("modifiers.medium"),
      large: t("modifiers.large"),
      extraLarge: t("modifiers.extraLarge"),
    }),
    [t],
  );

  const iceLabels: Record<IceId, string> = useMemo(
    () => ({
      regularIce: t("modifiers.regularIce"),
      lessIce: t("modifiers.lessIce"),
      noIce: t("modifiers.noIce"),
      warm: t("modifiers.warm"),
      hot: t("modifiers.hot"),
    }),
    [t],
  );

  const sweetnessLabels: Record<SweetnessId, string> = useMemo(
    () => ({
      noSugar: t("modifiers.noSugar"),
      quarterSugar: t("modifiers.quarterSugar"),
      lessSugar: t("modifiers.lessSugar"),
      regularSugar: t("modifiers.regularSugar"),
      extraSugar: t("modifiers.extraSugar"),
    }),
    [t],
  );

  const addOnLabels: Record<AddOnId, string> = useMemo(
    () => ({
      espressoShot: t("modifiers.espressoShot"),
      oatMilk: t("modifiers.oatMilk"),
      almondMilk: t("modifiers.almondMilk"),
      soyMilk: t("modifiers.soyMilk"),
      whippedCream: t("modifiers.whippedCream"),
      caramelDrizzle: t("modifiers.caramelDrizzle"),
      vanillaSyrup: t("modifiers.vanillaSyrup"),
      hazelnutSyrup: t("modifiers.hazelnutSyrup"),
      bobaPearls: t("modifiers.bobaPearls"),
      cheeseFoam: t("modifiers.cheeseFoam"),
      grassJelly: t("modifiers.grassJelly"),
      coconutJelly: t("modifiers.coconutJelly"),
    }),
    [t],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "favourites"
          ? product.favorite
          : selectedCategory === "bestSellers"
            ? product.bestSeller
            : product.category === selectedCategory;
      const matchesSearch =
        !normalizedQuery ||
        product.name.en.toLowerCase().includes(normalizedQuery) ||
        product.name.km.includes(searchQuery.trim());

      return Boolean(matchesCategory && matchesSearch);
    });
  }, [searchQuery, selectedCategory]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "km" ? "km-KH" : "en-US", {
        currency: "USD",
        maximumFractionDigits: 2,
        style: "currency",
      }),
    [locale],
  );
  const formatCurrency = useCallback((value: number) => formatter.format(value), [formatter]);

  const subtotal = orderItems.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);
  const discount = subtotal * 0.05;
  const tax = (subtotal - discount) * 0.1;
  const total = subtotal - discount + tax;
  const itemCount = orderItems.reduce((count, item) => count + item.quantity, 0);

  const panelItems: OrderPanelItem[] = useMemo(() => {
    return orderItems.flatMap((item) => {
      const product = getProduct(item.productId);
      if (!product) return [];

      const productName = product.name[locale];
      const modifierSummary = [
        sizeLabels[item.size],
        item.ice ? iceLabels[item.ice] : undefined,
        sweetnessLabels[item.sweetness],
        ...item.addOns.map((addOn) => addOnLabels[addOn]),
      ]
        .filter(Boolean)
        .join(" · ");

      return [
        {
          id: item.id,
          name: productName,
          price: product.price,
          quantity: item.quantity,
          modifiers: modifierSummary,
          formattedUnitPrice: formatCurrency(product.price),
          formattedTotalPrice: formatCurrency(product.price * item.quantity),
        },
      ];
    });
  }, [orderItems, locale, sizeLabels, iceLabels, sweetnessLabels, addOnLabels, formatCurrency]);

  const addProduct = (product: Product) => {
    const modifierKey = [selectedSize, selectedIce, selectedSweetness, ...selectedAddOns.toSorted()].join("-");
    const orderItemId = `${product.id}-${modifierKey}`;

    setOrderItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === orderItemId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === orderItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: orderItemId,
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          ice: selectedIce,
          sweetness: selectedSweetness,
          addOns: [...selectedAddOns],
        },
      ];
    });
    setIsPaid(false);
  };

  const updateQuantity = (itemId: string, change: number) => {
    setOrderItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.id !== itemId) {
          return [item];
        }

        const nextQuantity = item.quantity + change;
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      }),
    );
    setIsPaid(false);
  };

  const toggleAddOn = (addOnId: AddOnId) => {
    setSelectedAddOns((currentAddOns) =>
      currentAddOns.includes(addOnId)
        ? currentAddOns.filter((item) => item !== addOnId)
        : [...currentAddOns, addOnId],
    );
  };

  const paymentOptions: Array<{
    id: PaymentMethodId;
    icon: IconComponent;
    label: string;
  }> = [
    { id: "cash", icon: Wallet, label: t("payment.cash") },
    { id: "bankCard", icon: Card, label: t("payment.bankCard") },
    { id: "khqr", icon: Scan, label: t("payment.khqr") },
  ];

  const handleClearTicket = () => {
    setOrderItems([]);
    setIsPaid(false);
  };

  return (
    <POSLayout
      showSearch={false}
      rightPanel={
        <OrderPanel
          className="h-full rounded-none border-0"
          orderNumber="1048"
          eyebrow={t("ticketEyebrow")}
          orderType={orderType === "takeaway" ? t("takeaway") : t("dineIn")}
          changeButtonLabel={t("change")}
          onChangeOrderType={() =>
            setOrderType((current) => (current === "takeaway" ? "dineIn" : "takeaway"))
          }
          clearButtonLabel={t("clearTicket")}
          onClearTicket={handleClearTicket}
          items={panelItems}
          onUpdateQuantity={updateQuantity}
          emptyTitle={t("emptyTicket")}
          emptyDescription={t("emptyTicketHint")}
          decreaseAriaLabel={(name) => t("decreaseQuantity", { name })}
          increaseAriaLabel={(name) => t("increaseQuantity", { name })}
          removeAriaLabel={(name) => t("removeItem", { name })}
          subtotal={subtotal}
          discount={discount}
          discountLabel={t("summary.discount")}
          tax={tax}
          taxLabel={t("summary.tax")}
          total={total}
          totalLabel={t("summary.total")}
          itemCount={itemCount}
          itemsLabel={t("summary.items", { count: itemCount })}
          formatCurrency={formatCurrency}
          paymentTitle={t("payment.title")}
          paymentMethods={paymentOptions}
          selectedPaymentMethod={selectedPayment}
          onSelectPaymentMethod={(id) => setSelectedPayment(id as PaymentMethodId)}
          chargeLabel={t("payment.charge", { amount: formatCurrency(total) })}
          completeLabel={t("payment.complete")}
          paidMessage={t("payment.success")}
          onCharge={() => setIsPaid(true)}
          isPaid={isPaid}
          printLabel={t("printReceipt")}
          onPrintReceipt={() => window.print()}
          holdLabel={t("holdTicket")}
          onHoldOrder={() => {}}
          resetLabel={t("resetTicket")}
          onResetOrder={handleClearTicket}
        />
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        {/* Category Tabs & Products Catalog using default HeroUI Tabs */}
        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={(key) => setSelectedCategory(String(key) as CategoryId)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
        >
          {/* 1. Tab Categories Section */}
          <div className="shrink-0 border-b border-border/70 bg-background px-3.5 py-2 sm:px-4 sm:py-2.5">
            <Tabs.ListContainer>
              <Tabs.List aria-label={t("categoryLabel")}>
                {categoryOptions.map((item) => (
                  <Tabs.Tab key={item.id} id={item.id}>
                    {item.label}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
          </div>

          {/* 2. Search Menu Items Bar (below tab categories section) */}
          <div className="flex shrink-0 items-center gap-2 border-b border-border/60 bg-surface-secondary/20 px-3.5 py-2 sm:px-4">
            <SearchField
              aria-label={t("searchLabel")}
              className="flex-1"
              fullWidth
              onClear={() => setSearchQuery("")}
              value={searchQuery}
              onChange={setSearchQuery}
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input
                  placeholder={t("searchPlaceholder")}
                  className="text-xs sm:text-sm"
                />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>

            <Button
              isIconOnly
              aria-label={t("addItem")}
              variant="secondary"
              className="shrink-0"
            >
              <Add aria-hidden="true" size={20} />
            </Button>
          </div>

          {categoryOptions.map((item) => (
            <Tabs.Panel
              key={item.id}
              id={item.id}
              className="min-h-0 flex-1 overflow-y-auto p-3.5 sm:p-4 outline-none"
            >
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const productName = product.name[locale];

                    return (
                      <ProductCard
                        key={product.id}
                        addToTicketLabel={t("addToTicket", { name: productName })}
                        image={product.image}
                        name={productName}
                        onClick={() => addProduct(product)}
                        price={formatCurrency(product.price)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full min-h-[16rem] items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted">
                  {t("catalogEmpty")}
                </div>
              )}
            </Tabs.Panel>
          ))}
        </Tabs>

        {/* Modifiers docked bar - Row by row */}
        <section
          aria-label={t("modifiersTitle")}
          className="shrink-0 border-t border-border bg-surface-secondary/40 px-3.5 py-2.5 sm:px-4 sm:py-3 max-h-72 overflow-y-auto"
        >
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {/* Size */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("modifiers.size")}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {sizeLabels[selectedSize]}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {sizeOptions.map((option) => (
                  <ChoiceButton
                    key={option.id}
                    active={selectedSize === option.id}
                    onPress={() => setSelectedSize(option.id)}
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {/* Ice Level */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("modifiers.ice")}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {iceLabels[selectedIce]}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {iceOptions.map((option) => (
                  <ChoiceButton
                    key={option.id}
                    active={selectedIce === option.id}
                    onPress={() => setSelectedIce(option.id)}
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {/* Sweetness */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("modifiers.sweetness")}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {sweetnessLabels[selectedSweetness]}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {sweetnessOptions.map((option) => (
                  <ChoiceButton
                    key={option.id}
                    active={selectedSweetness === option.id}
                    onPress={() => setSelectedSweetness(option.id)}
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {t("modifiers.addOns")}
                </span>
                {selectedAddOns.length > 0 ? (
                  <span className="text-xs font-medium text-foreground truncate max-w-[60%] text-right">
                    {selectedAddOns.map((id) => addOnLabels[id]).join(", ")}
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2">
                {addOnOptions.map((option) => (
                  <ChoiceButton
                    key={option.id}
                    active={selectedAddOns.includes(option.id)}
                    onPress={() => toggleAddOn(option.id)}
                  >
                    {option.label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </POSLayout>
  );
}

function ChoiceButton({
  active,
  children,
  onPress,
}: {
  active: boolean;
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Button
      fullWidth
      size="lg"
      variant={active ? "primary" : "outline"}
      onPress={onPress}
      aria-pressed={active}
      className="truncate text-xs font-medium sm:text-sm"
    >
      <span className="truncate">{children}</span>
    </Button>
  );
}
