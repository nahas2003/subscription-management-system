# Odoo x Make-A-Ton 9.0 — Database & API Contract

**Project:** BrightLoop Subscription Management System  
**Document:** 04 — Database & API Contract  
**Version:** 1.0 — Proposed contract baseline  
**Depends on:** `01_Master_Project_Brief.md`, `02_Technical_Architecture.md`, `03_UI_UX_Design_Specification.md`  
**Status:** Proposed. Final schema and implementation must be adapted to the platform approved by the hackathon organizers.

---

## 1. Purpose and contract rules

This document defines the shared data model and the interfaces between the team's modules. It is the contract that Members 1–4 must use when implementing features in parallel.

It defines:
- Core entities and relationships.
- Suggested tables, columns and data types.
- Primary keys, foreign keys and uniqueness constraints.
- Role and ownership expectations.
- Subscription and invoice status values.
- Financial calculation conventions.
- API operation contracts and validation expectations.
- Billing idempotency requirements.
- Error response conventions.
- Migration and change-control rules.

**Important:** The challenge defines business requirements, not a complete database schema or exact API. The schema and operations below are the team's proposed implementation contract. Where a business rule is not specified by the challenge, it is explicitly marked as a decision to confirm rather than treated as a source requirement.

## 2. Architecture and modelling assumptions

The proposed implementation assumes PostgreSQL (through Supabase if approved). If the organizers require Odoo-native implementation, translate these entities and operations into the approved Odoo models, relations, access controls and methods. Do not build a separate database merely because this document uses relational terminology.

### 2.1 Company model

- There is one company: BrightLoop.
- Customers are BrightLoop customers.
- Customers do not own or administer separate companies in this system.
- No `tenant_id` or multi-tenant isolation model is required for the selected single-company scope.
- Customer record isolation is still mandatory: each customer can access only their own permitted records.

### 2.2 General conventions

| Topic | Convention |
|---|---|
| Primary keys | UUID, unless the approved platform uses its own native identifiers. |
| Timestamps | `timestamptz` in UTC for stored instants. |
| Business dates | `date` where a calendar date is intended, such as invoice due date. |
| Money | `numeric(14,2)` as a proposed precision; confirm currency/rounding rules. |
| Quantities | `numeric(12,3)` where fractional quantities are allowed; otherwise integer. |
| Status | Controlled values, preferably database enums or checked text values. |
| Soft deletion | Prefer `is_active` or explicit lifecycle states for catalogue/user records; do not hard-delete financial history. |
| Audit timestamps | `created_at`, `updated_at` where appropriate. |
| Naming | `snake_case` for database tables and columns. |

Do not use floating-point types for monetary values. The final currency, precision and rounding rules must be agreed before financial implementation.

## 3. Entity relationship overview

```text
auth.users
    |
    | 1:1
    v
profiles -------------------- customers
    |                             |
    |                             | 1:N
    |                             +---------------- quotations
    |                             |                    |
    |                             |                    | 1:N
    |                             |                    v
    |                             |               quotation_lines
    |                             |
    |                             +---------------- subscriptions
    |                                                  |
    |                                                  | 1:N
    |                                                  +---- subscription_lines
    |                                                  |
    |                                                  | 1:N
    |                                                  v
    |                                                invoices
    |                                                  |
    |                                                  | 1:N
    |                                                  +---- invoice_lines
    |                                                  |
    |                                                  | 1:N
    |                                                  v
    |                                             payment_allocations
    |                                                  ^
    |                                                  |
    |                                               payments
    |
    +-- role: admin / staff / customer

products ---- product_variants
    |
    +---- subscription_lines / quotation_lines / invoice_lines

plans ---- subscriptions

taxes ---- quotation_lines / subscription_lines / invoice_lines

discounts ---- applied_discounts (or invoice discount snapshot)
```

This is a conceptual relationship diagram. The exact schema below is authoritative for the proposed database design.

## 4. Core tables

The following definitions are proposed. They are not a claim that these exact tables already exist in BrightLoop's systems.

### 4.1 `profiles`

Application profile linked to the authentication provider's user identity.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key; same value as auth user ID. |
| `full_name` | text | Required. |
| `email` | text | Required; unique if stored here. Keep consistent with auth identity. |
| `role` | text/enum | `admin`, `staff`, `customer`. |
| `customer_id` | uuid, nullable | Required for customer role; references `customers.id`. Null for internal users. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

