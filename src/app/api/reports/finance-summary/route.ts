/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/reports/finance-summary
 * Method: GET (retrieve finance dashboard summary metrics)
 */

import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { paymentRepository } from '@/features/payments/payment-repository';
import { computeFinanceDashboardMetrics } from '@/features/reports/finance-reports-service';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleGetFinanceSummary(queryParams: {
  periodStart?: string;
  periodEnd?: string;
  asOfDate?: string;
  customerId?: string;
  activeSubscriptionsCount?: number;
}) {
  try {
    const invoices = await invoiceRepository.listInvoices();
    const payments = await paymentRepository.listPayments();

    const metrics = computeFinanceDashboardMetrics({
      invoices,
      payments,
      activeSubscriptionsCount: queryParams.activeSubscriptionsCount ?? 0,
      filter: {
        periodStart: queryParams.periodStart,
        periodEnd: queryParams.periodEnd,
        asOfDate: queryParams.asOfDate,
        customerId: queryParams.customerId,
      },
    });

    return successResponse(metrics, 'Finance summary retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to generate finance summary', 'INTERNAL_SERVER_ERROR');
  }
}
