# Restaurant POS Database Design

**Status:** Proposed logical and physical design. This document describes a production persistence target; it does not claim that the current frontend is connected to a database.

See the domain-split [POS Database ERD](./pos-database-erd.md) for renderable Mermaid relationship diagrams.

## 1. Scope and grounding

The current app is a frontend prototype. Its sales, catalog, add-on, table, reservation, kitchen, customer, invoice, shift, and settings flows use fixtures or React client state. There is no configured API, ORM, migration, or database package. The design below maps those visible workflows to a transactional relational model and adds the operational records needed for a complete restaurant POS.

The design is grounded in `app/(protected)/sales/`, `components/orders/`, `components/product/`, `components/tables/`, `components/reservation/`, `components/kitchen/`, `components/customer/`, `components/invoices/`, `components/more/`, and `components/settings/`. Current UI data is not treated as proof that server persistence, payment capture, kitchen dispatch, or printer integrations already exist.

Canonical POS vocabulary is recorded in [CONTEXT.md](../CONTEXT.md).

## 2. Recommended architecture

Use PostgreSQL as the transactional system of record. The repository does not currently choose a database or backend framework, so PostgreSQL is a recommendation for this design, not an existing dependency.

- Organize data by merchant `organization` and physical `location`.
- Keep catalog, access, dining, sales, payment, kitchen, inventory, and reporting as clear relational areas in one database initially. They share transactions and tenant constraints; separate services can be considered after real scale or ownership needs appear.
- Store operational writes in normalized tables. Use database views or derived read models for dashboard totals and current table/order summaries.
- Use an application service/API as the only normal write boundary. Enforce authorization and tenant scoping server-side; never accept a client-supplied `organization_id` as authorization.
- Persist integration work in a transactional outbox, then deliver to payment providers, kitchen displays, printers, and delivery services asynchronously.
- Keep external identity and payment credentials outside the POS schema. Store identity-provider subject IDs and payment-provider references/tokens only; never store card PAN or CVV.

## 3. Entity map

The complete domain-split relationship diagrams are in [pos-database-erd.md](./pos-database-erd.md). They show organization/access, catalog/pricing, dining/orders/kitchen, payment/documents/shifts, and inventory/integration entities.

## 4. Table design

Business-table primary keys are UUIDs; stable reference tables may use natural keys such as an ISO currency code. Business-facing numbers such as order, reservation, invoice, and receipt numbers are separate from primary keys and are allocated per location through a locked sequence/counter.

### 4.1 Organization, staff, and devices

| Table | Important columns and relationships |
| --- | --- |
| `organizations` | `id`, `name`, `status`, `created_at` |
| `locations` | `id`, `organization_id`, `name`, `timezone`, `default_currency`, `business_day_cutoff`, `status`; unique `(organization_id, id)` |
| `users` | `id`, `identity_provider`, `identity_subject`, `display_name`, `email`, `status`; unique `(identity_provider, identity_subject)` |
| `staff_memberships` | `id`, `organization_id`, `user_id`, `staff_code`, `status`, `started_at`, `ended_at`; unique `(organization_id, user_id)` |
| `roles`, `permissions`, `role_permissions` | Named capabilities and role grants, scoped to an organization or system catalog. |
| `staff_role_assignments` | `membership_id`, `role_id`, optional `location_id`, `granted_by`, `granted_at`; supports location-specific manager/cashier roles. |
| `pos_terminals` | `id`, `organization_id`, `location_id`, `device_key_hash`, `name`, `device_type`, `last_seen_at`, `last_sync_at`, `status`; store key hashes, not raw device secrets. |
| `registers` | `id`, `organization_id`, `location_id`, `terminal_id`, `name`, `drawer_identifier`, `status` |

Keep `users` separate from staff memberships: one identity may be granted access to more than one merchant, while each membership carries business-specific employment and role data.

### 4.2 Catalog, pricing, taxes, and promotions

