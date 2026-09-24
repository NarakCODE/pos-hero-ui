export type InvoiceStatus = "paid" | "pending" | "refunded" | "voided";

export type PaymentMethod =
  | "cash"
  | "khqr"
  | "bankCard"
  | "split"
  | "wownowPay"
  | "foodpandaPay"
  | "grabPay";

export type OrderType = "dineIn" | "takeaway" | "delivery";

export type OrderShift = "morning" | "afternoon" | "evening";

export type OrderChannel =
  | "pos"
  | "wownow"
  | "foodpanda"
  | "grabfood"
  | "nham24";

export interface InvoiceItem {
  id: string;
  name: string;
  nameKm?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: string;
  addOns?: string[];
}

export interface TenderDetails {
  tenderType: string;
  cashReceivedUsd?: number;
  cashReceivedKhr?: number;
  changeUsd?: number;
  changeKhr?: number;
  khqrRef?: string;
  cardLast4?: string;
  cardBrand?: string;
  approvalCode?: string;
  authCode?: string;
}

export interface RefundDetails {
  refundedAt: string;
  refundedBy: string;
  reason: string;
  amountUsd: number;
  refundMethod: string;
  notes?: string;
}

export interface VoidDetails {
  voidedAt: string;
  voidedBy: string;
  supervisorPin: string;
  reason: string;
}

export interface CustomerInfo {
  name: string;
  phone?: string;
  loyaltyTier?: "vip" | "gold" | "silver" | "member" | "regular";
  loyaltyPoints?: number;
  email?: string;
}

export interface InvoiceRecord {
  id: string;
  receiptNumber: string; // e.g. "REC-2026-1048"
  invoiceNumber: string; // e.g. "INV-2026-0891"
  sequence: number; // e.g. 155
  orderCode: string; // e.g. "ORD-1048"
  date: string; // "Sep 24, 2026"
  time: string; // "02:45 PM"
  timestamp: string; // ISO string for sorting/filtering
  shift: OrderShift;
  orderType: OrderType;
  tableNumber: string;
  customer: CustomerInfo;
  cashierName: string;
  registerId: string;
  channel: OrderChannel;
  items: InvoiceItem[];
  subtotalUsd: number;
  discountUsd: number;
  discountLabel?: string;
  vatUsd: number; // 10%
  serviceChargeUsd: number;
  totalUsd: number;
  totalKhr: number; // 4,100 KHR / 1 USD
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  tenderLabel: string;
  tenderDetails: TenderDetails;
  notes?: string;
  refundDetails?: RefundDetails;
  voidDetails?: VoidDetails;
}

