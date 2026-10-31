/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Deterministic Server-Side Financial Calculations
 * Document Reference: docs/04_Database_API_Contract.md (Sections 7.3, 7.4, 8, 9, 14)
 *
 * Rules:
 * - All monetary calculations strictly rounded to 2 decimal places in INR (₹).
 * - Tax-exclusive calculation model (standard 18% GST).
 * - No client-side floating point leakage.
 * - Idempotency key generation for duplicate billing prevention.
 */

import {
  Discount,
  DiscountApplication,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  PaymentAllocation,
} from '@/types/finance';

/**
 * Standard rounding to 2 decimal places for INR currency.
 */
export function roundTo2Decimals(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Generates deterministic idempotency key for recurring billing periods.
 * Format: `<subscription_id>:<billing_period_start>:<billing_period_end>`
 */
export function generateBillingPeriodKey(
  subscriptionId: string,
  periodStart: string,
  periodEnd: string
): string {
  return `${subscriptionId.trim()}:${periodStart.trim()}:${periodEnd.trim()}`;
}

/**
 * Calculates line totals: subtotal, discount, taxable amount, tax amount, and total.
 */
export function calculateLineTotal(params: {
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  taxRate?: number; // e.g. 0.18 for 18%
}): {
  lineSubtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  lineTotal: number;
} {
  const { quantity, unitPrice, discountAmount = 0, taxRate = 0.18 } = params;

  if (quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }
  if (unitPrice < 0) {
    throw new Error('Unit price cannot be negative');
  }

  const lineSubtotal = roundTo2Decimals(quantity * unitPrice);
  const validatedDiscount = Math.min(lineSubtotal, Math.max(0, roundTo2Decimals(discountAmount)));
  const taxableAmount = roundTo2Decimals(lineSubtotal - validatedDiscount);
  const taxAmount = roundTo2Decimals(taxableAmount * taxRate);
  const lineTotal = roundTo2Decimals(taxableAmount + taxAmount);

  return {
    lineSubtotal,
    discountAmount: validatedDiscount,
    taxableAmount,
    taxAmount,
    lineTotal,
  };
}

/**
 * Calculates complete invoice totals from line items and optional invoice-level discount.
 */
export function calculateInvoiceTotals(params: {
  lines: Array<{
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    taxRate?: number;
  }>;
  invoiceDiscountAmount?: number;
}): {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
} {
  const { lines, invoiceDiscountAmount = 0 } = params;

  let subtotal = 0;
  let linesDiscountTotal = 0;
  let taxTotal = 0;

  for (const line of lines) {
    const calculated = calculateLineTotal(line);
    subtotal = roundTo2Decimals(subtotal + calculated.lineSubtotal);
    linesDiscountTotal = roundTo2Decimals(linesDiscountTotal + calculated.discountAmount);
    taxTotal = roundTo2Decimals(taxTotal + calculated.taxAmount);
  }

  const discountTotal = roundTo2Decimals(linesDiscountTotal + Math.max(0, invoiceDiscountAmount));
  const rawTotal = roundTo2Decimals(subtotal - discountTotal + taxTotal);
  const total = Math.max(0, rawTotal);

  return {
    subtotal,
    discountTotal,
    taxTotal,
    total,
  };
}

/**
 * Calculates paid amount, balance due, and resolved status.
 */
export function calculateInvoiceBalance(params: {
  invoiceTotal: number;
  allocations: Array<{ amount_allocated?: number; amount?: number }>;
  currentStatus: InvoiceStatus;
}): {
  amountPaid: number;
  balanceDue: number;
  newStatus: InvoiceStatus;
} {
  const { invoiceTotal, allocations, currentStatus } = params;

  if (currentStatus === 'cancelled') {
    return {
      amountPaid: 0,
      balanceDue: 0,
      newStatus: 'cancelled',
    };
  }

  const amountPaid = roundTo2Decimals(
    allocations.reduce((sum, a) => sum + Math.max(0, (a.amount_allocated ?? a.amount ?? 0)), 0)
  );
  const balanceDue = roundTo2Decimals(Math.max(0, invoiceTotal - amountPaid));

  let newStatus: InvoiceStatus = currentStatus;
  if (balanceDue === 0 && amountPaid > 0) {
    newStatus = 'paid';
  } else if (currentStatus === 'paid' && balanceDue > 0) {
    newStatus = 'confirmed';
  }

  return {
    amountPaid,
    balanceDue,
    newStatus,
  };
}

/**
 * Determines whether an invoice is overdue as of a given business date.
 * Rule: Not cancelled, not draft, positive balance due, and due date < asOfDate.
 */
export function isInvoiceOverdue(
  invoice: Pick<Invoice, 'due_date' | 'balance_due' | 'status'>,
  asOfDate: string = new Date().toISOString().slice(0, 10)
): boolean {
  if (invoice.status === 'cancelled' || invoice.status === 'draft') {
    return false;
  }
  if (invoice.balance_due <= 0) {
    return false;
  }
  return invoice.due_date < asOfDate;
}

/**
 * Evaluates discount eligibility and calculates applicable discount amount.
 */
export function evaluateDiscountEligibility(params: {
  discount: Discount;
  subtotal: number;
  totalQuantity: number;
  asOfDate?: string;
}): {
  isEligible: boolean;
  ineligibilityReason?: string;
  calculatedDiscountAmount: number;
} {
  const { discount, subtotal, totalQuantity, asOfDate = new Date().toISOString() } = params;

  if (!discount.is_active) {
    return { isEligible: false, ineligibilityReason: 'Discount is inactive', calculatedDiscountAmount: 0 };
  }

  if (discount.starts_at && asOfDate < discount.starts_at) {
    return { isEligible: false, ineligibilityReason: 'Discount validity has not started', calculatedDiscountAmount: 0 };
  }

  if (discount.ends_at && asOfDate > discount.ends_at) {
    return { isEligible: false, ineligibilityReason: 'Discount has expired', calculatedDiscountAmount: 0 };
  }

  if (discount.usage_limit !== null && discount.usage_count >= discount.usage_limit) {
    return { isEligible: false, ineligibilityReason: 'Discount usage limit reached', calculatedDiscountAmount: 0 };
  }

  if (discount.minimum_purchase !== null && subtotal < discount.minimum_purchase) {
    return {
      isEligible: false,
      ineligibilityReason: `Minimum purchase of ₹${discount.minimum_purchase} required`,
      calculatedDiscountAmount: 0,
    };
  }

  if (discount.minimum_quantity !== null && totalQuantity < discount.minimum_quantity) {
    return {
      isEligible: false,
      ineligibilityReason: `Minimum quantity of ${discount.minimum_quantity} required`,
      calculatedDiscountAmount: 0,
    };
  }

  let calculatedDiscountAmount = 0;
  if (discount.discount_type === 'fixed') {
    calculatedDiscountAmount = Math.min(discount.value, subtotal);
  } else if (discount.discount_type === 'percentage') {
    const pct = Math.min(100, Math.max(0, discount.value));
    calculatedDiscountAmount = roundTo2Decimals(subtotal * (pct / 100));
  }

  return {
    isEligible: true,
    calculatedDiscountAmount: roundTo2Decimals(calculatedDiscountAmount),
  };
}

/**
 * Formats a numeric value to Indian Rupee (INR) display string.
 * Example: 15400.5 -> "₹15,400.50"
 */
export function formatINR(amount: number): string {
  const rounded = roundTo2Decimals(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}
