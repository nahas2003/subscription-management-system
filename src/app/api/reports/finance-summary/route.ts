/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/reports/finance-summary
 * Method: GET (retrieve finance dashboard summary metrics)
 */

import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { paymentRepository } from '@/features/payments/payment-repository';
import { computeFinanceDashboardMetrics } from '@/features/reports/finance-reports-service';
import { errorResponse, successResponse } from '@/lib/api-response';
import { store } from '@/lib/store';
import { NextResponse } from 'next/server';

async function handleGetFinanceSummary(queryParams: {
  periodStart?: string;
  periodEnd?: string;
  asOfDate?: string;
  customerId?: string;
  activeSubscriptionsCount?: number;
}) {
  try {
    const invoices = await invoiceRepository.listInvoices();
    const payments = await paymentRepository.listPayments();

    const activeCount =
      queryParams.activeSubscriptionsCount ??
      store.getSubscriptions().filter((s) => s.status === 'active').length;

    const metrics = computeFinanceDashboardMetrics({
      invoices,
      payments,
      activeSubscriptionsCount: activeCount,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams = {
    periodStart: searchParams.get('periodStart') || undefined,
    periodEnd: searchParams.get('periodEnd') || undefined,
    asOfDate: searchParams.get('asOfDate') || undefined,
    customerId: searchParams.get('customerId') || undefined,
    activeSubscriptionsCount: searchParams.get('activeSubscriptionsCount')
      ? parseInt(searchParams.get('activeSubscriptionsCount')!, 10)
      : undefined,
  };
  const res = await handleGetFinanceSummary(queryParams);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}