export const KHR_RATE = 4100;

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatKhr(amount: number): string {
  return `៛${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatDualCurrency(usd: number, khr?: number): string {
  const khrAmount = khr !== undefined ? khr : usd * KHR_RATE;
  return `${formatUsd(usd)} / ${formatKhr(khrAmount)}`;
}

export interface InvoiceSummaryMetrics {
  totalRevenueUsd: number;
  totalRevenueKhr: number;
  totalCount: number;
  paidCount: number;
  paidRevenueUsd: number;
  pendingCount: number;
  pendingRevenueUsd: number;
  refundedCount: number;
  refundedRevenueUsd: number;
  voidedCount: number;
  voidedRevenueUsd: number;
  averageTicketUsd: number;
  cashRevenueUsd: number;
  khqrRevenueUsd: number;
  cardRevenueUsd: number;
  deliveryRevenueUsd: number;
}

export function calculateInvoiceMetrics(
  invoices: InvoiceRecord[],
): InvoiceSummaryMetrics {
  let totalRevenueUsd = 0;
  let paidCount = 0;
  let paidRevenueUsd = 0;
  let pendingCount = 0;
  let pendingRevenueUsd = 0;
  let refundedCount = 0;
  let refundedRevenueUsd = 0;
  let voidedCount = 0;
  let voidedRevenueUsd = 0;
  let cashRevenueUsd = 0;
  let khqrRevenueUsd = 0;
  let cardRevenueUsd = 0;
  let deliveryRevenueUsd = 0;

  for (const inv of invoices) {
    if (inv.status === "paid") {
      paidCount++;
      paidRevenueUsd += inv.totalUsd;
      totalRevenueUsd += inv.totalUsd;

      if (inv.paymentMethod === "cash") {
        cashRevenueUsd += inv.totalUsd;
      } else if (inv.paymentMethod === "khqr") {
        khqrRevenueUsd += inv.totalUsd;
      } else if (inv.paymentMethod === "bankCard") {
        cardRevenueUsd += inv.totalUsd;
      } else {
        deliveryRevenueUsd += inv.totalUsd;
      }
    } else if (inv.status === "pending") {
      pendingCount++;
      pendingRevenueUsd += inv.totalUsd;
    } else if (inv.status === "refunded") {
      refundedCount++;
      refundedRevenueUsd += inv.totalUsd;
    } else if (inv.status === "voided") {
      voidedCount++;
      voidedRevenueUsd += inv.totalUsd;
    }
  }

  const validCount = paidCount > 0 ? paidCount : 1;
  const averageTicketUsd = paidRevenueUsd / validCount;

  return {
    totalRevenueUsd,
    totalRevenueKhr: totalRevenueUsd * KHR_RATE,
    totalCount: invoices.length,
    paidCount,
    paidRevenueUsd,
    pendingCount,
    pendingRevenueUsd,
    refundedCount,
    refundedRevenueUsd,
    voidedCount,
    voidedRevenueUsd,
    averageTicketUsd,
    cashRevenueUsd,
    khqrRevenueUsd,
    cardRevenueUsd,
    deliveryRevenueUsd,
  };
}

export const initialInvoiceRecords: InvoiceRecord[] = [
  {
    id: "rec-1048",
    receiptNumber: "REC-2026-1048",
    invoiceNumber: "INV-2026-0891",
    sequence: 155,
    orderCode: "ORD-1048",
    date: "Sep 24, 2026",
    time: "02:45 PM",
    timestamp: "2026-09-24T14:45:00",
    shift: "afternoon",
    orderType: "dineIn",
    tableNumber: "Table 02/05",
    customer: {
      name: "Sokha Chen",
      phone: "+855 12 345 678",
      loyaltyTier: "vip",
      loyaltyPoints: 1240,
      email: "sokha.chen@example.com",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-1",
        name: "Bubble Oolong Tea",
        nameKm: "តែអ៊ូឡុងគុជ",
        quantity: 4,
        unitPrice: 3.0,
        totalPrice: 12.0,
        modifiers: "70% Sugar · Normal Ice · Medium",
        addOns: ["Grass Jelly ($0.50)"],
      },
      {
        id: "item-2",
        name: "Black Tea Macchiato",
        nameKm: "តែខ្មៅម៉ាគីយ៉ាតូ",
        quantity: 1,
        unitPrice: 3.5,
        totalPrice: 3.5,
        modifiers: "50% Sugar · Less Ice · Large",
      },
      {
        id: "item-3",
        name: "Strawberry Matcha Latte",
        nameKm: "ម៉ាត់ឆាឡាតេស្រ្តប៊ែរី",
        quantity: 2,
        unitPrice: 4.25,
        totalPrice: 8.5,
        modifiers: "50% Sugar · Normal Ice · Large",
      },
    ],
    subtotalUsd: 24.0,
    discountUsd: 2.4,
    discountLabel: "VIP Member 10% Discount",
    vatUsd: 2.16,
    serviceChargeUsd: 0.0,
    totalUsd: 23.76,
    totalKhr: 97416,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong / ABA)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-8841-X7",
      authCode: "AUTH-892144",
    },
    notes: "Customer requested receipt split for VIP rewards.",
  },
  {
    id: "rec-1047",
    receiptNumber: "REC-2026-1047",
    invoiceNumber: "INV-2026-0890",
    sequence: 154,
    orderCode: "ORD-1047",
    date: "Sep 24, 2026",
    time: "02:32 PM",
    timestamp: "2026-09-24T14:32:00",
    shift: "afternoon",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Lina Chan",
      phone: "+855 16 284 901",
      loyaltyTier: "silver",
      loyaltyPoints: 340,
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-4",
        name: "Brown Sugar Milk Tea",
        nameKm: "តែទឹកដោះគោស្ករត្នោត",
        quantity: 2,
        unitPrice: 3.75,
        totalPrice: 7.5,
        modifiers: "100% Sugar · Less Ice · Medium",
        addOns: ["Boba Pearls ($0.50)"],
      },
      {
        id: "item-5",
        name: "Butter Croissant",
        nameKm: "នំប៉័ងក្រូសង់ប៊ឺ",
        quantity: 1,
        unitPrice: 2.5,
        totalPrice: 2.5,
        modifiers: "Warm",
      },
    ],
    subtotalUsd: 10.0,
    discountUsd: 0.5,
    discountLabel: "Silver Member 5% Discount",
    vatUsd: 0.95,
    serviceChargeUsd: 0.0,
    totalUsd: 10.45,
    totalKhr: 42845,
    status: "paid",
    paymentMethod: "cash",
    tenderLabel: "Cash (USD + KHR)",
    tenderDetails: {
      tenderType: "Cash",
      cashReceivedUsd: 20.0,
      changeUsd: 9.55,
      changeKhr: 39155,
    },
    notes: "Takeaway cup carrier provided.",
  },
  {
    id: "rec-1046",
    receiptNumber: "REC-2026-1046",
    invoiceNumber: "INV-2026-0889",
    sequence: 153,
    orderCode: "ORD-1046",
    date: "Sep 24, 2026",
    time: "02:18 PM",
    timestamp: "2026-09-24T14:18:00",
    shift: "afternoon",
    orderType: "dineIn",
    tableNumber: "Table 08/05",
    customer: {
      name: "Dara Sok",
      phone: "+855 97 532 118",
      loyaltyTier: "gold",
      loyaltyPoints: 780,
    },
    cashierName: "Sreymom Pich",
    registerId: "POS-02",
    channel: "pos",
    items: [
      {
        id: "item-6",
        name: "Iced Americano",
        nameKm: "អាមេរិកាណូទឹកកក",
        quantity: 1,
        unitPrice: 2.75,
        totalPrice: 2.75,
        modifiers: "No Sugar · Normal Ice · Large",
      },
      {
        id: "item-7",
        name: "Ham & Cheese Toast",
        nameKm: "នំប៉័ងអាំងសាច់ក្រកនិងឈីស",
        quantity: 1,
        unitPrice: 4.5,
        totalPrice: 4.5,
        modifiers: "Extra Toasted",
      },
    ],
    subtotalUsd: 7.25,
    discountUsd: 0.58,
    discountLabel: "Gold Member 8% Discount",
    vatUsd: 0.67,
    serviceChargeUsd: 0.0,
    totalUsd: 7.34,
    totalKhr: 30094,
    status: "paid",
    paymentMethod: "bankCard",
    tenderLabel: "Visa Card (**** 4291)",
    tenderDetails: {
      tenderType: "Visa",
      cardBrand: "Visa",
      cardLast4: "4291",
      approvalCode: "AP-99014",
    },
  },
  {
    id: "rec-1045",
    receiptNumber: "REC-2026-1045",
    invoiceNumber: "INV-2026-0888",
    sequence: 152,
    orderCode: "ORD-1045",
    date: "Sep 24, 2026",
    time: "01:58 PM",
    timestamp: "2026-09-24T13:58:00",
    shift: "afternoon",
    orderType: "delivery",
    tableNumber: "Delivery #18",
    customer: {
      name: "Vannak Lim",
      phone: "+855 10 844 220",
      loyaltyTier: "regular",
    },
    cashierName: "Sreymom Pich",
    registerId: "POS-02",
    channel: "foodpanda",
    items: [
      {
        id: "item-8",
        name: "Mango Smoothie",
        nameKm: "ស្មូតធីស្វាយ",
        quantity: 2,
        unitPrice: 4.0,
        totalPrice: 8.0,
        modifiers: "50% Sugar · No Ice · Medium",
        addOns: ["Coconut Jelly ($0.50)"],
      },
      {
        id: "item-9",
        name: "Matcha Latte",
        nameKm: "ម៉ាត់ឆាឡាតេ",
        quantity: 1,
        unitPrice: 3.5,
        totalPrice: 3.5,
        modifiers: "Less Sugar · Normal Ice",
      },
    ],
    subtotalUsd: 11.5,
    discountUsd: 0.0,
    vatUsd: 1.15,
    serviceChargeUsd: 0.0,
    totalUsd: 12.65,
    totalKhr: 51865,
    status: "paid",
    paymentMethod: "foodpandaPay",
    tenderLabel: "Foodpanda In-App Pay",
    tenderDetails: {
      tenderType: "Foodpanda Online",
      approvalCode: "FP-841902",
    },
  },
  {
    id: "rec-1044",
    receiptNumber: "REC-2026-1044",
    invoiceNumber: "INV-2026-0887",
    sequence: 151,
    orderCode: "ORD-1044",
    date: "Sep 24, 2026",
    time: "01:42 PM",
    timestamp: "2026-09-24T13:42:00",
    shift: "afternoon",
    orderType: "dineIn",
    tableNumber: "Table 01/05",
    customer: {
      name: "Maly Chea",
      phone: "+855 11 643 009",
      loyaltyTier: "gold",
      loyaltyPoints: 610,
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-10",
        name: "Matcha Macchiato",
        nameKm: "ម៉ាត់ឆាម៉ាគីយ៉ាតូ",
        quantity: 1,
        unitPrice: 4.25,
        totalPrice: 4.25,
        modifiers: "25% Sugar · Less Ice · Medium",
        addOns: ["Cheese Foam ($0.75)"],
      },
      {
        id: "item-11",
        name: "Chocolate Muffin",
        nameKm: "នំម៉ាហ្វិនសូកូឡា",
        quantity: 2,
        unitPrice: 2.25,
        totalPrice: 4.5,
        modifiers: "Warmed Up",
      },
    ],
    subtotalUsd: 8.75,
    discountUsd: 0.7,
    discountLabel: "Gold 8% Discount",
    vatUsd: 0.81,
    serviceChargeUsd: 0.0,
    totalUsd: 8.86,
    totalKhr: 36326,
    status: "pending",
    paymentMethod: "cash",
    tenderLabel: "Pay at Counter (Pending)",
    tenderDetails: {
      tenderType: "Pending Cash",
    },
    notes: "Customer still dining. Bill printed for table review.",
  },
  {
    id: "rec-1043",
    receiptNumber: "REC-2026-1043",
    invoiceNumber: "INV-2026-0886",
    sequence: 150,
    orderCode: "ORD-1043",
    date: "Sep 24, 2026",
    time: "01:25 PM",
    timestamp: "2026-09-24T13:25:00",
    shift: "afternoon",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Kosal Voeun",
      phone: "+855 89 221 450",
      loyaltyTier: "member",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-12",
        name: "Peach Oolong Fruit Tea",
        nameKm: "តែផ្លែឈើអ៊ូឡុងផ្លែប៉េស",
        quantity: 2,
        unitPrice: 3.5,
        totalPrice: 7.0,
        modifiers: "70% Sugar · Less Ice · Large",
        addOns: ["Aloe Vera ($0.50)"],
      },
    ],
    subtotalUsd: 7.0,
    discountUsd: 0.35,
    vatUsd: 0.67,
    serviceChargeUsd: 0.0,
    totalUsd: 7.32,
    totalKhr: 30012,
    status: "refunded",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Refunded)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-7712",
    },
    refundDetails: {
      refundedAt: "01:31 PM",
      refundedBy: "Dara Sok",
      reason: "Wrong Ice Level - Customer returned drink before departure",
      amountUsd: 7.32,
      refundMethod: "Cash reversal from drawer",
      notes: "Drink remake was declined. Full refund issued.",
    },
  },
  {
    id: "rec-1042",
    receiptNumber: "REC-2026-1042",
    invoiceNumber: "INV-2026-0885",
    sequence: 149,
    orderCode: "ORD-1042",
    date: "Sep 24, 2026",
    time: "01:10 PM",
    timestamp: "2026-09-24T13:10:00",
    shift: "afternoon",
    orderType: "dineIn",
    tableNumber: "Table 04/05",
    customer: {
      name: "Sreypov Kim",
      phone: "+855 78 901 234",
      loyaltyTier: "vip",
      loyaltyPoints: 1890,
    },
    cashierName: "Sreymom Pich",
    registerId: "POS-02",
    channel: "pos",
    items: [
      {
        id: "item-13",
        name: "Caramel Macchiato",
        nameKm: "ការ៉ាមែលម៉ាគីយ៉ាតូ",
        quantity: 2,
        unitPrice: 3.85,
        totalPrice: 7.7,
        modifiers: "Normal Sugar · Extra Hot",
      },
      {
        id: "item-14",
        name: "Blueberry Cheesecake",
        nameKm: "នំឈីសខេកប្លូប៊ែរី",
        quantity: 2,
        unitPrice: 4.5,
        totalPrice: 9.0,
      },
    ],
    subtotalUsd: 16.7,
    discountUsd: 1.67,
    discountLabel: "VIP 10% Discount",
    vatUsd: 1.5,
    serviceChargeUsd: 0.0,
    totalUsd: 16.53,
    totalKhr: 67773,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong / ABA)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-6632-K1",
    },
  },
  {
    id: "rec-1041",
    receiptNumber: "REC-2026-1041",
    invoiceNumber: "INV-2026-0884",
    sequence: 148,
    orderCode: "ORD-1041",
    date: "Sep 24, 2026",
    time: "12:55 PM",
    timestamp: "2026-09-24T12:55:00",
    shift: "morning",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Test Customer (Voided)",
      loyaltyTier: "regular",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-15",
        name: "Espresso Double Shot",
        nameKm: "អេសប្រេសសូ ២ ស៊ុត",
        quantity: 2,
        unitPrice: 2.25,
        totalPrice: 4.5,
      },
    ],
    subtotalUsd: 4.5,
    discountUsd: 0.0,
    vatUsd: 0.45,
    serviceChargeUsd: 0.0,
    totalUsd: 4.95,
    totalKhr: 20295,
    status: "voided",
    paymentMethod: "cash",
    tenderLabel: "Voided by Manager",
    tenderDetails: {
      tenderType: "Void",
    },
    voidDetails: {
      voidedAt: "12:58 PM",
      voidedBy: "Dara Sok",
      supervisorPin: "9988",
      reason: "Accidental double-entry on register during peak lunch rush.",
    },
  },
  {
    id: "rec-1040",
    receiptNumber: "REC-2026-1040",
    invoiceNumber: "INV-2026-0883",
    sequence: 147,
    orderCode: "ORD-1040",
    date: "Sep 24, 2026",
    time: "12:40 PM",
    timestamp: "2026-09-24T12:40:00",
    shift: "morning",
    orderType: "delivery",
    tableNumber: "Delivery #12",
    customer: {
      name: "Rithy Seng",
      phone: "+855 93 456 789",
      loyaltyTier: "member",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "wownow",
    items: [
      {
        id: "item-16",
        name: "Brown Sugar Boba Fresh Milk",
        nameKm: "ទឹកដោះគោស្រស់ស្ករត្នោតគុជ",
        quantity: 3,
        unitPrice: 3.8,
        totalPrice: 11.4,
        modifiers: "70% Sugar · Less Ice",
      },
      {
        id: "item-17",
        name: "Egg Tart (Box of 4)",
        nameKm: "នំតាតពងមាន់",
        quantity: 1,
        unitPrice: 4.0,
        totalPrice: 4.0,
      },
    ],
    subtotalUsd: 15.4,
    discountUsd: 0.0,
    vatUsd: 1.54,
    serviceChargeUsd: 0.0,
    totalUsd: 16.94,
    totalKhr: 69454,
    status: "paid",
    paymentMethod: "wownowPay",
    tenderLabel: "Wownow Online Payment",
    tenderDetails: {
      tenderType: "Wownow App",
      approvalCode: "WN-99120-K",
    },
  },
  {
    id: "rec-1039",
    receiptNumber: "REC-2026-1039",
    invoiceNumber: "INV-2026-0882",
    sequence: 146,
    orderCode: "ORD-1039",
    date: "Sep 24, 2026",
    time: "12:20 PM",
    timestamp: "2026-09-24T12:20:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 06/05",
    customer: {
      name: "Channa Pov",
      phone: "+855 12 778 990",
      loyaltyTier: "vip",
      loyaltyPoints: 2150,
    },
    cashierName: "Vireak Chea",
    registerId: "POS-03",
    channel: "pos",
    items: [
      {
        id: "item-18",
        name: "Iced Cappuccino",
        nameKm: "កាពូឈីណូទឹកកក",
        quantity: 2,
        unitPrice: 3.25,
        totalPrice: 6.5,
        modifiers: "Less Sweet · Cinnamon Powder",
      },
      {
        id: "item-19",
        name: "Avocado Chicken Sandwich",
        nameKm: "សាំងវិចសាច់មាន់ផ្លែបឺរ",
        quantity: 2,
        unitPrice: 5.5,
        totalPrice: 11.0,
      },
      {
        id: "item-20",
        name: "French Fries with Truffle Mayo",
        nameKm: "ដំឡូងបារាំងបំពង",
        quantity: 1,
        unitPrice: 3.5,
        totalPrice: 3.5,
      },
    ],
    subtotalUsd: 21.0,
    discountUsd: 2.1,
    discountLabel: "VIP 10% Discount",
    vatUsd: 1.89,
    serviceChargeUsd: 0.0,
    totalUsd: 20.79,
    totalKhr: 85239,
    status: "paid",
    paymentMethod: "bankCard",
    tenderLabel: "Mastercard (**** 8831)",
    tenderDetails: {
      tenderType: "Mastercard",
      cardBrand: "Mastercard",
      cardLast4: "8831",
      approvalCode: "MC-44120",
    },
  },
  {
    id: "rec-1038",
    receiptNumber: "REC-2026-1038",
    invoiceNumber: "INV-2026-0881",
    sequence: 145,
    orderCode: "ORD-1038",
    date: "Sep 24, 2026",
    time: "11:50 AM",
    timestamp: "2026-09-24T11:50:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 03/05",
    customer: {
      name: "Bopha Heng",
      phone: "+855 15 902 114",
      loyaltyTier: "silver",
    },
    cashierName: "Vireak Chea",
    registerId: "POS-03",
    channel: "pos",
    items: [
      {
        id: "item-21",
        name: "Iced Caramel Latte",
        nameKm: "ឡាតេការ៉ាមែលទឹកកក",
        quantity: 1,
        unitPrice: 3.75,
        totalPrice: 3.75,
        modifiers: "Half Sweet · Oat Milk",
      },
      {
        id: "item-22",
        name: "Almond Croissant",
        nameKm: "ក្រូសង់អាល់ម៉ុន",
        quantity: 1,
        unitPrice: 2.8,
        totalPrice: 2.8,
      },
    ],
    subtotalUsd: 6.55,
    discountUsd: 0.33,
    discountLabel: "Silver 5% Discount",
    vatUsd: 0.62,
    serviceChargeUsd: 0.0,
    totalUsd: 6.84,
    totalKhr: 28044,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-4418-B9",
    },
  },
  {
    id: "rec-1037",
    receiptNumber: "REC-2026-1037",
    invoiceNumber: "INV-2026-0880",
    sequence: 144,
    orderCode: "ORD-1037",
    date: "Sep 24, 2026",
    time: "11:30 AM",
    timestamp: "2026-09-24T11:30:00",
    shift: "morning",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Walk-in Guest",
      loyaltyTier: "regular",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-23",
        name: "Hot Green Tea Latte",
        nameKm: "តែបៃតងឡាតេក្តៅ",
        quantity: 1,
        unitPrice: 3.2,
        totalPrice: 3.2,
      },
    ],
    subtotalUsd: 3.2,
    discountUsd: 0.0,
    vatUsd: 0.32,
    serviceChargeUsd: 0.0,
    totalUsd: 3.52,
    totalKhr: 14432,
    status: "paid",
    paymentMethod: "cash",
    tenderLabel: "Cash (KHR)",
    tenderDetails: {
      tenderType: "Cash KHR",
      cashReceivedKhr: 20000,
      changeKhr: 5568,
    },
  },
  {
    id: "rec-1036",
    receiptNumber: "REC-2026-1036",
    invoiceNumber: "INV-2026-0879",
    sequence: 143,
    orderCode: "ORD-1036",
    date: "Sep 24, 2026",
    time: "11:05 AM",
    timestamp: "2026-09-24T11:05:00",
    shift: "morning",
    orderType: "delivery",
    tableNumber: "Delivery #09",
    customer: {
      name: "Sovanrith Ouk",
      phone: "+855 92 884 102",
      loyaltyTier: "member",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "nham24",
    items: [
      {
        id: "item-24",
        name: "Passion Fruit Green Tea",
        nameKm: "តែបៃតងផ្លែផាសិន",
        quantity: 2,
        unitPrice: 3.0,
        totalPrice: 6.0,
        modifiers: "100% Sugar · Normal Ice",
        addOns: ["Chia Seeds ($0.50)"],
      },
      {
        id: "item-25",
        name: "Classic Club Sandwich",
        nameKm: "ក្លិបសាំងវិច",
        quantity: 1,
        unitPrice: 4.8,
        totalPrice: 4.8,
      },
    ],
    subtotalUsd: 10.8,
    discountUsd: 0.0,
    vatUsd: 1.08,
    serviceChargeUsd: 0.0,
    totalUsd: 11.88,
    totalKhr: 48708,
    status: "paid",
    paymentMethod: "split",
    tenderLabel: "Nham24 Pay",
    tenderDetails: {
      tenderType: "Nham24 Integrated",
      approvalCode: "NH-229104",
    },
  },
  {
    id: "rec-1035",
    receiptNumber: "REC-2026-1035",
    invoiceNumber: "INV-2026-0878",
    sequence: 142,
    orderCode: "ORD-1035",
    date: "Sep 24, 2026",
    time: "10:45 AM",
    timestamp: "2026-09-24T10:45:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 05/05",
    customer: {
      name: "Piseth Sar",
      phone: "+855 12 990 011",
      loyaltyTier: "vip",
    },
    cashierName: "Vireak Chea",
    registerId: "POS-03",
    channel: "pos",
    items: [
      {
        id: "item-26",
        name: "Cold Brew Special Reserve",
        nameKm: "កាហ្វេខូលប្រ៊ូពិសេស",
        quantity: 2,
        unitPrice: 4.5,
        totalPrice: 9.0,
      },
      {
        id: "item-27",
        name: "Smoked Salmon Bagel",
        nameKm: "នំប៉័ងបេហ្គលត្រីសាម៉ុន",
        quantity: 2,
        unitPrice: 5.75,
        totalPrice: 11.5,
      },
    ],
    subtotalUsd: 20.5,
    discountUsd: 2.05,
    discountLabel: "VIP 10% Discount",
    vatUsd: 1.85,
    serviceChargeUsd: 0.0,
    totalUsd: 20.3,
    totalKhr: 83230,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong / ABA)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-1189-Z3",
    },
  },
  {
    id: "rec-1034",
    receiptNumber: "REC-2026-1034",
    invoiceNumber: "INV-2026-0877",
    sequence: 141,
    orderCode: "ORD-1034",
    date: "Sep 24, 2026",
    time: "10:15 AM",
    timestamp: "2026-09-24T10:15:00",
    shift: "morning",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Kagna Meas",
      phone: "+855 86 554 219",
      loyaltyTier: "member",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-28",
        name: "Iced Dirty Coffee",
        nameKm: "ឌឺធីខូហ្វីទឹកកក",
        quantity: 1,
        unitPrice: 3.5,
        totalPrice: 3.5,
      },
    ],
    subtotalUsd: 3.5,
    discountUsd: 0.0,
    vatUsd: 0.35,
    serviceChargeUsd: 0.0,
    totalUsd: 3.85,
    totalKhr: 15785,
    status: "paid",
    paymentMethod: "cash",
    tenderLabel: "Cash",
    tenderDetails: {
      tenderType: "Cash",
      cashReceivedUsd: 5.0,
      changeUsd: 1.15,
      changeKhr: 4715,
    },
  },
  {
    id: "rec-1033",
    receiptNumber: "REC-2026-1033",
    invoiceNumber: "INV-2026-0876",
    sequence: 140,
    orderCode: "ORD-1033",
    date: "Sep 24, 2026",
    time: "09:50 AM",
    timestamp: "2026-09-24T09:50:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 02/05",
    customer: {
      name: "Office Group Order",
      phone: "+855 77 112 334",
      loyaltyTier: "gold",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-29",
        name: "Brown Sugar Milk Tea",
        nameKm: "តែទឹកដោះគោស្ករត្នោត",
        quantity: 5,
        unitPrice: 3.75,
        totalPrice: 18.75,
      },
      {
        id: "item-30",
        name: "Iced Americano",
        nameKm: "អាមេរិកាណូទឹកកក",
        quantity: 3,
        unitPrice: 2.75,
        totalPrice: 8.25,
      },
      {
        id: "item-31",
        name: "Matcha Latte",
        nameKm: "ម៉ាត់ឆាឡាតេ",
        quantity: 2,
        unitPrice: 3.5,
        totalPrice: 7.0,
      },
    ],
    subtotalUsd: 34.0,
    discountUsd: 2.72,
    discountLabel: "Gold 8% Group Discount",
    vatUsd: 3.13,
    serviceChargeUsd: 0.0,
    totalUsd: 34.41,
    totalKhr: 141081,
    status: "paid",
    paymentMethod: "bankCard",
    tenderLabel: "Visa Business (**** 1099)",
    tenderDetails: {
      tenderType: "Visa Business",
      cardBrand: "Visa",
      cardLast4: "1099",
      approvalCode: "AP-38190",
    },
    notes: "Tax Invoice issued for Corporate Expense.",
  },
  {
    id: "rec-1032",
    receiptNumber: "REC-2026-1032",
    invoiceNumber: "INV-2026-0875",
    sequence: 139,
    orderCode: "ORD-1032",
    date: "Sep 24, 2026",
    time: "09:15 AM",
    timestamp: "2026-09-24T09:15:00",
    shift: "morning",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Chanrithy Nuon",
      phone: "+855 16 776 543",
      loyaltyTier: "regular",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-32",
        name: "Hot Latte",
        nameKm: "ឡាតេក្តៅ",
        quantity: 1,
        unitPrice: 3.0,
        totalPrice: 3.0,
      },
      {
        id: "item-33",
        name: "Cinnamon Roll",
        nameKm: "នំស៊ីណាម៉ុនរ៉ូល",
        quantity: 1,
        unitPrice: 2.5,
        totalPrice: 2.5,
      },
    ],
    subtotalUsd: 5.5,
    discountUsd: 0.0,
    vatUsd: 0.55,
    serviceChargeUsd: 0.0,
    totalUsd: 6.05,
    totalKhr: 24805,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-0019-Q4",
    },
  },
  {
    id: "rec-1031",
    receiptNumber: "REC-2026-1031",
    invoiceNumber: "INV-2026-0874",
    sequence: 138,
    orderCode: "ORD-1031",
    date: "Sep 24, 2026",
    time: "08:45 AM",
    timestamp: "2026-09-24T08:45:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 01/05",
    customer: {
      name: "Morning Regular Guest",
      loyaltyTier: "member",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-34",
        name: "Iced Black Coffee",
        nameKm: "កាហ្វេខ្មៅទឹកកក",
        quantity: 1,
        unitPrice: 2.25,
        totalPrice: 2.25,
      },
    ],
    subtotalUsd: 2.25,
    discountUsd: 0.0,
    vatUsd: 0.23,
    serviceChargeUsd: 0.0,
    totalUsd: 2.48,
    totalKhr: 10168,
    status: "paid",
    paymentMethod: "cash",
    tenderLabel: "Cash",
    tenderDetails: {
      tenderType: "Cash",
      cashReceivedUsd: 5.0,
      changeUsd: 2.52,
      changeKhr: 10332,
    },
  },
  {
    id: "rec-1030",
    receiptNumber: "REC-2026-1030",
    invoiceNumber: "INV-2026-0873",
    sequence: 137,
    orderCode: "ORD-1030",
    date: "Sep 24, 2026",
    time: "08:15 AM",
    timestamp: "2026-09-24T08:15:00",
    shift: "morning",
    orderType: "dineIn",
    tableNumber: "Table 03/05",
    customer: {
      name: "Morning Meeting Table",
      phone: "+855 12 888 777",
      loyaltyTier: "vip",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-35",
        name: "Hot Americano",
        nameKm: "អាមេរិកាណូក្តៅ",
        quantity: 4,
        unitPrice: 2.5,
        totalPrice: 10.0,
      },
      {
        id: "item-36",
        name: "Butter Croissant",
        nameKm: "នំប៉័ងក្រូសង់ប៊ឺ",
        quantity: 4,
        unitPrice: 2.5,
        totalPrice: 10.0,
      },
    ],
    subtotalUsd: 20.0,
    discountUsd: 2.0,
    discountLabel: "VIP 10% Discount",
    vatUsd: 1.8,
    serviceChargeUsd: 0.0,
    totalUsd: 19.8,
    totalKhr: 81180,
    status: "paid",
    paymentMethod: "khqr",
    tenderLabel: "KHQR (Bakong / ABA)",
    tenderDetails: {
      tenderType: "KHQR",
      khqrRef: "BAKONG-0924-8801-V8",
    },
  },
  {
    id: "rec-1029",
    receiptNumber: "REC-2026-1029",
    invoiceNumber: "INV-2026-0872",
    sequence: 136,
    orderCode: "ORD-1029",
    date: "Sep 24, 2026",
    time: "07:45 AM",
    timestamp: "2026-09-24T07:45:00",
    shift: "morning",
    orderType: "takeaway",
    tableNumber: "Takeaway",
    customer: {
      name: "Early Commuter",
      loyaltyTier: "regular",
    },
    cashierName: "Dara Sok",
    registerId: "POS-01",
    channel: "pos",
    items: [
      {
        id: "item-37",
        name: "Espresso Single",
        nameKm: "អេសប្រេសសូ ១ ស៊ុត",
        quantity: 1,
        unitPrice: 1.75,
        totalPrice: 1.75,
      },
    ],
    subtotalUsd: 1.75,
    discountUsd: 0.0,
    vatUsd: 0.18,
    serviceChargeUsd: 0.0,
    totalUsd: 1.93,
    totalKhr: 7913,
    status: "paid",
    paymentMethod: "cash",
    tenderLabel: "Cash",
    tenderDetails: {
      tenderType: "Cash",
      cashReceivedUsd: 2.0,
      changeUsd: 0.07,
      changeKhr: 287,
    },
  },
];

export const STORE_INFO = {
  nameEn: "RakPOS Specialty Coffee & Bakery",
  nameKm: "រ៉ាក់ភីអូអេស កាហ្វេនិងនំពិសេស",
  branchEn: "Norodom Boulevard Flagship",
  branchKm: "សាខាមហាវិថីព្រះនរោត្តម",
  addressEn: "#42 Norodom Blvd, Daun Penh, Phnom Penh, Cambodia",
  addressKm: "ផ្ទះលេខ ៤២ មហាវិថីព្រះនរោត្តម ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ",
  vatTin: "K008-902184910",
  phone: "+855 23 888 999 / +855 12 345 678",
  wifiSsid: "RakPOS_Guest",
  wifiPass: "coffee2026",
  email: "billing@rakpos.coffee",
  website: "www.rakpos.coffee",
};
