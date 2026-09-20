export type OrderChannel =
  | "pos"
  | "wownow"
  | "foodpanda"
  | "grabfood"
  | "nham24";

export type PaymentStatus = "paid" | "pending" | "refunded";
export type FulfillmentStatus =
  | "new"
  | "inProgress"
  | "onHold"
  | "completed"
  | "rejected"
  | "refund"
  | "void"
  | "expired"
  | "cancelled";
export type OrderShift = "morning" | "afternoon" | "evening";

export interface OrderLineItem {
  name: string;
  quantity: number;
  price: string;
  modifiers: string;
  addOns?: string[];
}

export interface OrderRecord {
  id: string;
  sequence: number;
  orderCode: string;
  tableNumber: string;
  customerName: string;
  customerPhone: string;
  loyaltyTier: "vip" | "gold" | "silver" | "member";
  channel: OrderChannel;
  items: OrderLineItem[];
  totalQuantity: number;
  totalUsd: number;
  totalKhr: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdTime: string;
  createdDate: string;
  pickupTime: string;
  pickupDate: string;
  endTime: string;
  endDate: string;
  elapsed: string;
  shift: OrderShift;
  tender: string;
  received: string;
  change: string;
  timeline: {
    ordered: string;
    kitchenSent: string;
    completed: string;
  };
}