Rules:
- Do not accept role assignments directly from customer registration input.
- Only an authorized Admin operation may create staff profiles or assign the staff role.
- Exactly one initial Admin must be provisioned securely by the project setup process; do not allow public registration to create Admin accounts.
- Confirm whether the profile email is duplicated or read from the auth provider; avoid conflicting sources of truth.

### 4.2 `customers`

Business customer record managed by BrightLoop.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `customer_code` | text | Unique business identifier. |
| `name` | text | Required. |
| `email` | text | Required; validate format. |
| `phone` | text, nullable | Optional unless required by the final form. |
| `address` | text, nullable | Optional. |
| `notes` | text, nullable | Internal notes; not visible to customers. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

Rules:
- A customer login profile links to one customer record through `profiles.customer_id`.
- Email uniqueness for customer business records must be decided: if one email must identify one customer, enforce a unique normalized email. If multiple contacts per customer are later supported, revise the model explicitly.
- Do not expose internal notes through customer-facing queries.

### 4.3 `products`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | text | Required. |
| `product_type` | text | Required; controlled values or catalogue category. |
| `description` | text, nullable | Product details. |
| `sales_price` | numeric(14,2) | Required; non-negative. |
| `cost_price` | numeric(14,2), nullable | Restricted to authorized internal roles. |
| `notes` | text, nullable | Internal or descriptive notes according to UI permissions. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

### 4.4 `product_variants`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `product_id` | uuid | FK to `products.id`. |
| `name` | text | Required, e.g. variant label. |
| `price_adjustment` | numeric(14,2) | May be positive or negative only if the business rule permits. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |

Suggested price calculation:

`variant unit price = product sales price + selected variant price adjustment`

The challenge gives an example of a selected variant adding 560 to the price. It does not establish a currency or a real BrightLoop price. Treat this only as a calculation example.

### 4.5 `plans`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | text | Required. |
| `description` | text, nullable | Optional. |
| `price` | numeric(14,2) | Required; non-negative. |
| `frequency` | text/enum | `daily`, `weekly`, `monthly`, `yearly`. |
| `minimum_quantity` | numeric(12,3) | Required; positive. |
| `available_from` | date, nullable | Optional availability start. |
| `available_until` | date, nullable | Optional availability end. |
| `auto_close` | boolean | Defaults false; exact behaviour must be defined. |
| `allow_early_close` | boolean | Defaults false. |
| `allow_pause` | boolean | Defaults false. |
| `renewal_rule` | jsonb/text | Structured rule; exact options must be agreed. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

Do not implement arbitrary JSON rules without validation. Document the allowed renewal-rule values and validation in code.

### 4.6 `taxes`

Proposed tax configuration.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | text | Required. |
| `rate` | numeric(7,4) | Percentage rate; non-negative. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |

The challenge requires tax handling but does not specify a jurisdiction, rate or tax-inclusive/exclusive pricing model. Use fictional demo configuration only after the team agrees. Do not claim a sample tax rate is BrightLoop's actual tax setup.

## 5. Quotations

### 5.1 `quotation_templates`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | text | Required. |
| `description` | text, nullable | Optional. |
| `template_content` | jsonb/text | Approved template structure. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |

### 5.2 `quotations`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `quotation_number` | text | Unique, generated by trusted backend logic. |
| `customer_id` | uuid | FK to `customers.id`. |
| `template_id` | uuid, nullable | FK to `quotation_templates.id`. |
| `created_by` | uuid | FK to `profiles.id`. |
| `quotation_date` | date | Required. |
| `valid_until` | date | Required; must not precede quotation date. |
| `status` | text/enum | Proposed: `draft`, `sent`, `accepted`, `rejected`, `expired`, `converted`. Confirm exact challenge mapping and workflow. |
| `subtotal` | numeric(14,2) | Calculated by trusted logic. |
| `discount_total` | numeric(14,2) | Calculated. |
| `tax_total` | numeric(14,2) | Calculated. |
| `total` | numeric(14,2) | Calculated. |
| `notes` | text, nullable | Optional. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

The challenge refers to quotation templates and validity periods, but does not specify the full quotation status vocabulary. The values above are proposed and must be confirmed by the team.

