export interface Reservation {
  id: string;
  guestName: string;
  tableId: string;
  partySize: number;
  startTime: string;
  endTime: string;
  date?: string;
  babyChair?: boolean;
  dishes?: ReservationDish[];
}

export interface ReservationDish {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export const reservationTables = [
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "A11",
  "A12",
  "A13",
  "A14",
] as const;

export const reservations: Reservation[] = [
  {
    id: "RV001",
    guestName: "Eva",
    tableId: "A1",
    partySize: 4,
    startTime: "10:30",
    endTime: "11:30",
  },
  {
    id: "RV003",
    guestName: "Bruno",
    tableId: "A3",
    partySize: 8,
    startTime: "12:00",
    endTime: "13:30",
  },
  {
    id: "RV004",
    guestName: "Huston",
    tableId: "A2",
    partySize: 2,
    startTime: "13:00",
    endTime: "14:00",
  },
];
