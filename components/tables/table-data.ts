export type TableStatus = "available" | "inProgress" | "reserved" | "dirty";

export type TableSection = "all" | "reservation" | "zoneA" | "zoneB" | "zoneC" | "vip";

export interface FloorTable {
  id: string;
  label: string;
  section: Exclude<TableSection, "all" | "reservation">;
  status: TableStatus;
  server?: string;
  guestCount?: number;
  itemCount?: number;
  orderTime?: string;
  runningTotal?: string;
  reservationTime?: string;
}

export const floorTables: FloorTable[] = [
  {
    id: "ta01",
    label: "TA01",
    section: "zoneA",
    status: "available",
  },
  {
    id: "ta02",
    label: "TA02",
    section: "zoneA",
    status: "inProgress",
    server: "Sokha",
    guestCount: 2,
    itemCount: 4,
    orderTime: "10:12 AM",
    runningTotal: "$24.50",
  },
  {
    id: "ta03",
    label: "TA03",
    section: "zoneA",
    status: "dirty",
    server: "Dara",
    guestCount: 3,
    itemCount: 6,
    orderTime: "09:48 AM",
    runningTotal: "$42.00",
  },
  {
    id: "ta04",
    label: "TA04",
    section: "zoneB",
    status: "reserved",
    reservationTime: "12:30 PM",
  },
  {
    id: "ta05",
    label: "TA05",
    section: "zoneB",
    status: "inProgress",
    server: "Mony",
    guestCount: 4,
    itemCount: 8,
    orderTime: "10:28 AM",
    runningTotal: "$68.50",
  },
  {
    id: "ta06",
    label: "TA06",
    section: "zoneB",
    status: "available",
  },
  {
    id: "ta07",
    label: "TA07",
    section: "zoneC",
    status: "available",
  },
  {
    id: "ta08",
    label: "TA08",
    section: "zoneC",
    status: "inProgress",
    server: "Sokha",
    guestCount: 1,
    itemCount: 2,
    orderTime: "11:04 AM",
    runningTotal: "$14.50",
  },
  {
    id: "ta09",
    label: "TA09",
    section: "zoneC",
    status: "dirty",
    server: "Dara",
    guestCount: 2,
    itemCount: 5,
    orderTime: "10:02 AM",
    runningTotal: "$31.00",
  },
  {
    id: "ta10",
    label: "TA10",
    section: "vip",
    status: "reserved",
    reservationTime: "12:00 PM",
  },
  {
    id: "ta11",
    label: "TA11",
    section: "vip",
    status: "inProgress",
    server: "Mony",
    guestCount: 6,
    itemCount: 14,
    orderTime: "09:55 AM",
    runningTotal: "$126.00",
  },
  {
    id: "ta12",
    label: "TA12",
    section: "vip",
    status: "available",
  },
];
