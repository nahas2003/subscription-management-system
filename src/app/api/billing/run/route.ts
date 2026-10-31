/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/billing/run
 * Method: POST (trigger recurring billing execution)
 */

import { executeRecurringBillingRun } from '@/features/billing/billing-service';
import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleRunBilling(payload: {
  subscriptions: any[];
  asOfDate?: string;
  paymentTermsDays?: number;
}) {
  try {
    if (!payload.subscriptions || !Array.isArray(payload.subscriptions)) {
      return errorResponse('Subscriptions array is required', 'VALIDATION_ERROR', { subscriptions: 'Must be array' });
    }

    const existingInvoices = await invoiceRepository.listInvoices();

    const billingRunOutput = executeRecurringBillingRun({
      subscriptions: payload.subscriptions,
      existingInvoices,
      asOfDate: payload.asOfDate,
      paymentTermsDays: payload.paymentTermsDays,
    });

    // Save newly generated invoices into repository
    for (const inv of billingRunOutput.newInvoices) {
      const lines = billingRunOutput.newInvoiceLines.filter((l) => l.invoice_id === inv.id);
      await invoiceRepository.saveInvoice(inv, lines);
    }

    return successResponse(
      {
        summary: billingRunOutput.result,
        updatedSubscriptions: billingRunOutput.updatedSubscriptions,
      },
      'Billing run completed successfully'
    );
  } catch (err: any) {
    return errorResponse(err.message || 'Billing run failed', 'INTERNAL_SERVER_ERROR');
  }
}
