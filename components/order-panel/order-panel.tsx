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
  onPrintReceipt,
  onQuickAction,
  onRemoveItem,
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
  const containerClasses = className
    ? `flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-background p-3 sm:p-4 ${className}`
    : "flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-background p-3 sm:p-4";

  if (children) {
    return (
      <section id={id} aria-label={ariaLabel} className={containerClasses}>
        {children}
      </section>
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
  const calculatedDiscount = discount ?? 0;
  const calculatedTax = tax ?? 0;
  const calculatedTotal =
    total !== undefined
      ? total
      : calculatedSubtotal - calculatedDiscount + calculatedTax + (serviceCharge ?? 0);
  const formattedChargeAmount =
    chargeAmount !== undefined ? chargeAmount : formatCurrency(calculatedTotal);

  return (
    <section id={id} aria-label={ariaLabel} className={containerClasses}>
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

      <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
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
        className="mt-3"
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
        className="mt-3"
      />

      {footer ? <div className="mt-3 shrink-0">{footer}</div> : null}
    </section>
  );
}

OrderPanel.Header = OrderHeader;
OrderPanel.ItemsTable = OrderItemsTable;
OrderPanel.BillingSummary = BillingSummary;
OrderPanel.PaymentActions = PaymentActions;
