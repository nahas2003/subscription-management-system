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

function seedInitialPayments() {
  const p1: Payment = {
    id: 'pay-001',
    payment_reference: 'PAY-2026-001',
    payment_number: 'PAY-2026-001',
    customer_id: 'cust-002',
    invoice_id: 'inv-002',
    amount: 35400,
    payment_method: 'bank_transfer',
    payment_date: '2026-10-12T16:00:00Z',
    reference: 'HDFC-NEFT-8839201',
    status: 'confirmed',
    recorded_by: 'finance_admin',
    created_at: '2026-10-12T16:00:00Z',
  };

  const p2: Payment = {
    id: 'pay-002',
    payment_reference: 'PAY-2026-002',
    payment_number: 'PAY-2026-002',
    customer_id: 'cust-003',
    invoice_id: 'inv-003',
    amount: 5000,
    payment_method: 'upi',
    payment_date: '2026-10-05T11:00:00Z',
    reference: 'UPI-RR-9048382',
    status: 'confirmed',
    recorded_by: 'finance_admin',
    created_at: '2026-10-05T11:00:00Z',
  };

  inMemoryPayments.set(p1.id, p1);
  inMemoryPayments.set(p2.id, p2);

  inMemoryAllocations.set('inv-002', [
    {
      id: 'alloc-001',
      payment_id: 'pay-001',
      invoice_id: 'inv-002',
      amount_allocated: 35400,
      amount: 35400,
      allocated_at: '2026-10-12T16:00:00Z',
    },
  ]);

  inMemoryAllocations.set('inv-003', [
    {
      id: 'alloc-002',
      payment_id: 'pay-002',
      invoice_id: 'inv-003',
      amount_allocated: 5000,
      amount: 5000,
      allocated_at: '2026-10-05T11:00:00Z',
    },
  ]);
}

seedInitialPayments();

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
