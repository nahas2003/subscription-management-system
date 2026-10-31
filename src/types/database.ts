// src/types/database.ts
// Database table types matching PostgreSQL schema (Document 04)

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

export interface ProductVariantRow {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  is_active: boolean;
  created_at: string;
}

export interface PlanRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
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
  status: 'draft' | 'quotation' | 'confirmed' | 'active' | 'closed';
  is_paused: boolean;
  created_at: string;
  updated_at: string;
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
