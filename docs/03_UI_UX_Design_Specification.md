# Odoo x Make-A-Ton 9.0 — UI/UX Design Specification

**Project:** BrightLoop Subscription Management System  
**Document:** 03 — UI/UX Design Specification  
**Version:** 1.0 — Proposed design baseline  
**Depends on:** `01_Master_Project_Brief.md`, `02_Technical_Architecture.md`  
**Status:** Proposed. Final implementation must follow the platform and technology approved by the hackathon organizers.

---

## 1. Purpose

This document defines the user experience and interface requirements for the BrightLoop Subscription Management System.

It gives all four team members one consistent reference for:
- Visual direction and design tokens.
- Navigation and role-specific layouts.
- Admin, Staff and Customer experiences.
- Required pages and page-level content.
- Shared UI components.
- Forms, tables, dialogs and feedback states.
- Responsive behaviour and accessibility.
- UI acceptance criteria.

The design should communicate a reliable business operations platform. It must prioritize clarity, speed and accurate financial information over decorative effects.

## 2. Product and user context

The application is for **one company: BrightLoop**. BrightLoop's internal team manages the company's products, plans, customers, quotations, subscriptions, invoices and payments. Customers log in to view and manage only their own permitted information.

This is not a multi-tenant SaaS platform where unrelated businesses sign up and manage their own companies.

### 2.1 Main user roles

| Role | Main goals | Main interface |
|---|---|---|
| Admin | Configure the business system, manage staff and oversee all operations. | Admin dashboard and full management navigation. |
| Staff | Process customers, quotations, subscriptions, invoices and payments within assigned permissions. | Operational dashboard and limited navigation. |
| Customer | View their own subscriptions, invoices and payment history; access permitted self-service actions. | Customer portal with simplified navigation. |

### 2.2 Design priorities

1. Make important business information visible without overwhelming users.
2. Make subscription and invoice status easy to understand.
3. Reduce repetitive data entry through sensible defaults and prefilled values.
4. Make financial totals, due dates and outstanding balances unambiguous.
5. Keep Admin/Staff workflows efficient for frequent use.
6. Keep the Customer portal simple and self-explanatory.
7. Ensure the interface works on desktop, tablet and mobile.

## 3. Visual direction

### 3.1 Design concept

Use a modern, restrained B2B software dashboard aesthetic:
- Clean light interface.
- Strong typographic hierarchy.
- Neutral surfaces and clear borders.
- One primary brand colour used consistently for primary actions and active navigation.
- Green, amber and red reserved for meaningful status and feedback.
- Minimal gradients, shadows and decorative graphics.
- Dense data views should remain readable and well-spaced.

BrightLoop's public website should be used as a reference for brand identity and tone. Do not invent a claim that the application is an official BrightLoop product design system unless the company has supplied one.

### 3.2 Proposed colour tokens

These are proposed application colours, not verified official BrightLoop brand hex values. If official brand guidelines or logo colours are supplied, update the tokens consistently.

| Token | Proposed value | Usage |
|---|---|---|
| Primary | `#4F46E5` | Primary buttons, active navigation, key links. |
| Primary hover | `#4338CA` | Hover/pressed primary actions. |
| App background | `#F8FAFC` | Main application background. |
| Surface | `#FFFFFF` | Cards, tables, dialogs and panels. |
| Text primary | `#0F172A` | Page titles and primary content. |
| Text secondary | `#64748B` | Supporting text and metadata. |
| Border | `#E2E8F0` | Dividers, card and input borders. |
| Success | `#15803D` | Paid, active and successful states where appropriate. |
| Warning | `#D97706` | Due soon, pending and attention states. |
| Danger | `#DC2626` | Overdue, failed and destructive actions. |
| Info | `#0284C7` | Informational states. |

Do not use status colours as decoration. Colour must be paired with readable text or an icon so meaning is not conveyed by colour alone.

### 3.3 Typography

Proposed:
- Font: Inter or a similarly readable sans-serif.
- Page title: 24–28 px, semibold.
- Section title: 16–20 px, semibold.
- Card metric: 24–32 px, semibold.
- Body: 14–16 px.
- Table content: 13–14 px, with adequate line height.
- Supporting labels: 12–13 px.

