# Point of Sale Modules and Features

This document describes the POS capabilities currently represented in the
repository. It is an implementation audit of the Next.js application, not a
future product specification.

- **Application:** <code>pos-hero-ui</code>
- **Audit date:** 2026-09-21
- **Runtime:** Next.js App Router, React, TypeScript, Tailwind CSS v4, HeroUI v3
- **Locales:** English (<code>en</code>) and Khmer (<code>km</code>)
- **Current data mode:** Static fixture data and client-side/session-local state

## Module map

| Module         | Route                   | Current role                                                   | Status                                  |
| -------------- | ----------------------- | -------------------------------------------------------------- | --------------------------------------- |
| Authentication | <code>/login</code>     | Sign in to the protected POS shell                             | UI/demo authentication                  |
| Sales          | <code>/sales</code>     | Cashier register, product catalog, ticket, payment             | Implemented UI with local state         |
| Orders         | <code>/orders</code>    | Search, filter, review, and act on existing orders             | Implemented UI with fixture data        |
| Table          | <code>/table</code>     | Floor sections, table status, sessions, and table actions      | Implemented UI with fixture data        |
| Customer       | <code>/customer</code>  | Customer directory, segmentation, profile details, and actions | Implemented UI with fixture data        |
| Settings       | <code>/settings</code>  | Company, staff, currency, station, and device configuration    | Implemented UI with session-local edits |
| Dashboard      | <code>/dashboard</code> | Entry screen with a link to the POS register                   | Minimal entry screen                    |
| More           | <code>—</code>          | Bottom drawer for register operations from the shared POS footer | Implemented drawer experience           |

## Shared POS experience

### Application shell

The protected routes use the shared layout components in
<code>components/shared/</code>:

- <code>AppLayout</code> owns viewport height, the main workstation, an optional
  desktop right aside, and the footer region.
- <code>POSLayout</code> composes the shared header, page content, optional right
  panel, and persistent POS footer.
- Layout tokens control content padding, inter-region gap, maximum width, and
  right-aside width so feature pages can change their content without changing
  the application frame.
- The main/aside relationship becomes a single-column workspace on smaller
  screens and a main-plus-aside workspace at the desktop breakpoint.
- The shared footer provides navigation for Sales, Orders, Table, Customer,
  Settings, and More, plus current shift/time metadata and sign-out.

### Localization and visual system

- Shared translations are stored in <code>messages/en.json</code> and
  <code>messages/km.json</code>. Feature catalogs use one flat namespace per
  file, such as <code>messages/en/customer.json</code> and
  <code>messages/en/product.json</code>, and are merged before they are
  consumed with <code>next-intl</code>.
- English uses Inter. Khmer uses Kantumruy Pro with Noto Sans Khmer as the
  fallback: “Kantumruy Pro”, “Noto Sans Khmer”, sans-serif.
- HeroUI v3 supplies the application controls, surfaces, cards, tables, tabs,
  selects, popovers, chips, avatars, dialogs, and form primitives.
- <code>@tabler/icons-react</code> is the default icon source for navigation and
  actions.
- Semantic HeroUI color tokens are used for accent, success, warning, danger,
  surface, muted text, and separators.
- Interactive controls include accessible labels or labelled regions, and the
  data tables use semantic table structure and row selection states.

### Authentication boundary

The login form in <code>app/(auth)/login/page.tsx</code> provides:

- Identifier and password fields with required-field validation.
- Password visibility toggle.
- Submit flow that stores <code>authSessionStorageKey</code> in
  <code>sessionStorage</code> and redirects to <code>/sales</code>.
- Links for starting a trial and recovering a password.
- Visual Google, Facebook, and Apple sign-in buttons.

<code>components/shared/protected-app-shell.tsx</code> checks the session flag
before rendering protected routes and redirects unauthenticated users to
<code>/login</code>. This is a browser-session demo boundary; it is not server
authentication or role-based access control.

## Sales module

**Route:** <code>app/(protected)/sales/page.tsx</code>

Sales is the primary cashier/register workspace. It combines a searchable
product catalog on the left with a reusable order and payment panel on the
right.

### Catalog and product selection

- Category tabs for Favourites, Best Sellers, Milk Tea, Fruit Tea, Coffee,
  Snacks, and Desserts.
