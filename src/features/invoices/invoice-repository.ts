/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Invoice Repository: Data access layer for Invoices and Invoice Lines
 */

import { DiscountApplication, Invoice, InvoiceLine, PaymentAllocation } from '@/types/finance';

export interface InvoiceFilter {
  customerId?: string;
  subscriptionId?: string;
  status?: Invoice['status'];
  startDate?: string;
  endDate?: string;
  isOverdueOnly?: boolean;
}

export interface InvoiceWithDetails extends Invoice {
  lines: InvoiceLine[];
  applied_discount?: DiscountApplication;
  allocations: PaymentAllocation[];
}

// In-memory data store for standalone testing and development
let inMemoryInvoices: Map<string, Invoice> = new Map();
let inMemoryLines: Map<string, InvoiceLine[]> = new Map();
let inMemoryDiscountApps: Map<string, DiscountApplication> = new Map();

function seedInitialData() {
  const initialInvoices: Invoice[] = [
    {
      id: 'inv-001',
      invoice_number: 'INV-2026-001',
      customer_id: 'cust-001',
      subscription_id: 'sub-001',
      invoice_date: '2026-10-15',
      due_date: '2026-11-15',
      billing_period_start: '2026-10-01',
      billing_period_end: '2026-10-31',
      currency: 'INR',
      subtotal: 15000,
      discount_total: 0,
      tax_total: 2700,
      total: 17700,
      amount_paid: 0,
      balance_due: 17700,
      status: 'confirmed',
      notes: 'QMS Standard Subscription - Monthly cycle',
      created_at: '2026-10-15T10:00:00Z',
      updated_at: '2026-10-15T10:00:00Z',
    },
    {
      id: 'inv-002',
      invoice_number: 'INV-2026-002',
      customer_id: 'cust-002',
      subscription_id: 'sub-002',
      invoice_date: '2026-10-10',
      due_date: '2026-10-25',
      billing_period_start: '2026-10-10',
      billing_period_end: '2026-11-09',
      currency: 'INR',
      subtotal: 30000,
      discount_total: 0,
      tax_total: 5400,
      total: 35400,
      amount_paid: 35400,
      balance_due: 0,
      status: 'paid',
      notes: 'Event Pro Platform - Full settlement',
      created_at: '2026-10-10T14:00:00Z',
      updated_at: '2026-10-12T16:00:00Z',
    },
    {
      id: 'inv-003',
      invoice_number: 'INV-2026-003',
      customer_id: 'cust-003',
      subscription_id: null,
      invoice_date: '2026-10-01',
      due_date: '2026-10-15',
      billing_period_start: null,
      billing_period_end: null,
      currency: 'INR',
      subtotal: 20000,
      discount_total: 0,
      tax_total: 3600,
      total: 23600,
      amount_paid: 5000,
      balance_due: 18600,
      status: 'confirmed',
      notes: 'Custom Delivery Platform Setup (Past Due)',
      created_at: '2026-10-01T09:00:00Z',
      updated_at: '2026-10-05T11:00:00Z',
    },
  ];

  for (const inv of initialInvoices) {
    inMemoryInvoices.set(inv.id, inv);
  }

  inMemoryLines.set('inv-001', [
    {
      id: 'inline-001',
      invoice_id: 'inv-001',
      product_id: 'prod-001',
      variant_id: 'var-002',
      description_snapshot: 'Quality Management System (QMS) - Odoo Brand Co-Edition',
      description: 'Quality Management System (QMS) - Odoo Brand Co-Edition',
      quantity: 1,
      unit_price: 15000,
      discount_amount: 0,
      taxable_amount: 15000,
      tax_rate_snapshot: 0.18,
      tax_rate: 0.18,
      tax_amount: 2700,
      line_total: 17700,
    },
  ]);

  inMemoryLines.set('inv-002', [
    {
      id: 'inline-002',
      invoice_id: 'inv-002',
      product_id: 'prod-002',
      variant_id: 'var-003',
      description_snapshot: 'Event Management System - Standard Cloud Edition',
      description: 'Event Management System - Standard Cloud Edition',
      quantity: 1,
      unit_price: 30000,
      discount_amount: 0,
      taxable_amount: 30000,
      tax_rate_snapshot: 0.18,
      tax_rate: 0.18,
      tax_amount: 5400,
      line_total: 35400,
    },
  ]);

  inMemoryLines.set('inv-003', [
    {
      id: 'inline-003',
      invoice_id: 'inv-003',
      product_id: 'prod-003',
      variant_id: 'var-004',
      description_snapshot: 'Food Delivery Ecosystem Setup & Regional Dispatch',
      description: 'Food Delivery Ecosystem Setup & Regional Dispatch',
      quantity: 1,
      unit_price: 20000,
      discount_amount: 0,
      taxable_amount: 20000,
      tax_rate_snapshot: 0.18,
      tax_rate: 0.18,
      tax_amount: 3600,
      line_total: 23600,
    },
  ]);
}