| Table | Important columns and relationships |
| --- | --- |
| `categories` | `id`, `organization_id`, `parent_id`, `name`, `sort_order`, `status`; supports nested categories. |
| `products` | `id`, `organization_id`, `sku`, `product_type`, `primary_category_id`, `status`, `track_inventory`, `created_at`, `archived_at` |
| `product_translations` | `product_id`, `locale`, `name`, `description`; unique `(product_id, locale)`. |
| `product_categories` | `product_id`, `category_id`, `sort_order`; use if a product can appear in multiple menu categories. |
| `product_variants` | `id`, `product_id`, `sku`, `barcode`, `status`; use for separately stocked/SKU-bearing variants. |
| `variant_attributes`, `variant_attribute_values`, `product_variant_attribute_values` | Normalized variant dimensions and values, such as size or color; each SKU variant references its selected values. |
| `modifier_groups` | `id`, `organization_id`, `name`, `min_select`, `max_select`, `selection_required`, `status` |
| `modifier_options` | `id`, `modifier_group_id`, `name`, `price_delta_minor`, `status`, `sort_order` |
| `product_modifier_groups` | `product_id`, `modifier_group_id`, optional product-level `min_select`/`max_select`, `sort_order`; unique pair. |
| `price_lists`, `product_prices` | Effective-dated product/variant price by organization default or location and currency. Require exactly one product or variant target per price. Keep the active display price separate from historical order prices. |
| `tax_categories`, `tax_rates`, `product_tax_assignments` | Jurisdiction/location-specific effective tax rules, rate basis points, inclusive/exclusive behavior, and product assignment. |
| `promotions`, `promotion_redemptions` | Rule/status/date/usage constraints and one redemption record per applied promotion. Store the actual discount allocation on the order as a snapshot. |
| `currencies` | ISO currency code and minor-unit exponent used for amount validation and display. Treat definitions as immutable; issued records also snapshot the exponent they used. |

Treat choices such as size, ice, sweetness, and paid add-ons as modifier options when they are guest selections. Use a product variant when a choice represents a distinct sellable SKU or stock balance. This avoids turning every UI selection into a duplicated product.

### 4.3 Dining, tables, and reservations

| Table | Important columns and relationships |
| --- | --- |
| `dining_areas` | `id`, `organization_id`, `location_id`, `name`, `sort_order`, `status` |
| `dining_tables` | `id`, `organization_id`, `location_id`, `area_id`, `table_code`, `capacity`, `sort_order`, `cleaning_state`, optional map coordinates; unique `(location_id, table_code)`. |
| `reservations` | `id`, `organization_id`, `location_id`, `reservation_number`, optional `customer_id`, guest name/phone snapshot, `party_size`, `starts_at`, `ends_at`, `status`, `source`, `notes`, `created_by`, `seated_at`, `cancelled_at` |
| `reservation_table_assignments` | `reservation_id`, `dining_table_id`, copied `reserved_period`, `blocks_availability`; allows combined tables and unassigned bookings, and gives each assigned table a direct time range for conflict constraints. |
| `dining_sessions` | `id`, `organization_id`, `location_id`, optional `reservation_id`, `party_size`, `started_at`, `ended_at`, `status`, `opened_by` |
| `dining_session_tables` | `dining_session_id`, `dining_table_id`, `assigned_at`, `released_at`; supports table joins and moves. |
| `order_table_assignments` | `order_id`, `dining_table_id`, `assigned_at`, `released_at`; orders can be associated with one or more tables. |

Do not treat `available`, `reserved`, and `in progress` as independent durable truths on a table row. Derive availability from reservation assignments and active dining sessions; keep clean/dirty state as its own operational field. Prevent overlapping confirmed reservations for the same table in a transaction. For a native PostgreSQL guard, copy the assigned reservation's time range and blocking state onto `reservation_table_assignments`, maintain them with the reservation write, and add a GiST exclusion constraint over table ID and the half-open range for blocking rows. Otherwise serialize the reservation check by locking affected table rows.