- Product search across English and Khmer product names.
- Product cards with product name, price, image, category context, and an Add
  action.
- Static catalog records in
  <code>app/(protected)/sales/data.ts</code>.

### Product customization

Each newly added product can be configured with:

- Size: Extra Small, Small, Medium, Large, or Extra Large.
- Ice: Regular Ice, Less Ice, No Ice, Warm, or Hot.
- Sweetness: 0%, 25%, 50%, 70%, or 100% sugar.
- Add-ons such as Grass Jelly, Boba Pearls, Cheese Foam, Coconut Jelly, Aloe
  Vera, Red Bean, and Whipped Cream.

The selected modifier combination is used to identify an order line, so adding
the same product with the same modifiers increments its quantity instead of
creating a duplicate line.

### Ticket and order management

The reusable <code>OrderPanel</code> and its subcomponents provide:

- Table/ticket number, sequence number, status, order type, and order channel.
- Takeaway and Dine In order type switching.
- Order channel selection, including POS and delivery-channel options.
- Itemized lines with modifiers, unit price, quantity, and line total.
- Increase, decrease, and remove line item actions.
- Clear ticket and start-new-order behavior.
- Empty-ticket state when all items are removed.
- Subtotal, discount, tax, item count, and total calculation.

### Discounts, members, and operational actions

The payment action area supports UI flows for:

- Promotions and applied discount summaries.
- Member lookup and member discount state.
- Brand wallet.
- Digital wallet.
- Send to kitchen.
- Print receipt.
- Hold order.
- Reset/new order.

### Payment methods

The register exposes Cash, Bank Card, and KHQR payment choices. Payment
interaction components include:

- Cash payment modal with received amount and change summary.
- Bank card payment modal with card/payment handling UI.
- KHQR payment modal.
- Payment method drawer for additional payment selection.
- Brand wallet payment modal.
- Digital wallet payment modal with provider, QR, processing, success, failure,
  and expired states.

The main charge action marks the local ticket as paid and shows the completed
state. The current implementation does not call a payment gateway or persist a
transaction.

## Orders module

**Route:** <code>app/(protected)/orders/page.tsx</code>

Orders is a dense, sortable order-management table paired with a right-side
order details panel.

### Status navigation

The secondary status tabs are:

- All
- In Progress
- Completed
- On Hold
- New
- Cancelled
- Refund
- Rejected

### Search, filters, and sorting

- Search by order code, customer, phone, or table information.
- Filters popover with HeroUI Select controls for channel, date/shift, and
  payment status.
- Reset filters action and active-filter count.
- Sortable columns for No., Customer, Channel, Payment, Total Bill, Date &
  Time, Pickup Time, End Time, and Status.
- Client-side pagination with 25, 50, and 100 rows per page.
- Row-size select is aligned to the start and pagination is aligned to the end;
  the old “Showing … of … orders” summary is not displayed.

### Order table and details aside

The table uses HeroUI’s semantic table primitives and displays:

- Customer identity and order metadata.
- Order channel labels and channel avatars.
- Payment status chips for Paid, Pending, and Refunded.
- Fulfillment status chips.
- USD/KHR totals where available.
- Single-row selection that drives the details aside.

The details aside includes:

- Table/ticket number and sequence metadata.
- Fulfillment status and order channel.
- Scrollable itemized order lines with product, price, quantity, amount, and
  modifiers/add-ons.
- Remark note area.
- Tender details: payment type, received amount, and change.
- Totals: subtotal, discount, VAT, and dual-currency grand total.
- Accept and Reject actions.

Accept and Reject currently update the selected order status in local component
state. They do not submit an order workflow to a backend.

### Order data model

<code>components/orders/orders-data.ts</code> models:

- Order channels: POS, Wownow, Foodpanda, GrabFood, and Nham24.
- Payment statuses: Paid, Pending, and Refunded.
- Fulfillment statuses: New, In Progress, On Hold, Completed, Rejected,
  Refund, Void, Expired, and Cancelled.
- Morning, Afternoon, and Evening shifts.
- Customer, table, line-item, currency, tender, timing, and timeline fields.

The current order list is generated from static seed records.

## Table module

**Route:** <code>app/(protected)/table/page.tsx</code>

Table is a floor-activity workspace for restaurant service teams.

### Floor navigation and filtering

