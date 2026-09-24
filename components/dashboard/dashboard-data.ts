export type TimeRange = "Today" | "7D" | "1M" | "MTD";

export type SalesChannelKey = "dineIn" | "takeaway" | "delivery";

export type TenderKey = "cash" | "khqr" | "card";

export interface RevenuePoint {
  period: string;
  revenue: number;
}

export interface DashboardRangeData {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  averageTicket: number;
  averageTicketChange: number;
  estimatedTax: number;
  revenueTrend: RevenuePoint[];
  channels: { key: SalesChannelKey; revenue: number }[];
  tenders: { key: TenderKey; revenue: number }[];
}

export const dashboardDataByRange: Record<TimeRange, DashboardRangeData> = {
  Today: {
    revenue: 2480.5,
    revenueChange: 33.2,
    orders: 48,
    ordersChange: 18.4,
    averageTicket: 51.68,
    averageTicketChange: 12.5,
    estimatedTax: 248.05,
    revenueTrend: [
      { period: "8a", revenue: 80 },
      { period: "10a", revenue: 150 },
      { period: "12p", revenue: 420 },
      { period: "2p", revenue: 310 },
      { period: "4p", revenue: 330 },
      { period: "6p", revenue: 540 },
      { period: "8p", revenue: 480 },
      { period: "10p", revenue: 170.5 },
    ],
    channels: [
      { key: "dineIn", revenue: 1340 },
      { key: "takeaway", revenue: 795 },
      { key: "delivery", revenue: 345.5 },
    ],
    tenders: [
      { key: "cash", revenue: 780 },
      { key: "khqr", revenue: 1150.5 },
      { key: "card", revenue: 550 },
    ],
  },
  "7D": {
    revenue: 18420,
    revenueChange: 24.6,
    orders: 342,
    ordersChange: 20.1,
    averageTicket: 53.86,
    averageTicketChange: 3.8,
    estimatedTax: 1842,
    revenueTrend: [
      { period: "Mon", revenue: 2240 },
      { period: "Tue", revenue: 2540 },
      { period: "Wed", revenue: 2340 },
      { period: "Thu", revenue: 2810 },
      { period: "Fri", revenue: 2630 },
      { period: "Sat", revenue: 2970 },
      { period: "Sun", revenue: 2890 },
    ],
    channels: [
      { key: "dineIn", revenue: 10131 },
      { key: "takeaway", revenue: 5526 },
      { key: "delivery", revenue: 2763 },
    ],
    tenders: [
      { key: "cash", revenue: 5796.3 },
      { key: "khqr", revenue: 8658 },
      { key: "card", revenue: 3965.7 },
    ],
  },
  "1M": {
    revenue: 86400,
    revenueChange: 14.2,
    orders: 1620,
    ordersChange: 9.1,
    averageTicket: 53.33,
    averageTicketChange: 4.7,
    estimatedTax: 8640,
    revenueTrend: [
      { period: "Week 1", revenue: 17200 },
      { period: "Week 2", revenue: 18900 },
      { period: "Week 3", revenue: 16800 },
      { period: "Week 4", revenue: 19500 },
      { period: "Week 5", revenue: 14000 },
    ],
    channels: [
      { key: "dineIn", revenue: 47520 },
      { key: "takeaway", revenue: 25920 },
      { key: "delivery", revenue: 12960 },
    ],
    tenders: [
      { key: "cash", revenue: 27216 },
      { key: "khqr", revenue: 40089.6 },
      { key: "card", revenue: 19094.4 },
    ],
  },
  MTD: {
    revenue: 64250,
    revenueChange: 18.9,
    orders: 1180,
    ordersChange: 15.2,
    averageTicket: 54.45,
    averageTicketChange: 3.2,
    estimatedTax: 6425,
    revenueTrend: [
      { period: "Week 1", revenue: 12800 },
      { period: "Week 2", revenue: 15900 },
      { period: "Week 3", revenue: 17750 },
      { period: "Week 4", revenue: 17800 },
    ],
    channels: [
      { key: "dineIn", revenue: 35337 },
      { key: "takeaway", revenue: 19275 },
      { key: "delivery", revenue: 9638 },
    ],
    tenders: [
      { key: "cash", revenue: 20239 },
      { key: "khqr", revenue: 29812 },
      { key: "card", revenue: 14199 },
    ],
  },
};