// Seed on startup
seedInitialData();

export const invoiceRepository = {
  /**
   * Clears in-memory cache (used primarily for test isolation).
   */
  reset() {
    inMemoryInvoices.clear();
    inMemoryLines.clear();
    inMemoryDiscountApps.clear();
  },

  /**
   * Retrieves invoices matching filters with optional pagination.
   */
  async listInvoices(filter: InvoiceFilter = {}): Promise<Invoice[]> {
    let results = Array.from(inMemoryInvoices.values());

    if (filter.customerId) {
      results = results.filter((i) => i.customer_id === filter.customerId);
    }
    if (filter.subscriptionId) {
      results = results.filter((i) => i.subscription_id === filter.subscriptionId);
    }
    if (filter.status) {
      results = results.filter((i) => i.status === filter.status);
    }
    if (filter.startDate) {
      results = results.filter((i) => i.invoice_date >= filter.startDate!);
    }
    if (filter.endDate) {
      results = results.filter((i) => i.invoice_date <= filter.endDate!);
    }
    if (filter.isOverdueOnly) {
      const today = new Date().toISOString().slice(0, 10);
      results = results.filter(
        (i) => i.status === 'confirmed' && i.balance_due > 0 && i.due_date < today
      );
    }

    // Sort descending by invoice_date
    return results.sort((a, b) => b.invoice_date.localeCompare(a.invoice_date));
  },

  /**
   * Retrieves single invoice by ID with lines and discount application.
   */
  async getInvoiceById(id: string): Promise<InvoiceWithDetails | null> {
    const invoice = inMemoryInvoices.get(id);
    if (!invoice) return null;

    const lines = inMemoryLines.get(id) || [];
    const applied_discount = inMemoryDiscountApps.get(id);

    return {
      ...invoice,
      lines,
      applied_discount,
      allocations: [],
    };
  },

  /**
   * Saves an invoice and its line items.
   */
  async saveInvoice(
    invoice: Invoice,
    lines: InvoiceLine[],
    discountApplication?: DiscountApplication
  ): Promise<InvoiceWithDetails> {
    inMemoryInvoices.set(invoice.id, invoice);
    inMemoryLines.set(invoice.id, lines);
    if (discountApplication) {
      inMemoryDiscountApps.set(invoice.id, discountApplication);
    }

    return {
      ...invoice,
      lines,
      applied_discount: discountApplication,
      allocations: [],
    };
  },

  /**
   * Updates an existing invoice record (e.g. balance, status).
   */
  async updateInvoice(invoice: Invoice): Promise<Invoice> {
    if (!inMemoryInvoices.has(invoice.id)) {
      throw new Error(`Invoice with ID ${invoice.id} not found.`);
    }
    inMemoryInvoices.set(invoice.id, invoice);
    return invoice;
  },
};