### 4.4 Orders, items, discounts, and taxes

| Table | Important columns and relationships |
| --- | --- |
| `orders` | `id`, `organization_id`, `location_id`, `business_date`, `order_number`, `order_type`, `channel`, `status`, optional `customer_id`, `dining_session_id`, `shift_id`, `created_by`, `opened_at`, `submitted_at`, `closed_at`, `currency_code`, `currency_exponent_snapshot`, `subtotal_minor`, `discount_minor`, `tax_minor`, `charges_minor`, `total_minor`, `version` |
| `order_items` | `id`, `order_id`, optional `product_id`/`variant_id`, `product_name_snapshot`, `sku_snapshot`, `quantity`, `unit_price_minor`, line subtotal/discount/tax/total minor amounts, `status`, `course`, `created_at` |
| `order_item_modifiers` | `id`, `order_item_id`, optional `modifier_option_id`, `group_name_snapshot`, `option_name_snapshot`, `quantity`, `price_delta_minor` |
| `order_discounts` | `id`, `order_id`, optional `order_item_id` and `promotion_id`, discount type/value, applied amount, reason, `authorized_by`; enforce that a discount targets the order or a line, not both. |
| `order_charges`, `order_charge_tax_lines` | Order-level service, delivery, or other configured charges and their tax snapshots. Keep gratuities attached to `payment_tips`, not product prices. |
| `order_item_tax_lines` | `order_item_id`, tax name/code/rate snapshot, taxable base, tax amount, inclusive flag; unique tax snapshot per order item. |
| `order_events`, `order_item_events` | Append-only state/quantity/void history with actor, reason, timestamp, and optional approval reference. |
| `order_relations`, `order_item_transfers` | Split/merge/transfer provenance between orders and items, including transferred quantity, actor, and timestamp. Apply before financial documents or captured payments exist; otherwise use explicit refunds/credit documents and create a new check. |

Use a separate `orders.status` for service workflow. Derive the amount settled on an order from captured payments less gratuities and successful sale refunds; tip refunds do not change the order balance. A kitchen status, delivery status, and payment status must not be collapsed into one order status. Keep a `version` for optimistic concurrency when more than one terminal can edit an open order.

At submit/settlement time, preserve product name, SKU, modifier name, quantity, price, discount, tax, and currency snapshots. Historical documents must not change if a product is renamed, repriced, or archived later.

### 4.5 Payments, invoices, refunds, and receipts

| Table | Important columns and relationships |
| --- | --- |
| `payment_attempts` | `id`, `organization_id`, `location_id`, `order_id` or `invoice_id`, optional captured `payment_id`, `provider`, `method`, `amount_minor`, `currency_code`, `status`, `provider_reference`, `idempotency_key`, `started_at`, `completed_at`, sanitized failure code; unique provider/idempotency key and unique non-null `payment_id`. Use for electronic provider flows; cash can be recorded directly. |
| `payments` | `id`, `organization_id`, `location_id`, `order_id` or `invoice_id`, `shift_id`, `method`, captured `amount_minor`, `currency_code`, `currency_exponent_snapshot`, `captured_at`, `recorded_by`, `provider_reference`, and FX snapshot when needed. One row represents one captured tender; an order may have several for split tender. |
| `cash_payment_details` | `payment_id`, `tendered_minor`, `change_minor`; the payment amount is the cash retained after change. |
| `payment_tips` | `id`, `payment_id`, optional recipient staff membership, tip amount/currency, distribution status; gratuity is part of the captured amount but excluded from the amount applied to an order/invoice. |
| `refunds` | `id`, `payment_id`, `refund_type` (`sale`/`tip`), optional `payment_tip_id`, refund method, amount/currency/exponent, reason, status, provider reference, authorizer, timestamps; require `payment_tip_id` for a tip refund and forbid it for a sale refund. Successful refunds cannot exceed the matching captured amount. |
| `invoices` | `id`, `organization_id`, `location_id`, `order_id`, `invoice_number`, document state (`draft`, `issued`, `void`), customer name/address/tax-ID snapshot, currency/exponent and totals snapshot, `issued_at`, `voided_at`; unique `(location_id, invoice_number)`. Outstanding balance is derived from the invoice total less captured payments net of sale refunds and credit notes, excluding tips. |
| `invoice_lines`, `invoice_tax_summaries` | Immutable line, modifier, discount, tax, and quantity snapshots copied when the invoice is issued. |
| `credit_notes`, `credit_note_lines` | Separately numbered correction documents linked to an issued invoice, with reason, authorized actor, line/tax amount snapshots, and issued/void timestamps. A credit note changes the amount owed; a refund records returned money. |
| `receipts` | `id`, `organization_id`, `location_id`, `order_id`, optional `payment_id`/`refund_id`, `receipt_number`, `document_type`, `content_snapshot`, `issued_at`; preserve the exact reprintable content. |
| `receipt_print_jobs` | `id`, `receipt_id`, terminal/printer reference, status, attempt count, `requested_at`, `completed_at`; printing is an integration result, not proof of payment. |

