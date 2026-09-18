import type { ComponentType, ReactNode } from "react";

export interface OrderItemModifier {
  label: string;
  value?: string;
  priceDelta?: number;
}

export interface OrderPanelItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string | string[];
  notes?: string;
  image?: string;
  category?: string;
  formattedUnitPrice?: string;
  formattedTotalPrice?: string;
}

export interface PaymentMethodOption {
  id: string;
  label: string;
  icon?: ComponentType<{
    className?: string;
    size?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  disabled?: boolean;
}

export interface OrderHeaderProps {
  orderNumber?: string | number;
  title?: ReactNode;
  eyebrow?: ReactNode;
  orderType?: string;
  tableNumber?: string | number;
  customerName?: string;
  timestamp?: string;
  onChangeOrderType?: () => void;
  changeButtonLabel?: string;
  onClearTicket?: () => void;
  clearButtonLabel?: string;
  canClear?: boolean;
  actions?: ReactNode;
  className?: string;
}

export interface OrderItemsTableProps {
  items: OrderPanelItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  formatCurrency?: (amount: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  viewMode?: "list" | "table";
  maxHeight?: string;
  className?: string;
  decreaseAriaLabel?: (name: string) => string;
  increaseAriaLabel?: (name: string) => string;
  removeAriaLabel?: (name: string) => string;
  labels?: {
    item?: string;
    price?: string;
    quantity?: string;
    total?: string;
    action?: string;
  };
}

export interface BillingSummaryRow {
  label: string;
  value: ReactNode;
  isDeduction?: boolean;
  isTotal?: boolean;
  isMuted?: boolean;
}

export interface BillingSummaryProps {
  subtotal: number;
  discount?: number;
  discountRate?: number | string;
  discountLabel?: string;
  tax?: number;
  taxRate?: number | string;
  taxLabel?: string;
  serviceCharge?: number;
  serviceChargeLabel?: string;
  total: number;
  totalLabel?: string;
  itemCount?: number;
  itemsLabel?: string;
  formatCurrency?: (amount: number) => string;
  customRows?: BillingSummaryRow[];
  className?: string;
}

export interface PaymentActionsProps {
  paymentMethods?: PaymentMethodOption[];
  selectedPaymentMethod?: string;
  onSelectPaymentMethod?: (methodId: string) => void;
  paymentTitle?: string;
  chargeAmount?: number | string;
  chargeLabel?: string;
  completeLabel?: string;
  onCharge?: () => void;
  isCharging?: boolean;
  isPaid?: boolean;
  paidMessage?: string;
  disabled?: boolean;
  onPrintReceipt?: () => void;
  printLabel?: string;
  onHoldOrder?: () => void;
  holdLabel?: string;
  onResetOrder?: () => void;
  resetLabel?: string;
  actionsSlot?: ReactNode;
  className?: string;
}

export interface OrderPanelProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;

  // Header Props
  orderNumber?: string | number;
  title?: ReactNode;
  eyebrow?: ReactNode;
  orderType?: string;
  tableNumber?: string | number;
  customerName?: string;
  timestamp?: string;
  onChangeOrderType?: () => void;
  changeButtonLabel?: string;
  onClearTicket?: () => void;
  clearButtonLabel?: string;
  headerActions?: ReactNode;

  // Items Props
  items?: OrderPanelItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  viewMode?: "list" | "table";
  decreaseAriaLabel?: (name: string) => string;
  increaseAriaLabel?: (name: string) => string;
  removeAriaLabel?: (name: string) => string;
  itemTableLabels?: {
    item?: string;
    price?: string;
    quantity?: string;
    total?: string;
    action?: string;
  };

  // Billing Props
  subtotal?: number;
  discount?: number;
  discountRate?: number | string;
  discountLabel?: string;
  tax?: number;
  taxRate?: number | string;
  taxLabel?: string;
  serviceCharge?: number;
  serviceChargeLabel?: string;
  total?: number;
  totalLabel?: string;
  itemCount?: number;
  itemsLabel?: string;
  formatCurrency?: (amount: number) => string;
  customBillingRows?: BillingSummaryRow[];

  // Payment Props
  paymentMethods?: PaymentMethodOption[];
  selectedPaymentMethod?: string;
  onSelectPaymentMethod?: (methodId: string) => void;
  paymentTitle?: string;
  chargeAmount?: number | string;
  chargeLabel?: string;
  completeLabel?: string;
  onCharge?: () => void;
  isCharging?: boolean;
  isPaid?: boolean;
  paidMessage?: string;
  onPrintReceipt?: () => void;
  printLabel?: string;
  onHoldOrder?: () => void;
  holdLabel?: string;
  onResetOrder?: () => void;
  resetLabel?: string;
  actionsSlot?: ReactNode;
}
