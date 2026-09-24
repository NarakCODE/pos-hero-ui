"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import {
  IconCreditCard,
  IconLetterLSmall,
  IconLetterMSmall,
  IconLetterSSmall,
  IconLetterXSmall,
  IconPlus,
  IconQrcode,
  IconSend,
  IconTag,
  IconUser,
  IconWallet,
  type TablerIcon,
} from "@tabler/icons-react";
import { ProductCard } from "@/components/product-card";
import { getProductImage } from "@/components/product/product-images";
import {
  OrderChannelSelect,
  type OrderChannel,
} from "@/components/order-channel-select";
import {
  OrderPanel,
  PaymentSuccessfulModal,
  type AppliedPromotion,
  type OrderPanelItem,
} from "@/components/order-panel";
import {
  Button,
  Modal,
  Radio,
  RadioGroup,
  ScrollShadow,
  SearchField,
  Tabs,
} from "@heroui/react";
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

const sizeIconById: Record<SizeId, TablerIcon> = {
  extraSmall: IconLetterXSmall,
  small: IconLetterSSmall,
  medium: IconLetterMSmall,
  large: IconLetterLSmall,
};

type OrderType = "takeaway" | "dineIn";

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
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [draftOrderType, setDraftOrderType] = useState<OrderType>("takeaway");
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);
  const [orderChannel, setOrderChannel] = useState<OrderChannel>("Wownow");
  const [appliedPromotion, setAppliedPromotion] =
    useState<AppliedPromotion | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);

  const categoryOptions: Array<{ id: CategoryId; label: string }> = useMemo(
    () => categoryIds.map((id) => ({ id, label: t(`categories.${id}`) })),
    [t],
  );

  const sizeOptions: Array<{ id: SizeId; label: string; icon: TablerIcon }> =
    useMemo(
      () =>
        sizeIds.map((id) => ({
          id,
          label: t(`modifiers.${id}`),
          icon: sizeIconById[id],
        })),
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
    icon: TablerIcon;
    label: string;
  }> = [
    { id: "cash", icon: IconWallet, label: t("payment.cash") },
    { id: "bankCard", icon: IconCreditCard, label: t("payment.bankCard") },
    { id: "khqr", icon: IconQrcode, label: t("payment.khqr") },
  ];

  const quickActions = [
    { id: "brandWallet", icon: IconWallet, label: t("payment.brandWallet") },
    {
      id: "digitalWallet",
      icon: IconWallet,
      label: t("payment.digitalWallet"),
    },
    { id: "promotion", icon: IconTag, label: t("payment.promotion") },
    { id: "member", icon: IconUser, label: t("payment.member") },
    { id: "sendKitchen", icon: IconSend, label: t("payment.sendKitchen") },
  ];

  const handleClearTicket = () => {
    setOrderItems([]);
    setAppliedPromotion(null);
    setIsPaid(false);
    setIsPaymentSuccessOpen(false);
  };

  return (
    <POSLayout
      showSearch={false}
      headerTitle={t("navigation.sales")}
      rightPanelLabel={t("ticketTitle")}
      rightPanelClassName="scrollbar-thin overflow-y-auto"
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
          orderTypeLabel={t("ticketSummary.orderType")}
          orderChannelLabel={t("ticketSummary.orderChannel")}
          orderChannel={
            <OrderChannelSelect
              label={null}
              onChange={setOrderChannel}
              value={orderChannel}
            />
          }
          orderType={orderType === "takeaway" ? t("takeaway") : t("dineIn")}
          changeButtonLabel={t("change")}
          onChangeOrderType={() => {
            setDraftOrderType(orderType);
            setIsOrderTypeModalOpen(true);
          }}
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
          onCharge={() => {
            setIsPaid(true);
            setIsPaymentSuccessOpen(true);
          }}
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
        {/* Category Tabs & Products Catalog using secondary HeroUI Tabs */}
        <Tabs
          selectedKey={selectedCategory}
          variant="secondary"
          onSelectionChange={(key) =>
            setSelectedCategory(String(key) as CategoryId)
          }
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {/* 1. Tab Categories Section */}
          <Tabs.ListContainer className="shrink-0">
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

          {/* 2. Search Menu Items Bar (below tab categories section) */}
          <div className="flex shrink-0 items-center gap-2 px-(--pos-content-padding) py-3">
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
              <IconPlus aria-hidden="true" size={20} />
            </Button>
          </div>

          {categoryOptions.map((item) => (
            <Tabs.Panel
              key={item.id}
              id={item.id}
              className="mt-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain"
            >
              <div className="flex flex-1 flex-col p-(--pos-content-padding)">
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
                          image={getProductImage(product.id)}
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
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>

        {/* Modifiers docked bar - horizontal rows with bounded scrolling */}
        <section
          aria-label={t("modifiersTitle")}
          className="min-h-0 shrink-0 overflow-hidden border-t border-border"
        >
          <div className="max-h-[14rem] min-h-0 overflow-y-auto overscroll-contain px-[var(--pos-content-padding)] py-2 sm:max-h-[16rem] sm:py-2.5 lg:max-h-[18rem] xl:max-h-[20rem]">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              {/* Size */}
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.size")}:
                </span>
                <ScrollShadow
                  className="min-w-0 flex-1"
                  hideScrollBar
                  orientation="horizontal"
                >
                  <div className="flex w-max min-w-full flex-row gap-1.5 pb-1">
                    {sizeOptions.map((option) => (
                      <div key={option.id} className="w-32 shrink-0">
                        <ChoiceButton
                          active={selectedSize === option.id}
                          icon={option.icon}
                          onPress={() => setSelectedSize(option.id)}
                        >
                          {option.label}
                        </ChoiceButton>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </div>

              {/* Sweetness */}
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.sweetness")}:
                </span>
                <ScrollShadow
                  className="min-w-0 flex-1"
                  hideScrollBar
                  orientation="horizontal"
                >
                  <div className="flex w-max min-w-full flex-row gap-1.5 pb-1">
                    {sweetnessOptions.map((option) => (
                      <div key={option.id} className="w-32 shrink-0">
                        <ChoiceButton
                          active={selectedSweetness === option.id}
                          onPress={() => setSelectedSweetness(option.id)}
                        >
                          {option.label}
                        </ChoiceButton>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </div>

              {/* Add-ons */}
              <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                <span className="w-20 shrink-0 truncate text-xs font-medium text-muted">
                  {t("modifiers.addOns")}:
                </span>
                <ScrollShadow
                  className="min-w-0 flex-1"
                  hideScrollBar
                  orientation="horizontal"
                >
                  <div className="flex w-max min-w-full flex-row gap-1.5 pb-1">
                    {addOnOptions.map((option) => (
                      <div key={option.id} className="w-32 shrink-0">
                        <ChoiceButton
                          active={selectedAddOns.includes(option.id)}
                          onPress={() => toggleAddOn(option.id)}
                        >
                          {option.label}
                        </ChoiceButton>
                      </div>
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal.Backdrop
        isOpen={isOrderTypeModalOpen}
        onOpenChange={setIsOrderTypeModalOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-sm">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {t("ticketSummary.changeOrderTypeTitle")}
              </Modal.Heading>
              <p className="mt-1.5 text-sm text-muted">
                {t("ticketSummary.changeOrderTypeDescription")}
              </p>
            </Modal.Header>
            <Modal.Body>
              <RadioGroup
                aria-label={t("ticketSummary.orderType")}
                value={draftOrderType}
                onChange={(value) => setDraftOrderType(value as OrderType)}
              >
                <Radio value="takeaway">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    {t("takeaway")}
                  </Radio.Content>
                </Radio>
                <Radio value="dineIn">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    {t("dineIn")}
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                {t("cancel")}
              </Button>
              <Button
                slot="close"
                onPress={() => setOrderType(draftOrderType)}
              >
                {t("ticketSummary.applyOrderType")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
      <PaymentSuccessfulModal
        isOpen={isPaymentSuccessOpen}
        orderNumber="1048"
        totalPayment={total > 0 ? formatCurrency(total) : undefined}
        customerPays={total > 0 ? "US$200.00" : undefined}
        change={total > 0 ? formatCurrency(Math.max(0, 200 - total)) : undefined}
        onOpenChange={setIsPaymentSuccessOpen}
        onPaymentDone={() => setIsPaymentSuccessOpen(false)}
        onPrintBills={() => window.print()}
      />
    </POSLayout>
  );
}

function ChoiceButton({
  active,
  children,
  icon: Icon,
  onPress,
}: {
  active: boolean;
  children: React.ReactNode;
  icon?: TablerIcon;
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
      {Icon ? <Icon aria-hidden="true" size={20} /> : null}
      {children}
    </Button>
  );
}
