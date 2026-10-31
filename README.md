# BrightLoop — Subscription Management System

> **Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026**  
> **Live Production Demo**: [https://subscription-management-system-pi.vercel.app/](https://subscription-management-system-pi.vercel.app/)

BrightLoop is an enterprise-grade subscription management and recurring billing operating system designed for modern SaaS and service businesses. Modeled after **Odoo Subscriptions** and elevated with an **Ambrook-inspired** design system, BrightLoop automates customer contracts, plan renewals, 18% GST tax calculations, automated invoicing runs, and partial/full payment reconciliations with strict data isolation.

---

## 🚀 Live Demo & Evaluator Quick-Access

- **Live Application URL**: [https://subscription-management-system-pi.vercel.app/](https://subscription-management-system-pi.vercel.app/)
- **Evaluator Feature**: Every screen includes a **Role Switcher** in the header (`Admin` ⇄ `Staff` ⇄ `Customer`) enabling evaluators to test all permissions and workspaces in a single click without repeatedly logging in and out.

### Demo Credentials (One-Click Chips on `/login`)

| Role | Email | Password | Landing Workspace | Capabilities |
|---|---|---|---|---|
| **Administrator** | `admin@brightloop.in` | `admin1234` | `/admin/dashboard` | Full executive visibility, revenue analytics, customer management, staff provisioning, plan catalogs |
| **Operations Staff** | `deepa@brightloop.in` | `staff1234` | `/staff/dashboard` | Quotation drafting, subscription lifecycle transitions, automated billing runs, and ledger reconciliation |
| **Customer (Client)** | `billing@apextech.in` | `client1234` | `/portal` | Isolated self-service: active subscriptions, billing statements, tax invoice downloads, UPI/NEFT settlements |

---

## 🏛️ System Architecture

BrightLoop is engineered with modern full-stack best practices:

- **Frontend & App Framework**: Next.js 14 (App Router) + TypeScript 5
- **Styling & Tokens**: Tailwind CSS with custom Ambrook Design System (`#252a23` Deep Evergreen, `#8c591b` Bronze Ochre, `#fcfaf1` Cream)
- **Database & Storage**: Supabase PostgreSQL with 15 normalized tables
- **Security & Authorization**: Row-Level Security (RLS) policies, session middleware, and server action role guards (`requireAdmin`, `requireStaffOrAdmin`, `requireCustomer`)
- **Financial Precision**: Strictly Indian Rupee (`₹` / INR), formatted via custom financial math utils to 2 decimal places (`numeric(14,2)`)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BrightLoop Architecture                         │
└────────────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ┌─────────────────┐                   ┌─────────────────┐
   │ Next.js 14 App  │                   │ Supabase Cloud  │
   │ App Router + UI │◄──(Session SSR)──►│ PostgreSQL + RLS│
   └────────┬────────┘                   └────────┬────────┘
            │                                     │
   ┌────────┴─────────────────────────────────────┴────────┐
   │                                                       │
   ▼                                                       ▼
[Role Portals]                                    [Database Core]
 • Admin (/admin)                                  • profiles (Auth sync)
 • Staff Desk (/staff)                             • customers & staff
 • Customer Portal (/portal)                       • products & plans
 • Global Ledger (/invoices, /payments)            • quotations & lines
                                                   • subscriptions & lines
                                                   • invoices & lines
                                                   • payments & allocations
                                                   • discounts & taxes
```

---

## 🌟 Core System Features

### 1. Authentication & Security Isolation (Member 1)
- **Server-Side Session Handling**: Supabase SSR client with automatic token refreshing via Next.js Middleware.
- **Enterprise Role-Based Access Control (RBAC)**: Route and server-action guards preventing privilege escalation.
- **Strict Customer Isolation**: Self-service portal queries are strictly scoped: `WHERE customer_id = profile.customer_id`. Apex Technologies can never inspect Kochi Logistics' statements.
- **Self-Service Password Recovery**: Secure tokenized password reset flow at `/auth/reset-password`.

### 2. Frontend & Design System (Member 2)
- **Ambrook Design Language**: High-contrast, typography-first enterprise workspace with warm organic tones.
- **Unified `AppShell`**: Consistent collapsible sidebar, top navigation, breadcrumbs, search, and evaluator role preview across all 40 application routes.
- **Accessible UI Primitives**: `DataTable` with sorting/filtering, `StatCard`, `StatusBadge`, `MoneyDisplay`, `FormField`, and `ConfirmDialog`.

### 3. Products, Plans & Quotation Engine (Member 3)
- **Catalog Management**: Support for `storable`, `service`, and `subscription` items with variant pricing.
- **Recurrence Engine**: Flexible recurrence units (`daily`, `weekly`, `monthly`, `yearly`), auto-close rules, and trial periods.
- **Quotation Builder**: Multi-line item pricing with automatic 18% GST computation and real-time total updates.
- **1-Click Conversion**: Quotation `sent` ➔ `confirmed` immediately creates an active recurring Subscription contract.
- **Subscription Lifecycle**: Robust state machine supporting `draft` ➔ `quotation` ➔ `confirmed` ➔ `active` ⇄ `paused` ➔ `closed`.

### 4. Finance, Invoicing & Automated Billing (Member 4)
- **Automated Recurring Billing Run**: One-click batch processor that evaluates all due active subscriptions and generates tax invoices.
- **Idempotency Guard**: Database constraint on `(subscription_id, billing_period_start, billing_period_end)` preventing duplicate billing for the same period.
- **Tax-Exclusive GST Engine**: Full compliance with Indian tax rules (default 18% GST and 5% concessions).
- **Payment Settlement & Ledger**: Record payments via UPI, Bank Transfer (NEFT/RTGS), or Card with support for partial payments, live balance due countdowns, and instant transition to `paid`.
- **Printable Invoices**: Clean, printable tax invoice layout with GSTIN breakdown, line totals, and payment allocation history.
- **Promotional Discounts**: Configurable percentage and flat discounts with minimum purchase thresholds and expiry dates.

---

## 🧪 8-Step Evaluator Walkthrough (Test the System)

Follow this 3-minute sequence to experience the complete end-to-end user journey:

1. **Visit the Landing Page (`/`)**:
   Open [https://subscription-management-system-pi.vercel.app/](https://subscription-management-system-pi.vercel.app/) to view the overview, feature breakdown, and one-click role portal launchers.
2. **Explore the Admin Executive Dashboard (`/admin/dashboard`)**:
   Click **Admin Portal** to inspect high-level KPIs: Active Subscriptions, Monthly Recurring Revenue (MRR), Invoiced Total, and Overdue Collections.
3. **Inspect Customer & Plan Catalogs (`/admin/customers`, `/admin/plans`)**:
   Create a new Customer record with GSTIN (`32AAAAA0000A1Z5`) and configure a recurring Subscription Plan.
4. **Draft & Confirm a Quotation (`/quotations/new`)**:
   Select your customer, add subscription items, observe the 18% GST calculation, and click **Create Quotation**. On the detail page, click **Confirm & Activate Subscription**.
5. **Manage the Subscription Lifecycle (`/subscriptions/[id]`)**:
   Inspect the newly activated contract. Test pausing and resuming the subscription to verify state machine transitions.
6. **Trigger an Automated Billing Run (`/invoices`)**:
   Navigate to the Invoices ledger and click **Run Recurring Billing**. The engine evaluates due contracts, generates invoices, and skips duplicates idempotently.
7. **Record a Payment & Print Statement (`/payments` & `/invoices`)**:
   Select an unpaid invoice with a balance due. Click **Record Payment**, choose **UPI** or **Bank Transfer**, enter a partial or full amount, and verify the balance due updates in real-time. Click **Print Invoice** to preview the tax invoice.
8. **Verify Customer Self-Service Isolation (`/portal`)**:
   Use the header role switcher to flip to **Customer**. Notice that the portal displays only the subscriptions and invoices belonging to the client's account.

---

## 🔬 Quality Assurance & Test Verification

BrightLoop features 100% type safety and an automated test suite verifying financial math and data invariants:

```bash
# Run TypeScript compilation check
npm run type-check
# Result: 0 errors across entire codebase

# Run automated finance and operational tests
npm run test:finance
```

### Automated Test Coverage (26 / 26 Passing):
- **Financial Calculation Invariants (8 tests)**: GST rounding, multi-line sums, negative quantity rejection, idempotency hashing.
- **Finance Services Integration (7 tests)**: Invoice state transitions, partial settlements, overpayment rejections, duplicate billing skips.
- **REST API Handlers (4 tests)**: Invoicing endpoints, payment allocation, and finance summary aggregations.
- **UI Logic & Formatters (4 tests)**: Indian currency formatting (`₹`), overdue badge computation, payment modal input validation.
- **Customer Portal & Discounts (3 tests)**: RLS data isolation verification and minimum threshold discount rules.

---

## 🛠️ Local Development Setup

To run BrightLoop locally:

```bash
# 1. Clone the repository
git clone https://github.com/nahas2003/subscription-management-system.git
cd subscription-management-system/brightloop-app

# 2. Install dependencies
npm install

# 3. Configure environment variables (.env.local)
cp .env.example .env.local
# Add your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 4. Run database migrations (optional, if using your own Supabase project)
# Copy and run supabase/migrations/20261031000000_init_brightloop_schema.sql
# Run supabase/seed.sql

# 5. Start the development server
npm run dev
# Open http://localhost:3000
```

---

## 👥 Team & Roles (Odoo x Make-A-Ton 9.0)

- **Member 1 (Team Leader)**: Architecture, Auth & User Management, PostgreSQL Schema & RLS, Security Guards, Customer Data Isolation, and Deployment.
- **Member 2**: Ambrook Frontend Design System, UI Components, Layouts, and Role Portal Experience.
- **Member 3**: Subscription Operations, Product Catalog, Recurrence Engine, and Quotation-to-Subscription Conversion.
- **Member 4**: Finance Operations, GST Tax Engine, Invoicing Lifecycle, Payment Ledger, and Automated Billing Runs.

---

*Built for Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026.*
