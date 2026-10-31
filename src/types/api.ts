/**
 * BrightLoop Subscription Management System
 * API Request & Response Contracts
 * Reference: docs/04_Database_API_Contract.md Section 13
 */

import { Customer, Invoice, Payment, Plan, Product, Quotation, Subscription, UserRole } from './database';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface RegisterCustomerPayload {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  billingAddress?: string;
}

export interface CreateStaffPayload {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  product_type: 'storable' | 'service' | 'subscription';
  sales_price: number;
  cost_price: number;
}

export interface CreatePlanPayload {
  name: string;
  code: string;
  billing_interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval_count: number;
  trial_period_days?: number;
  min_quantity?: number;
  auto_renew?: boolean;
}

export interface CreateQuotationPayload {
  customer_id: string;
  plan_id: string;
  valid_until?: string;
  notes?: string;
  lines: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: number;
    discount_amount?: number;
    tax_rate?: number;
  }>;
}

export interface RecordPaymentPayload {
  invoice_id: string;
  customer_id: string;
  amount: number;
  payment_method: 'bank_transfer' | 'upi' | 'credit_card' | 'cash' | 'other';
  note?: string;
}

export interface BillingRunResult {
  run_id: string;
  execution_date: string;
  due_subscriptions_count: number;
  invoices_generated: string[];
  invoices_skipped_existing: string[];
  errors: Array<{ subscription_id: string; error: string }>;
}