Require exactly one of `order_id` or `invoice_id` on a payment and payment attempt. Store provider attempts separately from successful captured tenders. A declined card attempt is not a payment; a refund is a new record referencing the original captured tender and must identify whether it reverses sale value or a tip. Total successful sale and tip refunds cannot exceed their respective captured amounts. A credit note changes an invoice balance without changing payment history. Never persist card PAN/CVV. For cross-currency tender, record both amounts, currency codes, exponents, and the accepted exchange-rate snapshot.

### 4.6 Kitchen, customers, and loyalty

| Table | Important columns and relationships |
| --- | --- |
| `kitchen_stations` | `id`, `organization_id`, `location_id`, `name`, `status` |
| `station_routes` | Product/category to station routing and priority/course defaults. |
| `kitchen_tickets` | `id`, `organization_id`, `location_id`, `order_id`, `station_id`, `ticket_number`, `priority`, `status`, `sent_at`, `started_at`, `ready_at`, `completed_at` |
| `kitchen_ticket_items` | `id`, `ticket_id`, `order_item_id`, `quantity`, item/modifier/note snapshot, `status`, lifecycle timestamps. |
| `kitchen_ticket_item_events` | Append-only pending/preparing/completed/cancelled transitions, actor/device, and event time. |
| `customers`, `customer_contacts`, `customer_addresses` | Optional profile, verified contact points, and address records scoped to an organization. Keep reservation guest snapshots even when linked to a profile. |
| `customer_tags`, `customer_tag_assignments` | Merchant-defined customer labels such as VIP or preferred contact. |
| `loyalty_accounts`, `loyalty_entries` | Customer balance/tier summary plus append-only earned, redeemed, adjusted, or expired points entries linked to the originating order. Derive balance from the ledger or maintain it transactionally as a cache. |
| `customer_credit_accounts`, `customer_credit_entries` | Optional pay-later limit and immutable charge/payment/adjustment ledger. Do not store a mutable “amount owed” without the corresponding ledger. |

Create kitchen tickets only for submitted order items. Send ticket creation and an outbox event in the same database transaction so an order cannot be committed as sent while silently losing its kitchen work. Track ticket line status and events rather than treating a copied kitchen fixture as a separate sale.

### 4.7 Register, shifts, and cash

| Table | Important columns and relationships |
| --- | --- |
| `shifts` | `id`, `organization_id`, `location_id`, `register_id`, `opened_by`, `opened_at`, opening cash amount, `closed_by`, `closed_at`, counted cash amount, expected cash amount, variance, `status` |
| `shift_cash_counts` | `shift_id`, count type (`opening`/`closing`), denomination, quantity, currency; preserves opening and closing denomination counts. |
| `cash_movements` | `id`, `shift_id`, movement type (`paid_in`, `payout`, `drop`), positive amount/currency, reason, actor, approver, timestamp. |
| `cash_reconciliations` | `id`, `shift_id`, expected and counted totals, variance, closing notes, finalizer, finalized timestamp. |