Use consistent font weights. Avoid excessively small text, all-caps paragraphs and decorative typefaces.

### 3.4 Spacing and shape

Suggested design tokens:
- Base spacing unit: 4 px.
- Common spacing: 8, 12, 16, 20, 24 and 32 px.
- Card radius: 10–12 px.
- Input/button radius: 8 px.
- Standard control height: approximately 40 px.
- Card border: 1 px neutral border.
- Shadows: subtle and used sparingly.

## 4. Application shell and navigation

### 4.1 Desktop shell

Recommended desktop layout:
- Fixed or sticky left sidebar.
- Top header with page context, search if implemented, notifications if implemented, and user menu.
- Main content area with consistent horizontal padding.
- Page title and primary action at the top of each page.
- Breadcrumbs on deeper pages where they improve orientation.

The sidebar should be collapsible if practical, but do not sacrifice development time for animation or decorative behaviour.

### 4.2 Admin navigation

Proposed navigation order:

1. Dashboard
2. Customers
3. Products
4. Plans
5. Quotations
6. Subscriptions
7. Invoices
8. Discounts
9. Payments
10. Reports
11. Staff Management
12. Settings (only if implemented and required)

Group related links visually where useful. Admin sees all permitted areas.

### 4.3 Staff navigation

Staff navigation must show only the areas permitted by the approved role rules. A reasonable starting set is:

1. Dashboard
2. Customers
3. Quotations
4. Subscriptions
5. Invoices
6. Payments

Do not show Staff Management or restricted system configuration controls to Staff.

The exact staff permissions must follow Document 01 and the finalized authorization rules in Document 04. Hiding a link is not authorization; the backend must enforce the restriction.

### 4.4 Customer navigation

Keep the customer portal deliberately simple:

1. Overview
2. My Subscriptions
3. My Invoices
4. My Payments
5. Profile

Only show actions that are actually implemented and permitted. Do not show internal catalogue, staff, finance or administration screens.

## 5. Page specifications

## 5.1 Authentication pages

### Login
Elements:
- BrightLoop identity/logo area.
- Email field.
- Password field with show/hide control.
- Sign in button.
- Link to password reset.
- Link to registration if customer self-registration is enabled.
- Clear validation and authentication error messages.

Behaviour:
- Disable repeated submission while processing.
- Do not reveal whether an email exists through overly specific error messages.
- Redirect authenticated users to the correct role landing page.
- Unauthorized role access must be rejected even if a user manually enters a URL.

### Customer registration
Fields:
- Name.
- Email.
- Password.
- Confirm password, if used.

Rules from the challenge:
- Email must be unique.
- Password must be longer than 8 characters and contain uppercase, lowercase and a special character.

The final implementation must verify the password rule with the chosen authentication provider and enforce it in the registration flow. Do not assume frontend validation alone is sufficient.

### Password reset
Elements:
- Registered email field.
- Send reset link action.
- Confirmation state explaining that reset instructions will be sent if the account is eligible.
- Reset-password form reached through a valid reset link.

Do not display or log reset tokens in the interface.

## 5.2 Admin dashboard

Purpose: give Admin a concise view of the business's subscription and financial operations.

Suggested summary cards:
- Active Subscriptions.
- Revenue Received.
- Outstanding Amount.
- Overdue Invoices.

Suggested supporting sections:
- Recent subscriptions.
- Recent invoices.
- Upcoming renewals.
- Overdue invoice list.
- Recent payments.
- Quick actions: Add Customer, Create Quotation, Create Subscription, Create Invoice or Run Billing (only if implemented and authorized).

Dashboard rules:
- Display the selected date range and relevant filters.
- Distinguish revenue received from invoice value.
- Make each metric's meaning clear.
- Clicking a card may navigate to a filtered detail list.
- Do not show fabricated live metrics; use seeded demo data and label it appropriately.

## 5.3 Staff dashboard

Purpose: surface the operational work Staff is permitted to perform.

Suggested content:
- Customers handled or recently created.
- Quotations awaiting action.
- Active subscriptions.
- Invoices awaiting payment.
- Overdue items requiring follow-up.
- Recent activity.
- Quick actions based on Staff permissions.

Do not expose restricted company-wide financial data if the role policy does not permit it.

## 5.4 Customer portal overview

