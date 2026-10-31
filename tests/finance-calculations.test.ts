/**
 * TypeScript Unit Tests: Finance Operations (Member 4)
 * Validates deterministic financial calculations for invoices, payments, and discounts.
 */

import {
  calculateInvoiceBalance,
  calculateInvoiceTotals,
  calculateLineTotal,
  evaluateDiscountEligibility,
  formatINR,
  generateBillingPeriodKey,
  isInvoiceOverdue,
  roundTo2Decimals,
} from '../src/lib/calculations/finance';
import { Discount } from '../src/types/finance';

describe('Finance Operations Calculations (Member 4)', () => {
  test('Line calculation with tax-exclusive GST (18%)', () => {
    const line = calculateLineTotal({ quantity: 2, unitPrice: 5000, taxRate: 0.18 });
    expect(line.lineSubtotal).toBe(10000);
    expect(line.taxAmount).toBe(1800);
    expect(line.lineTotal).toBe(11800);
  });

  test('Multi-line invoice totals calculation in INR', () => {
    const invoice = calculateInvoiceTotals({
      lines: [
        { quantity: 2, unitPrice: 2500, discountAmount: 500, taxRate: 0.18 },
        { quantity: 1, unitPrice: 3000, discountAmount: 0, taxRate: 0.18 },
      ],
    });
    expect(invoice.subtotal).toBe(8000);
    expect(invoice.discountTotal).toBe(500);
    expect(invoice.taxTotal).toBe(1350);
    expect(invoice.total).toBe(8850);
  });

  test('Invoice balance tracking and transition to paid', () => {
    const partial = calculateInvoiceBalance({
      invoiceTotal: 10000,
      allocations: [{ amount_allocated: 4000 }],
      currentStatus: 'confirmed',
    });
    expect(partial.amountPaid).toBe(4000);
    expect(partial.balanceDue).toBe(6000);
    expect(partial.newStatus).toBe('confirmed');

    const settled = calculateInvoiceBalance({
      invoiceTotal: 10000,
      allocations: [{ amount_allocated: 4000 }, { amount_allocated: 6000 }],
      currentStatus: 'confirmed',
    });
    expect(settled.amountPaid).toBe(10000);
    expect(settled.balanceDue).toBe(0);
    expect(settled.newStatus).toBe('paid');
  });

  test('Overdue detection requires past due date and positive balance', () => {
    expect(isInvoiceOverdue({ due_date: '2026-10-15', balance_due: 1500, status: 'confirmed' }, '2026-10-31')).toBe(true);
    expect(isInvoiceOverdue({ due_date: '2026-10-15', balance_due: 0, status: 'paid' }, '2026-10-31')).toBe(false);
    expect(isInvoiceOverdue({ due_date: '2026-11-15', balance_due: 1500, status: 'confirmed' }, '2026-10-31')).toBe(false);
  });

  test('Idempotency key format', () => {
    expect(generateBillingPeriodKey('sub-1', '2026-11-01', '2026-11-30')).toBe('sub-1:2026-11-01:2026-11-30');
  });

  test('INR formatting', () => {
    const formatted = formatINR(15000);
    expect(formatted).toContain('15,000');
  });
});
