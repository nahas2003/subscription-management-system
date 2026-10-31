-- ============================================================
-- BrightLoop Subscription Management System
-- Initial Schema Migration & Row Level Security (RLS)
-- Document Reference: docs/04_Database_API_Contract.md
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('admin', 'staff', 'customer')),
  customer_id uuid,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Customers Table
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  billing_address text,
  shipping_address text,
  currency text not null default 'INR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Link profiles.customer_id to customers.id
alter table public.profiles
  add constraint fk_profiles_customer
  foreign key (customer_id) references public.customers(id) on delete set null;

-- 3. Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  product_type text not null check (product_type in ('storable', 'service', 'subscription')),
  sales_price numeric(14,2) not null check (sales_price >= 0),
  cost_price numeric(14,2) not null check (cost_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Product Variants Table
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_name text not null,
  sku text,
  price_extra numeric(14,2) not null default 0.00,
  cost_extra numeric(14,2) not null default 0.00,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 5. Plans Table
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  billing_interval text not null check (billing_interval in ('daily', 'weekly', 'monthly', 'yearly')),
  interval_count integer not null default 1 check (interval_count > 0),
  trial_period_days integer not null default 0,
  min_quantity numeric(12,3) not null default 1.000,
  auto_renew boolean not null default true,
  allow_pause boolean not null default true,
  allow_cancellation boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6. Taxes Table
create table if not exists public.taxes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rate numeric(7,4) not null check (rate >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Insert Default 18% GST Tax
insert into public.taxes (name, rate, is_active)
values ('GST 18%', 0.1800, true)
on conflict do nothing;

-- 7. Quotations & Quotation Lines
create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique,
  customer_id uuid not null references public.customers(id),
  plan_id uuid not null references public.plans(id),
  status text not null check (status in ('draft', 'sent', 'confirmed', 'cancelled', 'expired')),
  currency text not null default 'INR',
  subtotal numeric(14,2) not null default 0.00,
  discount_total numeric(14,2) not null default 0.00,
  tax_total numeric(14,2) not null default 0.00,
  total numeric(14,2) not null default 0.00,
  valid_until date,
  notes text,
  created_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotation_lines (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  description_snapshot text not null,
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  discount_amount numeric(14,2) not null default 0.00,
  tax_rate_snapshot numeric(7,4) not null default 0.1800,
  tax_amount numeric(14,2) not null default 0.00,
  line_total numeric(14,2) not null default 0.00
);

-- 8. Subscriptions & Subscription Lines
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  subscription_number text not null unique,
  customer_id uuid not null references public.customers(id),
  plan_id uuid not null references public.plans(id),
  quotation_id uuid references public.quotations(id),
  status text not null check (status in ('draft', 'quotation', 'confirmed', 'active', 'paused', 'closed')),
  start_date date not null,
  next_billing_date date not null,
  end_date date,
  renewal_count integer not null default 0,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscription_lines (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  description_snapshot text not null,
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  discount_amount numeric(14,2) not null default 0.00,
  tax_rate_snapshot numeric(7,4) not null default 0.1800,
  tax_amount numeric(14,2) not null default 0.00,
  line_total numeric(14,2) not null default 0.00
);

-- 9. Invoices & Invoice Lines (with idempotent unique period constraint)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  customer_id uuid not null references public.customers(id),
  subscription_id uuid references public.subscriptions(id),
  invoice_date date not null,
  due_date date not null,
  billing_period_start date,
  billing_period_end date,
  status text not null check (status in ('draft', 'confirmed', 'paid', 'cancelled')),
  currency text not null default 'INR',
  subtotal numeric(14,2) not null default 0.00,
  discount_total numeric(14,2) not null default 0.00,
  tax_total numeric(14,2) not null default 0.00,
  total numeric(14,2) not null default 0.00,
  amount_paid numeric(14,2) not null default 0.00,
  balance_due numeric(14,2) not null default 0.00,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Idempotency constraint: prevent duplicate invoices for the same period
  constraint uq_invoice_subscription_period unique (subscription_id, billing_period_start, billing_period_end)
);

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  description_snapshot text not null,
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  discount_amount numeric(14,2) not null default 0.00,
  tax_rate_snapshot numeric(7,4) not null default 0.1800,
  tax_amount numeric(14,2) not null default 0.00,
  line_total numeric(14,2) not null default 0.00
);

-- 10. Payments & Payment Allocations
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_reference text not null unique,
  customer_id uuid not null references public.customers(id),
  payment_method text not null check (payment_method in ('bank_transfer', 'upi', 'credit_card', 'cash', 'other')),
  amount numeric(14,2) not null check (amount > 0),
  payment_date date not null default current_date,
  note text,
  recorded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id),
  amount_allocated numeric(14,2) not null check (amount_allocated > 0),
  created_at timestamptz not null default now()
);

-- 11. Discounts & Applications
create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  discount_type text not null check (discount_type in ('fixed', 'percentage')),
  value numeric(14,2) not null check (value >= 0),
  minimum_purchase numeric(14,2),
  minimum_quantity numeric(12,3),
  starts_at timestamptz,
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer not null default 0,
  scope_type text not null check (scope_type in ('subscription', 'product', 'global')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.plans enable row level security;
alter table public.taxes enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_lines enable row level security;
alter table public.subscriptions enable row level security;
alter table public.subscription_lines enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.payments enable row level security;
alter table public.payment_allocations enable row level security;
alter table public.discounts enable row level security;

-- Helper function: get current profile role
create or replace function public.current_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid() limit 1;
$$ language sql security definer stable;

-- Helper function: get current customer id
create or replace function public.current_customer_id()
returns uuid as $$
  select customer_id from public.profiles where id = auth.uid() limit 1;
$$ language sql security definer stable;

-- RLS: Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id or public.current_user_role() in ('admin', 'staff'));

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id or public.current_user_role() = 'admin');

-- RLS: Customers
create policy "Staff and Admin can read all customers"
  on public.customers for select
  using (public.current_user_role() in ('admin', 'staff') or id = public.current_customer_id());

create policy "Staff and Admin can insert/update customers"
  on public.customers for all
  using (public.current_user_role() in ('admin', 'staff'));

-- RLS: Products & Plans (Readable by all authenticated, manageable by Admin)
create policy "Everyone can view active products"
  on public.products for select
  using (true);

create policy "Only admin can manage products"
  on public.products for all
  using (public.current_user_role() = 'admin');

create policy "Everyone can view active plans"
  on public.plans for select
  using (true);

create policy "Only admin can manage plans"
  on public.plans for all
  using (public.current_user_role() = 'admin');

-- RLS: Subscriptions
create policy "Staff and Admin view all subscriptions, Customers view own"
  on public.subscriptions for select
  using (public.current_user_role() in ('admin', 'staff') or customer_id = public.current_customer_id());

create policy "Staff and Admin manage subscriptions"
  on public.subscriptions for all
  using (public.current_user_role() in ('admin', 'staff'));

-- RLS: Invoices
create policy "Staff and Admin view all invoices, Customers view own"
  on public.invoices for select
  using (public.current_user_role() in ('admin', 'staff') or customer_id = public.current_customer_id());

create policy "Staff and Admin manage invoices"
  on public.invoices for all
  using (public.current_user_role() in ('admin', 'staff'));

-- RLS: Payments
create policy "Staff and Admin view all payments, Customers view own"
  on public.payments for select
  using (public.current_user_role() in ('admin', 'staff') or customer_id = public.current_customer_id());

create policy "Staff and Admin manage payments"
  on public.payments for all
  using (public.current_user_role() in ('admin', 'staff'));
