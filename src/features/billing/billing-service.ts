/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Recurring Billing Engine: Idempotent billing run, duplicate protection, & date advancement
 * Document Reference: docs/04_Database_API_Contract.md (Sections 7.3, 7.5, 12.2)
 */

import { createInvoice } from '@/features/invoices/invoice-service';
import { generateBillingPeriodKey } from '@/lib/calculations/finance';
import { BillingRunResult, Invoice, InvoiceLine } from '@/types/finance';

export type PlanFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface BillableSubscription {
  id: string;
  subscription_number: string;
  customer_id: string;
  status: 'draft' | 'quotation' | 'confirmed' | 'active' | 'closed';
  next_billing_date: string; // YYYY-MM-DD
  plan: {
    id: string;
    name: string;
    frequency: PlanFrequency;
    price: number;
  };
  lines: Array<{
    product_id?: string | null;
    variant_id?: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate?: number;
  }>;
}

/**
 * Calculates the next billing date based on the plan's frequency.
 */
export function advanceBillingDate(dateStr: string, frequency: PlanFrequency): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  switch (frequency) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unsupported plan frequency: ${frequency}`);
  }

  return d.toISOString().slice(0, 10);
}

/**
 * Calculates billing period start and end dates from the next billing date.
 * Example for monthly from 2026-11-01 -> Start: 2026-11-01, End: 2026-11-30.
 */
export function calculateBillingPeriod(
  periodStartStr: string,
  frequency: PlanFrequency
): { periodStart: string; periodEnd: string } {
  const nextDate = advanceBillingDate(periodStartStr, frequency);
  const endDateObj = new Date(nextDate);
  endDateObj.setDate(endDateObj.getDate() - 1); // Last day of period

  return {
    periodStart: periodStartStr,
    periodEnd: endDateObj.toISOString().slice(0, 10),
  };
}

/**
 * Executes a deterministic, idempotent recurring billing run.
 * Guaranteed to never generate duplicate invoices for the same subscription period.
 */
export function executeRecurringBillingRun(params: {
  subscriptions: BillableSubscription[];
  existingInvoices: Pick<Invoice, 'subscription_id' | 'billing_period_start' | 'billing_period_end'>[];
  asOfDate?: string; // Business date, defaults to current date YYYY-MM-DD
  paymentTermsDays?: number; // Days to due date, default 15
}): {
  result: BillingRunResult;
  newInvoices: Invoice[];
  newInvoiceLines: InvoiceLine[];
  updatedSubscriptions: Array<{ id: string; next_billing_date: string }>;
} {
  const {
    subscriptions,
    existingInvoices,
    asOfDate = new Date().toISOString().slice(0, 10),
    paymentTermsDays = 15,
  } = params;

  const runId = `run_${Date.now()}`;
  const generatedInvoiceIds: string[] = [];
  const skippedSubscriptionIds: string[] = [];
  const errors: Array<{ subscription_id: string; error: string }> = [];

  const newInvoices: Invoice[] = [];
  const newInvoiceLines: InvoiceLine[] = [];
  const updatedSubscriptions: Array<{ id: string; next_billing_date: string }> = [];

  // Build index of already invoiced periods
  const existingPeriodKeys = new Set<string>();
  for (const inv of existingInvoices) {
    if (inv.subscription_id && inv.billing_period_start && inv.billing_period_end) {
      existingPeriodKeys.add(
        generateBillingPeriodKey(inv.subscription_id, inv.billing_period_start, inv.billing_period_end)
      );
    }
  }

  // Filter subscriptions eligible for billing: Active and next_billing_date <= asOfDate
  const dueSubscriptions = subscriptions.filter(
    (sub) => sub.status === 'active' && sub.next_billing_date <= asOfDate
  );

  for (const sub of dueSubscriptions) {
    try {
      const { periodStart, periodEnd } = calculateBillingPeriod(sub.next_billing_date, sub.plan.frequency);
      const periodKey = generateBillingPeriodKey(sub.id, periodStart, periodEnd);

      // IDEMPOTENCY CHECK:
      if (existingPeriodKeys.has(periodKey)) {
        skippedSubscriptionIds.push(sub.id);
        continue;
      }

      // Calculate invoice due date
      const dueDateObj = new Date(periodStart);
      dueDateObj.setDate(dueDateObj.getDate() + paymentTermsDays);
      const dueDate = dueDateObj.toISOString().slice(0, 10);

      // Generate invoice
      const created = createInvoice({
        customerId: sub.customer_id,
        subscriptionId: sub.id,
        invoiceDate: periodStart,
        dueDate,
        billingPeriodStart: periodStart,
        billingPeriodEnd: periodEnd,
        lines: sub.lines.map((l) => ({
          productId: l.product_id,
          variantId: l.variant_id,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unit_price,
          taxRate: l.tax_rate ?? 0.18,
        })),
        notes: `Recurring billing for subscription ${sub.subscription_number} (${sub.plan.name})`,
        initialStatus: 'confirmed', // Recurring invoices are issued in confirmed status awaiting payment
      });

      newInvoices.push(created.invoice);
      newInvoiceLines.push(...created.lines);
      generatedInvoiceIds.push(created.invoice.id);
      existingPeriodKeys.add(periodKey); // Track in-flight

      // Advance next billing date
      const nextDate = advanceBillingDate(sub.next_billing_date, sub.plan.frequency);
      updatedSubscriptions.push({
        id: sub.id,
        next_billing_date: nextDate,
      });
    } catch (err: any) {
      errors.push({
        subscription_id: sub.id,
        error: err.message || 'Unknown billing error',
      });
    }
  }

  return {
    result: {
      run_id: runId,
      execution_date: asOfDate,
      due_subscriptions_count: dueSubscriptions.length,
      invoices_generated: generatedInvoiceIds,
      invoices_skipped_existing: skippedSubscriptionIds,
      errors,
    },
    newInvoices,
    newInvoiceLines,
    updatedSubscriptions,
  };
}