- Secondary section tabs for All, Reservation, Zone A, Zone B, Zone C, and VIP.
- Search for a table or floor item.
- Filters popover for table status and assigned server.
- Active-filter count and reset action.

### Table grid

- Three-column responsive grid of HeroUI <code>Card</code> table cards.
- Static tables TA01 through TA12.
- Statuses: Available, In Progress, Reserved, and Dirty.
- Status badge, table identifier, section, and active-session context.
- Occupied table cards show server, guest count, item count, order time, and
  running total.
- Available cards preserve the same card layout while displaying zero values
  and “--” placeholders for unavailable session text.
- Table selection uses accessible pressed-state semantics without changing the
  table card into a separate active-color variant.

### Table details aside

The table aside contains:

- Table/ticket number, sequence number, status, and Dine In/order-channel
  selector.
- Product, price, quantity, and amount columns.
- Product customization details and paid add-ons.
- Remark note.
- Payment details for payment type, received amount, and change.
- Subtotal, discount, and dual-currency total.
- Primary actions: Edit Order, Pay Request, and Add Guest.
- Table/billing actions: Add Bill, Merge Bill, Split Bill, Merge Table, and
  Move Table.

Table cards, the aside, and action buttons currently use fixture data and local
selection/action state.

## Customer module

**Route:** <code>app/(protected)/customer/page.tsx</code>

Customer provides a searchable customer directory and a profile/details aside.

### Directory controls

- Customer segment tabs for All, VIP, Gold, Black, and Regular.
- Search by name, phone, email, favourite item, or last visit.
- Activity filter popover for all, frequent, and recent customers.
- Sortable customer table.
- Customer profile avatar, contact details, tier, visits, lifetime spend, and
  last-visit information.
- Pagination with 25, 50, and 100 rows per page.
- Start-aligned page-size control and end-aligned pagination.

### Customer profile aside

The selected customer profile includes:

- DiceBear Open Peeps avatar generated from the customer identifier.
- Full name, customer ID, telephone number, and Active/Inactive status.
- Expandable Basic Information section.
- Two-column details for email, gender, date of birth, tier, pay later,
  pay-later limit, joined date, and tags.
- Quick actions: Start Order, Edit, and Pay Back.
- Reservation action plus call, message, and more utility buttons.

Customer records are defined in <code>components/customer/customer-data.ts</code>,
and the profile UI is implemented in
<code>components/customer/customer-workspace.tsx</code>. Avatars use:

    https://api.dicebear.com/10.x/open-peeps/svg?seed=<customer-id>

## Settings module

**Route:** <code>app/(protected)/settings/page.tsx</code>

Settings uses a dual-pane workspace designed for desktop and touch/tablet
interaction. The left pane selects a settings area; the right pane displays the
active configuration.

### Categories and settings tiles

Top-level secondary tabs currently include:

- Company
- User Management
- Menu & Products
- Inventory
- Customer
- Reports
- Integrations

The left pane also provides a Search Settings field and touch-friendly HeroUI
Card tiles. Available tiles include Company, Store, Stations & Devices,
Currency, Staff, Menu, Modifiers, Stock, Customer, Reports, and Integrations.
Tile cards use a centered icon-and-label layout without descriptions or a
chevron.

### Configuration panels

The implemented configuration panels are:

#### Company and Store

- Store name.
- Store phone.
- Currency selection.
- Timezone selection for Phnom Penh or Bangkok.
- Auto-lock register toggle.
- Sound feedback toggle.

#### Currency

- Default currency selection for USD or KHR.

#### Staff

- Require staff PIN toggle.
- Manager approval toggle.
- Role counts for Cashiers, Managers, and Owners.

#### Stations & Devices

Connected-device rows currently cover:

- Receipt printer.
- Customer display.
- Cash drawer.
- Kitchen display.
- Barcode scanner.
- Payment terminal.
- Kitchen printer.
- Label printer.
- Store network.

Each row exposes connected/not-connected status and the panel includes device
sync information.

Menu, Modifiers, Stock, Customer, Reports, and Integrations currently render
the settings selection/empty state rather than a full configuration form.

### Save behavior

The Save Changes button is placed at the bottom end of the configuration pane.
The current save state is session-local UI feedback; there is no settings API or
database persistence in this repository.

## Dashboard and More modules

### Dashboard

