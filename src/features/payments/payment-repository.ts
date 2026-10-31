/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Payment Repository: Data access layer for Payments and Payment Allocations
 */

import { Invoice, Payment, PaymentAllocation } from '@/types/finance';
import { invoiceRepository } from '../invoices/invoice-repository';

export interface PaymentFilter {
  customerId?: string;
  invoiceId?: string;
  startDate?: string;
  endDate?: string;
}

let inMemoryPayments: Map<string, Payment> = new Map();
let inMemoryAllocations: Map<string, PaymentAllocation[]> = new Map();

export const paymentRepository = {
  reset() {
    inMemoryPayments.clear();
    inMemoryAllocations.clear();
  },

  async listPayments(filter: PaymentFilter = {}): Promise<Payment[]> {
    let results = Array.from(inMemoryPayments.values());

    if (filter.customerId) {
      results = results.filter((p) => p.customer_id === filter.customerId);
    }
    if (filter.startDate) {
      results = results.filter((p) => p.payment_date.slice(0, 10) >= filter.startDate!);
    }
    if (filter.endDate) {
      results = results.filter((p) => p.payment_date.slice(0, 10) <= filter.endDate!);
    }

    return results.sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  },

  async getAllocationsForInvoice(invoiceId: string): Promise<PaymentAllocation[]> {
    return inMemoryAllocations.get(invoiceId) || [];
  },

  /**
   * Atomically records a payment, its allocation, and updates the invoice balance.
   */
  async savePaymentAndAllocation(params: {
    payment: Payment;
    allocation: PaymentAllocation;
    updatedInvoice: Invoice;
  }): Promise<{ payment: Payment; allocation: PaymentAllocation; updatedInvoice: Invoice }> {
    const { payment, allocation, updatedInvoice } = params;

    // 1. Store payment
    inMemoryPayments.set(payment.id, payment);

    // 2. Store allocation
    const existing = inMemoryAllocations.get(allocation.invoice_id) || [];
    inMemoryAllocations.set(allocation.invoice_id, [...existing, allocation]);

    // 3. Update invoice balance and status
    await invoiceRepository.updateInvoice(updatedInvoice);

    return {
      payment,
      allocation,
      updatedInvoice,
    };
  },
};
