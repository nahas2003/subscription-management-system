# BrightLoop Subscription Management System

**Event:** Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026  
**Application Scope:** Single-company subscription-to-cash management for BrightLoop  
**Standardized Demo Currency:** INR (₹)  
**Branch:** `payment` (Member 4 — Finance Operations)

---

## Team Roles & Ownership

- **Member 1 (Team Leader):** Project setup, architecture coordination, authentication, authorization, role access, security/RLS, deployment.
- **Member 2 (UI/UX Developer):** Shared design system, application shell, admin/staff dashboard, customer portal, responsive layouts.
- **Member 3 (Subscription Operations Developer):** Customer records, products, variants, plans, quotations, subscription lifecycle.
- **Member 4 (Finance Operations Developer):** Invoices, recurring billing engine, taxes, discounts, payment recording and allocation, outstanding/overdue balances, financial reports.

---

## Project Structure

```text
├── docs/
│   ├── 01_Master_Project_Brief.md
│   ├── 02_Technical_Architecture.md
│   ├── 03_UI_UX_Design_Specification.md
│   ├── 04_Database_API_Contract.md
│   ├── 05_Team_Allocation_Hourly_Plan.xlsx
│   └── 06_AI_Development_Instructions_v2.md
├── src/
│   ├── lib/
│   │   └── calculations/
│   │       └── finance.ts       # Server-side deterministic financial calculations
│   └── types/
│       └── finance.ts           # Invoice, Payment, Discount, Tax, & Billing contracts
├── tests/
│   ├── finance-calculations.test.ts
│   └── run-finance-tests.mjs    # Executable unit tests for finance logic
├── .gitignore                   # Never commits secrets or environment files
├── package.json
├── tsconfig.json
└── README.md
```

---

## Finance Module (Member 4) Specifications

- **Currency:** Indian Rupee (`INR / ₹`), 2 decimal precision.
- **Tax Model:** Tax-exclusive standard GST rate (18%).
- **Invoice Lifecycle:** `Draft` → `Confirmed` → `Paid`.
- **Payment Allocation:** Manual payment recording with exact balance tracking (`balance_due = total - amount_paid`). Paid status enforced strictly when balance reaches zero.
- **Overdue Detection:** Derived condition (`status !== 'cancelled' && balance_due > 0 && due_date < current_date`).
- **Billing Idempotency:** Stable key generation (`<subscription_id>:<billing_period_start>:<billing_period_end>`) preventing duplicate billing runs.

---

## Running Verification Tests

```bash
node tests/run-finance-tests.mjs
```