### 5.3 `quotation_lines`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `quotation_id` | uuid | FK to `quotations.id`. |
| `product_id` | uuid, nullable | FK to `products.id`, if product-based line. |
| `variant_id` | uuid, nullable | FK to `product_variants.id`, if selected. |
| `plan_id` | uuid, nullable | FK to `plans.id`, if plan-based line. |
| `description_snapshot` | text | Description at quotation time. |
| `quantity` | numeric(12,3) | Positive. |
| `unit_price` | numeric(14,2) | Price snapshot. |
| `tax_rate_snapshot` | numeric(7,4) | Tax rate applied. |
| `line_subtotal` | numeric(14,2) | Calculated. |
| `line_tax` | numeric(14,2) | Calculated. |
| `line_total` | numeric(14,2) | Calculated. |

A quotation line must reference the relevant catalogue item or plan and preserve the displayed description and price at the time it was quoted.

## 6. Subscriptions

### 6.1 `subscriptions`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `subscription_number` | text | Unique; generated by trusted backend logic. |
| `customer_id` | uuid | FK to `customers.id`. |
| `plan_id` | uuid, nullable | FK to `plans.id`, if subscription is plan-based. |
| `quotation_id` | uuid, nullable | FK to `quotations.id`, if converted from quotation. |
| `start_date` | date | Required. |
| `expiry_date` | date, nullable | Required where plan/contract has an end date. |
| `next_billing_date` | date, nullable | Used for recurring billing. |
| `payment_terms` | text, nullable | Agreed payment terms. |
| `status` | text/enum | `draft`, `quotation`, `confirmed`, `active`, `closed`. |
| `created_by` | uuid | FK to `profiles.id`. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

The five statuses above are taken from the challenge's stated subscription sequence. Do not add `paused`, `cancelled` or other subscription statuses without a documented team decision. Pause may be represented through a separate pause record/flag if required, while preserving the official status vocabulary.

### 6.2 `subscription_lines`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `subscription_id` | uuid | FK to `subscriptions.id`. |
| `product_id` | uuid, nullable | FK to `products.id`. |
| `variant_id` | uuid, nullable | FK to `product_variants.id`. |
| `plan_id` | uuid, nullable | FK to `plans.id`. |
| `description_snapshot` | text | Description at subscription creation. |
| `quantity` | numeric(12,3) | Positive and satisfies plan minimum. |
| `unit_price` | numeric(14,2) | Agreed unit price snapshot. |
| `tax_rate_snapshot` | numeric(7,4) | Applied tax snapshot. |
| `line_total` | numeric(14,2) | Calculated. |

### 6.3 `subscription_events` (recommended)

A history table for important subscription actions.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `subscription_id` | uuid | FK to `subscriptions.id`. |
| `actor_profile_id` | uuid, nullable | FK to `profiles.id`; null for system action. |
| `event_type` | text | e.g. created, confirmed, activated, paused, resumed, renewed, closed. |
| `from_status` | text, nullable | Previous status. |
| `to_status` | text, nullable | New status. |
| `notes` | text, nullable | Reason/context. |
| `created_at` | timestamptz | Event timestamp. |

This is recommended for traceability. It is not explicitly required as a separate table by the challenge.

### 6.4 Subscription transition contract

The challenge provides the status sequence but does not define every trigger. Proposed transition constraints:

| Current status | Action | Next status | Notes |
|---|---|---|---|
| Draft | Send as quotation | Quotation | Requires valid customer and lines. |
| Quotation | Confirm accepted quotation | Confirmed | Requires valid quotation acceptance. |
| Confirmed | Activate | Active | Requires valid start/activation conditions. |
| Active | Close | Closed | Requires authorized action and reason where applicable. |

Rules:
- Reject invalid transitions.
- Do not let the frontend set a status field directly.
- Use a dedicated server-side operation for each transition.
- Record actor and timestamp.
- Do not activate a subscription with invalid lines or missing required dates.
- Pause, resume and renewal behaviour must be specified separately before implementation.
- Whether a quotation can be converted directly to Confirmed or must pass through another step is an open workflow decision.

## 7. Invoices and billing

