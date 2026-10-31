/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/billing/run
 * Method: POST (trigger recurring billing execution)
 */

import { executeRecurringBillingRun } from '@/features/billing/billing-service';
import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { errorResponse, successResponse } from '@/lib/api-response';
import { store } from '@/lib/store';
import { NextResponse } from 'next/server';

async function handleRunBilling(payload: {
  subscriptions?: any[];
  asOfDate?: string;
  paymentTermsDays?: number;
}) {
  try {
    let subs = payload.subscriptions;
    if (!subs || subs.length === 0) {
      const activeSubs = store.getSubscriptions().filter((s) => s.status === 'active');
      subs = activeSubs.map((s) => ({
        id: s.id,
        subscription_number: s.subscription_number,
        customer_id: s.customer_id,
        status: s.status,
        next_billing_date: s.next_billing_date,
        plan: {
          id: s.plan?.id || 'plan_default',
          name: s.plan?.name || 'Standard Recurring Plan',
          frequency: (s.plan?.frequency as any) || 'monthly',
          price: s.plan?.price || 0,
        },
        lines: (s.lines || []).map((l) => ({
          product_id: l.product_id,
          variant_id: l.variant_id,
          description: l.description_snapshot,
          quantity: l.quantity,
          unit_price: l.unit_price,
          tax_rate: l.tax_rate_snapshot || 0.18,
        })),
      }));
    }

    const existingInvoices = await invoiceRepository.listInvoices();

    const billingRunOutput = executeRecurringBillingRun({
      subscriptions: subs,
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const res = await handleRunBilling(body);
    return NextResponse.json(res, { status: res.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
