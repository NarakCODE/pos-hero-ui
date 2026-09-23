export type TableStatus = "available" | "inProgress" | "reserved" | "dirty";

export type TableBookingStatus = "completed" | "inProgress" | "upcoming";

export type TableBooking = {
  time: (typeof tableBookingHours)[number];
  status: TableBookingStatus;
  guestName?: string;
  partySize?: number;
  walkIn?: "breakfast" | "lunch";
};

export const tableBookingHours = [
  "08:00am",
  "09:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "01:00pm",
  "02:00pm",
  "03:00pm",
  "04:00pm",
  "05:00pm",
  "06:00pm",
  "07:00pm",
  "08:00pm",
  "09:00pm",
  "10:00pm",
] as const;

export type TableSection = "all" | "reservation" | "zoneA" | "zoneB" | "zoneC" | "vip";

export interface FloorTable {
  id: string;
  label: string;
  section: Exclude<TableSection, "all" | "reservation">;
  status: TableStatus;
  capacity: number;
  bookings: TableBooking[];
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
    capacity: 4,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "05:00pm", guestName: "Irene Wong", partySize: 4, status: "upcoming" },
      { time: "06:00pm", guestName: "Irene Wong", partySize: 4, status: "upcoming" },
    ],
  },
  {
    id: "ta02",
    label: "TA02",
    section: "zoneA",
    status: "inProgress",
    capacity: 8,
    bookings: [
      { time: "11:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "12:00pm", guestName: "John", partySize: 8, status: "inProgress" },
      { time: "06:00pm", guestName: "Terry", partySize: 6, status: "upcoming" },
    ],
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
    capacity: 8,
    bookings: [
      { time: "12:00pm", walkIn: "lunch", partySize: 3, status: "inProgress" },
      { time: "01:00pm", guestName: "Lisa", partySize: 8, status: "upcoming" },
      { time: "02:00pm", guestName: "Lisa", partySize: 8, status: "upcoming" },
      { time: "06:00pm", guestName: "Terry", status: "upcoming" },
    ],
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
    capacity: 4,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "12:00pm", walkIn: "lunch", partySize: 3, status: "inProgress" },
      { time: "01:00pm", guestName: "Richard", partySize: 4, status: "upcoming" },
      { time: "02:00pm", guestName: "Richard", partySize: 4, status: "upcoming" },
      { time: "06:00pm", guestName: "Paul", partySize: 3, status: "upcoming" },
      { time: "07:00pm", guestName: "Paul", partySize: 3, status: "upcoming" },
      { time: "08:00pm", guestName: "Paul", partySize: 3, status: "upcoming" },
    ],
    reservationTime: "12:30 PM",
  },
  {
    id: "ta05",
    label: "TA05",
    section: "zoneB",
    status: "inProgress",
    capacity: 4,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "12:00pm", walkIn: "lunch", partySize: 3, status: "inProgress" },
    ],
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
    capacity: 4,
    bookings: [
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "10:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
    ],
  },
  {
    id: "ta07",
    label: "TA07",
    section: "zoneC",
    status: "available",
    capacity: 6,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "12:00pm", walkIn: "lunch", partySize: 4, status: "inProgress" },
    ],
  },
  {
    id: "ta08",
    label: "TA08",
    section: "zoneC",
    status: "inProgress",
    capacity: 4,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "12:00pm", walkIn: "lunch", partySize: 3, status: "inProgress" },
    ],
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
    capacity: 4,
    bookings: [
      { time: "08:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
      { time: "09:00am", walkIn: "breakfast", partySize: 2, status: "completed" },
    ],
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
    capacity: 4,
    bookings: [
      { time: "12:00pm", guestName: "Sophea", partySize: 3, status: "upcoming" },
    ],
    reservationTime: "12:00 PM",
  },
  {
    id: "ta11",
    label: "TA11",
    section: "vip",
    status: "inProgress",
    capacity: 6,
    bookings: [
      { time: "11:00am", guestName: "Dara", partySize: 6, status: "inProgress" },
      { time: "05:00pm", guestName: "Sokha", partySize: 4, status: "upcoming" },
    ],
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
    capacity: 4,
    bookings: [],
  },
];
