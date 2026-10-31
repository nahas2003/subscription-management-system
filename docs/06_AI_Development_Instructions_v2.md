# 06 — AI Development Instructions
## BrightLoop Subscription Management System | Odoo x Make-A-Ton 9.0

**Purpose:** Give all four team members a consistent way to use an AI coding assistant while working in the shared project repository.

---

## 1. First interaction: identify the team member

At the beginning of a new AI coding session, ask:

> Which team member are you? Enter your member number: 1, 2, 3 or 4.

Wait for the answer before planning or editing code. Do not assume the member number.

After the member identifies themselves, use the ownership table below. If the member asks for work outside their assigned area, explain the ownership boundary and ask for the team leader's approval before changing shared code or contracts.

## 2. Read the project references first

Before making implementation decisions, read the available project documents:

1. `docs/01_Master_Project_Brief.md`
2. `docs/02_Technical_Architecture.md`
3. `docs/03_UI_UX_Design_Specification.md`
4. `docs/04_Database_API_Contract.md`
5. `docs/05_Team_Allocation_Hourly_Plan.xlsx`
6. `docs/06_AI_Development_Instructions.md`

If a document is missing or inaccessible, say so and ask the member to provide it. Never claim to have read a document that you have not actually inspected.

The problem statement and organizer instructions take precedence over assumptions in planning documents. The BrightLoop website may inform business context, but it does not establish actual prices, tax rates, contract terms or billing policies.

## 3. Mandatory technology approval gate

The proposed architecture uses Next.js, TypeScript, Tailwind CSS and Supabase/PostgreSQL. This is a proposal, not proof that the organizers permit a standalone application.

Before initializing or changing the stack:
- Check whether the organizers require an Odoo-native implementation or permit a standalone application.
- If the answer is unknown, stop stack-specific setup and ask the team leader to confirm with the organizers.
- If Odoo-native development is required, do not continue building a standalone Next.js/Supabase app. Ask the leader to revise the architecture and task plan.

Do not silently change frameworks, database providers or deployment targets.

## 4. Team ownership

| Member | Primary ownership |
|---|---|
| **1 — Team leader** | Repository and project coordination; architecture; authentication and profiles; roles and authorization; security/RLS; integration; deployment; final quality control |
| **2 — UI/UX** | Shared visual system; layout; sidebar/navigation; dashboards; admin/staff screens; customer portal; responsive UI and reusable presentation components |
| **3 — Subscription operations** | Customer management; products; variants; plans; quotations; subscription creation and lifecycle |
| **4 — Finance operations** | Invoices; recurring billing; taxes; discounts; payment recording and allocation; outstanding/overdue balances; finance reports |

Ownership is not permission to change shared contracts unilaterally. Coordinate changes to shared components, database schema, API contracts, authentication, role policies and common types with Member 1 and affected members.

## 5. Product scope and business assumptions

- This is a **single-company BrightLoop system**. Do not build multi-tenancy or independent company workspaces unless the leader and organizers explicitly change the scope.
- BrightLoop is the business operating the platform. Customers are BrightLoop's customers.
- Do not invent actual BrightLoop prices, taxes, customer data or contractual terms. Use clearly labelled fictional demo data where needed.
- Manual payment recording is sufficient for the core workflow unless the organizers explicitly require a payment gateway.
- Custom development services can be quoted as projects; do not force every service into a recurring subscription.
- Keep the approved lifecycle vocabulary consistent:
  - Subscription: `Draft → Quotation → Confirmed → Active → Closed`
  - Invoice: `Draft → Confirmed → Paid`
- Treat overdue as a derived condition based on due date and unpaid balance, not as an arbitrary replacement for invoice status.
- Do not invent pause, renewal, cancellation, partial-payment, discount-stacking or tax rules. Check the approved documents and ask the leader when the rule is unresolved.

## 6. Required working procedure before editing code

1. Confirm the member number and assigned task.
2. Inspect the current repository and working tree.
3. Check the current branch, recent commits and uncommitted changes.
4. Inspect relevant files, components, types, migrations, API contracts and tests.
5. Read the latest changes made by teammates before modifying shared areas.
6. State a short implementation plan and identify dependencies.
7. Make the smallest coherent change within the assigned area.
8. Run relevant tests, type checks and build/lint commands that are available.
9. Report exactly what changed and what remains incomplete.

Do not create duplicate pages, components, database tables or services without checking whether they already exist.

## 7. Rules after every pull or rebase

After pulling or rebasing, do not immediately resume coding. First inspect:
- New commits and changed files.
- Changes to shared UI components and styles.
- Database migrations, generated types and schema changes.
- API endpoints, request/response shapes and shared types.
- Package/dependency changes.
- Tests and build configuration.

