// src/types/domain.ts
// Domain models and business logic types for Subscription Operations (Member 3)

import {
  CustomerRow,
  ProductRow,
  ProductVariantRow,
  PlanRow,
  QuotationRow,
  QuotationLineRow,
  SubscriptionRow,
  SubscriptionLineRow,
} from './database';

export type PlanFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted';

export type SubscriptionStatus =
  | 'draft'
  | 'quotation'
  | 'confirmed'
  | 'active'
  | 'closed';

// Extended domain models with relations
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
  tax_rate: number; // e.g. 0.10 for 10%
  line_subtotal: number;
  line_tax: number;
  line_total: number;
}

export interface QuotationWithLines extends QuotationRow {
  customer?: CustomerRow;
  lines: QuotationLineRow[];
}

export interface SubscriptionWithDetails extends SubscriptionRow {
  customer?: CustomerRow;
  plan?: PlanRow;
  lines: SubscriptionLineRow[];
}

// Lifecycle transition validation
export const ALLOWED_SUBSCRIPTION_TRANSITIONS: Record<
  SubscriptionStatus,
  SubscriptionStatus[]
> = {
  draft: ['quotation', 'closed'],
  quotation: ['confirmed', 'closed'],
  confirmed: ['active', 'closed'],
  active: ['closed'],
  closed: [], // Terminal status
};