### 7.1 `invoices`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `invoice_number` | text | Unique; generated by trusted backend logic. |
| `customer_id` | uuid | FK to `customers.id`. |
| `subscription_id` | uuid, nullable | FK to `subscriptions.id`. |
| `invoice_date` | date | Required. |
| `due_date` | date | Required. |
| `billing_period_start` | date, nullable | Period covered by recurring invoice. |
| `billing_period_end` | date, nullable | Period covered by recurring invoice. |
| `status` | text/enum | `draft`, `confirmed`, `paid`, `cancelled` (cancelled is proposed; confirm). |
| `subtotal` | numeric(14,2) | Calculated. |
| `discount_total` | numeric(14,2) | Calculated. |
| `tax_total` | numeric(14,2) | Calculated. |
| `total` | numeric(14,2) | Calculated. |
| `amount_paid` | numeric(14,2) | Derived or maintained transactionally. |
| `balance_due` | numeric(14,2) | Derived or maintained transactionally. |
| `notes` | text, nullable | Optional. |
| `created_at` | timestamptz | Creation timestamp. |
| `updated_at` | timestamptz | Last update timestamp. |

The challenge specifies invoice statuses Draft → Confirmed → Paid. It also refers to cancellation. If cancellation is implemented, document it as an explicit allowed transition. Do not mark an invoice Paid until the full balance is paid under the agreed rounding rule.

### 7.2 `invoice_lines`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `invoice_id` | uuid | FK to `invoices.id`. |
| `product_id` | uuid, nullable | Optional catalogue reference. |
| `description_snapshot` | text | Required historical description. |
| `quantity` | numeric(12,3) | Positive. |
| `unit_price` | numeric(14,2) | Historical price snapshot. |
| `discount_amount` | numeric(14,2) | Applied line discount. |
| `tax_rate_snapshot` | numeric(7,4) | Historical tax rate. |
| `tax_amount` | numeric(14,2) | Calculated tax amount. |
| `line_total` | numeric(14,2) | Final line total. |

Historical invoice lines must not change when a product, plan, tax rate or discount rule is edited later.

### 7.3 Billing idempotency

Duplicate billing prevention is a core requirement.

For recurring invoices, create a stable billing-period identity, for example:
- `subscription_id`
- `billing_period_start`
- `billing_period_end`

Add a unique constraint for the applicable recurring invoice identity. If a subscription can produce multiple invoice types for the same period, include an invoice type/source discriminator in the unique key.

The exact implementation must be compatible with the approved database/platform. A server-side check alone is not sufficient because two requests may run at the same time.

Billing operation rules:
1. Select eligible active subscriptions due for the requested billing date.
2. Determine the billing period deterministically.
3. Calculate invoice lines using stored subscription price/tax snapshots or the approved repricing rule.
4. Attempt invoice creation with the unique period key.
5. If the same period already exists, return the existing invoice or a duplicate-safe result; do not create another.
6. Advance `next_billing_date` only when invoice creation succeeds.
7. Record failures so they can be retried safely.

**Open decision:** Does a subscription retain its agreed price for all renewals, or can catalogue/plan price changes affect future billing? The challenge does not settle this. The team must choose and document a rule.

### 7.4 Invoice status and overdue calculation

Proposed invoice status flow:
- Draft → Confirmed.
- Confirmed → Paid when the outstanding balance reaches zero.
- Confirmed → Cancelled only through an authorized cancellation operation, if cancellation is supported.

Overdue is a derived condition:
- `due_date` is earlier than the business date; and
- `balance_due > 0`; and
- invoice is not cancelled.

Do not confuse the overdue condition with the invoice lifecycle status unless the team explicitly adopts a separate overdue status.

## 8. Discounts

### 8.1 `discounts`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | text | Required. |
| `discount_type` | text/enum | `fixed` or `percentage`. |
| `value` | numeric(14,2) | Non-negative; percentage range must be validated. |
| `minimum_purchase` | numeric(14,2), nullable | Optional threshold. |
| `minimum_quantity` | numeric(12,3), nullable | Optional threshold. |
| `starts_at` | timestamptz, nullable | Start of eligibility. |
| `ends_at` | timestamptz, nullable | End of eligibility. |
| `usage_limit` | integer, nullable | Maximum use count. |
| `usage_count` | integer | Current use count; update safely. |
| `scope_type` | text | Product/subscription/global scope as approved. |
| `is_active` | boolean | Defaults true. |
| `created_at` | timestamptz | Creation timestamp. |

### 8.2 `discount_applications` (recommended)

