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
  tableTicketNumber?: ReactNode;
  tableTicketLabel?: ReactNode;
  sequenceNumber?: ReactNode;
  sequenceLabel?: ReactNode;
  status?: ReactNode;
  statusLabel?: ReactNode;
  orderChannel?: ReactNode;
  orderChannelLabel?: ReactNode;
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

export interface Promotion {
  id: string;
  name: string;
  code?: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minSpend?: number;
  isAvailable?: boolean;
  expiryDate?: string;
}

export interface AppliedPromotion {
  id: string;
  name: string;
  code?: string;
  type: "percentage" | "fixed";
  value: number;
  discountAmount: number;
  description?: string;
}

export interface PromotionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subtotal: number;
  appliedPromotion?: AppliedPromotion | null;
  onApplyPromotion?: (promotion: AppliedPromotion) => void;
  onRemovePromotion?: () => void;
  promotions?: Promotion[];
  formatCurrency?: (amount: number) => string;
  className?: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  tier: string;
  points: number;
  availableBenefit: string;
  phone: string;
  memberId: string;
  scanCode: string;
}

export interface MemberModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  appliedMember?: MemberProfile | null;
  members?: readonly MemberProfile[];
  onApplyMember?: (member: MemberProfile) => void;
  className?: string;
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
  subtotalLabel?: string;
  discount?: number;
  totalDiscountLabel?: string;
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
  paymentLabel?: ReactNode;
  paymentMethod?: ReactNode;
  receivedLabel?: ReactNode;
  receivedAmount?: ReactNode;
  changeLabel?: ReactNode;
  changeAmount?: ReactNode;
  changeSecondaryAmount?: ReactNode;
  formatCurrency?: (amount: number) => string;
  customRows?: BillingSummaryRow[];
  appliedPromotion?: AppliedPromotion | null;
  onRemovePromotion?: () => void;
  onOpenPromotionModal?: () => void;
  className?: string;
}

export interface PaymentActionsProps {
  paymentMethods?: PaymentMethodOption[];
  quickActions?: PaymentMethodOption[];
  selectedPaymentMethod?: string;
  onSelectPaymentMethod?: (methodId: string) => void;
  onQuickAction?: (actionId: string) => void;
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
  appliedPromotion?: AppliedPromotion | null;
  onApplyPromotion?: (promotion: AppliedPromotion) => void;
  onRemovePromotion?: () => void;
  subtotal?: number;
  promotions?: Promotion[];
  formatCurrency?: (amount: number) => string;
  className?: string;
}

export interface SignOutAlertDialogProps {
  body?: ReactNode;
  cancelLabel?: ReactNode;
  className?: string;
  confirmLabel?: ReactNode;
  header?: ReactNode;
  isOpen?: boolean;
  onConfirm?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  onSignOut?: () => void;
  status?: "default" | "accent" | "success" | "warning" | "danger";
  trigger?: ReactNode;
  triggerClassName?: string;
}

export interface OrderPanelFooterProps {
  className?: string;
  dateTime?: ReactNode;
  dateTimeLabel?: ReactNode;
  locale?: string;
  onSignOut?: () => void;
  shiftInfo?: ReactNode;
  shiftLabel?: ReactNode;
  showSignOut?: boolean;
  signOutBody?: ReactNode;
  signOutCancelLabel?: ReactNode;
  signOutConfirmLabel?: ReactNode;
  signOutHeader?: ReactNode;
  signOutStatus?: "default" | "accent" | "success" | "warning" | "danger";
  signOutTrigger?: ReactNode;
  signOutTriggerClassName?: string;
  signOutTriggerLabel?: ReactNode;
  systemLabel?: ReactNode;
  systemStatus?: ReactNode;
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
  tableTicketNumber?: ReactNode;
  tableTicketLabel?: ReactNode;
  sequenceNumber?: ReactNode;
  sequenceLabel?: ReactNode;
  status?: ReactNode;
  statusLabel?: ReactNode;
  orderChannel?: ReactNode;
  orderChannelLabel?: ReactNode;
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
  subtotalLabel?: string;
  discount?: number;
  totalDiscountLabel?: string;
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
  paymentLabel?: ReactNode;
  paymentMethod?: ReactNode;
  receivedLabel?: ReactNode;
  receivedAmount?: ReactNode;
  changeLabel?: ReactNode;
  changeAmount?: ReactNode;
  changeSecondaryAmount?: ReactNode;
  formatCurrency?: (amount: number) => string;
  customBillingRows?: BillingSummaryRow[];
  appliedPromotion?: AppliedPromotion | null;
  onApplyPromotion?: (promotion: AppliedPromotion) => void;
  onRemovePromotion?: () => void;
  promotions?: Promotion[];

  // Payment Props
  paymentMethods?: PaymentMethodOption[];
  quickActions?: PaymentMethodOption[];
  selectedPaymentMethod?: string;
  onSelectPaymentMethod?: (methodId: string) => void;
  onQuickAction?: (actionId: string) => void;
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
  footer?: ReactNode;
}
