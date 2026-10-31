/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Invoice Service: Invoice creation, snapshots, and lifecycle transitions
 * Document Reference: docs/04_Database_API_Contract.md (Section 7, 12.2)
 */

import {
  calculateInvoiceBalance,
  calculateInvoiceTotals,
  calculateLineTotal,
  roundTo2Decimals,
} from '@/lib/calculations/finance';
import {
  Discount,
  DiscountApplication,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  PaymentAllocation,
} from '@/types/finance';

export interface CreateInvoiceLineInput {
  productId?: string | null;
  variantId?: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  taxRate?: number; // e.g. 0.18
}

export interface CreateInvoiceInput {
  customerId: string;
  subscriptionId?: string | null;
  invoiceDate?: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  billingPeriodStart?: string | null;
  billingPeriodEnd?: string | null;
  lines: CreateInvoiceLineInput[];
  appliedDiscount?: {
    discount: Discount;
    discountAmount: number;
  } | null;
  notes?: string | null;
  initialStatus?: InvoiceStatus; // Default 'draft'
}

let invoiceCounter = 1000;

/**
 * Generates an internal sequential/random invoice number e.g. INV-2026-001001.
 */
export function generateInvoiceNumber(prefix: string = 'INV', year: number = 2026): string {
  invoiceCounter += 1;
  return `${prefix}-${year}-${invoiceCounter.toString().padStart(6, '0')}`;
}

/**
 * Core business function to create an invoice from subscription or quotation lines.
 * Strictly captures price and tax snapshots to preserve historical financial integrity.
 */
export function createInvoice(input: CreateInvoiceInput): {
  invoice: Invoice;
  lines: InvoiceLine[];
  discountApplication?: DiscountApplication;
} {
  const {
    customerId,
    subscriptionId = null,
    invoiceDate = new Date().toISOString().slice(0, 10),
    dueDate,
    billingPeriodStart = null,
    billingPeriodEnd = null,
    lines: lineInputs,
    appliedDiscount = null,
    notes = null,
    initialStatus = 'draft',
  } = input;

  if (!customerId) throw new Error('Customer ID is required');
  if (!dueDate) throw new Error('Due date is required');
  if (dueDate < invoiceDate) throw new Error('Due date cannot precede invoice date');
  if (!lineInputs || lineInputs.length === 0) throw new Error('Invoice must contain at least one line');

  const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const invoiceNumber = generateInvoiceNumber();

  // 1. Process line items and snapshots
  const calculatedLines: InvoiceLine[] = [];
  const linesForTotals = [];

  for (const item of lineInputs) {
    const calc = calculateLineTotal({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountAmount: item.discountAmount,
      taxRate: item.taxRate ?? 0.18,
    });

    linesForTotals.push({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountAmount: calc.discountAmount,
      taxRate: item.taxRate ?? 0.18,
    });

    calculatedLines.push({
      id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      invoice_id: invoiceId,
      product_id: item.productId ?? null,
      variant_id: item.variantId ?? null,
      description_snapshot: item.description,
      quantity: item.quantity,
      unit_price: roundTo2Decimals(item.unitPrice),
      discount_amount: calc.discountAmount,
      tax_rate_snapshot: item.taxRate ?? 0.18,
      tax_amount: calc.taxAmount,
      line_total: calc.lineTotal,
    });
  }

  // 2. Aggregate totals
  const invoiceLevelDiscount = appliedDiscount?.discountAmount ?? 0;
  const totals = calculateInvoiceTotals({
    lines: linesForTotals,
    invoiceDiscountAmount: invoiceLevelDiscount,
  });

  const now = new Date().toISOString();

  // 3. Assemble complete invoice record
  const invoice: Invoice = {
    id: invoiceId,
    invoice_number: invoiceNumber,
    customer_id: customerId,
    subscription_id: subscriptionId,
    invoice_date: invoiceDate,
    due_date: dueDate,
    billing_period_start: billingPeriodStart,
    billing_period_end: billingPeriodEnd,
    status: initialStatus,
    currency: 'INR',
    subtotal: totals.subtotal,
    discount_total: totals.discountTotal,
    tax_total: totals.taxTotal,
    total: totals.total,
    amount_paid: 0,
    balance_due: totals.total,
    notes,
    created_at: now,
    updated_at: now,
  };

  let discountApplication: DiscountApplication | undefined;
  if (appliedDiscount && appliedDiscount.discountAmount > 0) {
    discountApplication = {
      id: `disc_app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      discount_id: appliedDiscount.discount.id,
      invoice_id: invoiceId,
      discount_name_snapshot: appliedDiscount.discount.name,
      discount_type_snapshot: appliedDiscount.discount.discount_type,
      discount_value_snapshot: appliedDiscount.discount.value,
      amount_applied: appliedDiscount.discountAmount,
      created_at: now,
    };
  }

  return {
    invoice,
    lines: calculatedLines,
    discountApplication,
  };
}

/**
 * Validates and transitions invoice from Draft to Confirmed.
 */
export function transitionToConfirmed(invoice: Invoice): Invoice {
  if (invoice.status !== 'draft') {
    throw new Error(`Cannot confirm invoice with status: ${invoice.status}. Only draft invoices can be confirmed.`);
  }
  return {
    ...invoice,
    status: 'confirmed',
    updated_at: new Date().toISOString(),
  };
}

/**
 * Validates and transitions invoice to Cancelled.
 */
export function transitionToCancelled(invoice: Invoice, reason?: string): Invoice {
  if (invoice.status === 'paid') {
    throw new Error('Cannot cancel a fully settled/paid invoice.');
  }
  if (invoice.amount_paid > 0) {
    throw new Error('Cannot cancel an invoice with allocated payments. Reverse payments first.');
  }
  return {
    ...invoice,
    status: 'cancelled',
    notes: reason ? `${invoice.notes ? invoice.notes + '\n' : ''}Cancellation reason: ${reason}` : invoice.notes,
    balance_due: 0,
    updated_at: new Date().toISOString(),
  };
}