Expected drawer cash is derived from opening cash plus cash captures and paid-ins, less cash refunds, payouts, and drops. Record a cash refund in `refunds` with cash as its method; do not create a second cash movement for that refund. Cash movement rows are only for non-sale paid-ins, payouts, and drops. Close a shift by locking it, computing its ledger, recording the actual count and variance, and then marking it closed; never rewrite past tenders to force a match.

### 4.8 Inventory and purchasing

These tables complete the restaurant stock flow; the current screens do not yet establish supplier or purchasing behavior.

| Table | Important columns and relationships |
| --- | --- |
| `inventory_items` | `id`, `organization_id`, `name`, `stock_unit`, `status`, reorder threshold. |
| `product_recipes`, `recipe_components` | Product/variant recipe and quantity of each inventory item consumed per sold unit. |
| `inventory_movements` | Append-only quantity delta, unit cost snapshot, location, reason/source reference, actor, timestamp. Sources include sale consumption, receiving, count adjustment, waste, and transfer. |
| `inventory_balances` | Optional current-balance projection by location/item; rebuildable from `inventory_movements`. |
| `suppliers`, `purchase_orders`, `purchase_order_lines` | Vendor and ordered stock quantities/costs/status. |
| `goods_receipts`, `goods_receipt_lines` | Received quantity and unit cost; receipt posting creates inventory movements transactionally. |
| `stock_counts`, `stock_count_lines` | Count session, expected/counted quantities, variance, approver; posting creates adjustment movements rather than overwriting a balance. |

### 4.9 Configuration and platform reliability

| Table | Purpose |
| --- | --- |
| `location_settings` | Typed per-location currency, timezone, locale, business-day cutoff, service fee and operational settings. |
| `user_preferences` | Per-user display preferences; do not mix these with restaurant configuration. |
| `integration_connections` | Provider, location scope, connection state, external account ID, and secret-vault reference; never store the provider secret itself. |
| `printers` | Location, terminal/station assignment, printer protocol/address reference, receipt/kitchen role, and health state. |
| `delivery_jobs`, `delivery_events` | Order, provider, external order ID, delivery lifecycle/timestamps, and append-only provider status callbacks. |
| `delivery_settlements`, `delivery_settlement_lines` | Optional marketplace payout, fees, adjustments, and order-level reconciliation when aggregators settle net amounts. |
| `audit_events` | Actor, tenant/location, action, entity reference, timestamp, request/device ID, and a filtered before/after snapshot for sensitive business changes. |
| `idempotency_records` | Unique `(organization_id, terminal_id, command_id)`, request hash, response reference, result status; prevents duplicated orders/payments after retries or offline sync. |
| `outbox_events` | `organization_id`, event type, aggregate ID/version, payload, created/delivered timestamps, retry count; inserted in the same transaction as the business write. |
| `device_sync_cursors` | Device, last acknowledged server cursor, last upload/download times, sync status. |
| `document_sequences` | `organization_id`, `location_id`, sequence type, optional business date/prefix, next value; locked and incremented in the transaction that issues a human-readable number. |

PINs and approval secrets must be salted/hashed with a suitable password hashing function, or delegated to an identity provider. The current invoice UI's `supervisorPin` concept must become an authenticated `authorized_by` user reference plus an audit event; never store or log a raw PIN.

### Offline command queue

If offline sales are required, store an encrypted local command queue on each terminal and replay commands with stable device and command IDs. `idempotency_records` deduplicates replay on the server; `outbox_events` is a separate server-side queue for integrations. Use provisional local order references until the server assigns official document numbers. Define which operations are allowed offline—especially card capture, invoice issuance, reservation edits, and shared-table changes—and how concurrent edits are reconciled before enabling multi-terminal offline work.

