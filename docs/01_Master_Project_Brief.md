# Odoo x Make-A-Ton 9.0 — Master Project Brief

**Project:** BrightLoop Subscription Management System  
**Document:** 01 — Master Project Brief  
**Version:** 1.0 — Initial working baseline  
**Team:** Four members  
**Status:** Working baseline; open decisions must be confirmed before architecture is finalized.

---

## Purpose

Define the business context, project scope, users, requirements, workflows and expected demonstration for the team's subscription management application.

> **Important:** This document separates requirements stated in the hackathon problem statement from information published on BrightLoop's website and implementation recommendations made by the team. Details not established by the sources are labelled as assumptions or open decisions.

## Document control

| Item | Definition |
|---|---|
| Owner | Team leader; all members follow the approved version. |
| Primary requirements source | Hackathon problem statement: *Subscription Management System*. |
| Business identity source | [BrightLoop official website](https://brightloop.in/) |
| Change control | Changes to scope, roles, lifecycle, data contracts or architecture require team-leader review and updates to dependent documents. |
| Audience | Four developers, AI coding assistants, evaluator/mentor and stakeholders. |

## Contents

1. Executive summary and project objective
2. Source material and interpretation
3. BrightLoop business context
4. Business model and application boundaries
5. User roles and permissions
6. Functional requirements
7. Core workflows and lifecycle rules
8. Dashboards, reporting and performance
9. Proposed catalogue and demonstration data
10. Scope prioritization and exclusions
11. End-to-end demonstration scenario
12. Acceptance criteria
13. Risks, assumptions and open decisions
14. Dependencies and handoff to the next documents

---

## 1. Executive summary

The team will build a unified Subscription Management System that manages the lifecycle of a subscription business: catalogue setup, plans, quotations, subscriptions, recurring invoices, discounts, payment recording and financial reporting.

The hackathon challenge describes an organization whose current work is fragmented across spreadsheets, manually remembered renewals, manually prepared invoices, bank-statement matching and quarterly reporting.

The intended result is one application where authorized internal users manage BrightLoop's commercial operations and customers access their own subscription and invoice information through a portal.

### Project objective

Deliver a working, integrated demonstration of the complete subscription-to-cash flow:

**Configure a product and plan → create a quotation → confirm a subscription → activate it → generate an invoice → record a payment → update customer and finance views.**

## 2. Source material and interpretation

| Source | What it establishes | How this brief uses it |
|---|---|---|
| Hackathon problem statement | Required scenario, roles, product/plan fields, quotation/subscription lifecycle, billing, discounts, payments, dashboard and performance. | Primary authority for mandatory functional requirements. |
| BrightLoop official website | Public identity, services, product categories and published product descriptions. | Business context and sample catalogue; not proof of prices or contracts. |
| Hackathon event email / participant guidance | Repository submission, individual commits, main branch expectation, evaluator collaboration and demo guidance. | Delivery constraints, not application features. |

**Interpretation rule:** The hackathon statement governs mandatory functionality. BrightLoop's website makes the business context realistic. Do not present unsupported commercial details as facts.

## 3. BrightLoop business context

BrightLoop presents itself as an AI-native software studio focused on digital experiences, full-stack delivery, craftsmanship and round-the-clock support. Its public website describes both software products and custom software development services.

### 3.1 Published product categories

| Product category | Website-described capabilities (summary) |
|---|---|
| Quality Management System (QMS) | Document control/versioning, approval workflows, audit management, compliance tracking and AI-powered insights. |
| Event Management System | Registration and ticketing, payment integration, real-time analytics, mobile event app and AI event assistant. |
| Food Delivery Ecosystem | Customer app, restaurant dashboard, menu/inventory management, driver app, routing and payment integration. |
| Financial Applications | Financial platforms, payment processing, security, fraud detection, regulatory compliance and financial analytics. |

### 3.2 Published service categories

| Service | Examples listed by BrightLoop |
|---|---|
| Mobile app development | React Native, native iOS, native Android and Progressive Web Apps. |
| Web application development | React/Next.js, Ruby on Rails, Elixir/Phoenix and single-page applications. |
| API development and integration | REST APIs, GraphQL, microservices and third-party integrations. |
| Cloud solutions | AWS, Azure, Docker, Kubernetes and CI/CD automation. |
| AI and machine learning | Natural language processing, computer vision, predictive analytics and AI assistants. |
| UI/UX design | User research, interface design, design systems, prototyping and wireframing. |

### 3.3 Business positioning

The website emphasizes AI-native thinking, craftsmanship, reliability, partnership, full-stack capability and 24/7 support. These may inform visual tone and sample descriptions; they do not create additional mandatory system features.

## 4. Business model and application boundaries

### 4.1 Selected operating model — one company

The application models **one business entity: BrightLoop**. BrightLoop's administrator and staff operate the system. Customers are external users who purchase BrightLoop products or services and access only their own records.

| Actor | Responsibilities in this application |
|---|---|
| BrightLoop Admin | Owns configuration: catalogue, plans, taxes, discounts, staff accounts, access rules and overall operations. |
| BrightLoop Staff | Handles permitted daily operations such as customer records, quotations, subscriptions, invoices and payment recording. |
| BrightLoop Customer | Registers/logs in and views their own subscriptions, invoices and payment history through the portal. |

### 4.2 What the application is not

- Not a multi-tenant SaaS platform where unrelated businesses administer separate workspaces.
- Not a personal tracker for subscriptions customers hold with Netflix or other third parties.
- Not a complete accounting/ERP replacement beyond the billing and finance functions required by this challenge.
- Not a marketplace where customers create BrightLoop's products or plans.

### 4.3 Product and service billing approach

The catalogue should represent software products, add-ons, variants and development services. Recurring plans are appropriate for products/services sold on a recurring basis. Custom development work may use quotations and project-based arrangements rather than being forced into recurring billing. Recurring subscription management remains the central challenge.

### 4.4 Customer self-service boundary

The problem statement requires customers to see and manage their own subscriptions, and explicitly requires a portal where customers see only their own subscriptions and invoices. It does not define every change customers may execute directly.

**Recommended approach:** Show subscription details and allow controlled requests for upgrade, downgrade, quantity adjustment, pause or cancellation; staff/admin approves and applies the change. Customers must not edit prices, plan configuration, invoices or payment records.

## 5. User roles and permissions

| Capability | Admin | Staff | Customer |
|---|---|---|---|
| Global dashboard and business records | Yes | Limited / authorized | No |
| Create/manage staff accounts | Yes | No | No |
| Configure products, variants and plans | Yes | If permitted | No |
| Configure taxes and discount rules | Yes | No by default | No |
| Manage customer records | Yes | Yes, within access | Own profile only |
| Create quotations/subscriptions | Yes | Yes, within access | No direct creation by default |
| View subscriptions | All | Operationally permitted | Own only |
| Manage invoices | All | Operationally permitted | Own invoices only |
| Record payments | Yes | If permitted | No |
| View finance reports | Yes | Limited if authorized | No |

Access control must be enforced in backend/database policies, not only by hiding buttons. Customer-facing reads must be scoped to the authenticated customer's linked record.

## 6. Functional requirements

Requirements below are derived from the hackathon problem statement. **Required** means explicitly stated; **Recommended** is a proposed implementation detail.

### 6.1 Authentication and user management

- **Required:** Customer registration with unique email.
- **Required:** Password longer than eight characters with uppercase, lowercase and special character.
- **Required:** Password reset link sent to registered email.
- **Required:** Admin, internal Staff and Customer roles.
- **Required:** Customers see only their own subscriptions and invoices.
- **Required:** Only Admin can add staff.
- **Recommended:** Secure logout, session handling, profile management and server-side role checks.

### 6.2 Product and variant management

- **Required:** Product name, type, sales price, cost price and notes.
- **Required:** Variants; the challenge gives a brand example where selecting the Odoo brand adds 560 to the price.
- **Recommended:** Active/archive status, SKU/internal code, optional description and variant-level price adjustments.
- **Rule:** Store price adjustments as structured data and include them in quotation/subscription line pricing.

### 6.3 Subscription plan management

- **Required:** Price and billing frequency: daily, weekly, monthly or yearly.
- **Required:** Minimum quantity and plan availability dates.
- **Required:** Plan-specific automatic closure, early closure, pause and renewal rules.
- **Recommended:** Configuration controls and validation for contradictory rules.

### 6.4 Customer and quotation management

- **Required:** Quotation templates with reusable product/plan lines.
- **Required:** Configurable quotation validity period.
- **Recommended:** Customer search, customer detail and quotation expiry indicators.
- **Recommended:** Convert accepted quotation into subscription while preserving lines and pricing.

### 6.5 Subscription management

- **Required:** Unique subscription number, customer, plan, start date, expiry date and payment terms.
- **Required:** Lines with product, quantity, unit price, taxes and amount.
- **Required lifecycle:** Draft → Quotation → Confirmed → Active → Closed.
- **Required:** Team can see current status.
- **Required:** Pause, early close and renewal according to Admin-configured plan rules.

### 6.6 Invoice and recurring billing management

- **Required:** Generate invoices from subscriptions, not by retyping details.
- **Required:** Populate customer details, product lines, taxes and totals.
- **Required:** Calculate taxes from Admin-configured rules.
- **Required:** Confirm, cancel, send and print invoices.
- **Required lifecycle:** Draft → Confirmed → Paid.
- **Required:** Prevent duplicate billing and missed billing.
- **Recommended:** Billing-run summary for due, generated, skipped and failed invoices.

### 6.7 Discount management

- **Required:** Admin creates fixed-amount or percentage discounts.
- **Required:** Minimum purchase or quantity condition.
- **Required:** Start/end dates and usage limit.
- **Required:** Scope can target products or whole subscriptions.
- **Required:** Automatically include eligible discount on next invoice and stop when expired/exhausted.

### 6.8 Payment recording

- **Required:** Record method, amount, date and note.
- **Required:** Link payment to correct invoice.
- **Required:** Show paid and outstanding invoices; identify overdue invoices.
- **Interpretation:** Payment recording is required. A live payment gateway is not explicitly required by the problem statement.

## 7. Core workflows and lifecycle rules

### 7.1 Customer onboarding

1. Customer submits email and password.
2. System validates unique email and password requirements.
3. Account is created and linked to customer profile.
4. Customer signs in and sees only their own portal records.
5. Forgot-password flow sends reset link to registered email.

### 7.2 Catalogue and plan setup

1. Admin creates product/service with type, sales price, cost price and notes.
2. Admin configures variants and additional price adjustments.
3. Admin creates plan with price, frequency, minimum quantity and availability dates.
4. Admin configures pause, early-close, auto-close and renewal behaviour.
5. Only active/available items should be offered for new quotations.

### 7.3 Quotation to subscription

1. Staff selects customer and starts from template or approved catalogue items.
2. Staff enters quantities, prices, taxes and discounts.
3. Quotation receives validity period and is shared/reviewed.
4. After acceptance/approval, quotation converts to subscription while preserving agreed lines and amounts.
5. Subscription receives unique number, dates, payment terms and lifecycle status.

### 7.4 Subscription lifecycle

| Status | Meaning / expected handling |
|---|---|
| Draft | Being prepared; not yet an active billable commitment. |
| Quotation | Offer prepared/shared and awaiting acceptance or confirmation. |
| Confirmed | Commercial terms accepted/confirmed; activation follows the documented rule. |
| Active | Live subscription eligible for billing according to its schedule. |
| Closed | Ended; must not generate future recurring invoices. |

The status sequence is specified by the problem statement, but every transition trigger is not. Document exact transition conditions in Document 04. Paused subscriptions should not be billed during pause unless an explicit plan rule says otherwise. Closed subscriptions must not generate future invoices.

### 7.5 Recurring invoice generation

1. Find active subscriptions whose next billing date is due.
2. Calculate invoice lines, quantities, unit prices, taxes and eligible discounts.
3. Check a unique subscription/billing-period constraint before creating the invoice.
4. Create one invoice for the intended billing period.
5. Advance the next billing date only after successful invoice creation.
6. Record exceptions so retries do not create duplicate invoices.

### 7.6 Invoice lifecycle and payment allocation

| Invoice state | Meaning |
|---|---|
| Draft | Invoice generated/prepared but not confirmed. |
| Confirmed | Invoice confirmed and awaiting payment/settlement. |
| Paid | Invoice fully settled by linked payment records. |

The challenge names Draft, Confirmed and Paid. Overdue is best treated as a derived indicator based on due date and remaining balance, not necessarily a replacement for the required lifecycle. If partial payments are supported, balance = invoice total minus allocated payments.

### 7.7 Discount application

1. Check active dates.
2. Check product/subscription scope and minimum purchase/quantity.
3. Check usage limit.
4. Apply fixed or percentage discount using documented calculation order.
5. Persist applied discount on invoice so historical invoices do not change when a rule is edited or expires.

## 8. Dashboards, reporting and performance

| Metric | Definition to implement |
|---|---|
| Active subscriptions | Count subscriptions in Active status and within applicable dates/rules. |
| Revenue received | Sum recorded/allocated payment amounts in selected period; do not confuse with invoiced revenue. |
| Outstanding amount | Confirmed invoice balance: invoice total less allocated payments. |
| Overdue invoices | Invoices past due date with positive outstanding balance. |
| Subscription summary | Counts by status, plan, frequency or date range. |
| Payment summary | Payments grouped by date range and method. |

Filters should include useful date ranges and relevant status/customer/plan filters. Metric definitions must be consistent across dashboard cards, tables and reports.

### Performance target

The challenge states that pages should respond in under two seconds with thousands of subscriptions. Treat this as a target to validate, not a guaranteed outcome. Use server-side pagination, indexed filter fields and efficient queries; avoid loading all records into the browser.

## 9. Proposed catalogue and demonstration data

Examples use BrightLoop's publicly described product and service categories. They are suggested demo records, not confirmed commercial offers, prices, plans or customer contracts.

| Catalogue item | Classification | Possible demo arrangement |
|---|---|---|
| Quality Management System | Software product | Monthly/yearly plan; optional user/feature add-ons. |
| Event Management System | Software product | Monthly/yearly plan or event-specific quotation. |
| Food Delivery Ecosystem | Software product/platform | Recurring platform plan or custom quotation. |
| Financial Applications | Product/service | Custom quotation; recurring support only if configured. |
| Web Application Development | Development service | Project quotation; optional maintenance agreement. |
| Mobile App Development | Development service | Project quotation; optional support agreement. |
| API Development & Integration | Development service | Project quotation or recurring integration support. |
| Cloud Solutions | Service/add-on | Recurring service plan or configurable add-on. |
| AI & Machine Learning | Development service | Project quotation or managed service. |
| UI/UX Design | Development service | Project quotation or defined service package. |

### 9.1 Pricing and tax data

- No actual BrightLoop subscription prices are published in the sources used for this brief.
- Use clearly labelled demo prices and a clearly stated demo currency.
- Do not imply demo values are BrightLoop's real prices.
- The challenge's variant example adds 560 to the price; do not assert a currency or claim it is BrightLoop's actual price.
- Tax rates and jurisdiction are unspecified; use configurable sample rules and label them as demo data.

### 9.2 Sample customers

Use fictional customer/company names. Do not use real customer records or personal data unless authorized. Demo data should cover monthly and yearly plans, variants, discounts, due invoices, outstanding balances and overdue tracking where implemented.

## 10. Scope prioritization and exclusions

### 10.1 Must-have for a credible submission

- Authentication, role separation and customer data isolation.
- Admin product, variant and plan configuration.
- Customer records and quotation creation.
- Subscription creation and required lifecycle statuses.
- Recurring invoice generation from subscriptions.
- Tax and discount application.
- Payment recording linked to invoices.
- Paid, outstanding and overdue tracking.
- Finance dashboard with required metrics and filters.
- Working end-to-end flow with persistent data.

### 10.2 Quality improvements if time permits

- Quotation and invoice PDF/print layouts.
- Customer email notifications or invoice delivery.
- Audit trail for financial/subscription changes.
- CSV report export.
- Billing-run exception/retry screen.
- Customer pause/cancellation/plan-change requests with staff approval.

### 10.3 Avoid unless required or approved

- Live payment gateway integration.
- Full double-entry accounting, general ledger or tax filing.
- Multi-company/multi-tenant architecture.
- Complex AI assistant or predictive analytics unrelated to core billing.
- Separate native mobile applications.
- Unrelated CRM, HR, inventory or project-management modules.
- Feature additions that prevent core workflows being completed and tested.

## 11. End-to-end demonstration scenario

Demonstrate that the modules work together using one fictional customer and one BrightLoop catalogue item.

| Step | Action | Expected result |
|---|---|---|
| 1. Configure | Admin creates a QMS product and monthly plan with sample price, tax and quantity rules. | Product and plan are available. |
| 2. Register | Customer creates account using valid email/password. | Customer account links to a customer profile. |
| 3. Quote | Staff creates quotation for that customer. | Quotation shows line, quantity, price, tax, total and validity. |
| 4. Confirm | Staff confirms accepted quotation and converts it. | Unique subscription preserves dates, terms and line data. |
| 5. Activate | Subscription becomes Active under documented transition. | It appears in active subscription views. |
| 6. Bill | Billing run generates invoice for due period. | Invoice is generated from subscription exactly once. |
| 7. Pay | Staff records payment against invoice. | Invoice balance/payment state updates correctly. |
| 8. Portal | Customer signs in and views subscription, invoice and payment history. | Customer sees only their own records. |
| 9. Finance | Admin filters dashboard for the period. | Metrics reconcile with stored subscription, invoice and payment data. |

### Demo discipline

Demonstrate real interactions and persisted data. Avoid hardcoded KPI cards, fake buttons, static screenshots presented as live features or manual database edits during the demo. The event email specifies an open-access functional-flow demo video with a maximum duration of 5–6 minutes after coding time ends. Follow the current event portal timeline and instructions.

## 12. Acceptance criteria

- Customer registration enforces password rules and rejects duplicate email.
- Admin, staff and customer boundaries are enforced on backend/database.
- Only Admin can create staff accounts.
- Admin can create products, variants and plans with required fields/rules.
- Staff can create a quotation and convert it while preserving line data.
- Subscription status and dates follow documented transition rules.
- An active subscription due for billing generates the correct invoice.
- Repeated billing execution does not duplicate an invoice for the same subscription period.
- Taxes and eligible discounts are reflected correctly in invoice totals.
- Payments link to the correct invoice and outstanding balance is accurate.
- Customer portal exposes only that customer's authorized records.
- Dashboard metrics reconcile with underlying records.
- Main demo completes without fake data or manual database intervention.

## 13. Risks, assumptions and open decisions

| Topic | Current position | Required action |
|---|---|---|
| Standalone app permission | Not conclusively established by the challenge statement/email reviewed. | Confirm with organizers whether Next.js/Supabase or another standalone stack is allowed, or implementation must be inside Odoo. |
| Technology stack | Not fixed by this brief. | Document 02 records only the permitted, team-approved stack. |
| Billing currency | Not specified by challenge or BrightLoop pages reviewed. | Choose and clearly label demo currency. |
| Tax jurisdiction/rates | Not specified. | Use configurable sample tax rules; do not present as legal/tax advice. |
| Payment gateway | Payment recording required; live gateway not explicit. | Prioritize manual payment recording. Gateway only if time/permission allow. |
| Customer self-service changes | Portal required; exact change permissions undefined. | Use controlled requests with staff/admin approval unless otherwise approved. |
| Partial payments | Not explicitly specified. | Decide whether to support and define balance/status logic. |
| Status transitions | Status sequence specified; triggers not fully specified. | Document exact transitions in Document 04. |
| Performance target | Under 2 seconds with thousands of subscriptions is stated. | Use pagination/indexes and test; do not claim compliance without measurement. |
| BrightLoop pricing | Not found in reviewed public sources. | Use fictional demo prices labelled as sample data. |

### 13.1 Key risks

- **Scope overload:** Optional features can leave core billing unfinished. Protect must-haves.
- **Data contract drift:** Independent schema changes can break integration. Agree schema/API contracts before parallel work.
- **Billing errors:** Duplicate invoices, incorrect discounts or payment allocation undermine the core purpose. Test these cases.
- **Authorization gaps:** Hiding UI controls is not security. Enforce policies at backend/database layer.
- **Unconfirmed framework rules:** A disallowed stack could invalidate work. Confirm before architecture lock.
- **Commercial assumptions:** Website descriptions do not prove actual prices, plans or contracts.

## 14. Dependencies and handoff

| Next document | Must take from this brief |
|---|---|
| 02 — Technical Architecture | One-company model, roles, modules, workflows, performance target, open stack-permission decision and security requirements. |
| 03 — UI/UX Design Specification | BrightLoop positioning, roles, catalogue categories, required pages, status visibility and demo flow. |
| 04 — Database & API Contract | Products/services, variants, plans, quotations, subscriptions, invoices, discounts, payments, roles, statuses and billing idempotency. |
| 05 — Team Allocation & Hourly Plan | Four-member ownership, dependencies, must-have priorities and acceptance criteria. |
| 06 — AI Development Instructions | Source-of-truth hierarchy, scope boundaries, member-number identification, ownership, pull/reinspection and no-invention rules. |

### Approval checklist

- [ ] Team agrees BrightLoop is the single company modelled.
- [ ] Catalogue examples are approved and labelled as demo data.
- [ ] Must-have scope and exclusions are agreed.
- [ ] Customer self-service boundaries are agreed.
- [ ] Team leader confirms permitted development platform/technology with organizers.
- [ ] Team approves the exact stack before Document 02 is finalized.

## Source references

**Hackathon problem statement:** *Subscription Management System* (participant-provided PDF, 4 pages). Defines the challenge, Brightloop Software scenario, account/role requirements, product and plan fields, quotation/subscription lifecycle, billing, discounts, payments and finance dashboard/performance target.

**BrightLoop official website:**
- Homepage: https://brightloop.in/
- Products: https://brightloop.in/products
- Services: https://brightloop.in/services
- About: https://brightloop.in/about

**Hackathon event email:** Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026 — Virtual Round. Used for repository, individual commits, main branch and demo-video process notes. Follow the latest event portal timeline if it differs.

---

**End of Document 01 — Master Project Brief**

This is the baseline for the remaining five project documents. Approved changes to business scope or core workflows must be reflected in dependent documents before implementation.
