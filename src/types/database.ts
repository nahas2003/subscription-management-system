/**
 * BrightLoop Subscription Management System
 * Shared Database Entity Types
 * Reference: docs/04_Database_API_Contract.md
 */

export type UserRole = 'admin' | 'staff' | 'customer';

export type Currency = 'INR';

export interface Profile {
  id: string; // references auth.users(id)
  email: string;
  full_name: string;
  role: UserRole;
  customer_id: string | null; // links to customers.id when role === 'customer'
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  customer_code?: string;
  name: string;
  email: string;
  phone: string | null;
  billing_address?: string | null;
  shipping_address?: string | null;
  address?: string | null;
  notes?: string | null;
  currency: Currency;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: string;
  customer_code: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'storable' | 'service' | 'subscription';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type: ProductType | string;
  sales_price: number; // numeric(14,2)
  cost_price: number | null; // numeric(14,2)
  notes?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  product_type: string;
  description: string | null;
  sales_price: number;
  cost_price: number | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name?: string;
  name?: string;
  sku?: string | null;
  price_extra?: number; // numeric(14,2)
  price_adjustment?: number;
  cost_extra?: number; // numeric(14,2)
  is_active: boolean;
  created_at: string;
}

export interface ProductVariantRow {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
}

export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type PlanFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Plan {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  price?: number;
  frequency?: PlanFrequency;
  billing_interval: BillingInterval;
  interval_count: number;
  trial_period_days?: number;
  min_quantity: number;
  minimum_quantity?: number;
  available_from?: string | null;
  available_until?: string | null;
  auto_renew?: boolean;
  auto_close?: boolean;
  allow_early_close?: boolean;
  allow_pause: boolean;
  allow_cancellation?: boolean;
  renewal_rule?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PlanRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  frequency: PlanFrequency;
  minimum_quantity: number;
  available_from: string | null;
  available_until: string | null;
  auto_close: boolean;
  allow_early_close: boolean;
  allow_pause: boolean;
  renewal_rule: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tax {
  id: string;
  name: string;
  rate: number;
  is_active: boolean;
  created_at: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'confirmed' | 'cancelled' | 'expired' | 'accepted' | 'rejected' | 'converted';

export interface Quotation {
  id: string;
  quotation_number: string;
  customer_id: string;
  plan_id?: string | null;
  quotation_date?: string;
  status: QuotationStatus;
  currency: Currency;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  valid_until: string | null;
  notes: string | null;
  created_by?: string;
  confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuotationRow {
  id: string;
  quotation_number: string;
  customer_id: string;
  quotation_date: string;
  valid_until: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuotationLine {
  id: string;
  quotation_id: string;
  product_id: string | null;
  variant_id: string | null;
  plan_id?: string | null;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  tax_rate_snapshot: number;
  tax_amount?: number;
  line_subtotal?: number;
  line_tax?: number;
  line_total: number;
}

export interface QuotationLineRow {
  id: string;
  quotation_id: string;
  product_id: string | null;
  variant_id: string | null;
  plan_id: string | null;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  tax_rate_snapshot: number;
  line_subtotal: number;
  line_tax: number;
  line_total: number;
}

export type SubscriptionStatus =
  | 'draft'
  | 'quotation'
  | 'confirmed'
  | 'active'
  | 'paused'
  | 'closed';

export interface Subscription {
  id: string;
  subscription_number: string;
  customer_id: string;
  plan_id: string | null;
  quotation_id: string | null;
  status: SubscriptionStatus;
  start_date: string;
  next_billing_date: string | null;
  expiry_date?: string | null;
  end_date?: string | null;
  renewal_count?: number;
  payment_terms?: string;
  is_paused?: boolean;
  currency?: Currency;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionRow {
  id: string;
  subscription_number: string;
  customer_id: string;
  plan_id: string | null;
  quotation_id: string | null;
  start_date: string;
  expiry_date: string | null;
  next_billing_date: string | null;
  payment_terms: string;
  status: 'draft' | 'quotation' | 'confirmed' | 'active' | 'paused' | 'closed';
  is_paused: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionLine {
  id: string;
  subscription_id: string;
  product_id: string | null;
  variant_id: string | null;
  plan_id?: string | null;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  tax_rate_snapshot: number;
  tax_amount?: number;
  line_total: number;
}

export interface SubscriptionLineRow {
  id: string;
  subscription_id: string;
  product_id: string | null;
  variant_id: string | null;
  plan_id: string | null;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  tax_rate_snapshot: number;
  line_total: number;
}

export type InvoiceStatus = 'draft' | 'confirmed' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  subscription_id: string | null;
  invoice_date: string;
  due_date: string;
  billing_period_start: string | null;
  billing_period_end: string | null;
  status: InvoiceStatus;
  currency: Currency;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string | null;
  variant_id: string | null;
  description_snapshot: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate_snapshot: number;
  tax_amount: number;
  line_total: number;
}

export type PaymentMethod = 'bank_transfer' | 'upi' | 'credit_card' | 'cash' | 'other';

export interface Payment {
  id: string;
  payment_reference: string;
  customer_id: string;
  payment_method: PaymentMethod;
  amount: number;
  payment_date: string;
  note: string | null;
  recorded_by: string;
  created_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  invoice_id: string;
  amount_allocated: number;
  created_at: string;
}

export type DiscountType = 'fixed' | 'percentage';
export type DiscountScope = 'subscription' | 'product' | 'global';

export interface Discount {
  id: string;
  name: string;
  code: string | null;
  discount_type: DiscountType;
  value: number;
  minimum_purchase: number | null;
  minimum_quantity: number | null;
  starts_at: string | null;
  ends_at: string | null;
  usage_limit: number | null;
  usage_count: number;
  scope_type: DiscountScope;
  is_active: boolean;
  created_at: string;
}
