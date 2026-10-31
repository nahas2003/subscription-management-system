# Odoo x Make-A-Ton 9.0 — Technical Architecture

**Project:** BrightLoop Subscription Management System  
**Document:** 02 — Technical Architecture  
**Version:** 1.0 — Proposed architecture baseline  
**Depends on:** `01_Master_Project_Brief.md`  
**Status:** Proposed. The development platform and stack must be confirmed against hackathon rules before implementation.

---

## 1. Purpose

This document defines the proposed technical architecture for the BrightLoop Subscription Management System. It establishes the application structure, technology choices, frontend/backend responsibilities, authentication, authorization, data access, integration boundaries, security practices, deployment approach and development conventions.

All four team members and their AI coding assistants must follow the same approved architecture. No member may independently introduce a different framework, database, authentication system or architectural pattern.

## 2. Architecture decision status

### 2.1 Mandatory approval gate

The hackathon problem statement describes the required subscription management application, but the materials reviewed by the team do not conclusively establish whether a standalone Next.js/Supabase application is permitted or whether the solution must be implemented inside Odoo.

**Before implementation, the team leader must ask the organizers and obtain confirmation.**

Until confirmation:
- Treat the stack below as a proposal, not an approved fact.
- Do not spend significant time building the application on this assumption.
- If organizers require Odoo-native implementation, this document must be revised before development.
- Record the organizer's answer and the date in the decision log at the end of this document.

### 2.2 Proposed stack — subject to approval

| Layer | Proposed technology | Intended use |
|---|---|---|
| Language | TypeScript | Shared type safety across application code. |
| Web framework | Next.js (App Router) | Web application, routing, server-rendered pages and server-side operations. |
| UI library | React | Component-based user interface. |
| Styling | Tailwind CSS | Consistent styling and responsive layouts. |
| Backend platform | Supabase | Managed PostgreSQL database, authentication and supported backend services. |
| Database | PostgreSQL through Supabase | Persistent application data and relational constraints. |
| Authentication | Supabase Auth | Registration, login, session management and password reset. |
| Authorization | Application role checks + PostgreSQL Row Level Security (RLS) | Enforce admin, staff and customer access. |
| Form handling | React Hook Form + Zod (proposed) | Form state and input validation. |
| Charts | Recharts (proposed) | Dashboard and report visualizations. |
| Version control | Git + GitHub | Shared source repository and individual contribution history. |
| Development environment | VS Code | Local development for all team members. |
| Hosting | Vercel (proposed) | Frontend/application deployment, subject to organizer and platform approval. |

**Do not silently substitute libraries.** If a proposed library is unavailable, incompatible or unnecessary, the team leader must approve the alternative and update this document.

### 2.3 Architecture style

Proposed architecture: a modular web application with:
- One shared Next.js codebase.
- Clearly separated feature modules.
- Supabase Auth for identity.
- PostgreSQL as the source of truth.
- Server-side operations for privileged business actions.
- Database constraints and RLS for data integrity and access isolation.
- Shared types and documented interfaces between modules.

Do not create separate microservices for this hackathon unless a later approved decision demonstrates a real need. A modular monolith is simpler to integrate and test within the available team and time.

## 3. High-level architecture

```text
                 Browser / User
                       |
                       v
              Next.js Web Application
          (React UI + App Router + TypeScript)
                       |
          +------------+-------------+
          |                          |
          v                          v
   Server-side actions /       Supabase Auth
   route handlers              (identity/session)
          |                          |
          +------------+-------------+
                       |
                       v
             Supabase PostgreSQL
          (application data + constraints)
                       |
                       v
          Row Level Security (RLS)
       (database-level data access rules)

  Optional/approved supporting services:
  - Email provider for auth and invoice notifications
  - Scheduled billing execution mechanism
  - Hosting and deployment platform
```

### 3.1 Main architectural principles

1. PostgreSQL is the source of truth for business records.
2. The browser must not be trusted to enforce permissions.
3. Privileged actions must be checked on the server and protected by database policies.
4. Customer data must be isolated by authenticated customer identity.
5. Business rules that affect money, invoice status, subscription status or discounts must not rely only on frontend calculations.
6. Shared data contracts must be agreed before parallel implementation.
7. Keep the architecture small enough for four members to integrate and test.

## 4. Application modules

