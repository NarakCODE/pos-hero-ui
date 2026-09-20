export type CustomerTier = "vip" | "gold" | "member";

export interface CustomerRecord {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  tier: CustomerTier;
  visits: number;
  points: number;
  lifetimeSpend: string;
  lastVisit: string;
  memberSince: string;
  favorite: string;
}

export const customerRecords: CustomerRecord[] = [
  {
    id: "sokha-chhay",
    name: "Sokha Chhay",
    initials: "SC",
    phone: "+855 12 345 678",
    email: "sokha@example.com",
    tier: "vip",
    visits: 42,
    points: 2480,
    lifetimeSpend: "$1,248.50",
    lastVisit: "Today, 10:42 AM",
    memberSince: "Jan 2024",
    favorite: "S-Bubble Oolong Tea",
  },
  {
    id: "dara-sok",
    name: "Dara Sok",
    initials: "DS",
    phone: "+855 97 222 481",
    email: "dara@example.com",
    tier: "gold",
    visits: 28,
    points: 1360,
    lifetimeSpend: "$786.00",
    lastVisit: "Yesterday, 4:18 PM",
    memberSince: "Mar 2024",
    favorite: "M-Black Tea Macchiato",
  },
  {
    id: "mony-ly",
    name: "Mony Ly",
    initials: "ML",
    phone: "+855 10 678 912",
    email: "mony@example.com",
    tier: "member",
    visits: 16,
    points: 720,
    lifetimeSpend: "$412.50",
    lastVisit: "Yesterday, 11:06 AM",
    memberSince: "Jun 2024",
    favorite: "Matcha Latte",
  },
  {
    id: "sreypov-kim",
    name: "Sreypov Kim",
    initials: "SK",
    phone: "+855 96 435 220",
    email: "sreypov@example.com",
    tier: "gold",
    visits: 24,
    points: 1120,
    lifetimeSpend: "$655.75",
    lastVisit: "Mon, 2:35 PM",
    memberSince: "Feb 2024",
    favorite: "Taro Milk Tea",
  },
  {
    id: "vannak-chea",
    name: "Vannak Chea",
    initials: "VC",
    phone: "+855 11 540 709",
    email: "vannak@example.com",
    tier: "member",
    visits: 8,
    points: 300,
    lifetimeSpend: "$198.00",
    lastVisit: "Sun, 9:12 AM",
    memberSince: "Aug 2024",
    favorite: "Passion Fruit Tea",
  },
];