## 5. Data rules and constraints

### Status ownership

- `reservations.status`: `tentative`, `confirmed`, `seated`, `completed`, `cancelled`, or `no_show`; table assignment and seating are separate from booking status.
- `orders.status`: `open`, `submitted`, `closed`, or `cancelled`; keep service lifecycle separate from payment and fulfillment.
- `payment_attempts.status`: `pending`, `authorized`, `captured`, `failed`, or `expired`. A row in `payments` represents only a successful captured tender.
- `refunds.status`: `pending`, `succeeded`, or `failed`; only successful refunds reduce the captured balance.
- `kitchen_ticket_items.status`: `pending`, `in_progress`, `completed`, or `cancelled`; the ticket has its own aggregate status.
- `shifts.status`: `open` or `closed`; closing is final and records the actual cash count and variance.

These are proposed persistence vocabularies. The client can continue to use display labels, but API adapters should map them to these canonical states.

1. **Tenant and location integrity:** Tenant-owned tables carry `organization_id`; location-owned records also carry `location_id`. Add composite foreign keys such as `(organization_id, location_id)` to prevent cross-tenant links, and apply PostgreSQL row-level security as defense in depth.
2. **Money:** Store amounts as signed `BIGINT` minor units plus ISO currency code and snapshot the exponent on issued records. Never use floating point for money. Store percentage/rate inputs as integer basis points or explicit high-precision decimals.
3. **Quantity:** Use `NUMERIC(12, 3)` or a tighter domain type for sellable quantities and stock movement quantities; round final line/tax amounts under an explicit location tax policy.
4. **Time:** Store timestamps as `TIMESTAMPTZ` in UTC. Store `business_date` separately using the location timezone and configured day cutoff.
5. **Financial immutability:** Once submitted/captured/issued, do not rewrite item price, tax, invoice, payment, or refund history. Correct with voids, refunds, credit documents, or append-only adjustments.
6. **Deletion:** Archive catalog and staff records. Use `RESTRICT` for financial/history foreign keys; do not cascade-delete orders, payments, invoices, receipts, or ledger entries.
7. **Numbers:** Allocate human-readable numbers from a location-scoped sequence inside the write transaction; do not use `MAX(number) + 1`.
8. **Concurrency:** Add `version` to mutable orders, reserve tables under row locks or a time-range exclusion constraint, and use idempotency keys for terminal retries.
9. **Sensitive data:** No card PAN/CVV, plaintext staff PIN, or raw provider secret. Keep provider tokens in a provider vault and store only opaque references.
10. **JSON:** Use `JSONB` only for provider-specific sanitized payloads, document snapshots, and outbox payloads. Keep fields used for constraints, joins, permissions, and reports relational.
11. **Settlement:** Payment rows have one order or invoice target. Gratuity is part of captured tender but not order/invoice value; for cash, `tendered_minor - change_minor = payments.amount_minor`. Refund sale and tip amounts against their own captured balances.

## 6. Transaction boundaries

- **Open/edit order:** Create or update the order, line snapshots, modifiers, discounts/charges, and event records in one transaction. Apply optimistic version checking on edits from more than one terminal.
- **Split/merge check:** Before payment or invoice issuance, create relation records and target item snapshots/transfer quantities in one transaction; lock all affected orders and validate transferred quantities. Preserve the source/target relationship for audit.
- **Submit to kitchen:** Lock the order version; freeze the sent line snapshot; create station tickets and ticket items; append order events and outbox messages; commit atomically.
- **Seat a reservation:** Lock affected table rows; validate reservation conflicts; update reservation state; create the dining session and table assignments; commit together.
- **Capture payment:** Create an idempotent payment attempt before calling an external provider. On confirmed capture, record the captured payment, its order/invoice target, any tip and cash-change details, update payment summaries, issue invoice/receipt snapshots as required, and append outbox/audit records. Provider calls are not part of a database transaction; retry safely by provider idempotency reference.
- **Refund:** Lock the captured payment; ensure successful refunds do not exceed the capture; record the provider refund and audit/approval reference. A cash refund itself reduces expected drawer cash, so do not also create a non-sale cash movement for it.
- **Close shift:** Lock the shift; calculate expected tender totals; save denomination counts, actual totals, variance, and closer; transition once to closed.
- **Receive inventory:** Post receipt lines and matching stock movements atomically. A failed receipt cannot partially increase stock.