| Module | Main responsibility | Primary owner |
|---|---|---|
| Authentication and access | Registration, login, password reset, profiles, roles and authorization | Member 1 |
| Shared UI and dashboards | Navigation, layouts, reusable UI, admin/staff/customer views | Member 2 |
| Catalogue and customers | Products, variants, plans and customer records | Member 3 |
| Quotations and subscriptions | Templates, quotations, subscription creation and lifecycle | Member 3 |
| Billing and finance | Invoices, recurring billing, taxes, discounts, payments and reports | Member 4 |
| Integration and deployment | Shared configuration, integration, security review and deployment | Member 1, with all members contributing |

Ownership does not remove dependencies. For example, Member 4 must use the subscription and customer contracts agreed with Member 3.

## 5. Proposed project folder structure

Use one repository and one agreed application structure. The following is a starting proposal; adapt it only through a team-approved change.

```text
brightloop-subscription-system/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset-password/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── plans/
│   │   │   ├── customers/
│   │   │   ├── quotations/
│   │   │   ├── subscriptions/
│   │   │   ├── invoices/
│   │   │   ├── discounts/
│   │   │   ├── payments/
│   │   │   ├── reports/
│   │   │   └── staff/
│   │   ├── (staff)/
│   │   │   └── ... permitted staff pages
│   │   ├── (customer)/
│   │   │   ├── portal/
│   │   │   ├── subscriptions/
│   │   │   ├── invoices/
│   │   │   └── payments/
│   │   ├── api/
│   │   │   └── ... only where route handlers are needed
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── forms/
│   │   ├── tables/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── plans/
│   │   ├── customers/
│   │   ├── quotations/
│   │   ├── subscriptions/
│   │   ├── invoices/
│   │   ├── discounts/
│   │   ├── payments/
│   │   └── reports/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── auth/
│   │   ├── permissions/
│   │   ├── validations/
│   │   ├── calculations/
│   │   └── utils/
│   ├── types/
│   │   ├── database.ts
│   │   ├── domain.ts
│   │   └── api.ts
│   └── styles/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
├── tests/
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

### 5.1 Folder ownership guidance

- `src/components/ui/` and `src/components/layout/` are shared areas. Member 2 coordinates changes to these folders.
- `src/features/products/`, `plans/`, `customers/`, `quotations/` and `subscriptions/` are primarily Member 3's areas.
- `src/features/invoices/`, `discounts/`, `payments/` and `reports/` are primarily Member 4's areas.
- `src/features/auth/`, `src/lib/supabase/`, `src/lib/permissions/` and global configuration are primarily Member 1's areas.
- Shared files must not be edited independently without checking ownership and communicating the change.

This structure is a proposed layout, not permission to create every folder immediately. Create folders as implementation begins.

## 6. Frontend architecture

### 6.1 User interface layers

1. **Application shell:** root layout, fonts, theme and global providers.
2. **Role-specific layout:** navigation and page shell for Admin, Staff and Customer.
3. **Feature pages:** product, plan, quotation, subscription, invoice and other screens.
4. **Reusable components:** buttons, inputs, dialogs, tables, badges, cards and notifications.
5. **Data interaction:** validated forms and controlled calls to approved server/database operations.

### 6.2 UI rules

- Follow Document 03 as the authority for colours, typography, spacing and page layout.
- Use one shared component for the same repeated UI pattern.
- Avoid separate competing sidebar, button or table implementations.
- Use consistent loading, empty, error and success states.
- Forms must show validation messages and prevent invalid submission.
- Tables should support pagination where record counts can grow.
- Customer pages must not expose admin/staff navigation or data.
- Responsive behaviour must be consistent across modules.

### 6.3 Client and server responsibilities

Use server-side rendering and server-side data access where appropriate. Client components should be used for interactive controls and local UI state.

Do not put privileged database operations, service credentials or authorization decisions exclusively in client-side code.

## 7. Backend and business logic

### 7.1 Responsibilities

The backend/data layer is responsible for:
- Validating the authenticated user.
- Checking role and record ownership.
- Validating business inputs.
- Enforcing allowed status transitions.
- Calculating totals, taxes and discounts.
- Creating invoices from subscriptions.
- Preventing duplicate invoices for a billing period.
- Recording payment allocations.
- Returning only authorized records.

### 7.2 Where business logic belongs

| Logic | Required enforcement location |
|---|---|
| Password rules | Auth configuration and registration validation; verify provider behaviour. |
| Role authorization | Server-side checks and database RLS. |
| Customer record isolation | Database RLS and ownership checks. |
| Product/plan validation | Server-side validation and database constraints where applicable. |
| Subscription transitions | Server-side business operation; validate allowed prior and next status. |
| Invoice total calculation | Trusted server-side operation; persist calculated line/tax/discount values. |
| Duplicate billing prevention | Database uniqueness/idempotency constraint plus server-side billing logic. |
| Payment allocation | Trusted server-side operation with invoice and amount validation. |
| Dashboard aggregates | Server-side/database queries with authorization and filters. |

Do not rely on a frontend-only calculation for financial totals.

### 7.3 Recurring billing execution

The challenge requires invoices to be generated from subscriptions and duplicate or missed billing to be prevented. The exact scheduler technology is not specified by the challenge.

Proposed implementation stages:
1. Build a deterministic billing operation that accepts a billing date or run identifier.
2. Find eligible active subscriptions due for billing.
3. Compute invoice lines using the approved pricing/tax/discount rules.
4. Enforce a unique subscription + billing-period key to prevent duplicates.
5. Create the invoice and its lines in a safe transaction or equivalent reliable operation.
6. Advance the next billing date only after successful invoice creation.
7. Record failures and allow safe retry.

For the hackathon demo, an authorized Admin/Staff-triggered **Run Billing** action can demonstrate the workflow if automatic scheduling is not available or not approved. A manual trigger must still be idempotent. Do not claim automatic background scheduling unless it is actually implemented and tested.

## 8. Authentication and authorization

### 8.1 Identity model

Proposed identity provider: Supabase Auth.

Every authenticated person has an authentication identity. The application must associate that identity with an application profile and role.

Recommended profile concepts:
- `user_id`: matches the authentication identity.
- `role`: `admin`, `staff` or `customer`.
- `customer_id`: populated for customer accounts where applicable.
- `is_active`: controls whether the application account is enabled.
- timestamps for creation and updates.

The exact schema must be finalized in Document 04.

### 8.2 Role rules

**Admin**
- Full business configuration access.
- Can create staff accounts.
- Can configure products, plans, taxes and discounts.
- Can view business-wide dashboards and records.

**Staff**
- Access only to permitted operational functions.
- Cannot create staff accounts.
- Cannot change restricted admin configuration unless explicitly granted.
- Cannot bypass customer ownership or financial controls.

**Customer**
- Can access their own profile and permitted portal information.
- Can view only their own subscriptions and invoices.
- Cannot view another customer's records.
- Cannot create or edit internal products, plans, discounts, invoices or payment records.

### 8.3 Critical security requirements

- Enforce permissions in server-side code and PostgreSQL RLS.
- Never trust a `customer_id`, `user_id` or role sent by the browser without verifying it against the authenticated session and database.
- Never expose a Supabase service-role key in browser code.
- Never allow customers to choose or elevate their own role.
- Only an authorized Admin operation may create staff accounts and assign the staff role.
- Protect administrative actions against unauthorized direct API calls.
- Test cross-customer access explicitly.

## 9. Database integration and data ownership

PostgreSQL is the proposed source of truth. The canonical table schema and relationships belong in Document 04.

General rules:
- Use stable primary keys.
- Use foreign keys for relationships.
- Add database constraints for unique identifiers and valid values.
- Store monetary values using an exact decimal/numeric type, not floating-point types.
- Store timestamps consistently and display them in the chosen application timezone.
- Use explicit status values rather than arbitrary free text.
- Store historical invoice line prices, taxes and discounts as snapshots so later catalogue edits do not rewrite old invoices.
- Use migrations for schema changes; do not make undocumented production-only schema edits.
- Seed only fictional demonstration data.

### 9.1 Expected domain areas

The schema is expected to cover these domains; exact table names and columns are defined in Document 04:

1. Authentication-linked user profiles and roles.
2. Customers.
3. Products and product variants.
4. Subscription plans and plan rules.
5. Quotation templates, quotations and quotation lines.
6. Subscriptions and subscription lines.
7. Tax rules.
8. Discount rules and applied discounts.
9. Invoices and invoice lines.
10. Payments and payment allocations.
11. Optional audit events and notification records.

### 9.2 Schema change process

Before changing a shared table:
1. Identify the affected module and consumers.
2. Explain why the change is needed.
3. Propose the schema/migration change.
4. Notify the team leader and affected member.
5. Update Document 04 or its approved change log.
6. Implement a migration.
7. Test existing module compatibility.
8. Commit the migration and related code together where practical.

No member should independently rename or remove shared columns.

## 10. API and module contracts

The team must use shared, documented contracts. Do not invent endpoint names or payload shapes independently.

Before implementing cross-module functionality, Document 04 must define:
- Operation name or endpoint.
- Required authenticated role.
- Request fields and types.
- Validation rules.
- Response fields and types.
- Expected errors.
- Side effects and status changes.

### 10.1 Contract examples — conceptual only

| Operation | Caller | Expected purpose |
|---|---|---|
| Create quotation | Staff/Admin | Create quotation for a customer using approved catalogue lines. |
| Convert quotation | Staff/Admin | Convert an accepted quotation into a subscription. |
| Run billing | Authorized Staff/Admin | Generate due invoices idempotently. |
| Record payment | Authorized Staff/Admin | Record payment and allocate it to an invoice. |
| Get customer portal data | Customer | Return only the authenticated customer's permitted records. |
| Get finance summary | Admin / authorized finance staff | Return filtered, authorized dashboard metrics. |

These are conceptual operations, not finalized API routes. Use the exact contracts approved in Document 04.

## 11. Financial calculation rules

Financial logic must be consistent across quotation, subscription, invoice and dashboard modules.

### 11.1 General calculation principles

- Use decimal/numeric storage for monetary values.
- Define currency and rounding precision before implementation.
- Define whether tax is calculated before or after discount and apply the same rule everywhere.
- Store the final applied unit price, discount and tax details on invoice lines.
- Validate quantity and price ranges.
- Prevent negative or invalid totals unless a documented credit/refund workflow supports them.
- Do not recompute historical invoices from current product prices.

### 11.2 Invoice balance

For a simple invoice model:

`Outstanding balance = Invoice total - Payments allocated to that invoice`

An invoice is overdue when:
- Its due date is before the current business date; and
- Its outstanding balance is greater than zero.

If partial payments are implemented, do not mark an invoice Paid until its outstanding balance reaches zero according to the documented rounding rule.

### 11.3 Revenue definition

For the dashboard, distinguish:
- Invoiced amount: value of invoices issued.
- Revenue received / collections: payments recorded and allocated in the selected period.
- Outstanding amount: unpaid invoice balance.

Do not label invoice totals as cash received.

## 12. Error handling and application states

Every feature must handle:
- Loading.
- Empty result.
- Validation failure.
- Unauthorized access.
- Record not found.
- Network/backend failure.
- Duplicate submission.
- Conflict or stale data.
- Successful completion.

Do not show raw secrets, database errors or stack traces to customers. Log technical details safely for development/debugging.

For financial operations, provide clear confirmation and prevent accidental repeated submissions. The backend must still protect against duplicate requests.

## 13. Performance and scalability

The challenge states a target of under two seconds per page with thousands of subscriptions.

Implementation guidance:
- Use server-side pagination for large lists.
- Index columns commonly used for filters and joins, based on actual query patterns.
- Select only required fields.
- Avoid N+1 queries.
- Aggregate dashboard metrics in the database/server rather than downloading all rows.
- Avoid unnecessary client-side re-fetching.
- Use loading indicators for longer operations.
- Test with realistic sample volumes.

The team must measure performance before claiming that the target has been achieved.

## 14. Testing strategy

### 14.1 Minimum test areas

| Area | Required checks |
|---|---|
| Authentication | Registration, unique email, password rules, login, reset and logout. |
| Authorization | Admin/staff/customer permissions and unauthorized direct requests. |
| Customer isolation | Customer A cannot read or modify Customer B's records. |
| Catalogue | Product, variant, price adjustment and plan validation. |
| Quotations | Validity, line calculations and conversion. |
| Subscriptions | Unique number, status transitions, pause, renew and close rules. |
| Billing | Correct due subscriptions, invoice values, retry and duplicate prevention. |
| Discounts/taxes | Conditions, dates, usage limits and correct totals. |
| Payments | Correct invoice allocation, amount validation and outstanding balance. |
| Dashboard | Metrics reconcile with stored data and filters. |
| Performance | Pagination and representative query/page response time. |

### 14.2 Integration test

The team must test one complete flow:

Admin configures product/plan → customer registers → staff creates quotation → quotation converts to subscription → subscription activates → billing generates invoice → staff records payment → customer sees own records → dashboard reflects the transaction.

A page that renders without errors is not proof that its business workflow works.

## 15. Environment configuration and secrets

Use environment variables for project-specific configuration.

Expected public configuration may include:
- Supabase project URL.
- Supabase publishable/anonymous key, according to the provider's current naming and guidance.

Server-only secrets may include:
- Supabase service-role/secret key, if a server-side privileged operation genuinely requires it.
- Email provider secrets.
- Other private integration credentials.

Rules:
- Never commit `.env` files.
- Commit `.env.example` with placeholder values only.
- Never paste secrets into public issues, chat messages or source code.
- Never expose service-role/secret keys in `NEXT_PUBLIC_` variables or browser bundles.
- Each member configures their own local environment using approved project credentials.
- Rotate any secret accidentally committed or exposed.

Exact environment variable names must be confirmed during project initialization and documented in `README.md`.

## 16. GitHub and collaboration architecture

- One shared repository.
- `main` is the integration/submission branch.
- Each member uses their own Git identity.
- Every member makes meaningful commits under their own account.
- Members synchronize before starting and before pushing.
- One member pushes at a time, coordinated through the team chat.
- All final submission code must be integrated into the required branch.
- Do not force-push or discard another member's work.

### 16.1 Pull-and-reinspect rule

After every `git pull` or `git pull --rebase`, the AI assistant must:
1. Inspect the latest commit history.
2. Review changed files.
3. Reopen relevant shared components.
4. Recheck migrations/schema/API contracts.
5. Check whether another member has implemented the same or a dependent feature.
6. Update the implementation plan.
7. Resolve conflicts only within the member's authority; escalate shared architecture conflicts.

## 17. Deployment approach

Proposed hosting: Vercel for the Next.js application and Supabase-hosted services/database, subject to organizer approval and service availability.

Before deployment:
- Confirm the organizer permits the hosting/deployment approach.
- Configure environment variables securely.
- Apply migrations to the intended database.
- Seed only demo data.
- Test authentication redirect URLs and password reset flow.
- Verify RLS policies in the deployed environment.
- Test role-based access and customer data isolation.
- Confirm the public demo URL is accessible to evaluators.
- Never expose test credentials or secrets in the public repository.

A successful local build is not proof that production deployment, email delivery or database permissions work.

## 18. Change control

A change is considered architectural if it affects:
- Framework or runtime.
- Authentication provider.
- Database provider or core schema.
- Role/permission model.
- Shared API contracts.
- Financial calculation rules.
- Module ownership boundaries.
- Deployment model.

Architectural changes require team-leader approval and must be reflected in the affected documents before implementation.

Small internal refactoring within an owned module may proceed if it preserves the published contracts and does not break other members' work.

## 19. Open decisions and approval log

| Decision | Current status | Owner / action |
|---|---|---|
| Is a standalone Next.js/Supabase app allowed by the hackathon? | **Unconfirmed — blocking decision** | Team leader to confirm with organizers. |
| Is Odoo-native implementation mandatory or optional? | Unconfirmed | Team leader to obtain explicit answer. |
| Final framework and versions | Proposed only | Approve after platform clarification. |
| Final database/auth provider | Proposed Supabase | Approve after platform clarification. |
| Hosting provider | Proposed Vercel + Supabase | Confirm event rules, access and deployment feasibility. |
| Billing scheduler | Not selected | Decide after core billing flow and available execution options are known. |
| Currency and tax demo configuration | Not selected | Agree and document in Document 04. |
| Final database schema | Pending | Define in Document 04. |

### Decision log

| Date | Decision / organizer response | Approved by | Documents updated |
|---|---|---|---|
| Pending | Confirm permitted development platform and standalone app policy. | Pending | 02, 03, 04, 05, 06 |

---

## 20. Handoff to the next documents

| Document | Architecture information it must use |
|---|---|
| 03 — UI/UX Design Specification | Role-based layouts, shared components, frontend boundaries, responsive and state requirements. |
| 04 — Database & API Contract | PostgreSQL as proposed data store, domain areas, server-side business rules, RLS, API contracts and billing idempotency. |
| 05 — Team Allocation & Hourly Plan | Module ownership, shared file ownership, dependencies, integration and testing responsibilities. |
| 06 — AI Development Instructions | Mandatory architecture adherence, member identification, pull/reinspection, ownership and escalation rules. |

**End of Document 02 — Technical Architecture**

This document is a proposed technical baseline. Do not treat the stack as approved until the hackathon platform requirement is confirmed and the team leader records the decision.
