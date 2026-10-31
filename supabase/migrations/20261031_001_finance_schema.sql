-- ==============================================================================
-- BrightLoop Subscription Management System
-- Module: Finance Operations (Member 4)
-- Migration: 20261031_001_finance_schema.sql
-- Document Reference: docs/04_Database_API_Contract.md (Sections 7, 8, 9, 14, 15)
-- Currency Standard: INR (₹)
-- ==============================================================================

-- 1. TAXES TABLE
CREATE TABLE IF NOT EXISTS taxes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rate NUMERIC(7, 4) NOT NULL CHECK (rate >= 0), -- e.g. 0.1800 for 18% GST
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('fixed', 'percentage')),
    value NUMERIC(14, 2) NOT NULL CHECK (value >= 0),
    minimum_purchase NUMERIC(14, 2) CHECK (minimum_purchase IS NULL OR minimum_purchase >= 0),
    minimum_quantity NUMERIC(12, 3) CHECK (minimum_quantity IS NULL OR minimum_quantity > 0),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
    usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    scope_type TEXT NOT NULL DEFAULT 'subscription' CHECK (scope_type IN ('subscription', 'product', 'global')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_discount_dates CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

-- 3. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL, -- references customers(id)
    subscription_id UUID,      -- references subscriptions(id), nullable for ad-hoc / quotation invoices
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    billing_period_start DATE,
    billing_period_end DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'paid', 'cancelled')),
    currency TEXT NOT NULL DEFAULT 'INR',
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (subtotal >= 0),
    discount_total NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (discount_total >= 0),
    tax_total NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (tax_total >= 0),
    total NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    amount_paid NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (amount_paid >= 0),
    balance_due NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (balance_due >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_invoice_due_date CHECK (due_date >= invoice_date),
    CONSTRAINT chk_invoice_billing_period CHECK (
        billing_period_start IS NULL OR billing_period_end IS NULL OR billing_period_end >= billing_period_start
    )
);

-- UNIQUE CONSTRAINT FOR RECURRING BILLING IDEMPOTENCY
-- Prevents duplicate recurring invoices for the exact same subscription and billing period
CREATE UNIQUE INDEX IF NOT EXISTS uq_subscription_billing_period 
ON invoices (subscription_id, billing_period_start, billing_period_end) 
WHERE subscription_id IS NOT NULL AND billing_period_start IS NOT NULL AND billing_period_end IS NOT NULL;

-- 4. INVOICE LINES TABLE
CREATE TABLE IF NOT EXISTS invoice_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID,          -- references products(id)
    variant_id UUID,          -- references product_variants(id)
    description_snapshot TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
    discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    tax_rate_snapshot NUMERIC(7, 4) NOT NULL DEFAULT 0.1800 CHECK (tax_rate_snapshot >= 0),
    tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    line_total NUMERIC(14, 2) NOT NULL CHECK (line_total >= 0)
);

-- 5. DISCOUNT APPLICATIONS TABLE (Historical snapshot of applied discount per invoice)
CREATE TABLE IF NOT EXISTS discount_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_id UUID NOT NULL REFERENCES discounts(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    discount_name_snapshot TEXT NOT NULL,
    discount_type_snapshot TEXT NOT NULL CHECK (discount_type_snapshot IN ('fixed', 'percentage')),
    discount_value_snapshot NUMERIC(14, 2) NOT NULL,
    amount_applied NUMERIC(14, 2) NOT NULL CHECK (amount_applied >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_reference TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL, -- references customers(id)
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'upi', 'credit_card', 'cash', 'other')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0), -- Strictly positive
    payment_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    note TEXT,
    recorded_by UUID NOT NULL, -- references profiles(id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PAYMENT ALLOCATIONS TABLE
CREATE TABLE IF NOT EXISTS payment_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    amount_allocated NUMERIC(14, 2) NOT NULL CHECK (amount_allocated > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. INDEXES FOR PERFORMANCE (Per Document 04 Section 15)
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice_id ON invoice_lines(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_allocations_payment_id ON payment_allocations(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_allocations_invoice_id ON payment_allocations(invoice_id);

-- 9. SEED DEFAULT TAX CONFIGURATION (18% Standard GST for India)
INSERT INTO taxes (id, name, rate, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'GST 18%', 0.1800, true),
    ('00000000-0000-0000-0000-000000000002', 'GST 0% (Exempt)', 0.0000, true)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED SAMPLE DEMO DISCOUNTS
INSERT INTO discounts (id, name, code, discount_type, value, minimum_purchase, starts_at, ends_at, usage_limit, is_active)
VALUES 
    ('00000000-0000-0000-0000-000000000010', 'Launch Promo 10%', 'LAUNCH10', 'percentage', 10.00, 2000.00, timezone('utc'::text, now()), timezone('utc'::text, now() + interval '90 days'), 500, true),
    ('00000000-0000-0000-0000-000000000011', 'Welcome Discount ₹500', 'WELCOME500', 'fixed', 500.00, 5000.00, timezone('utc'::text, now()), timezone('utc'::text, now() + interval '90 days'), 200, true)
ON CONFLICT (id) DO NOTHING;