## 7. Indexes and reporting

Create indexes around actual workstation queries:

- Unique `(location_id, business_date, order_number)` and `(location_id, reservation_number)`.
- Orders `(organization_id, location_id, business_date, status, opened_at DESC)` and `(customer_id, opened_at DESC)`.
- Order lines `(order_id, status)`; kitchen tickets `(location_id, status, sent_at)` and lines `(ticket_id, status)`.
- Reservations `(location_id, starts_at, status)` and assignments `(dining_table_id, reservation_id)`.
- Payments `(order_id, captured_at)` and `(invoice_id, captured_at)`; refunds `(payment_id, created_at)`.
- Inventory movements `(location_id, inventory_item_id, occurred_at)` and receipts `(location_id, issued_at)`.

Build dashboard cards, daily revenue, top products, cash summaries, and customer visit metrics from captured business records. Use materialized views or maintained read models only when query volume warrants them; each must be rebuildable from the underlying order, payment, refund, and inventory ledgers.

## 8. UI-to-model mapping and gaps

| UI area | Persistent model |
| --- | --- |
| Sales ticket/order panel | `orders`, `order_items`, `order_item_modifiers`, `order_discounts`, `order_item_tax_lines` |
| Products, categories, add-ons | `products`, translations, categories, variants, modifier groups/options, price and tax assignment tables |
| Tables and reservation timeline | `dining_areas`, `dining_tables`, `reservations`, table assignments, dining sessions |
| Kitchen board | `kitchen_tickets`, ticket items, station routing, append-only item lifecycle events |
| Customers and loyalty | `customers`, contact/tag tables, loyalty and credit ledgers |
| Orders, payments, refunds | order state/events, payment attempts, captured payments, refunds |
| Invoicing and receipts | immutable invoices/lines, receipts/document snapshots, print-job history |
| Cash drawer and shift | registers, shifts, cash counts, cash movements, reconciliations |
| Dashboard | queries/read models over orders, captured payments/refunds, shifts, and inventory |
| Settings | organization/location configuration and individual user preferences |

The UI currently does not define durable supplier/purchase workflows, authoritative tax/fiscal rules, delivery-provider settlement, split/merged check policy, or offline conflict resolution. The schema includes delivery and split/merge extension tables, but allowed transitions still need business confirmation. Do not overload `orders.status` with courier state. Before production, confirm jurisdiction-specific invoice/tax requirements, stock costing/depletion rules, whether one captured tender can pay multiple checks, the offline policy, and whether a table session can have several simultaneous checks.

## 9. Suggested delivery sequence

1. Establish PostgreSQL, migrations, server-side tenant authentication, organizations/locations, staff roles, terminals/registers, and audit/idempotency/outbox foundations.
2. Persist catalog, pricing, modifier groups/options, taxes, tables, reservations, dining sessions, orders, and order-item snapshots.
3. Add payment attempts, captured payments, refunds, shifts/cash ledgers, invoices, receipts, and printer/payment integrations.
4. Connect kitchen routing and lifecycle events; add customer profiles and loyalty/credit ledgers.
5. Add inventory recipes/movements, purchasing/receiving/counts, delivery integration, and optimized reporting projections.

The model should be implemented as migrations only after the business rules for taxes, payment allocation, order splitting, reservation overlap policy, and offline operation are confirmed.
