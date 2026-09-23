# POS Footer Design and Route Review

- **Reviewed:** 2026-09-22
- **Component:** `components/shared/pos-footer.tsx`
- **Purpose:** Describe the current shared footer layout, its route coverage, and the component structure to preserve when refining it.

## Layout

The footer is a single compact bar at the bottom of the main POS workspace. It is shared across the six operational routes and stays below each route's content. On desktop, the cashier and shift metadata sits at the right. The navigation and utility actions share one horizontally scrollable rail.

```text
Desktop
┌────────────┬──────────────────────────────────────────────────────────────────────────┬────────────────────────┐
│ Sign out   │ Sales  Orders  Table  Customer  Settings  │ Products  Open Drawer ... │ Cashier · Shift open   │
│            │                                             Reprint ... Delivery Status │ 9:41 AM                │
└────────────┴──────────────────────────────────────────────────────────────────────────┴────────────────────────┘

Small screens
┌───────────┬────────────────────────────────────────────────────────────────────────────┐
│ [logout]  │ horizontally scrollable routes  │  Products  ...  Delivery Status          │
└───────────┴────────────────────────────────────────────────────────────────────────────┘
```

The rail does not wrap. On small screens, the sign-out label and shift metadata are hidden while their accessible labels remain available; the route and action buttons scroll horizontally with a fade hint. The visual order is:

1. Sign out, separated from the scrollable rail.
2. Five primary destinations: Sales, Orders, Table, Customer, Settings.
3. A vertical divider.
4. Operational shortcuts: Products, Open Drawer, Reprint Receipt, Cash In / Out, End Shift, Lock Register, Test Printer, Kitchen Queue, Delivery Status.
5. Cashier, shift status, and the localized current time on large screens.

The footer uses a card surface, a top border, and a light shadow. The current route uses the primary button variant; inactive destinations and utility actions use ghost buttons. Products is visually part of the utility group but receives the active style on `/products`.

## Route coverage

`POSFooter` is mounted by `POSLayout`, which places it at the end of the main workspace column. On desktop the optional right-side panel sits beside the main column and extends to the bottom of the workspace; the footer remains inside the main column rather than spanning beneath the aside.

| Route       | Footer active item | `POSLayout` caller                                                           |
| ----------- | ------------------ | ---------------------------------------------------------------------------- |
| `/sales`    | Sales              | `app/(protected)/sales/page.tsx`                                             |
| `/orders`   | Orders             | `app/(protected)/orders/page.tsx`                                            |
| `/table`    | Table              | `app/(protected)/table/page.tsx`                                             |
| `/customer` | Customer           | `components/customer/customer-workspace.tsx` (`CustomerPageClient`)          |
| `/settings` | Settings           | `components/settings/settings-workspace.tsx` (`SettingsWorkspace`)           |
| `/products` | Products           | `app/(protected)/products/products-page-content.tsx` (`ProductsPageContent`) |

`/dashboard` is protected but renders its own entry page and does not mount the persistent footer. `/`, `/login`, and `/dashboard` therefore have no live footer. The protected shell can show a footer **skeleton** while checking the session and during its 600 ms route loading gate; this is a temporary loading state, not a `POSFooter` mount.

The primary navigation targets are `/sales`, `/orders`, `/table`, `/customer`, and `/settings`. The Products shortcut targets `/products`. There is no `/more` destination and no More drawer in this component. The existing `docs/pos-features.md` describes a More drawer, so that description no longer matches the component's current direct-action rail.

## Component structure

```text
POSFooter({ className? })
├── footer frame (sticky bottom, top border, card surface)
├── SignOutAlertDialog
│   └── danger-soft Button + logout icon
├── ScrollShadow (horizontal)
│   └── nav
│       ├── five route Buttons
│       ├── visual separator
│       └── nine shortcut Buttons
├── cashier / shift / <time> metadata (large screens)
└── CashInOutModal, CloseShiftModal, LockRegisterModal
```

The public prop is only `className?: string`. Route and shortcut definitions, selected-route state, time formatting, action handlers, and the three modal open states are owned by the component. `POSLayout` supplies `className="w-full"` and no route currently overrides the footer styling.

### Interactions

- Selecting a route pushes its destination unless it is already current.
- Sign out confirms through `SignOutAlertDialog`, removes the session key, and replaces the route with `/login`.
- Cash In / Out, End Shift, and Lock Register open their corresponding modals.
- Open Drawer, Reprint Receipt, Test Printer, Kitchen Queue, and Delivery Status show toast feedback. They currently use static demo copy and do not perform device, network, or persistence operations.
- The displayed time refreshes once per minute and formats for English or Khmer.

## Review notes for refinement

- **Keep the one-row hierarchy:** preserve the fixed sign-out action, one scrollable route/action rail, and right-aligned shift metadata. It fits both sales and management pages without changing their content area.
- **Use segment-aware active matching:** current matching uses `pathname.startsWith(href)`. Matching the route itself or a slash-delimited child avoids activating `/orders` on a similarly prefixed path such as `/orders-archive`.
- **Localize the whole footer:** primary labels, sign-out copy, and cashier/shift labels use `SalesMenu`, but the nine shortcut labels and their toast text are hard-coded in English.
- **Persistent footer navigation:** The loading skeleton was removed from the POS footer navigation in favor of rendering the live `POSFooter` directly during loading, eliminating route transition flicker and keeping navigation accessible at all times.
- **Keep implementation status clear:** the current utility feedback is local demo behavior. Treating a toast as a completed drawer, printer, kitchen, or delivery operation would overstate what the UI does today.

## Component design contract

When changing the footer, keep the route list and utility shortcuts as distinct groups, keep a visible separator between them, and derive the active state from the current path. Keep icon-only controls labelled, mark decorative Tabler icons as hidden from assistive technology, retain `aria-current="page"` on the selected destination, and preserve a horizontal keyboard-scrollable rail at narrow widths. Continue using the installed HeroUI `Button` and `ScrollShadow` primitives and the repository's Tabler icon convention.
