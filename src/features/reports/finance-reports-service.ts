/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Finance Reports Service: Aggregates dashboard metrics, revenue, outstanding, and overdue tracking
 * Document Reference: docs/01_Master_Project_Brief.md (Section 8), docs/04_Database_API_Contract.md (Section 14.1)
 */

import { isInvoiceOverdue, roundTo2Decimals } from '@/lib/calculations/finance';
import { FinanceDashboardMetrics, Invoice, Payment } from '@/types/finance';

export interface FinanceSummaryFilter {
  periodStart?: string; // YYYY-MM-DD
  periodEnd?: string; // YYYY-MM-DD
  asOfDate?: string; // YYYY-MM-DD, defaults to current date
  customerId?: string;
}

/**
 * Computes reconciled financial dashboard metrics.
 * Strictly separates Collections (Revenue Received) from Invoiced Totals.
 */
export function computeFinanceDashboardMetrics(params: {
  invoices: Invoice[];
  payments: Payment[];
  activeSubscriptionsCount: number;
  filter?: FinanceSummaryFilter;
}): FinanceDashboardMetrics {
  const { invoices, payments, activeSubscriptionsCount, filter = {} } = params;
  const {
    periodStart,
    periodEnd,
    asOfDate = new Date().toISOString().slice(0, 10),
    customerId,
  } = filter;

  // 1. Filter payments for Revenue Received (Collections in selected period)
  let periodPayments = payments;
  if (customerId) {
    periodPayments = periodPayments.filter((p) => p.customer_id === customerId);
  }
  if (periodStart) {
    periodPayments = periodPayments.filter((p) => p.payment_date.slice(0, 10) >= periodStart);
  }
  if (periodEnd) {
    periodPayments = periodPayments.filter((p) => p.payment_date.slice(0, 10) <= periodEnd);
  }

  const revenueReceived = roundTo2Decimals(
    periodPayments.reduce((sum, p) => sum + p.amount, 0)
  );

  // 2. Filter invoices
  let eligibleInvoices = invoices;
  if (customerId) {
    eligibleInvoices = eligibleInvoices.filter((inv) => inv.customer_id === customerId);
  }

  let periodInvoices = eligibleInvoices;
  if (periodStart) {
    periodInvoices = periodInvoices.filter((inv) => inv.invoice_date >= periodStart);
  }
  if (periodEnd) {
    periodInvoices = periodInvoices.filter((inv) => inv.invoice_date <= periodEnd);
  }

  // Invoiced amount: confirmed, paid, or draft invoices issued in period (excluding cancelled)
  const invoicedAmount = roundTo2Decimals(
    periodInvoices
      .filter((inv) => inv.status !== 'cancelled')
      .reduce((sum, inv) => sum + inv.total, 0)
  );

  // Outstanding amount: sum of positive unpaid balances on all confirmed invoices (excluding cancelled)
  const outstandingAmount = roundTo2Decimals(
    eligibleInvoices
      .filter((inv) => inv.status === 'confirmed' && inv.balance_due > 0)
      .reduce((sum, inv) => sum + inv.balance_due, 0)
  );

  // Overdue invoices: confirmed invoices whose due_date < asOfDate with balance > 0
  const overdueInvoices = eligibleInvoices.filter((inv) => isInvoiceOverdue(inv, asOfDate));
  const overdueInvoicesCount = overdueInvoices.length;
  const overdueAmount = roundTo2Decimals(
    overdueInvoices.reduce((sum, inv) => sum + inv.balance_due, 0)
  );

  return {
    currency: 'INR',
    period_start: periodStart,
    period_end: periodEnd,
    active_subscriptions_count: activeSubscriptionsCount,
    revenue_received: revenueReceived,
    invoiced_amount: invoicedAmount,
    outstanding_amount: outstandingAmount,
    overdue_invoices_count: overdueInvoicesCount,
    overdue_amount: overdueAmount,
  };
}