Stores the discount applied to a particular invoice or line.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `discount_id` | uuid | FK to `discounts.id`. |
| `invoice_id` | uuid | FK to `invoices.id`. |
| `discount_name_snapshot` | text | Historical label. |
| `discount_type_snapshot` | text | Fixed/percentage. |
| `discount_value_snapshot` | numeric(14,2) | Applied rule value. |
| `amount_applied` | numeric(14,2) | Actual discount amount. |
| `created_at` | timestamptz | Creation timestamp. |

Rules:
- Validate start/end dates.
- Validate minimum purchase/quantity.
- Enforce usage limits atomically.
- Prevent applying an ineligible discount.
- Preserve historical discount details on the invoice.
- The challenge says discounts should apply to the next invoice and stop at expiry/limit; the exact timing and whether multiple discounts can stack must be decided.

## 9. Payments

### 9.1 `payments`

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `payment_reference` | text | Unique internal reference. |
| `customer_id` | uuid | FK to `customers.id`. |
| `payment_method` | text | Controlled method values. |
| `amount` | numeric(14,2) | Positive. |
| `payment_date` | date/timestamptz | Date/time received. |
| `note` | text, nullable | Reference or note. |
| `recorded_by` | uuid | FK to `profiles.id`. |
| `created_at` | timestamptz | Creation timestamp. |

### 9.2 `payment_allocations`

This table allows one payment to be allocated to one or more invoices, if that behaviour is approved.

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `payment_id` | uuid | FK to `payments.id`. |
| `invoice_id` | uuid | FK to `invoices.id`. |
| `amount_allocated` | numeric(14,2) | Positive. |
| `created_at` | timestamptz | Creation timestamp. |

If the team chooses to support only one payment per invoice in the demo, this table can still support the model without complicating the UI. If allocations are not implemented, document the simpler relationship explicitly.

Payment rules:
- Payment amount must be positive.
- Allocations cannot exceed the unallocated payment amount.
- Allocation cannot exceed invoice balance unless overpayment/credit handling is explicitly implemented.
- Customer on the payment and invoice must match.
- Update invoice paid amount/balance transactionally.
- Mark invoice Paid only when balance is zero.
- Partial payment support is not explicitly required by the challenge; if implemented, test it fully.

## 10. Customer self-service requests

The challenge says customers should manage their own subscriptions, but does not specify every permitted operation.

A safe proposed model is to let customers submit requests for:
- Upgrade/downgrade.
- Quantity change.
- Pause/resume.
- Cancellation/closure.

Internal Staff/Admin reviews and approves requests before changes affect billing.

Optional table `subscription_change_requests`:

| Column | Proposed type | Rules / purpose |
|---|---|---|
| `id` | uuid | Primary key. |
| `subscription_id` | uuid | FK to `subscriptions.id`. |
| `customer_id` | uuid | FK to `customers.id`. |
| `request_type` | text | Controlled request types. |
| `request_details` | jsonb | Validated requested changes. |
| `status` | text | `pending`, `approved`, `rejected`. |
| `reviewed_by` | uuid, nullable | FK to `profiles.id`. |
| `reviewed_at` | timestamptz, nullable | Review timestamp. |
| `created_at` | timestamptz | Creation timestamp. |

This is optional and should be implemented only if the core workflows are stable. Do not allow customers to directly alter invoice amounts, plan prices or subscription billing dates.

## 11. Role-based access and RLS contract

The database must enforce access boundaries, not just the UI.

### 11.1 Access matrix

| Data / action | Admin | Staff | Customer |
|---|---|---|---|
| Read all customers | Yes | As permitted | No |
| Create/edit customers | Yes | As permitted | No |
| Read products/plans | Yes | Operational read | Only display data needed for own account |
| Manage products/plans | Yes | No unless explicitly granted | No |
| Create quotations | Yes | Yes, if permitted | No |
| Read all quotations | Yes | As permitted | Own quotations only if exposed |
| Manage subscriptions | Yes | As permitted | Own permitted view/request actions |
| Read all invoices | Yes | As permitted | Own invoices only |
| Confirm/cancel invoices | Yes | As permitted | No |
| Record payments | Yes | As permitted | No, unless a real customer payment flow is implemented |
| Read finance reports | Yes | Only if permitted | No |
| Create staff | Yes | No | No |
| Change roles | Restricted Admin operation | No | No |

