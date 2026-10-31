/**
 * BrightLoop Subscription Management System
 * Domain Models and Common Application Types
 */

import {
  Currency,
  Customer,
  CustomerRow,
  Discount,
  Invoice,
  InvoiceLine,
  Plan,
  PlanFrequency,
  PlanRow,
  Product,
  ProductRow,
  ProductVariant,
  ProductVariantRow,
  Profile,
  Quotation,
  QuotationLine,
  QuotationLineRow,
  QuotationRow,
  Subscription,
  SubscriptionLine,
  SubscriptionLineRow,
  SubscriptionRow,
  UserRole,
} from './database';

export type { PlanFrequency };

export type QuotationDomainStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted';

export type SubscriptionDomainStatus =
  | 'draft'
  | 'quotation'
  | 'confirmed'
  | 'active'
  | 'closed';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  customerId: string | null;
}

export interface AuthSession {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ProductWithVariants extends ProductRow {
  variants: ProductVariantRow[];
}

export interface QuotationLineItem {
  id?: string;
  product_id?: string;
  variant_id?: string;
  plan_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_subtotal: number;
  line_tax: number;
  line_total: number;
}

export interface QuotationWithLines extends QuotationRow {
  customer?: CustomerRow;
  lines: QuotationLineRow[];
}

export interface QuotationWithDetails extends Quotation {
  customer: Customer;
  plan?: Plan;
  lines: QuotationLine[];
}

export interface SubscriptionWithDetails extends Subscription {
  customer?: Customer | CustomerRow;
  plan?: Plan | PlanRow;
  lines: SubscriptionLine[] | SubscriptionLineRow[];
}

export interface InvoiceWithDetails extends Invoice {
  customer: Customer;
  subscription?: Subscription | null;
  lines: InvoiceLine[];
}

export interface DashboardMetrics {
  currency: Currency;
  activeSubscriptionsCount: number;
  totalCustomersCount: number;
  revenueReceived: number;
  invoicedAmount: number;
  outstandingAmount: number;
  overdueInvoicesCount: number;
  overdueAmount: number;
}

// Lifecycle transition validation
export const ALLOWED_SUBSCRIPTION_TRANSITIONS: Record<
  SubscriptionDomainStatus,
  SubscriptionDomainStatus[]
> = {
  draft: ['quotation', 'closed'],
  quotation: ['confirmed', 'closed'],
  confirmed: ['active', 'closed'],
  active: ['closed'],
  closed: [], // Terminal status
};
