# 07 — Member 2 (UI/UX) Alignment, Decisions & Execution Plan
## BrightLoop Subscription Management System | Odoo x Make-A-Ton 9.0

**Document Reference:** Discussion & Alignment Record for Member 2 (UI/UX Developer)  
**Created Date:** 2026-10-31  
**Trigger Command:** When the user enters `"start frotend"` (or `"start frontend"`), use this document as the exact blueprint and memory to proceed with implementation.

---

## 1. Context & Team Member Identity
- **Identified Member:** Member 2 — UI/UX Developer
- **Primary Ownership:**
  - Shared design system & UI component library
  - Application layouts, sidebars, headers, and role-based navigation shells (Admin, Staff, Customer)
  - Admin & Staff dashboards
  - Customer self-service portal (strictly isolated views)
  - Responsive layouts (desktop, tablet, mobile) and feedback states (loading skeletons, empty states, error handling, dialogs)
- **Collaboration Guardrails:**
  - Do not alter shared schemas, database migrations, or authentication logic without Member 1 (Team Leader) approval.
  - Adhere to the contracts in `04_Database_API_Contract.md` when rendering catalog, quotation, subscription, invoice, and payment data.

---

## 2. Agreed Technology Stack (Proposed Baseline)
- **Framework:** Next.js (App Router) + React
- **Language:** TypeScript (strict typing)
- **Styling:** Tailwind CSS (configured to design tokens)
- **Icons:** `lucide-react`
- **Form Management:** React Hook Form + Zod
- **Visualizations:** Recharts (for revenue, active subscription trends)
- **Backend / Identity:** Supabase (PostgreSQL + Supabase Auth)
- **Status Gate:** Proceeding on the Next.js baseline as agreed. If hackathon organizers mandate Odoo-native at any point, UI will translate to Odoo OWL/XML views.

---

## 3. Approved Visual Design Tokens (`03_UI_UX_Design_Specification.md`)

### 3.1 Color Palette
- **Primary:** `#4F46E5` (Indigo 600)
- **Primary Hover:** `#4338CA` (Indigo 700)
- **App Background:** `#F8FAFC` (Slate 50)
- **Surface / Card Background:** `#FFFFFF` (White)
- **Text Primary:** `#0F172A` (Slate 900)
- **Text Secondary / Muted:** `#64748B` (Slate 500)
- **Border:** `#E2E8F0` (Slate 200)
- **Semantic Statuses:**
  - **Success:** `#15803D` (Paid, Active, Successful)
  - **Warning:** `#D97706` (Due soon, Pending, Quotation)
  - **Danger:** `#DC2626` (Overdue, Failed, Destructive actions)
  - **Info:** `#0284C7` (Informational, Draft)

### 3.2 Spacing & Radii
- **Base Grid:** 4px
- **Card Radius:** `rounded-xl` (12px)
- **Button / Input Radius:** `rounded-lg` (8px)
- **Standard Control Height:** 40px (`h-10`)

---

## 4. Exact Execution Plan for `"start frotend"`

When `"start frotend"` is triggered, execute in the following sequential order:

### Phase 1: Shared Design System & Core Atoms (`M2-01` — Priority P0)
Location: `src/components/ui/`
1. `Button.tsx` (primary, secondary, outline, ghost, danger; loading spinner; disabled states)
2. `FormField.tsx` & `Input.tsx` (label, helper text, error message, required marker)
3. `StatusBadge.tsx` (enforcing strict lifecycle text):
   - **Subscriptions:** `Draft`, `Quotation`, `Confirmed`, `Active`, `Closed`
   - **Invoices:** `Draft`, `Confirmed`, `Paid` + derived `Overdue` warning
4. `MoneyDisplay.tsx` (currency symbol, decimal formatting `14,2`)
5. `DateDisplay.tsx` (formatted UTC date)
6. `StatCard.tsx` (title, value, subtitle/trend, optional icon)
7. `DataTable.tsx` (standardized table wrapper with header, pagination, row states)
8. `FeedbackStates`: `LoadingSkeleton.tsx`, `EmptyState.tsx`, `ErrorState.tsx`, `ConfirmDialog.tsx`

### Phase 2: Role Shells & Navigation (`M2-02` — Priority P0)
Location: `src/components/layout/`
1. `AppHeader.tsx`: BrightLoop logo, user profile badge, role indicator, logout action.
2. `AppSidebar.tsx`: Role-aware navigation:
   - **Admin:** Dashboard, Customers, Products, Plans, Quotations, Subscriptions, Invoices, Discounts, Payments, Reports, Staff Management.
   - **Staff:** Dashboard, Customers, Quotations, Subscriptions, Invoices, Payments.
   - **Customer:** Overview, My Subscriptions, My Invoices, My Payments, Profile.
3. Mobile responsiveness (hamburger toggle + slide-out drawer).

### Phase 3: Customer Portal Views (`M2-04` — Priority P0)
Location: `src/app/(customer)/`
1. `portal/page.tsx`: Overview with KPI cards (Active Subscriptions, Next Renewal, Unpaid Invoices, Total Balance) + quick links.
2. `portal/subscriptions/page.tsx`: Customer's own subscriptions list and detail view.
3. `portal/invoices/page.tsx`: Customer's own invoices list and invoice detail view.
4. `portal/payments/page.tsx`: Customer's payment history.

### Phase 4: Admin & Staff Dashboards (`M2-03` — Priority P1)
Location: `src/app/(admin)/` and `src/app/(staff)/`
1. Admin Dashboard: Executive KPI cards, recent subscriptions/invoices, overdue alerts.
2. Staff Dashboard: Operational tasks (pending quotations, confirmed subscriptions awaiting activation, invoices awaiting payment).

---

## 5. Teammate Dependencies & Hand-offs
- **Member 1 (Team Leader):** Authentication wrapper (`useUser`, `useRole`), route protection middleware.
- **Member 3 (Subscriptions):** Customer, product, plan, and quotation API schemas.
- **Member 4 (Finance):** Invoice, tax, discount, payment, and finance report schemas.