const seedOrders: Omit<OrderRecord, "id" | "sequence" | "orderCode" | "elapsed">[] = [
  {
    tableNumber: "Table 02/05",
    customerName: "Sokha Chen",
    customerPhone: "+855 12 345 678",
    loyaltyTier: "vip",
    channel: "pos",
    items: [
      {
        name: "Bubble Oolong Tea",
        quantity: 4,
        price: "$3.00",
        modifiers: "70% Sugar · Normal Ice",
        addOns: ["Grass Jelly"],
      },
      {
        name: "Black Tea Macchiato",
        quantity: 1,
        price: "$3.50",
        modifiers: "50% Sugar · Less Ice",
      },
      {
        name: "Strawberry Matcha Latte",
        quantity: 2,
        price: "$4.25",
        modifiers: "50% Sugar · Normal Ice",
      },
    ],
    totalQuantity: 7,
    totalUsd: 22.5,
    totalKhr: 90000,
    paymentStatus: "pending",
    fulfillmentStatus: "inProgress",
    createdTime: "12:45 PM",
    createdDate: "Sep 19, 2026",
    pickupTime: "12:50 PM",
    pickupDate: "Sep 19, 2026",
    endTime: "Pending",
    endDate: "Sep 19, 2026",
    shift: "morning",
    tender: "Cash, KHQR",
    received: "$25.00",
    change: "$2.50",
    timeline: {
      ordered: "12:45 PM",
      kitchenSent: "12:46 PM",
      completed: "Pending",
    },
  },
  {
    tableNumber: "Takeaway",
    customerName: "Lina Chan",
    customerPhone: "+855 16 284 901",
    loyaltyTier: "silver",
    channel: "wownow",
    items: [
      {
        name: "Brown Sugar Milk Tea",
        quantity: 2,
        price: "$3.75",
        modifiers: "100% Sugar · Less Ice",
        addOns: ["Boba Pearls"],
      },
      {
        name: "Croissant",
        quantity: 1,
        price: "$2.50",
        modifiers: "Warm",
      },
    ],
    totalQuantity: 3,
    totalUsd: 10,
    totalKhr: 40000,
    paymentStatus: "paid",
    fulfillmentStatus: "completed",
    createdTime: "12:32 PM",
    createdDate: "Sep 19, 2026",
    pickupTime: "12:38 PM",
    pickupDate: "Sep 19, 2026",
    endTime: "12:44 PM",
    endDate: "Sep 19, 2026",
    shift: "morning",
    tender: "KHQR",
    received: "$10.00",
    change: "$0.00",
    timeline: {
      ordered: "12:32 PM",
      kitchenSent: "12:33 PM",
      completed: "12:44 PM",
    },
  },
  {
    tableNumber: "Table 08/05",
    customerName: "Dara Sok",
    customerPhone: "+855 97 532 118",
    loyaltyTier: "gold",
    channel: "grabfood",
    items: [
      {
        name: "Iced Americano",
        quantity: 1,
        price: "$2.75",
        modifiers: "No Sugar · Normal Ice",
      },
      {
        name: "Ham & Cheese Toast",
        quantity: 1,
        price: "$4.50",
        modifiers: "Extra Toasted",
      },
    ],
    totalQuantity: 2,
    totalUsd: 7.25,
    totalKhr: 29000,
    paymentStatus: "paid",
    fulfillmentStatus: "completed",
    createdTime: "12:18 PM",
    createdDate: "Sep 19, 2026",
    pickupTime: "12:23 PM",
    pickupDate: "Sep 19, 2026",
    endTime: "12:30 PM",
    endDate: "Sep 19, 2026",
    shift: "morning",
    tender: "Credit",
    received: "$7.25",
    change: "$0.00",
    timeline: {
      ordered: "12:18 PM",
      kitchenSent: "12:19 PM",
      completed: "12:30 PM",
    },
  },
  {
    tableNumber: "Takeaway",
    customerName: "Vannak Lim",
    customerPhone: "+855 10 844 220",
    loyaltyTier: "member",
    channel: "foodpanda",
    items: [
      {
        name: "Mango Smoothie",
        quantity: 2,
        price: "$4.00",
        modifiers: "50% Sugar · No Ice",
        addOns: ["Coconut Jelly"],
      },
    ],
    totalQuantity: 2,
    totalUsd: 8,
    totalKhr: 32000,
    paymentStatus: "pending",
    fulfillmentStatus: "inProgress",
    createdTime: "11:58 AM",
    createdDate: "Sep 19, 2026",
    pickupTime: "12:04 PM",
    pickupDate: "Sep 19, 2026",
    endTime: "Pending",
    endDate: "Sep 19, 2026",
    shift: "morning",
    tender: "Cash",
    received: "$0.00",
    change: "$0.00",
    timeline: {
      ordered: "11:58 AM",
      kitchenSent: "12:00 PM",
      completed: "Pending",
    },
  },
  {
    tableNumber: "Table 01/05",
    customerName: "Maly Chea",
    customerPhone: "+855 11 643 009",
    loyaltyTier: "gold",
    channel: "nham24",
    items: [
      {
        name: "Matcha Macchiato",
        quantity: 1,
        price: "$4.25",
        modifiers: "25% Sugar · Less Ice",
        addOns: ["Cheese Foam"],
      },
      {
        name: "Chocolate Muffin",
        quantity: 2,
        price: "$2.25",
        modifiers: "Room Temperature",
      },
    ],
    totalQuantity: 3,
    totalUsd: 8.75,
    totalKhr: 35000,
    paymentStatus: "refunded",
    fulfillmentStatus: "cancelled",
    createdTime: "11:41 AM",
    createdDate: "Sep 19, 2026",
    pickupTime: "11:47 AM",
    pickupDate: "Sep 19, 2026",
    endTime: "Voided",
    endDate: "Sep 19, 2026",
    shift: "morning",
    tender: "Cash",
    received: "$10.00",
    change: "$1.25",
    timeline: {
      ordered: "11:41 AM",
      kitchenSent: "11:42 AM",
      completed: "Cancelled",
    },
  },
];

const statusCycle: FulfillmentStatus[] = [
  "new",
  "inProgress",
  "onHold",
  "completed",
  "rejected",
  "refund",
  "void",
  "expired",
  "cancelled",
];

export const orderRecords: OrderRecord[] = Array.from(
  { length: 155 },
  (_, index) => {
    const seed = seedOrders[index % seedOrders.length];
    const sequence = 155 - index;

    return {
      ...seed,
      id: `order-${sequence}`,
      sequence,
      orderCode: `ORD-2026-${String(891 - index).padStart(4, "0")}`,
      fulfillmentStatus: statusCycle[index % statusCycle.length],
      elapsed: `${index + 2}m ago`,
    };
  },
);