Purpose: let a customer understand their own account quickly.

Suggested cards:
- Active Subscriptions.
- Next Renewal.
- Unpaid Invoices.
- Total Outstanding.

Suggested sections:
- Current subscriptions.
- Recent invoices.
- Recent payments.
- Important renewal or payment notices.

All data must be scoped to the authenticated customer. A customer must never be able to change a URL or request parameter to view another customer's information.

## 5.5 Customers page

Admin/Staff list view:
- Customer name.
- Email.
- Phone, if collected.
- Customer/account status, if defined.
- Number of subscriptions, if available.
- Created date.
- Actions based on role.

Actions:
- Search.
- Filter.
- Pagination.
- View customer details.
- Create/edit customer where permitted.

Customer detail view:
- Contact information.
- Subscriptions.
- Quotations.
- Invoices.
- Payment history.

Avoid putting every detail into the list table. Use a detail page or drawer for secondary information.

## 5.6 Products page

List columns:
- Product name.
- Product type/category.
- Base sales price.
- Active/inactive status, if supported.
- Last updated.
- Actions.

Create/edit form:
- Product name.
- Product type.
- Sales price.
- Cost price (visible only to authorized roles).
- Notes/description.
- Variants and their price adjustments.
- Save/cancel actions.

Variant behaviour:
- Show the base price and each variant adjustment clearly.
- Display the resulting price before saving or adding the item to a quotation/subscription.
- Use the challenge's example of a variant adding 560 only as an illustrative calculation. Do not label the currency or present it as a real BrightLoop price unless confirmed.

## 5.7 Plans page

List columns:
- Plan name.
- Frequency.
- Price.
- Minimum quantity.
- Availability.
- Status.

Create/edit form should support the challenge's plan concepts:
- Price.
- Billing frequency: daily, weekly, monthly or yearly.
- Minimum quantity.
- Availability start/end dates.
- Auto-close rule, if configured.
- Early close option, if configured.
- Pause rule, if configured.
- Renewal rule.

Use clear helper text for less familiar rules. Do not expose complex configuration as unexplained toggles.

## 5.8 Quotations page

List columns:
- Quotation number.
- Customer.
- Created date.
- Valid until.
- Total.
- Status.
- Actions.

Quotation creation flow:
1. Select customer.
2. Select a quotation template if available.
3. Add product/plan lines.
4. Set quantity and permitted pricing adjustments.
5. Review taxes, discounts and total.
6. Set validity period.
7. Save as draft or issue according to the approved workflow.

Show a clear summary panel:
- Subtotal.
- Discount.
- Tax.
- Total.

The quotation must be easy to review before confirmation. Conversion to a subscription should be a deliberate action with a confirmation step.

## 5.9 Subscriptions page

List columns:
- Subscription number.
- Customer.
- Plan.
- Start date.
- Expiry/next billing date as applicable.
- Amount.
- Status.
- Actions.

Subscription detail page:
- Subscription number and status.
- Customer information.
- Plan and subscription lines.
- Start and expiry dates.
- Payment terms.
- Billing history/invoices.
- Renewal information.
- Activity/history where implemented.

Status display must use the exact agreed status terminology:
- Draft.
- Quotation.
- Confirmed.
- Active.
- Closed.

If the system also needs paused or pending states, those must be formally approved and documented in the database/API contract rather than introduced ad hoc.

Actions such as Confirm, Activate, Pause, Resume, Renew and Close must:
- Be shown only when valid for the current status and user's role.
- Explain consequential changes.
- Require confirmation for destructive or financially significant operations.
- Be validated by the backend.

## 5.10 Invoices page

List columns:
- Invoice number.
- Customer.
- Invoice date.
- Due date.
- Total.
- Amount paid.
- Outstanding balance.
- Status.

Invoice detail:
- BrightLoop/company details.
- Customer details.
- Invoice number and dates.
- Source subscription/quotation where relevant.
- Line description, quantity, unit price and tax.
- Discount.
- Subtotal and total.
- Payment allocations.
- Outstanding balance.
- Available actions based on role and status.

Invoice lifecycle from the challenge:
- Draft.
- Confirmed.
- Paid.

Do not invent additional official statuses. Overdue should be shown as a derived warning when the due date has passed and balance remains outstanding, unless the team formally approves a separate status field.

