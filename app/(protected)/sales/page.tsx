"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { IconComponent } from "reicon-react";
import {
  Add,
  Card,
  Profile,
  Scan,
  Send2,
  Tag,
  Wallet,
  Wallet2,
  Wallet3,
} from "reicon-react";
import { ProductCard } from "@/components/product-card";
import {
  OrderChannelSelect,
  type OrderChannel,
} from "@/components/order-channel-select";
import {
  OrderPanel,
  OrderPanelFooter,
  type AppliedPromotion,
  type OrderPanelItem,
} from "@/components/order-panel";
import { Button, SearchField, Tabs } from "@heroui/react";
import { POSLayout } from "@/components/shared/pos-layout";
import { defaultLocale, isLocale, type Locale } from "@/config/i18n";

import {
  type AddOnId,
  addOnIds,
  type CategoryId,
  categoryIds,
  getProduct,
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
  const locale: Locale = isLocale(currentLocale)
    ? currentLocale
    : defaultLocale;
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryId>("favourites");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<SizeId>("medium");
  const [selectedSweetness, setSelectedSweetness] =
    useState<SweetnessId>("lessSugar");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(initialOrderItems);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodId>("cash");
  const [orderType, setOrderType] = useState<"takeaway" | "dineIn">("takeaway");
  const [orderChannel, setOrderChannel] = useState<OrderChannel>("Wownow");
  const [appliedPromotion, setAppliedPromotion] =
    useState<AppliedPromotion | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const categoryOptions: Array<{ id: CategoryId; label: string }> = useMemo(
    () => categoryIds.map((id) => ({ id, label: t(`categories.${id}`) })),
    [t],
  );

  const sizeOptions: Array<{ id: SizeId; label: string }> = useMemo(
    () => sizeIds.map((id) => ({ id, label: t(`modifiers.${id}`) })),
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

  const sizeLabels: Partial<Record<SizeId, string>> = useMemo(
    () =>
      sizeIds.reduce(
        (acc, id) => ({ ...acc, [id]: t(`modifiers.${id}`) }),
        {} as Record<SizeId, string>,
      ),
    [t],
  );

  const sweetnessLabels: Partial<Record<SweetnessId, string>> = useMemo(
    () =>
      sweetnessIds.reduce(
        (acc, id) => ({ ...acc, [id]: t(`modifiers.${id}`) }),
        {} as Record<SweetnessId, string>,
      ),
    [t],
  );

  const addOnLabels: Partial<Record<AddOnId, string>> = useMemo(
    () =>
      addOnIds.reduce(
        (acc, id) => ({ ...acc, [id]: t(`modifiers.${id}`) }),
        {} as Record<AddOnId, string>,
      ),
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
  const formatCurrency = useCallback(
    (value: number) => formatter.format(value),
    [formatter],
  );

  const subtotal = orderItems.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0);
  const promoDiscount = appliedPromotion
    ? appliedPromotion.type === "percentage"
      ? (subtotal * appliedPromotion.value) / 100
      : Math.min(appliedPromotion.value, subtotal)
    : 0;
  const memberDiscount = subtotal * 0.05;
  const discount = appliedPromotion ? promoDiscount : memberDiscount;
  const tax = Math.max(0, (subtotal - discount) * 0.1);
  const total = Math.max(0, subtotal - discount + tax);
  const itemCount = orderItems.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  const currentAppliedPromotion: AppliedPromotion | null = useMemo(() => {
    if (!appliedPromotion) return null;
    return {
      ...appliedPromotion,
      discountAmount: Number(promoDiscount.toFixed(2)),
    };
  }, [appliedPromotion, promoDiscount]);

  const panelItems: OrderPanelItem[] = useMemo(() => {
    return orderItems.flatMap((item) => {
      const product = getProduct(item.productId);
      if (!product) return [];

      const productName = product.name[locale];
      const modifierSummary = [
        sizeLabels[item.size],
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
  }, [
    orderItems,
    locale,
    sizeLabels,
    sweetnessLabels,
    addOnLabels,
    formatCurrency,
  ]);

  const addProduct = (product: Product) => {
    const modifierKey = [
      selectedSize,
      selectedSweetness,
      ...selectedAddOns.toSorted(),
    ].join("-");
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

  const quickActions = [
    { id: "brandWallet", icon: Wallet3, label: t("payment.brandWallet") },
    { id: "digitalWallet", icon: Wallet2, label: t("payment.digitalWallet") },
    { id: "promotion", icon: Tag, label: t("payment.promotion") },
    { id: "member", icon: Profile, label: t("payment.member") },
    { id: "sendKitchen", icon: Send2, label: t("payment.sendKitchen") },
  ];

  const handleClearTicket = () => {
    setOrderItems([]);
    setAppliedPromotion(null);
    setIsPaid(false);
  };

  return (
    <POSLayout
      showSearch={false}
      rightPanelLabel={t("ticketTitle")}
      rightPanel={
        <OrderPanel
          className="h-full rounded-none border-0"
          orderNumber="1048"
          eyebrow={t("ticketEyebrow")}
          title={t("ticketTitle")}
          tableTicketLabel={t("ticketSummary.tableTicket")}
          tableTicketNumber="Table02/05"
          sequenceLabel={t("ticketSummary.sequence")}
          sequenceNumber="155"
          statusLabel={t("ticketSummary.status")}
          status={t("ticketSummary.inProgress")}
          orderChannelLabel={t("ticketSummary.orderChannel")}
          orderChannel={
            <OrderChannelSelect
              className="w-full"
              label={null}
              onChange={setOrderChannel}
              value={orderChannel}
            />
          }
          orderType={orderType === "takeaway" ? t("takeaway") : t("dineIn")}
          changeButtonLabel={t("change")}
          onChangeOrderType={() =>
            setOrderType((current) =>
              current === "takeaway" ? "dineIn" : "takeaway",
            )
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
          subtotalLabel={t("ticketSummary.subtotal")}
          discount={discount}
          appliedPromotion={currentAppliedPromotion}
          onApplyPromotion={setAppliedPromotion}
          onRemovePromotion={() => setAppliedPromotion(null)}
          discountLabel={t("summary.discount")}
          totalDiscountLabel={t("ticketSummary.totalDiscount")}
          tax={tax}
          taxLabel={t("summary.tax")}
          total={total}
          totalLabel={t("summary.total")}
          itemCount={itemCount}
          itemsLabel={t("summary.items", { count: itemCount })}
          paymentLabel={t("ticketSummary.payment")}
          paymentMethod={t("payment.cash")}
          receivedLabel={t("ticketSummary.received")}
          receivedAmount="៛100,000.00"
          changeLabel={t("ticketSummary.change")}
          changeAmount="$2.50"
          changeSecondaryAmount="៛10,000.00"
          formatCurrency={formatCurrency}
          paymentTitle={t("payment.title")}
          paymentMethods={paymentOptions}
          quickActions={quickActions}
          selectedPaymentMethod={selectedPayment}
          onSelectPaymentMethod={(id) =>
            setSelectedPayment(id as PaymentMethodId)
          }
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
          footer={
            <OrderPanelFooter
              locale={locale === "km" ? "km-KH" : "en-US"}
              systemLabel={t("ticketSummary.system")}
              systemStatus={t("ticketSummary.online")}
              shiftLabel={t("ticketSummary.shift")}
              shiftInfo={`${t("cashier")} · ${t("shiftOpen")}`}
              dateTimeLabel={t("ticketSummary.dateTime")}
              signOutTriggerLabel={t("signOut")}
              signOutHeader={t("signOutDialog.header")}
              signOutBody={t("signOutDialog.body")}
              signOutCancelLabel={t("signOutDialog.cancel")}
              signOutConfirmLabel={t("signOutDialog.confirm")}
            />
          }
        />
      }
    >
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        {/* Category Tabs & Products Catalog using default HeroUI Tabs */}
        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={(key) =>
            setSelectedCategory(String(key) as CategoryId)
          }
          className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
        >
          {/* 1. Tab Categories Section */}
          <div className="shrink-0 bg-background px-3.5 py-2 sm:px-4 sm:py-2.5">
            <Tabs.ListContainer>
              <Tabs.List aria-label={t("categoryLabel")}>
                {categoryOptions.map((item) => (
                  <Tabs.Tab
                    key={item.id}
                    id={item.id}
                    className="w-auto shrink-0 whitespace-nowrap"
                  >
                    {item.label}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
          </div>

          {/* 2. Search Menu Items Bar (below tab categories section) */}
          <div className="flex shrink-0 items-center gap-2 px-3.5 sm:px-4">
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
              className="mt-0 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-3.5 outline-none sm:p-4"
            >
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                  {filteredProducts.map((product) => {
                    const productName = product.name[locale];

                    return (
                      <ProductCard
                        key={product.id}
                        addToTicketLabel={t("addToTicket", {
                          name: productName,
                        })}
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

        {/* Modifiers docked bar - horizontal rows with bounded scrolling */}
        <section
          aria-label={t("modifiersTitle")}
          className="min-h-0 shrink-0 overflow-hidden border-t border-border"
        >
          <div className="max-h-[14rem] min-h-0 overflow-y-auto overscroll-contain px-3.5 py-2 sm:max-h-[16rem] sm:px-4 sm:py-2.5 lg:max-h-[18rem] xl:max-h-[20rem]">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {/* Size */}
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.size")}:
                </span>
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
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

              {/* Sweetness */}
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.sweetness")}:
                </span>
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
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
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.addOns")}:
                </span>
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
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
      size="sm"
      variant={active ? "primary" : "outline"}
      onPress={onPress}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}