“Staff as permitted” must be converted into explicit permissions before implementation. Do not leave it as a permanent ambiguous rule.

### 11.2 RLS requirements

At minimum:
- A customer may select only the customer row linked to their authenticated profile.
- A customer may select only subscriptions, quotations (if exposed), invoices and payments belonging to that customer.
- A customer cannot insert or update another customer's records.
- Staff access is limited to the approved operational policy.
- Admin-only operations are restricted to Admin identities.
- Public/anonymous users cannot read internal business records.
- Sensitive fields such as cost price and internal notes are not exposed to customers.

For Supabase:
- Use authenticated identity (`auth.uid()`) and trusted profile/role data in policies.
- Avoid policies that trust user-editable metadata.
- Avoid recursive RLS policy dependencies.
- Test policies using separate Admin, Staff, Customer A and Customer B accounts.
- Never expose a service-role key to the browser.

If the platform is Odoo-native, implement equivalent model access rights and record rules.

## 12. API / server operation contracts

These are logical operation contracts. The final implementation may use Next.js server actions, route handlers, Supabase RPC functions or Odoo methods depending on the approved platform. Do not create multiple interfaces for the same operation.

All protected operations require an authenticated session and server-side authorization.

### 12.1 Standard response shape

Proposed success response:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed"
}
```

Proposed error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The supplied data is invalid",
    "fields": {
      "email": "Enter a valid email address"
    }
  }
}
```

Do not expose database stack traces or secrets in responses.

### 12.2 Logical operations

#### Authentication/profile
- `getCurrentProfile`
  - Role: authenticated user.
  - Returns the current user's profile and permitted role information.
- `registerCustomer`
  - Role: public.
  - Creates a customer account only.
  - Validates unique email and password policy.
  - Must not accept an Admin/Staff role from the client.
- `createStaff`
  - Role: Admin only.
  - Creates or invites a staff identity and profile.
  - Rejects Staff and Customer callers.

#### Catalogue
- `createProduct`, `updateProduct`, `deactivateProduct`
  - Role: Admin.
  - Validate name, type, price and variants.
- `createPlan`, `updatePlan`, `deactivatePlan`
  - Role: Admin.
  - Validate frequency, price, minimum quantity and date rules.

#### Customers and quotations
- `createCustomer`, `updateCustomer`
  - Role: Admin or permitted Staff.
  - Validate customer details and uniqueness policy.
- `createQuotation`
  - Role: Admin or permitted Staff.
  - Input: customer, template (optional), validity dates and quotation lines.
  - Server calculates totals.
- `updateQuotation`
  - Role: Admin or permitted Staff.
  - Only allowed while quotation is in an editable state.
- `convertQuotation`
  - Role: Admin or permitted Staff.
  - Validates acceptance/validity and creates the linked subscription without duplicating conversion.

#### Subscriptions
- `createSubscription`
  - Role: Admin or permitted Staff.
  - Input: customer, plan/lines, dates and payment terms.
  - Server validates catalogue, quantity and pricing.
- `transitionSubscription`
  - Role: Admin or permitted Staff.
  - Input: subscription ID, requested action and optional reason.
  - Server validates current state and allowed transition.
- `requestSubscriptionChange`
  - Role: Customer for their own subscription.
  - Creates a request; does not directly change billing data.
- `reviewSubscriptionChange`
  - Role: Admin or permitted Staff.
  - Approves/rejects a pending request and records reviewer.

#### Billing and invoices
- `runBilling`
  - Role: Admin or explicitly authorized Staff.
  - Input: billing date/run context.
  - Generates eligible invoices idempotently.
- `getInvoice`
  - Role: Admin/permitted Staff or owning Customer.
  - Customer result must be scoped to their own account.
- `confirmInvoice`
  - Role: Admin or permitted Staff.
  - Only valid for a draft invoice.
- `cancelInvoice`
  - Role: Admin or permitted Staff.
  - Only if cancellation is an approved transition; records reason.
- `sendInvoice`
  - Role: Admin or permitted Staff.
  - Sends through a configured email service if available; otherwise do not claim email was sent.

#### Discounts and payments
- `createDiscount`, `updateDiscount`
  - Role: Admin.
  - Validates dates, type, value, scope and usage limits.