Actions may include Confirm, Cancel, Send and Print, subject to role and implementation.

## 5.11 Discounts page

List columns:
- Discount name/code.
- Type: fixed or percentage.
- Value.
- Scope.
- Start/end date.
- Usage limit.
- Current usage.
- Status.

Create/edit form:
- Discount name/code.
- Fixed or percentage type.
- Value.
- Minimum purchase/quantity condition.
- Validity period.
- Usage limit.
- Applicable product/subscription scope.
- Enable/disable state if supported.

Clearly explain when a discount applies and when it stops applying. Do not display a discount as active if its dates or usage limit make it ineligible.

## 5.12 Payments page

List columns:
- Payment reference.
- Customer.
- Invoice.
- Method.
- Amount.
- Payment date.
- Status, if defined.

Record payment form:
- Select invoice.
- Payment method.
- Amount.
- Payment date.
- Note/reference.

Show invoice total, amount already paid and remaining balance before saving. Validate that the payment allocation is permitted by the agreed rules.

The challenge does not require a live payment gateway. Do not display a fake gateway checkout or imply a real payment has occurred. Manual payment recording is sufficient for the core workflow if implemented correctly.

## 5.13 Reports page

Suggested report sections:
- Revenue received over time.
- Active subscriptions by plan.
- Outstanding invoices.
- Overdue invoices.
- Subscription renewals/closures.
- Customer/subscription summary.

Requirements:
- Show date filters and relevant grouping.
- Define each metric.
- Ensure report totals reconcile with the underlying invoice/payment records.
- Provide empty states when no records match.
- Export functionality is optional unless the team confirms time and scope.

## 5.14 Staff management page

Admin only:
- Staff list.
- Name and email.
- Account status.
- Created date.
- Add staff action.
- Activate/deactivate action if implemented.

The Add Staff action must not be available to Staff or Customer users. Backend authorization must enforce the same rule.

## 6. Shared component library

Build and reuse a small set of components.

| Component | Required behaviour |
|---|---|
| AppSidebar | Role-aware navigation and active route state. |
| AppHeader | Page context and user menu. |
| PageHeader | Title, optional description and primary action. |
| StatCard | Label, value, optional trend/context and destination. |
| DataTable | Consistent columns, loading, empty, error and pagination states. |
| StatusBadge | Consistent status text and visual treatment. |
| SearchInput | Clear search affordance and controlled value. |
| FilterBar | Consistent filter layout and reset behaviour. |
| FormField | Label, input, helper text and validation message. |
| ConfirmDialog | Confirmation for consequential actions. |
| EmptyState | Explain why no data is shown and what action is possible. |
| LoadingState | Consistent loading feedback. |
| ErrorState | Clear message and safe retry option where appropriate. |
| Toast/Alert | Success, warning and error feedback. |
| MoneyDisplay | Consistent currency and decimal formatting. |
| DateDisplay | Consistent date formatting and timezone handling. |

Do not create multiple versions of the same component in separate feature folders unless a genuine difference is documented.

## 7. Tables, filters and pagination

Large lists must not load every record into the browser.

Common table behaviour:
- Server-side pagination.
- Search where useful.
- Filters relevant to the module.
- Sortable columns only where sorting is supported correctly.
- Clear active filter indicators.
- Reset filters action.
- Stable row keys.
- Empty and error states.
- Role-aware row actions.

Recommended filters:
- Customers: name/email search, account status if available.
- Subscriptions: status, plan, customer and date range.
- Invoices: status, due date, customer and overdue.
- Payments: method, date range and customer.
- Quotations: status, customer and validity.

## 8. Forms and interaction patterns

- Use clear labels; do not rely on placeholders as labels.
- Mark required fields.
- Validate on submission and provide useful inline errors.
- Preserve user input when a recoverable server error occurs.
- Disable submit while an operation is processing.
- Prevent accidental double-click submissions.
- Ask for confirmation before cancellation, closure or other consequential actions.
- Show calculated totals as the user edits lines, but recalculate and validate them on the server.
- Do not silently modify prices, quantities, discounts or taxes.
- Use sensible defaults only when the business rule is known.

## 9. Status and feedback design

Use consistent labels and meanings across tables, details, dashboards and filters.

