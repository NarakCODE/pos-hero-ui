# RakPOS

RakPOS is a touch-friendly point-of-sale workstation UI for café and restaurant operations. It is a frontend MVP built with Next.js, React, HeroUI, and Tailwind CSS.

The current project focuses on the cashier experience: product ordering, payment flows, order management, table operations, customer profiles, and terminal settings.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- HeroUI v3.2.6
- Tailwind CSS v4
- `next-intl` for English and Khmer localization
- `reicon-react` for application icons
- `next-themes` for light and dark mode
- `pnpm` 10.26.1

## Getting started

Install dependencies with the repository's pinned package manager:

```bash
corepack enable
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The current authentication flow is a demo. Enter any non-empty identifier and password on `/login` to open the protected POS workspace.

## Available commands

```bash
pnpm dev       # Start the development server
pnpm lint      # Run ESLint
pnpm build     # Create a production build and run TypeScript checks
pnpm start     # Serve the latest production build
```

Before handing off changes, run:

```bash
pnpm lint
pnpm build
git diff --check
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with locale and theme controls |
| `/login` | Demo sign-in screen |
| `/sales` | Product catalog, modifiers, order ticket, and payment actions |
| `/orders` | Order data grid, filters, pagination, and order details aside |
| `/table` | Floor sections, table search/filtering, table cards, and table order aside |
| `/customer` | Customer directory, segments, search, metrics, and profile details |
| `/settings` | Responsive register, receipt, payment, staff, and device settings |
| `/more` | Additional operations placeholder |

The protected routes use the shared POS shell with a header, footer navigation, locale/theme switchers, and optional desktop context panels.

## UI highlights

### Sales

- Product catalog with category tabs and search.
- Product customization for size, sweetness, and add-ons.
- Order ticket with quantity controls, promotions, membership discount, and payment methods.
- Payment flows for cash, bank card, KHQR, brand wallet, and digital wallet.

### Orders

- HeroUI data grid with sorting, selection, filters, and pagination.
- Filters for channel, date/shift, order status, and payment status.
- Scrollable order details and checkout actions in the right aside.

### Tables

- Floor and area tabs for All, Reservation, Zone A, Zone B, Zone C, and VIP.
- Search and a filters popover for table status and assigned server.
- Three-column table card grid with availability and active-session details.
- Table order aside with itemized products, payment summary, and management actions.

### Customer

- Responsive customer directory with search and loyalty segments.
- Summary metrics for customers, active members, and rewards.
- Desktop list/detail layout that becomes a touch-friendly stacked layout on smaller screens.

### Settings

- Large touch targets and spacious controls for cashier and tablet use.
- Horizontal section navigation on smaller screens.
- Vertical section navigation on tablet and desktop layouts.
- Local UI state for general, receipt, payment, staff access, and device settings.

## Project structure

```text
app/
├── (auth)/login/              Demo authentication
├── (protected)/sales/         Sales workstation
├── (protected)/orders/        Orders workspace
├── (protected)/table/         Table workspace
├── (protected)/customer/      Customer workspace
└── (protected)/settings/      Settings workspace

components/
├── customer/                  Customer data and directory UI
├── orders/                    Orders grid and order details aside
├── order-panel/               Ticket, billing, and payment flows
├── settings/                  Responsive settings workspace
├── tables/                    Table grid, filters, and table aside
└── shared/                    POS layout, header, footer, and shell

messages/
├── en.json                    English translations
└── km.json                    Khmer translations
```

## Localization and fonts

The active locale is read from the `locale` cookie. The supported locales are:

- `en` — Inter
- `km` — Kantumruy Pro with Noto Sans Khmer fallback

Translation catalogs live in `messages/en.json` and `messages/km.json`. New UI copy should be added to both catalogs and consumed through `next-intl`.

## Design and component conventions

- Use HeroUI v3 compound components and semantic variants such as `primary`, `secondary`, `ghost`, and `danger`.
- Use `onPress` for HeroUI interactive controls.
- Use `reicon-react` for application icons and mark decorative icons with `aria-hidden="true"`.
- Prefer shared layout primitives in `components/shared` for page structure.
- Keep settings and other dense workstation controls usable with touch targets, wrapping labels, and responsive layouts.
- Use theme tokens such as `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, and `border-border` instead of hard-coded interface colors.

## MVP boundaries

This repository currently contains frontend demo data and session-local interactions. Customer records, table data, orders, and settings are not connected to a backend or database. The demo sign-in flag is stored in `sessionStorage` under `rakpos:authenticated`; it is not production authentication.

There is no configured test suite yet. `pnpm lint` and `pnpm build` are the current baseline checks.
