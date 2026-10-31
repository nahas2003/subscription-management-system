// src/lib/store.ts
// In-memory persistent data store and domain logic for Member 3 Subscription Operations

import {
  CustomerRow,
  ProductRow,
  ProductVariantRow,
  PlanRow,
  QuotationRow,
  QuotationLineRow,
  SubscriptionRow,
  SubscriptionLineRow,
  SubscriptionEvent,
} from '@/types/database';

import {
  ProductWithVariants,
  QuotationWithLines,
  SubscriptionWithDetails,
  QuotationLineItem,
  QuotationStatus,
  SubscriptionStatus,
  ALLOWED_SUBSCRIPTION_TRANSITIONS,
} from '@/types/domain';

import {
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_VARIANTS,
  INITIAL_PLANS,
  INITIAL_QUOTATIONS,
  INITIAL_QUOTATION_LINES,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SUBSCRIPTION_LINES,
} from './mock-data';

class SubscriptionStore {
  private customers: CustomerRow[] = [...INITIAL_CUSTOMERS];
  private products: ProductRow[] = [...INITIAL_PRODUCTS];
  private variants: ProductVariantRow[] = [...INITIAL_VARIANTS];
  private plans: PlanRow[] = [...INITIAL_PLANS];
  private quotations: QuotationRow[] = [...INITIAL_QUOTATIONS];
  private quotationLines: QuotationLineRow[] = [...INITIAL_QUOTATION_LINES];
  private subscriptions: SubscriptionRow[] = [...INITIAL_SUBSCRIPTIONS];
  private subscriptionLines: SubscriptionLineRow[] = [...INITIAL_SUBSCRIPTION_LINES];
  private events: SubscriptionEvent[] = [
    {
      id: 'evt-01',
      subscription_id: 'sub-01',
      actor_name: 'Operations Staff',
      event_type: 'creation',
      from_status: null,
      to_status: 'draft',
      notes: 'Subscription draft generated from accepted quotation QUO-2026-0001',
      created_at: '2026-01-15T09:00:00Z',
    },
    {
      id: 'evt-02',
      subscription_id: 'sub-01',
      actor_name: 'Operations Staff',
      event_type: 'activation',
      from_status: 'confirmed',
      to_status: 'active',
      notes: 'Initial billing run processed and subscription activated',
      created_at: '2026-01-15T10:30:00Z',
    },
    {
      id: 'evt-03',
      subscription_id: 'sub-02',
      actor_name: 'System Admin',
      event_type: 'activation',
      from_status: 'confirmed',
      to_status: 'active',
      notes: 'Cloud SLA contract confirmed and activated',
      created_at: '2026-10-01T08:00:00Z',
    },
  ];

