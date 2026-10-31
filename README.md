# BrightLoop Subscription Management System

Odoo x Make-A-Ton 9.0 Kochi Hackathon 2026

## Overview
This repository contains the standalone **Next.js & Supabase** implementation of the **BrightLoop Subscription Management System**. The system manages the complete commercial subscription-to-cash lifecycle for BrightLoop's single-company business model.

## Branch: `product-dev` (Member 3 — Subscription Operations)
This branch implements the core Subscription Operations suite owned by **Member 3**:
- **Customer Management (`/customers` — Task `M3-01` [P0]):**
  - Customer directory with unique auto-generated codes (`CUST-xxx`).
  - Contact details (email, phone, address, operational notes).
  - Search, filter, and customer creation forms.
- **Products & Product Variants (`/products` — Task `M3-02` [P0]):**
  - Product catalogue setup (sales price, cost price, notes, types).
  - Dynamic variant configurations with additive price adjustments:
    $$\text{Effective Unit Price} = \text{Base Price} + \text{Variant Adjustment}$$
  - Full demonstration of the problem statement's variant example: **Odoo Brand Co-Edition** adding **+$560.00** to the base price ($499 + $560 = **$1,059.00**).
- **Subscription Plans (`/plans` — Task `M3-03` [P0]):**
  - Frequencies: `daily`, `weekly`, `monthly`, `yearly`.
  - Minimum commitment quantity validation.
  - Lifecycle rules: `allow_pause`, `allow_early_close`, and `auto_close`.
- **Quotations (`/quotations` & `/quotations/new` — Task `M3-04` [P0]):**
  - Interactive multi-line quotation builder with live pricing calculations.
  - Tax calculation snapshots and configurable validity windows.
  - Quotation status management: `draft`, `sent`, `accepted`, `converted`.
- **Subscriptions & Lifecycle Engine (`/subscriptions` & `/subscriptions/[id]` — Task `M3-05` [P0]):**
  - Conversion of accepted quotations directly into subscriptions, preserving all agreed line pricing snapshots.
  - Strict server-side lifecycle state machine:
    $$\text{Draft} \longrightarrow \text{Quotation} \longrightarrow \text{Confirmed} \longrightarrow \text{Active} \longrightarrow \text{Closed}$$
  - Pause and Resume toggles for live Active subscriptions (halting billing during pause).
  - `next_billing_date` tracking for handoff to Member 4's invoice generation.

## Database Migration
- Canonical SQL schema and seed data are located in `supabase/migrations/20261031_01_member3_core_schema.sql`.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
