# RakPOS Domain Context

RakPOS is a restaurant point-of-sale system for recording guest orders, coordinating table and kitchen service, and reconciling payments across one or more restaurant locations.

## People and locations

**Organization**:
A merchant account that owns one or more restaurant locations.

**Location**:
A physical restaurant branch with its own timezone, business day, floor plan, registers, and operating settings. _Avoid_: store, when referring to a product storage location.

**Customer**:
A known guest profile used for order history, contact details, credit, or loyalty. An order or reservation may exist without a customer profile.

**Guest**:
A person dining or named on a reservation; a guest may be linked to a customer profile but does not have to be.

## Service

**Order**:
A commercial check for one service interaction. It owns the ordered items and is distinct from its payment, invoice, kitchen tickets, and table assignment. _Avoid_: transaction, sale, when referring to the check itself.

**Order item**:
A product and quantity requested on an order, including the selected modifiers and the price and tax snapshots used for that sale.

**Modifier group**:
A named set of selectable choices on a product, such as size, sweetness, or add-ons, with rules about how many choices are allowed. _Avoid_: add-on, for the group itself.

**Modifier option**:
A selectable value within a modifier group, such as oat milk or extra cheese.

**Reservation**:
A planned seating booking for a guest, party size, and time range. It may be assigned one or more dining tables and can later be linked to a dining session.

**Dining table**:
A physical seating resource on a location's floor plan. Table availability is determined from assignments and active service, not from the label alone.

**Dining session**:
The period during which a party occupies one or more dining tables. It may be linked to a reservation and to one or more orders.

**Kitchen ticket**:
A preparation instruction generated from submitted order items and routed to kitchen stations. It is not a second order.

## Money and operations

**Payment**:
A captured tender linked to an order or invoice; any gratuity is recorded separately from the amount settling the bill. An order can have multiple payments for split or partial tender.

**Refund**:
A reversal of some or all of a captured payment. It preserves the original payment record.

**Invoice**:
An issued, itemized financial document for an order. Its contents are a historical snapshot; corrections are recorded as voids or credit documents.

**Credit note**:
An issued document that reduces or corrects an invoice balance while preserving the original invoice. It is distinct from a refund, which returns captured money.

**Receipt**:
A record of a captured payment or refund presented to the guest. It is distinct from an editable order and from an invoice.

**Register**:
A checkout station and its associated cash drawer or tender context. _Avoid_: terminal, when referring to the software device.

**Terminal**:
A physical POS device that submits commands to the system and may sync after offline operation.

**Shift**:
A cashier's operating session on a register, from opening cash count through close and reconciliation. It is independent of the user's login session.

**Cash movement**:
A non-sale change to drawer cash, such as a paid-in, payout, or cash drop. Cash sales and refunds remain in their respective payment and refund ledgers.