Suggested visual mapping:
- Active / Paid / Successful: success treatment.
- Draft / Pending / Awaiting action: neutral or informational treatment.
- Due soon / Needs attention: warning treatment.
- Overdue / Failed / Cancelled where appropriate: danger or neutral treatment according to meaning.

Never rely on colour alone. Always include the status text.

For a status transition, show:
- Current status.
- Requested action.
- Resulting status.
- Any important effect, such as invoice generation or renewal date change.

## 10. Responsive behaviour

### Desktop
- Full sidebar.
- Multi-column dashboard cards.
- Wide data tables with sensible column prioritization.
- Detail pages may use two-column layouts.

### Tablet
- Collapsible navigation.
- Reduce dashboard columns.
- Preserve key table columns and allow controlled horizontal scrolling only when necessary.
- Keep forms readable.

### Mobile
- Compact navigation or drawer.
- Single-column cards and forms.
- Stack page actions where needed.
- Use readable table alternatives or carefully designed horizontal scrolling.
- Keep primary actions reachable.
- Do not hide important invoice totals or subscription status.

The app must remain usable at narrow viewport widths. Responsive support is not satisfied merely because the page technically shrinks.

## 11. Accessibility and usability

Minimum expectations:
- Semantic headings and form labels.
- Keyboard-accessible navigation and controls.
- Visible focus states.
- Adequate text/background contrast.
- Descriptive button labels.
- Accessible dialog focus behaviour.
- Error messages associated with relevant fields.
- Status communicated by text as well as colour.
- Do not use tiny icons without labels or tooltips where meaning is unclear.

## 12. Demo data and presentation

Use fictional but realistic demo records that demonstrate the complete business workflow.

Suggested catalogue examples based on BrightLoop's publicly presented product/service categories:
- Quality Management System.
- Event Management System.
- Food Delivery Ecosystem.
- Financial Applications.
- Web/mobile development or managed support as quotation-based examples where appropriate.

The website describes BrightLoop's product and service categories, but does not establish actual subscription prices, plan frequencies or commercial contract terms. Therefore:
- Use clearly fictional sample prices.
- Label demo pricing as sample data.
- Select one currency and use it consistently after the team agrees.
- Do not claim sample prices are BrightLoop's actual prices.
- Do not imply that every development service is necessarily sold as a recurring subscription.

## 13. UI acceptance checklist

A feature is not complete until its relevant checklist is satisfied.

### General
- [ ] Consistent typography, colours, spacing and controls.
- [ ] Responsive desktop, tablet and mobile layouts.
- [ ] Loading, empty, error and success states.
- [ ] Keyboard focus and readable contrast.
- [ ] No broken navigation or placeholder buttons.

### Role access
- [ ] Admin sees permitted administration areas.
- [ ] Staff sees only permitted operational areas.
- [ ] Customer sees only the customer portal.
- [ ] Direct URL access is checked by the backend, not only hidden in the UI.

### Business workflows
- [ ] Product and variant price changes are understandable.
- [ ] Plan frequency and rules are clear.
- [ ] Quotation totals and validity are visible.
- [ ] Subscription status and dates are clear.
- [ ] Invoice totals, tax, payment and outstanding balance are clear.
- [ ] Discount conditions are understandable.
- [ ] Payment allocation and remaining balance are visible.
- [ ] Dashboard figures have clear definitions and reconcile with records.

### Data safety
- [ ] Customer cannot see another customer's records.
- [ ] Cost price and restricted financial data are hidden from unauthorized roles.
- [ ] Consequential actions require appropriate confirmation.
- [ ] No fake payment gateway or misleading success state.

---

## 14. Handoff to the next documents

| Document | UI/UX information it must use |
|---|---|
| 04 — Database & API Contract | Page data requirements, filters, status labels, form fields and financial display requirements. |
| 05 — Team Allocation & Hourly Plan | Page/module ownership and shared component dependencies. |
| 06 — AI Development Instructions | Visual consistency, shared component reuse, role-based UI and acceptance checklist. |

**End of Document 03 — UI/UX Design Specification**

This is a proposed design baseline. If the hackathon requires an Odoo-native implementation, translate these user journeys and interface requirements into the approved Odoo interface rather than building a separate unapproved frontend.
