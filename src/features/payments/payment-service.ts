/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Payment Service: Manual payment recording, invoice allocation, & balance settlement
 * Document Reference: docs/04_Database_API_Contract.md (Sections 7.6, 9, 12.2)
 */

import { calculateInvoiceBalance, roundTo2Decimals } from '@/lib/calculations/finance';
import { Invoice, Payment, PaymentAllocation, PaymentMethod } from '@/types/finance';

export interface RecordPaymentInput {
  customerId: string;
  invoiceId: string;
  amount: number; // INR, strictly positive
  paymentMethod: PaymentMethod;
  paymentDate?: string; // ISO / YYYY-MM-DD
  note?: string | null;
  recordedBy: string; // Staff/Admin profile ID
}

let paymentCounter = 5000;

export function generatePaymentReference(prefix: string = 'PAY', year: number = 2026): string {
  paymentCounter += 1;
  return `${prefix}-${year}-${paymentCounter.toString().padStart(6, '0')}`;
}

/**
 * Records a manual payment and applies allocation to an invoice.
 * Validates amounts, customer match, balance limits, and resolves paid status.
 */
export function recordInvoicePayment(params: {
  input: RecordPaymentInput;
  invoice: Invoice;
  existingAllocations?: PaymentAllocation[];
}): {
  payment: Payment;
  allocation: PaymentAllocation;
  updatedInvoice: Invoice;
} {
  const { input, invoice, existingAllocations = [] } = params;

  if (input.amount <= 0) {
    throw new Error('Payment amount must be greater than zero.');
  }

  if (invoice.customer_id !== input.customerId) {
    throw new Error(
      `Customer mismatch: Payment customer (${input.customerId}) does not match invoice customer (${invoice.customer_id}).`
    );
  }

  if (invoice.status === 'draft') {
    throw new Error('Cannot record payment against a draft invoice. Please confirm the invoice first.');
  }

  if (invoice.status === 'cancelled') {
    throw new Error('Cannot record payment against a cancelled invoice.');
  }

  if (invoice.balance_due <= 0) {
    throw new Error(`Invoice ${invoice.invoice_number} is already fully paid.`);
  }

  const roundedPaymentAmount = roundTo2Decimals(input.amount);
  if (roundedPaymentAmount > invoice.balance_due) {
    throw new Error(
      `Payment amount (₹${roundedPaymentAmount}) exceeds outstanding invoice balance (₹${invoice.balance_due}). Overpayment is not permitted.`
    );
  }

  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const paymentRef = generatePaymentReference();
  const now = input.paymentDate || new Date().toISOString();

  // 1. Create Payment record
  const payment: Payment = {
    id: paymentId,
    payment_reference: paymentRef,
    customer_id: input.customerId,
    payment_method: input.paymentMethod,
    amount: roundedPaymentAmount,
    payment_date: now,
    note: input.note ?? null,
    recorded_by: input.recordedBy,
    created_at: now,
  };

  // 2. Create Payment Allocation record
  const allocation: PaymentAllocation = {
    id: `alloc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    payment_id: paymentId,
    invoice_id: invoice.id,
    amount_allocated: roundedPaymentAmount,
    created_at: now,
  };

  // 3. Recalculate invoice balance
  const allAllocations = [...existingAllocations, allocation];
  const balanceResult = calculateInvoiceBalance({
    invoiceTotal: invoice.total,
    allocations: allAllocations,
    currentStatus: invoice.status,
  });

  const updatedInvoice: Invoice = {
    ...invoice,
    amount_paid: balanceResult.amountPaid,
    balance_due: balanceResult.balanceDue,
    status: balanceResult.newStatus,
    updated_at: now,
  };

  return {
    payment,
    allocation,
    updatedInvoice,
  };
}

/**
 * Filters and returns all outstanding/unsettled invoices.
 */
export function getOutstandingInvoices(invoices: Invoice[], customerId?: string): Invoice[] {
  return invoices.filter((inv) => {
    if (customerId && inv.customer_id !== customerId) return false;
    return inv.status === 'confirmed' && inv.balance_due > 0;
  });
}
