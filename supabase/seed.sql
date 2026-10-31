-- ============================================================
-- BrightLoop Subscription Management System
-- Comprehensive Seed Data for Hackathon Demonstration
-- Document Reference: docs/01_Master_Project_Brief.md & docs/04_Database_API_Contract.md
-- ============================================================

-- 1. Insert Initial Taxes
insert into public.taxes (id, name, rate, is_active)
values
  ('11111111-1111-1111-1111-111111111111', 'GST 18%', 0.1800, true),
  ('22222222-2222-2222-2222-222222222222', 'GST 5%', 0.0500, true)
on conflict (id) do nothing;

-- 2. Insert Demo Customers
insert into public.customers (id, name, email, phone, billing_address, shipping_address, currency, is_active)
values
  (
    'c1111111-1111-1111-1111-111111111111',
    'Alpha Infotech Solutions',
    'billing@alphainfotech.in',
    '+91 98401 23456',
    'Infopark Phase 1, Kochi, Kerala 682042',
    'Infopark Phase 1, Kochi, Kerala 682042',
    'INR',
    true
  ),
  (
    'c2222222-2222-2222-2222-222222222222',
    'Beta Cloud Labs Pvt Ltd',
    'accounts@betacloud.in',
    '+91 98402 34567',
    'SmartCity Kochi, Kakkanad, Kerala 682030',
    'SmartCity Kochi, Kakkanad, Kerala 682030',
    'INR',
    true
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'Gamma Logistics Hub',
    'finance@gammalogistics.in',
    '+91 98403 45678',
    'Willingdon Island, Kochi, Kerala 682003',
    'Willingdon Island, Kochi, Kerala 682003',
    'INR',
    true
  )
on conflict (id) do nothing;

-- 3. Insert Catalogue Products
insert into public.products (id, name, description, product_type, sales_price, cost_price, is_active)
values
  (
    'ba111111-1111-1111-1111-111111111111',
    'BrightLoop Cloud ERP Core',
    'Complete multi-tenant ERP platform subscription per instance.',
    'subscription',
    15000.00,
    4500.00,
    true
  ),
  (
    'ba222222-2222-2222-2222-222222222222',
    'Priority SLA Support Add-on',
    '24/7 technical helpdesk, dedicated account manager, and 1-hour SLA response.',
    'service',
    5000.00,
    1200.00,
    true
  ),
  (
    'ba333333-3333-3333-3333-333333333333',
    'Implementation & Customization Pack',
    'One-time onboarding and data migration package.',
    'service',
    25000.00,
    8000.00,
    true
  )
on conflict (id) do nothing;

-- 4. Insert Subscription Plans
insert into public.plans (id, name, code, billing_interval, interval_count, trial_period_days, min_quantity, auto_renew, allow_pause, allow_cancellation, is_active)
values
  (
    'a1111111-1111-1111-1111-111111111111',
    'Monthly Pro Subscription',
    'PLAN-MONTHLY',
    'monthly',
    1,
    14,
    1.000,
    true,
    true,
    true,
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Annual Enterprise Subscription',
    'PLAN-ANNUAL',
    'yearly',
    1,
    30,
    1.000,
    true,
    true,
    true,
    true
  )
on conflict (id) do nothing;

-- 5. Insert Discounts
insert into public.discounts (id, name, code, discount_type, value, minimum_purchase, minimum_quantity, starts_at, ends_at, usage_limit, usage_count, scope_type, is_active)
values
  (
    'd1111111-1111-1111-1111-111111111111',
    'Hackathon Early Bird 10%',
    'HACKATHON10',
    'percentage',
    10.00,
    10000.00,
    null,
    '2026-01-01T00:00:00Z',
    '2026-12-31T23:59:59Z',
    100,
    12,
    'subscription',
    true
  ),
  (
    'd2222222-2222-2222-2222-222222222222',
    'Flat Welcome ₹2,000 Off',
    'WELCOME2000',
    'fixed',
    2000.00,
    15000.00,
    null,
    '2026-01-01T00:00:00Z',
    '2026-12-31T23:59:59Z',
    50,
    5,
    'global',
    true
  )
on conflict (id) do nothing;