Then update the implementation plan. If a teammate's changes conflict with your work, stop and coordinate rather than overwriting their changes.

## 8. Security and financial correctness

- Enforce authorization on the server/database, not only by hiding UI buttons.
- A customer must only access their own customer profile, subscriptions, quotations, invoices and payment information.
- Only Admin may create Staff accounts, as required by the brief.
- Never expose service-role keys, database secrets, private tokens or `.env` contents in browser code or Git.
- Validate all inputs on trusted server-side boundaries.
- Calculate totals, taxes, discounts and balances using trusted server-side logic and consistent decimal/money handling.
- Preserve historical invoice line descriptions, prices and tax snapshots; later catalogue edits must not silently rewrite issued invoices.
- Recurring invoice generation must be idempotent: retrying a billing job must not create duplicate invoices for the same subscription and billing period.
- Prevent skipped billing periods and duplicate payment allocations.
- Do not mark an invoice paid unless its outstanding balance is actually settled under the approved payment rules.
- Do not claim a payment gateway is integrated if payments are only being recorded manually.

## 9. Git and collaboration rules

- Use your own GitHub account and Git identity. Do not commit under another member's identity.
- Work only in the agreed repository and branch workflow.
- Pull the latest shared changes before starting work.
- Coordinate pushes; only one person should push at a time if the team is sharing `main`.
- Make meaningful commits regularly, meeting the event's stated commit frequency.
- Stage only files you own or have coordinated changes to.
- Never force-push, reset shared history, or discard another member's work.
- Never commit `.env`, credentials, API keys, private customer data or generated secrets.
- AI may suggest Git commands, but a human member must review and approve commit/push actions. Do not claim a push succeeded unless the command result confirms it.

Example commit messages:
- `feat: add customer management`
- `feat: implement subscription lifecycle`
- `feat: generate recurring invoices`
- `fix: prevent duplicate billing periods`
- `test: cover customer data isolation`

## 10. Priorities for a short hackathon

**P0 — must work end to end**
- Authentication and role-based access.
- Admin product and plan setup.
- Customer records.
- Quotation and subscription lifecycle.
- Invoice creation and recurring billing safeguards.
- Manual payment recording and outstanding balance.
- Customer's own subscription and invoice view.
- Integrated dashboard and a reliable demo workflow.

**P1 — add if P0 is stable**
- Discounts and their validity/usage rules.
- Useful finance filters and reports.
- Customer requests for changes, if supported by the approved scope.

**P2 — only after the core flow is reliable**
- Animations and decorative polish.
- Advanced exports.
- Payment gateway integration.
- Unrequested integrations or speculative features.

Do not sacrifice a working end-to-end workflow to add more features.

## 11. End-to-end acceptance scenario

The integrated application should support this demonstration:

1. Admin creates a product and a subscription plan.
2. Staff creates a customer.
3. Staff prepares and sends a quotation.
4. Staff confirms the quotation and creates the subscription.
5. The system generates the correct invoice.
6. Staff records a payment against the invoice.
7. The customer signs in and sees only their own subscription and invoice.
8. Admin sees active subscriptions, revenue and outstanding balances.

Also test:
- Re-running the same billing action does not create a duplicate invoice.
- A customer cannot access another customer's records by changing an ID or URL.
- Staff cannot perform Admin-only actions.
- Invalid inputs and expired discounts are rejected appropriately.
- Invoice totals and remaining balances are correct.

## 12. Reporting format after each task

At the end of each work session, report:

- **Member number:**
- **Assigned task:**
- **Files created or changed:**
- **What is implemented:**
- **Tests/commands actually run and their results:**
- **Dependencies or shared-contract changes:**
- **Known bugs or incomplete/mock behaviour:**
- **Git status:** branch, commit hash if created, push status if verified
- **Next recommended task:**

Never say “complete” when important parts are mocked, untested or disconnected from the rest of the application.

## 13. Final submission checks

Before submission, the team leader should verify the current event instructions and confirm:
- The required code is in the submission branch (the event guide previously specified `main`).
- Each member has meaningful commits under their own Git identity, as required by the event.
- The evaluator and mentor have been added where required.
- No secrets or private data are committed.
- The demo video is accessible to evaluators and meets the event's time limit.
- The repository URL and video are submitted through the official portal.
- Submission is not described as successful until the portal confirms it.

---

## Final instruction to the AI assistant

Act as a careful implementation partner, not an autonomous project owner. Follow the approved requirements, inspect the actual repository, preserve teammate work, explain uncertainty, and ask before changing shared architecture or business rules. Do not fabricate test results, completed features, commits, pushes or deployment status.
