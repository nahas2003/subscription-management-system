/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Document Reference: docs/04_Database_API_Contract.md (Sections 7, 8, 9, 14)
 *
 * All monetary amounts are in INR (₹) and formatted to 2 decimal places.
 */

export type Currency = 'INR';

export type InvoiceStatus = 'draft' | 'confirmed' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  subscription_id: string | null;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  billing_period_start: string | null; // YYYY-MM-DD
  billing_period_end: string | null; // YYYY-MM-DD
  status: InvoiceStatus;
  currency: Currency;
  subtotal: number; // numeric(14,2)
  discount_total: number; // numeric(14,2)
  tax_total: number; // numeric(14,2)
  total: number; // numeric(14,2)
  amount_paid: number; // numeric(14,2)
  balance_due: number; // numeric(14,2)
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string | null;
  variant_id?: string | null;
description?: string;
  description_snapshot?: string;
  quantity: number; // numeric(12,3)
  unit_price: number; // numeric(14,2) in INR
  discount_amount: number; // numeric(14,2)
  taxable_amount?: number;
  tax_rate?: number;
  tax_rate_snapshot?: number; // numeric(7,4) e.g., 0.18 for 18% GST
  tax_amount: number; // numeric(14,2)
  line_total: number; // numeric(14,2)
}

export interface Tax {
  id: string;
  name: string; // e.g., "GST 18%"
  rate: number; // e.g., 0.18
  is_active: boolean;
  created_at: string;
}

export type DiscountType = 'fixed' | 'percentage';
export type DiscountScope = 'subscription' | 'product' | 'global';

export interface Discount {
  id: string;
  name: string;
  code?: string | null;
  discount_type: DiscountType;
  value: number; // Amount in INR or percentage 0-100
  minimum_purchase: number | null; // INR threshold
  minimum_quantity: number | null;
  starts_at: string | null; // ISO Date / timestamptz
  ends_at: string | null; // ISO Date / timestamptz
  usage_limit: number | null;
  usage_count: number;
  scope_type: DiscountScope;
  is_active: boolean;
  created_at: string;
}

export interface InvoiceDiscount {
  id: string;
  invoice_id: string;
  discount_id?: string;
  discount_name_snapshot: string;
  discount_type_snapshot: DiscountType;
  discount_value_snapshot: number;
  amount_applied: number; // INR
  created_at: string;
}

export type DiscountApplication = InvoiceDiscount;

export type PaymentMethod = 'bank_transfer' | 'upi' | 'credit_card' | 'cash' | 'other';

export interface Payment {
  id: string;
payment_reference?: string;
  payment_number?: string;
  reference?: string | null;
  invoice_id?: string | null;
  status?: string;
  customer_id: string;
  payment_method: PaymentMethod;
  amount: number; // INR, strictly positive
  payment_date: string; // ISO / YYYY-MM-DD
  note?: string | null;

  recorded_by: string; // profiles.id (Staff / Admin)
  created_at: string;
}

export interface PaymentAllocation {
  id: string;
  payment_id: string;
  invoice_id: string;
amount_allocated: number; // INR, strictly positive
  amount?: number;
  allocated_at?: string;
  created_at?: string;
}

/**
 * Result of recurring billing run execution.
 */
export interface BillingRunResult {
  run_id: string;
  execution_date: string;
  due_subscriptions_count: number;
  invoices_generated: string[]; // List of invoice IDs created
  invoices_skipped_existing: string[]; // List of subscriptions skipped because period invoice already exists
  errors: Array<{ subscription_id: string; error: string }>;
}

/**
 * Aggregated metrics for Admin/Finance Dashboard.
 */
export interface FinanceDashboardMetrics {
  currency: Currency;
  period_start?: string;
  period_end?: string;
  active_subscriptions_count: number;
  revenue_received: number; // Sum of recorded payments in INR
  invoiced_amount: number; // Sum of confirmed invoices in INR
  outstanding_amount: number; // Sum of unpaid confirmed invoice balances
  overdue_invoices_count: number;
  overdue_amount: number; // Sum of positive balances on invoices past due date
}
