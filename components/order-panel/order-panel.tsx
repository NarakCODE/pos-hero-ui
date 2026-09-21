"use client";

import { useState } from "react";
import { POSAside } from "@/components/shared/pos-aside";
import { BillingSummary } from "./billing-summary";
import { OrderHeader } from "./order-header";
import { OrderItemsTable } from "./order-items-table";
import { OrderPanelFooter, SignOutAlertDialog } from "./order-panel-footer";
import { PaymentActions } from "./payment-actions";
import { PromotionModal } from "./promotion-modal";
import type { AppliedPromotion, OrderPanelProps } from "./types";

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export function OrderPanel({
  actionsSlot,
  appliedPromotion,
  ariaLabel = "Order ticket",
  changeAmount,
  changeLabel,
  changeSecondaryAmount,
  changeButtonLabel,
  chargeAmount,
  chargeLabel,
  children,
  className = "",
  clearButtonLabel,
  completeLabel,
  customBillingRows,
  customerName,
  decreaseAriaLabel,
  discount,
  discountLabel,
  discountRate,
  emptyDescription,
  emptyIcon,
  emptyTitle,
  eyebrow,
  footer,
  formatCurrency = defaultFormatCurrency,
  headerActions,
  holdLabel,
  id,
  increaseAriaLabel,
  isCharging,
  isPaid,
  itemCount,
  items = [],
  itemsLabel,
  itemTableLabels,
  onChangeOrderType,
  onCharge,
  onClearTicket,
  onHoldOrder,
  onApplyPromotion,
  onPrintReceipt,
  onQuickAction,
  onRemoveItem,
  onRemovePromotion,
  onResetOrder,
  onSelectPaymentMethod,
  onUpdateQuantity,
  orderChannel,
  orderChannelLabel,
  orderNumber,
  orderType,
  paidMessage,
  paymentLabel,
  paymentMethod,
  paymentMethods,
  paymentTitle,
  promotions,
  quickActions,
  printLabel,
  receivedAmount,
  receivedLabel,
  removeAriaLabel,
  resetLabel,
  selectedPaymentMethod,
  sequenceLabel,
  sequenceNumber,
  serviceCharge,
  serviceChargeLabel,
  status,
  statusLabel,
  subtotal,
  subtotalLabel,
  tableNumber,
  tableTicketLabel,
  tableTicketNumber,
  tax,
  taxLabel,
  taxRate,
  timestamp,
  title,
  total,
  totalDiscountLabel,
  totalLabel,
  viewMode = "table",
}: OrderPanelProps) {
  const [localPromotion, setLocalPromotion] = useState<AppliedPromotion | null>(null);
  const currentPromotion = appliedPromotion !== undefined ? appliedPromotion : localPromotion;
  const handleApplyPromotion = onApplyPromotion ?? setLocalPromotion;
  const handleRemovePromotion = onRemovePromotion ?? (() => setLocalPromotion(null));

  const containerClasses = className
    ? `overflow-hidden p-[var(--pos-content-padding)] ${className}`
    : "overflow-hidden rounded-2xl border border-border p-[var(--pos-content-padding)]";

  if (children) {
    return (
      <POSAside
        id={id}
        ariaLabel={ariaLabel}
        className={containerClasses}
        mainClassName="overflow-y-auto"
      >
        {children}
      </POSAside>
    );
  }

  const calculatedSubtotal =
    subtotal !== undefined
      ? subtotal
      : items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const calculatedItemCount =
    itemCount !== undefined
      ? itemCount
      : items.reduce((acc, item) => acc + item.quantity, 0);
  const promoDiscount = currentPromotion ? currentPromotion.discountAmount : 0;
  const calculatedDiscount = (discount ?? 0) + promoDiscount;
  const calculatedTax = tax ?? 0;
  const calculatedTotal =
    total !== undefined
      ? total
      : Math.max(0, calculatedSubtotal - calculatedDiscount + calculatedTax + (serviceCharge ?? 0));
  const formattedChargeAmount =
    chargeAmount !== undefined ? chargeAmount : formatCurrency(calculatedTotal);

  return (
    <POSAside
      id={id}
      ariaLabel={ariaLabel}
      className={containerClasses}
      mainClassName="mt-3 flex min-h-0 flex-col overflow-hidden"
      footerClassName="mt-3 flex shrink-0 flex-col gap-3"
      header={
        <OrderHeader
          orderNumber={orderNumber}
          title={title}
          eyebrow={eyebrow}
          tableTicketNumber={tableTicketNumber}
          tableTicketLabel={tableTicketLabel}
          sequenceNumber={sequenceNumber}
          sequenceLabel={sequenceLabel}
          status={status}
          statusLabel={statusLabel}
          orderChannel={orderChannel}
          orderChannelLabel={orderChannelLabel}
          orderType={orderType}
          tableNumber={tableNumber}
          customerName={customerName}
          timestamp={timestamp}
          onChangeOrderType={onChangeOrderType}
          changeButtonLabel={changeButtonLabel}
          onClearTicket={onClearTicket}
          clearButtonLabel={clearButtonLabel}
          canClear={items.length > 0}
          actions={headerActions}
        />
      }
      footer={
        <>
          <BillingSummary
            subtotal={calculatedSubtotal}
            subtotalLabel={subtotalLabel}
            discount={calculatedDiscount}
            discountRate={discountRate}
            discountLabel={discountLabel}
            totalDiscountLabel={totalDiscountLabel}
            tax={tax !== undefined ? tax : calculatedTax}
            taxRate={taxRate}
            taxLabel={taxLabel}
            serviceCharge={serviceCharge}
            serviceChargeLabel={serviceChargeLabel}
            total={calculatedTotal}
            totalLabel={totalLabel}
            itemCount={calculatedItemCount}
            itemsLabel={itemsLabel}
            paymentLabel={paymentLabel}
            paymentMethod={paymentMethod}
            receivedLabel={receivedLabel}
            receivedAmount={receivedAmount}
            changeLabel={changeLabel}
            changeAmount={changeAmount}
            changeSecondaryAmount={changeSecondaryAmount}
            formatCurrency={formatCurrency}
            customRows={customBillingRows}
            appliedPromotion={currentPromotion}
            onRemovePromotion={handleRemovePromotion}
          />

          <PaymentActions
            paymentMethods={paymentMethods}
            quickActions={quickActions}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={onSelectPaymentMethod}
            onQuickAction={onQuickAction}
            paymentTitle={paymentTitle}
            chargeAmount={formattedChargeAmount}
            chargeLabel={chargeLabel}
            completeLabel={completeLabel}
            onCharge={onCharge}
            isCharging={isCharging}
            isPaid={isPaid}
            paidMessage={paidMessage}
            disabled={items.length === 0}
            onPrintReceipt={onPrintReceipt}
            printLabel={printLabel}
            onHoldOrder={onHoldOrder}
            holdLabel={holdLabel}
            onResetOrder={onResetOrder}
            resetLabel={resetLabel}
            actionsSlot={actionsSlot}
            appliedPromotion={currentPromotion}
            onApplyPromotion={handleApplyPromotion}
            onRemovePromotion={handleRemovePromotion}
            subtotal={calculatedSubtotal}
            promotions={promotions}
            formatCurrency={formatCurrency}
          />

          {footer ? <div>{footer}</div> : null}
        </>
      }
    >
      <OrderItemsTable
        items={items}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        formatCurrency={formatCurrency}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyIcon={emptyIcon}
        viewMode={viewMode}
        decreaseAriaLabel={decreaseAriaLabel}
        increaseAriaLabel={increaseAriaLabel}
        removeAriaLabel={removeAriaLabel}
        labels={itemTableLabels}
      />
    </POSAside>
  );
}

OrderPanel.Header = OrderHeader;
OrderPanel.ItemsTable = OrderItemsTable;
OrderPanel.BillingSummary = BillingSummary;
OrderPanel.PaymentActions = PaymentActions;
OrderPanel.Footer = OrderPanelFooter;
OrderPanel.SignOutAlertDialog = SignOutAlertDialog;
OrderPanel.PromotionModal = PromotionModal;
