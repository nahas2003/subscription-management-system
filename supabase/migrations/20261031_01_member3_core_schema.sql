-- Migration: 20261031_01_member3_core_schema.sql
-- Description: Core schema for Member 3 (Subscription Operations Developer)
-- Tables: customers, products, product_variants, plans, quotations, quotation_lines, subscriptions, subscription_lines

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    product_type TEXT NOT NULL,
    description TEXT,
    sales_price NUMERIC(14, 2) NOT NULL CHECK (sales_price >= 0),
    cost_price NUMERIC(14, 2) CHECK (cost_price >= 0),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment NUMERIC(14, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Subscription Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    minimum_quantity NUMERIC(12, 3) NOT NULL DEFAULT 1 CHECK (minimum_quantity > 0),
    available_from DATE,
    available_until DATE,
    auto_close BOOLEAN NOT NULL DEFAULT FALSE,
    allow_early_close BOOLEAN NOT NULL DEFAULT FALSE,
    allow_pause BOOLEAN NOT NULL DEFAULT FALSE,
    renewal_rule JSONB NOT NULL DEFAULT '{"auto_renew": true}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    quotation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted')),
    subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    discount_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    tax_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    total NUMERIC(14, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_until_check CHECK (valid_until >= quotation_date)
);

-- 6. Quotation Lines Table
CREATE TABLE IF NOT EXISTS quotation_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    description_snapshot TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
    tax_rate_snapshot NUMERIC(7, 4) NOT NULL DEFAULT 0,
    line_subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
    line_tax NUMERIC(14, 2) NOT NULL DEFAULT 0,
    line_total NUMERIC(14, 2) NOT NULL DEFAULT 0
);

-- 7. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    next_billing_date DATE,
    payment_terms TEXT DEFAULT 'Net 30',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'quotation', 'confirmed', 'active', 'closed')),
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Subscription Lines Table
CREATE TABLE IF NOT EXISTS subscription_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    description_snapshot TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(14, 2) NOT NULL CHECK (unit_price >= 0),
    tax_rate_snapshot NUMERIC(7, 4) NOT NULL DEFAULT 0,
    line_total NUMERIC(14, 2) NOT NULL DEFAULT 0
);

-- Indexes for Query Performance (Document 04, Section 15)
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_code ON customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);

-- Fictional Demo Seed Data for BrightLoop Catalogue
INSERT INTO products (id, name, product_type, description, sales_price, cost_price, notes)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Quality Management System (QMS)', 'Software Product', 'Document control, approval workflows, audit management, and compliance tracking.', 499.00, 150.00, 'BrightLoop Core Product'),
    ('22222222-2222-2222-2222-222222222222', 'Event Management System', 'Software Product', 'Registration, ticketing, real-time analytics, mobile app integration.', 299.00, 80.00, 'BrightLoop Core Product'),
    ('33333333-3333-3333-3333-333333333333', 'Food Delivery Ecosystem', 'Software Platform', 'Customer app, restaurant dashboard, menu/inventory, driver dispatch.', 799.00, 250.00, 'Turnkey Platform')
ON CONFLICT (id) DO NOTHING;

-- Variants (including the challenge brand example: Odoo Brand adding 560 to price)
INSERT INTO product_variants (id, product_id, name, price_adjustment)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Standard Brand Edition', 0.00),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Odoo Brand Co-Edition', 560.00)
ON CONFLICT (id) DO NOTHING;

-- Subscription Plans
INSERT INTO plans (id, name, description, price, frequency, minimum_quantity, available_from, available_until, allow_pause, allow_early_close, auto_close)
VALUES
    ('44444444-4444-4444-4444-444444444444', 'QMS Professional Monthly', 'Full QMS access billed monthly', 499.00, 'monthly', 1, '2026-01-01', '2026-12-31', TRUE, TRUE, FALSE),
    ('55555555-5555-5555-5555-555555555555', 'QMS Enterprise Yearly', 'Enterprise access with annual discount', 4990.00, 'yearly', 1, '2026-01-01', '2026-12-31', TRUE, TRUE, FALSE),
    ('66666666-6666-6666-6666-666666666666', 'Event Pro Monthly', 'Event management monthly subscription', 299.00, 'monthly', 1, '2026-01-01', '2026-12-31', TRUE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Fictional Demo Customers
INSERT INTO customers (id, customer_code, name, email, phone, address, notes)
VALUES
    ('77777777-7777-7777-7777-777777777777', 'CUST-001', 'Acme Corporation Ltd', 'procurement@acmecorp.demo', '+1-555-0199', '1200 Market Street, Suite 400', 'Enterprise client interested in QMS'),
    ('88888888-8888-8888-8888-888888888888', 'CUST-002', 'Apex Global Media', 'billing@apexmedia.demo', '+1-555-0245', '750 Broadway Ave', 'Event system subscriber'),
    ('99999999-9999-9999-9999-999999999999', 'CUST-003', 'BrightWave Logistics', 'ops@brightwave.demo', '+1-555-0371', '404 Industrial Blvd', 'Platform client')
ON CONFLICT (id) DO NOTHING;