- `recordPayment`
  - Role: Admin or permitted Staff.
  - Input: customer, invoice allocation, amount, method, date and note.
  - Validates amount and allocation; updates invoice balance safely.
- `getPaymentHistory`
  - Role: Admin/permitted Staff or owning Customer.
  - Customer sees only their own payments.

#### Reports
- `getDashboardSummary`
  - Role: Admin or authorized Staff.
  - Supports date filters and approved scope.
  - Returns defined metrics, not ambiguous labels.
- `getSubscriptionReport`, `getInvoiceReport`, `getPaymentReport`
  - Role: Admin or authorized Staff.
  - Use pagination/aggregation and enforce permissions.

### 12.3 Contract change rule

Before a member changes an operation's name, payload, return structure or permissions:
1. Identify every consumer.
2. Notify the owner and team leader.
3. Agree the new contract.
4. Update this document.
5. Update shared TypeScript types.
6. Update implementation and tests together.

## 13. Validation rules

Minimum shared validation rules:

### Customers and users
- Valid email format.
- Unique email according to the agreed identity/customer policy.
- Required name.
- Customer registration cannot set privileged roles.
- Password follows the challenge's stated length and character requirements.

### Products and plans
- Name required.
- Price non-negative.
- Variant adjustment validated under the approved pricing rule.
- Frequency must be one of the allowed values.
- Minimum quantity greater than zero.
- Availability end cannot precede availability start.

### Quotations and subscriptions
- Customer must exist and be active where required.
- At least one valid line.
- Quantity greater than zero and meets plan minimum.
- Valid dates.
- Totals recalculated by trusted logic.
- Status transitions validated server-side.

### Invoices and payments
- Invoice total cannot be negative.
- Due date must satisfy the agreed date rule.
- Payment amount must be positive.
- Allocation must match customer and invoice.
- No duplicate recurring invoice for the same subscription billing period.
- Invoice Paid only when balance is zero under agreed rounding.

### Discounts
- Type is fixed or percentage.
- Percentage within approved range (normally 0–100 inclusive, with exact zero/100 behaviour agreed).
- Fixed amount cannot exceed the eligible amount unless a specific policy allows it.
- Start date/time must precede end date/time.
- Usage limit cannot be exceeded.

## 14. Financial calculation contract

The team must agree currency and tax treatment before coding. The challenge does not supply actual BrightLoop prices, currency, tax rate or tax jurisdiction.

Proposed calculation sequence:
1. Calculate each line's base amount: quantity × unit price.
2. Apply eligible line-level or invoice-level discounts according to the approved discount policy.
3. Calculate tax according to the approved tax-inclusive/exclusive policy.
4. Sum line totals to obtain invoice total.
5. Allocate payments and calculate outstanding balance.

Suggested formulas for a tax-exclusive model:

`line_subtotal = quantity × unit_price`

`discounted_taxable_amount = line_subtotal - eligible_discount`

`line_tax = discounted_taxable_amount × tax_rate`

`line_total = discounted_taxable_amount + line_tax`

`invoice_total = sum(line_total)`

`balance_due = invoice_total - sum(payment_allocations)`

These formulas are illustrative. The final calculation must specify rounding at line level or invoice level and must be implemented identically across quotations, subscriptions and invoices.

### 14.1 Dashboard metric definitions

| Metric | Proposed definition |
|---|---|
| Active subscriptions | Count of subscriptions whose status is Active under the approved date rules. |
| Revenue received / collections | Sum of payment amounts allocated/received in the selected period. |
| Outstanding | Sum of positive invoice balances excluding cancelled invoices. |
| Overdue | Sum of positive balances on invoices whose due date has passed. |
| Invoiced amount | Sum of confirmed invoice totals in the selected period, if reported. |

Do not call invoiced amount “revenue received”. Dashboard labels must match their calculation.

## 15. Indexes and performance

Proposed indexes to evaluate:
- `customers.email` (unique if policy requires).
- `profiles.customer_id`.
- `profiles.role`.
- `subscriptions.customer_id`.
- `subscriptions.status`.
- `subscriptions.next_billing_date`.
- `invoices.customer_id`.
- `invoices.status`.
- `invoices.due_date`.
- Unique `invoices.invoice_number`.
- Unique recurring billing key (subscription + billing period + discriminator if needed).
- `payments.customer_id`.
- `payment_allocations.invoice_id`.
- Foreign-key columns used frequently in joins.

