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