<code>/dashboard</code> currently acts as a simple entry screen with:

- Dashboard title and description.
- Open POS Register action that routes to <code>/sales</code>.
- Sign-out action.

It does not currently contain KPI cards, charts, inventory analytics, or shift
reports.

### More

More is a drawer-only POS action menu opened from the shared footer. It contains
quick register operations such as cash drawer access, receipt reprints, cash
in/out, shift closing, register locking, printer testing, kitchen queue status,
and delivery status. There is no standalone <code>/more</code> route.

## Component ownership

| Area               | Main implementation files                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared shell       | <code>components/shared/app-layout.tsx</code>, <code>components/shared/pos-layout.tsx</code>, <code>components/shared/pos-header.tsx</code>, <code>components/shared/pos-footer.tsx</code>                                             |
| Auth guard         | <code>app/(auth)/login/page.tsx</code>, <code>components/shared/protected-app-shell.tsx</code>, <code>config/auth.ts</code>                                                                                                            |
| Sales              | <code>app/(protected)/sales/page.tsx</code>, <code>app/(protected)/sales/data.ts</code>, <code>components/product-card.tsx</code>                                                                                                      |
| Order ticket       | <code>components/order-panel/order-panel.tsx</code>, <code>components/order-panel/order-items-table.tsx</code>, <code>components/order-panel/billing-summary.tsx</code>, <code>components/order-panel/payment-actions.tsx</code>       |
| Payment flows      | <code>components/order-panel/\*-payment-modal.tsx</code>, <code>components/order-panel/payment-method-drawer.tsx</code>, <code>components/order-panel/promotion-modal.tsx</code>, <code>components/order-panel/member-modal.tsx</code> |
| Orders             | <code>components/orders/orders-data-grid.tsx</code>, <code>components/orders/orders-data.ts</code>, <code>components/orders/orders-aside.tsx</code>                                                                                    |
| Tables             | <code>components/tables/table-floor.tsx</code>, <code>components/tables/table-data.ts</code>, <code>components/tables/table-filters-popover.tsx</code>, <code>components/tables/table-aside.tsx</code>                                 |
| Customers          | <code>components/customer/customer-workspace.tsx</code>, <code>components/customer/customer-data.ts</code>                                                                                                                             |
| Settings           | <code>components/settings/settings-workspace.tsx</code>                                                                                                                                                                                |
| Placeholder panels | <code>components/shared/pos-page-placeholder.tsx</code>, <code>components/shared/pos-context-panel.tsx</code>                                                                                                                          |

## Current data and integration boundaries

The current repository is a frontend POS prototype. The following boundaries
are important when extending it:

- Product, order, table, and customer data are static fixtures in local
  TypeScript files.
- Sales, order actions, table actions, customer selection, and settings edits
  use React client state.
- No API client, database model, server action, or persistence layer is wired
  to the POS modules.
- Login sets a <code>sessionStorage</code> flag; it does not validate credentials
  against an identity provider.
- Payment, receipt, kitchen, wallet, and device actions are UI flows and local
  state transitions rather than external service integrations.
- DiceBear customer avatars require a network request to the external avatar
  service when rendered.
- <code>/register</code> and <code>/forgot-password</code> are presented as login
  links, but the repository's protected POS experience is currently centered on
  the login demo.

## Recommended next modules for production readiness

The UI modules are ready to be connected to application services. The next
production layers would be:

1. Replace the session flag with server-backed authentication, staff roles, and
   permission checks.
2. Add product, modifier, price, inventory, table, customer, and order APIs.
3. Persist tickets and order status transitions with audit history.
4. Integrate cash drawer, receipt printer, kitchen printer/display, payment
   terminal, KHQR, and wallet providers.
5. Add shift opening/closing, cash reconciliation, refunds, voids, discounts,
   taxes, service charges, and receipt numbering rules.
6. Complete the Menu & Products, Inventory, Customer, Reports, and Integrations
   settings forms.
7. Expand the More drawer with operational reports and administrative utilities.
8. Add automated component, route, accessibility, and end-to-end tests.

## Deployment

The application has a Vercel production deployment:

- <https://pos-hero-ui.vercel.app>

The active POS routes are unprefixed, for example <code>/sales</code>,
<code>/orders</code>, <code>/table</code>, <code>/customer</code>, and
<code>/settings</code>.
