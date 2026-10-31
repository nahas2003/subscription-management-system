/**
 * BrightLoop Subscription Management System
 * Domain Models and Common Application Types
 */

import {
  Currency,
  Customer,
  Discount,
  Invoice,
  InvoiceLine,
  Plan,
  Product,
  ProductVariant,
  Profile,
  Quotation,
  QuotationLine,
  Subscription,
  SubscriptionLine,
  UserRole,
} from './database';

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

export interface QuotationWithDetails extends Quotation {
  customer: Customer;
  plan: Plan;
  lines: QuotationLine[];
}

export interface SubscriptionWithDetails extends Subscription {
  customer: Customer;
  plan: Plan;
  lines: SubscriptionLine[];
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