Do not add every possible index blindly. Confirm query patterns and measure performance. Use server-side pagination and database aggregation for large lists.

## 16. Migration, seed and integration rules

- Every schema change must be represented by a migration.
- Migrations must be committed to Git.
- Seed data must be fictional and repeatable.
- Do not seed real customer data or real credentials.
- Do not edit another member's migration without coordination.
- Test migrations against a clean development database.
- Keep database types generated/updated from the approved schema where tooling supports it.
- A schema change is incomplete until dependent queries, types, RLS policies and tests are updated.

## 17. Required integration scenarios

The following scenarios must pass before final submission.

### Scenario A — quotation to subscription
1. Admin configures product, variant and plan.
2. Staff creates a customer.
3. Staff creates a quotation with lines.
4. System calculates subtotal, discount, tax and total.
5. Quotation is accepted and converted.
6. A linked subscription is created once.
7. Subscription follows the approved status transitions.

### Scenario B — recurring billing
1. Subscription is Active and due for billing.
2. Authorized user runs billing.
3. System creates the invoice for the correct period.
4. Running billing again does not create a duplicate.
5. Next billing date advances only after successful invoice creation.

### Scenario C — payment
1. Staff records a payment against an invoice.
2. System validates allocation.
3. Invoice amount paid and balance due update.
4. Invoice becomes Paid only when fully settled.
5. Customer portal reflects the updated invoice/payment details.

### Scenario D — customer isolation
1. Customer A logs in.
2. Customer A can view their own subscription, invoice and payment history.
3. Customer A attempts to access Customer B's record through a modified URL or request.
4. Access is denied at the database/server layer.

### Scenario E — discount eligibility
1. Admin creates a discount with conditions and usage limit.
2. Eligible invoice receives the discount.
3. Ineligible invoice does not receive it.
4. Expired or exhausted discount cannot be applied.
5. Historical invoice retains the discount snapshot.

---

## 18. Decisions to confirm before implementation

| Decision | Why it matters | Proposed owner |
|---|---|---|
| Approved platform: standalone app or Odoo-native | Determines whether this schema/API is implemented in PostgreSQL/Next.js or translated into Odoo models/methods. | Team leader |
| Currency and decimal precision | All monetary calculations and display depend on it. | Team leader + Member 4 |
| Tax-inclusive or tax-exclusive prices | Changes quotation and invoice totals. | Member 4 |
| Tax rate/demo rules | Required for consistent calculations; challenge gives no actual rate. | Member 4 |
| Product/plan price snapshot vs future repricing | Determines renewal billing behaviour. | Member 3 + Member 4 |
| Quotation status vocabulary and conversion trigger | Challenge does not define full quotation lifecycle. | Member 3 |
| Pause/resume representation | Challenge mentions pause rules but subscription status sequence omits a Paused status. | Member 3 |
| Renewal and billing-period calculation | Needed for correct recurring invoices. | Member 3 + Member 4 |
| Partial payments and overpayments | Not explicitly required; affects payment model and invoice status. | Member 4 |
| Multiple discounts stacking | Not specified; affects calculations. | Member 4 |
| Staff permission granularity | “Limited access” needs exact operation-level rules. | Team leader |
| Customer self-service scope | “Manage own subscriptions” needs approved actions. | Team leader + Member 3 |

Do not guess these decisions independently. Record the agreed answer and update the relevant tables/contracts before implementation.

---

## 19. Module ownership and contract consumers

| Member | Owns | Must coordinate with |
|---|---|---|
| Member 1 | Profiles, roles, authentication integration, authorization, RLS foundation, shared types and migrations coordination. | All members. |
| Member 2 | UI components and page data integration; does not independently change business schema. | Members 1, 3 and 4 for page contracts. |
| Member 3 | Customers, products, variants, plans, quotations, subscriptions and lifecycle operations. | Member 1 for schema/RLS; Member 4 for billing inputs. |
| Member 4 | Invoices, invoice lines, discounts, payments, allocations, billing and reports. | Member 1 for security/migrations; Member 3 for subscription/plan data. |

All members must read the entire contract before implementing a feature that consumes shared data.

**End of Document 04 — Database & API Contract**

This is a proposed shared contract. Resolve the open decisions and confirm the permitted hackathon platform before treating it as final.
