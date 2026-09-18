"use client";

import { BillingSummary } from "./billing-summary";
import { OrderHeader } from "./order-header";
import { OrderItemsTable } from "./order-items-table";
import { PaymentActions } from "./payment-actions";
import type { OrderPanelProps } from "./types";

const defaultFormatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export function OrderPanel({
  actionsSlot,
  ariaLabel = "Order ticket",
  changeButtonLabel,
  chargeAmount,
  chargeLabel,
  children,
  className = "",
  clearButtonLabel,
  completeLabel,
  customBillingRows,
  customerName,
  changeAmount,
  changeLabel,
  changeSecondaryAmount,
  decreaseAriaLabel,
  discount,
  discountLabel,
  discountRate,
  emptyDescription,
  emptyIcon,
  emptyTitle,
  eyebrow,
  formatCurrency = defaultFormatCurrency,
  headerActions,
  holdLabel,
  id,
  increaseAriaLabel,
  isCharging,
  isPaid,
  itemCount,
  items = [],
  itemTableLabels,
  onChangeOrderType,
  onCharge,
  onClearTicket,
  onHoldOrder,
  onPrintReceipt,
  onRemoveItem,
  onResetOrder,
  onOrderChannelChange,
  onSelectPaymentMethod,
  onUpdateQuantity,
  orderChannel,
  orderChannelLabel,
  orderNumber,
  orderType,
  paidMessage,
  paymentMethods,
  paymentLabel,
  paymentMethod,
  paymentTitle,
  printLabel,
  removeAriaLabel,
  resetLabel,
  receivedAmount,
  receivedLabel,
  selectedPaymentMethod,
  sequenceLabel,
  sequenceNumber,
  serviceCharge,
  serviceChargeLabel,
  status,
  statusLabel,
  subtotal,
  subtotalLabel,
  tableTicketLabel,
  tableTicketNo,
  tableNumber,
  tax,
  taxLabel,
  taxRate,
  timestamp,
  title,
  total,
  totalSecondaryAmount,
  viewMode = "list",
  quickActions,
}: OrderPanelProps) {
  const containerClasses = className
    ? `flex h-full min-h-0 min-w-0 flex-col bg-background p-4 sm:p-5 ${className}`
    : "flex h-full min-h-0 min-w-0 flex-col rounded-2xl border border-border bg-background p-4 sm:p-5";

  // If compound children are provided, render them within the panel container
  if (children) {
    return (
      <section
        id={id}
        aria-label={ariaLabel}
        className={containerClasses}
      >
        {children}
      </section>
    );
  }

  // Calculate derived values if not explicitly provided
  const calculatedSubtotal =
    subtotal !== undefined
      ? subtotal
      : items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculatedItemCount =
    itemCount !== undefined
      ? itemCount
      : items.reduce((acc, item) => acc + item.quantity, 0);

  const calculatedDiscount = discount ?? 0;
  const calculatedTax = tax ?? 0;
  const calculatedTotal =
    total !== undefined
      ? total
      : calculatedSubtotal - calculatedDiscount + calculatedTax + (serviceCharge ?? 0);

  const formattedChargeAmount =
    chargeAmount !== undefined
      ? chargeAmount
      : formatCurrency(calculatedTotal);

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={containerClasses}
    >
      {/* 1. Order Header Section */}
      <OrderHeader
        orderNumber={orderNumber}
        title={title}
        eyebrow={eyebrow}
        orderType={orderType}
        tableNumber={tableNumber}
        customerName={customerName}
        orderChannel={orderChannel}
        orderChannelLabel={orderChannelLabel}
        onOrderChannelChange={onOrderChannelChange}
        timestamp={timestamp}
        sequenceLabel={sequenceLabel}
        sequenceNumber={sequenceNumber}
        status={status}
        statusLabel={statusLabel}
        tableTicketLabel={tableTicketLabel}
        tableTicketNo={tableTicketNo}
        onChangeOrderType={onChangeOrderType}
        changeButtonLabel={changeButtonLabel}
        onClearTicket={onClearTicket}
        clearButtonLabel={clearButtonLabel}
        canClear={items.length > 0}
        actions={headerActions}
      />

      {/* 2. Order Items Table Section */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
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
      </div>

      {/* 3. Billing Summary Section */}
      <BillingSummary
        subtotal={calculatedSubtotal}
        discount={calculatedDiscount}
        discountRate={discountRate}
        discountLabel={discountLabel}
        paymentLabel={paymentLabel}
        paymentMethod={paymentMethod}
        receivedLabel={receivedLabel}
        receivedAmount={receivedAmount}
        changeLabel={changeLabel}
        changeAmount={changeAmount}
        changeSecondaryAmount={changeSecondaryAmount}
        subtotalLabel={subtotalLabel}
        tax={tax !== undefined ? tax : calculatedTax}
        taxRate={taxRate}
        taxLabel={taxLabel}
        serviceCharge={serviceCharge}
        serviceChargeLabel={serviceChargeLabel}
        total={calculatedTotal}
        totalSecondaryAmount={totalSecondaryAmount}
        itemCount={calculatedItemCount}
        formatCurrency={formatCurrency}
        customRows={customBillingRows}
        className="mt-4"
      />

      {/* 4. Payment Actions Section */}
      <PaymentActions
        paymentMethods={paymentMethods}
        quickActions={quickActions}
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPaymentMethod={onSelectPaymentMethod}
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
      />
    </section>
  );
}

// Compound component attachments
OrderPanel.Header = OrderHeader;
OrderPanel.ItemsTable = OrderItemsTable;
OrderPanel.BillingSummary = BillingSummary;
OrderPanel.PaymentActions = PaymentActions;