  // ===================== CUSTOMERS =====================
  getCustomers(): CustomerRow[] {
    return [...this.customers].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  getCustomerById(id: string): CustomerRow | undefined {
    return this.customers.find((c) => c.id === id);
  }

  createCustomer(data: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
  }): CustomerRow {
    const existing = this.customers.find((c) => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error(`Customer with email ${data.email} already exists.`);
    }

    const nextCodeNum = this.customers.length + 1;
    const customerCode = `CUST-${String(nextCodeNum).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newCustomer: CustomerRow = {
      id: `cust-${Date.now()}`,
      customer_code: customerCode,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  updateCustomer(id: string, data: Partial<CustomerRow>): CustomerRow {
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error(`Customer with ID ${id} not found.`);

    this.customers[idx] = {
      ...this.customers[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return this.customers[idx];
  }

  // ===================== PRODUCTS & VARIANTS =====================
  getProducts(): ProductWithVariants[] {
    return this.products.map((p) => ({
      ...p,
      variants: this.variants.filter((v) => v.product_id === p.id),
    }));
  }

  getProductById(id: string): ProductWithVariants | undefined {
    const prod = this.products.find((p) => p.id === id);
    if (!prod) return undefined;
    return {
      ...prod,
      variants: this.variants.filter((v) => v.product_id === prod.id),
    };
  }

  createProduct(
    productData: {
      name: string;
      product_type: string;
      sales_price: number;
      cost_price?: number | null;
      description?: string | null;
      notes?: string | null;
      is_active?: boolean;
    },
    variantsData: { name: string; price_adjustment: number }[] = []
  ): ProductWithVariants {
    if (productData.sales_price < 0) {
      throw new Error('Sales price must be non-negative.');
    }

    const now = new Date().toISOString();
    const productId = `prod-${Date.now()}`;

    const newProduct: ProductRow = {
      id: productId,
      name: productData.name,
      product_type: productData.product_type,
      sales_price: productData.sales_price,
      cost_price: productData.cost_price ?? null,
      description: productData.description || null,
      notes: productData.notes || null,
      is_active: productData.is_active ?? true,
      created_at: now,
      updated_at: now,
    };

    this.products.push(newProduct);

    const createdVariants: ProductVariantRow[] = variantsData.map((v, i) => {
      const variantRow: ProductVariantRow = {
        id: `var-${Date.now()}-${i}`,
        product_id: productId,
        name: v.name,
        price_adjustment: v.price_adjustment,
        is_active: true,
        created_at: now,
      };
      this.variants.push(variantRow);
      return variantRow;
    });

    return {
      ...newProduct,
      variants: createdVariants,
    };
  }

  // ===================== PLANS =====================
  getPlans(): PlanRow[] {
    return [...this.plans].sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  getPlanById(id: string): PlanRow | undefined {
    return this.plans.find((p) => p.id === id);
  }

  createPlan(data: {
    name: string;
    description?: string | null;
    price: number;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    minimum_quantity: number;
    available_from?: string | null;
    available_until?: string | null;
    auto_close?: boolean;
    allow_early_close?: boolean;
    allow_pause?: boolean;
    renewal_rule?: Record<string, any>;
  }): PlanRow {
    if (data.price < 0) throw new Error('Price cannot be negative.');
    if (data.minimum_quantity <= 0) throw new Error('Minimum quantity must be greater than zero.');

    const now = new Date().toISOString();
    const newPlan: PlanRow = {
      id: `plan-${Date.now()}`,
      name: data.name,
      description: data.description || null,
      price: data.price,
      frequency: data.frequency,
      minimum_quantity: data.minimum_quantity,
      available_from: data.available_from || null,
      available_until: data.available_until || null,
      auto_close: data.auto_close ?? false,
      allow_early_close: data.allow_early_close ?? false,
      allow_pause: data.allow_pause ?? false,
      renewal_rule: data.renewal_rule || { auto_renew: true },
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    this.plans.push(newPlan);
    return newPlan;
  }

  // ===================== QUOTATIONS =====================
  getQuotations(): QuotationWithLines[] {
    return this.quotations.map((q) => ({
      ...q,
      customer: this.customers.find((c) => c.id === q.customer_id),
      lines: this.quotationLines.filter((l) => l.quotation_id === q.id),
    }));
  }

  getQuotationById(id: string): QuotationWithLines | undefined {
    const q = this.quotations.find((item) => item.id === id);
    if (!q) return undefined;
    return {
      ...q,
      customer: this.customers.find((c) => c.id === q.customer_id),
      lines: this.quotationLines.filter((l) => l.quotation_id === q.id),
    };
  }

  createQuotation(data: {
    customer_id: string;
    valid_until?: string;
    notes?: string;
    lines: {
      product_id?: string;
      variant_id?: string;
      plan_id?: string;
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate?: number;
    }[];
  }): QuotationWithLines {
    if (!data.lines || data.lines.length === 0) {
      throw new Error('A quotation must have at least one line item.');
    }

    const quotationNumber = `QUO-2026-${String(this.quotations.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const today = now.split('T')[0];
    const quotationId = `quo-${Date.now()}`;
    const validUntil = data.valid_until || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    let subtotal = 0;
    let taxTotal = 0;

    const createdLines: QuotationLineRow[] = data.lines.map((item, idx) => {
      const taxRate = item.tax_rate !== undefined ? item.tax_rate : 0.18;
      const lineSubtotal = Math.round(item.quantity * item.unit_price * 100) / 100;
      const lineTax = Math.round(lineSubtotal * taxRate * 100) / 100;
      const lineTotal = Math.round((lineSubtotal + lineTax) * 100) / 100;

      subtotal += lineSubtotal;
      taxTotal += lineTax;

      const lineRow: QuotationLineRow = {
        id: `qline-${Date.now()}-${idx}`,
        quotation_id: quotationId,
        product_id: item.product_id || null,
        variant_id: item.variant_id || null,
        plan_id: item.plan_id || null,
        description_snapshot: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate_snapshot: taxRate,
        line_subtotal: lineSubtotal,
        line_tax: lineTax,
        line_total: lineTotal,
      };

      this.quotationLines.push(lineRow);
      return lineRow;
    });

    const total = Math.round((subtotal + taxTotal) * 100) / 100;

    const newQuotation: QuotationRow = {
      id: quotationId,
      quotation_number: quotationNumber,
      customer_id: data.customer_id,
      quotation_date: today,
      valid_until: validUntil,
      status: 'draft',
      subtotal: subtotal,
      discount_total: 0,
      tax_total: taxTotal,
      total: total,
      notes: data.notes || null,
      created_at: now,
      updated_at: now,
    };

    this.quotations.push(newQuotation);

    return {
      ...newQuotation,
      customer: this.customers.find((c) => c.id === data.customer_id),
      lines: createdLines,
    };
  }

  updateQuotationStatus(id: string, status: QuotationStatus): QuotationRow {
    const q = this.quotations.find((item) => item.id === id);
    if (!q) throw new Error(`Quotation ${id} not found.`);
    q.status = status;
    q.updated_at = new Date().toISOString();
    return q;
  }

  // ===================== CONVERT QUOTATION TO SUBSCRIPTION =====================
  convertQuotationToSubscription(quotationId: string, paymentTerms: string = 'Net 30'): SubscriptionWithDetails {
    const quotation = this.getQuotationById(quotationId);
    if (!quotation) throw new Error(`Quotation ${quotationId} not found.`);

    if (quotation.status === 'converted') {
      throw new Error(`Quotation ${quotation.quotation_number} has already been converted to a subscription.`);
    }

    const subNumber = `SUB-2026-${String(this.subscriptions.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const startDate = now.split('T')[0];

    // Compute next billing date (1 month default)
    const nextBill = new Date();
    nextBill.setMonth(nextBill.getMonth() + 1);
    const nextBillingDate = nextBill.toISOString().split('T')[0];

    const subId = `sub-${Date.now()}`;

    // Look for plan_id from quotation lines if available
    const primaryPlanId = quotation.lines.find((l) => l.plan_id)?.plan_id || null;

    const newSub: SubscriptionRow = {
      id: subId,
      subscription_number: subNumber,
      customer_id: quotation.customer_id,
      plan_id: primaryPlanId,
      quotation_id: quotation.id,
      start_date: startDate,
      expiry_date: null,
      next_billing_date: nextBillingDate,
      payment_terms: paymentTerms,
      status: 'confirmed', // Converts to Confirmed state
      is_paused: false,
      created_at: now,
      updated_at: now,
    };

    this.subscriptions.push(newSub);

    // Snapshot lines from quotation to subscription
    const createdLines: SubscriptionLineRow[] = quotation.lines.map((ql, idx) => {
      const subLine: SubscriptionLineRow = {
        id: `sline-${Date.now()}-${idx}`,
        subscription_id: subId,
        product_id: ql.product_id,
        variant_id: ql.variant_id,
        plan_id: ql.plan_id,
        description_snapshot: ql.description_snapshot,
        quantity: ql.quantity,
        unit_price: ql.unit_price,
        tax_rate_snapshot: ql.tax_rate_snapshot,
        line_total: ql.line_total,
      };
      this.subscriptionLines.push(subLine);
      return subLine;
    });

    // Mark quotation converted
    quotation.status = 'converted';
    quotation.updated_at = now;

    // Log lifecycle event
    this.events.unshift({
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      subscription_id: subId,
      actor_name: 'Operations Staff',
      event_type: 'quotation_converted',
      from_status: 'quotation',
      to_status: 'confirmed',
      notes: `Converted from accepted quotation ${quotation.quotation_number}`,
      created_at: now,
    });

    return {
      ...newSub,
      customer: this.customers.find((c) => c.id === newSub.customer_id),
      plan: primaryPlanId ? this.plans.find((p) => p.id === primaryPlanId) : undefined,
      lines: createdLines,
    };
  }

  // ===================== SUBSCRIPTIONS & LIFECYCLE =====================
  getSubscriptions(): SubscriptionWithDetails[] {
    return this.subscriptions.map((s) => ({
      ...s,
      customer: this.customers.find((c) => c.id === s.customer_id),
      plan: s.plan_id ? this.plans.find((p) => p.id === s.plan_id) : undefined,
      lines: this.subscriptionLines.filter((l) => l.subscription_id === s.id),
    }));
  }

  getSubscriptionById(id: string): SubscriptionWithDetails | undefined {
    const s = this.subscriptions.find(
      (item) =>
        item.id === id ||
        item.id === id.replace('sub-0', 'sub-00') ||
        item.id === id.replace('sub-00', 'sub-0') ||
        item.subscription_number.toLowerCase() === id.toLowerCase() ||
        item.subscription_number.replace('-0', '-00').toLowerCase() === id.toLowerCase() ||
        item.subscription_number.replace('-00', '-0').toLowerCase() === id.toLowerCase()
    );
    if (!s) return undefined;
    return {
      ...s,
      customer: this.customers.find((c) => c.id === s.customer_id),
      plan: s.plan_id ? this.plans.find((p) => p.id === s.plan_id) : undefined,
      lines: this.subscriptionLines.filter((l) => l.subscription_id === s.id),
    };
  }

  transitionSubscriptionStatus(
    id: string,
    newStatus: SubscriptionStatus,
    notes?: string
  ): { success: boolean; subscription?: SubscriptionWithDetails; error?: string } {
    const sub = this.subscriptions.find((s) => s.id === id);
    if (!sub) return { success: false, error: `Subscription ${id} not found.` };

    const allowed = ALLOWED_SUBSCRIPTION_TRANSITIONS[sub.status];
    if (!allowed.includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition from "${sub.status}" to "${newStatus}". Allowed transitions: ${allowed.join(', ') || 'none (terminal state)'}.`,
      };
    }

    const oldStatus = sub.status;
    sub.status = newStatus;
    sub.updated_at = new Date().toISOString();

    // Log lifecycle event
    this.events.unshift({
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      subscription_id: id,
      actor_name: 'Operations Staff',
      event_type: 'status_transition',
      from_status: oldStatus,
      to_status: newStatus,
      notes: notes || `Transitioned status from ${oldStatus} to ${newStatus}`,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      subscription: this.getSubscriptionById(id),
    };
  }

  togglePauseSubscription(id: string): { success: boolean; is_paused?: boolean; error?: string } {
    const sub = this.subscriptions.find((s) => s.id === id);
    if (!sub) return { success: false, error: `Subscription ${id} not found.` };

    if (sub.status !== 'active') {
      return { success: false, error: 'Only Active subscriptions can be paused or resumed.' };
    }

    sub.is_paused = !sub.is_paused;
    sub.updated_at = new Date().toISOString();

    this.events.unshift({
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      subscription_id: id,
      actor_name: 'Operations Staff',
      event_type: sub.is_paused ? 'paused' : 'resumed',
      from_status: 'active',
      to_status: sub.is_paused ? 'paused' : 'active',
      notes: sub.is_paused ? 'Subscription service paused temporarily' : 'Subscription service resumed',
      created_at: new Date().toISOString(),
    });

    return { success: true, is_paused: sub.is_paused };
  }

  getSubscriptionEvents(subscriptionId: string): SubscriptionEvent[] {
    const sub = this.getSubscriptionById(subscriptionId);
    const targetId = sub?.id || subscriptionId;
    return this.events.filter(
      (e) =>
        e.subscription_id === targetId ||
        e.subscription_id === subscriptionId ||
        e.subscription_id === subscriptionId.replace('sub-0', 'sub-00') ||
        e.subscription_id === subscriptionId.replace('sub-00', 'sub-0')
    );
  }
}

// Global singleton instance for local dev & prototype persistence
export const store = new SubscriptionStore();
