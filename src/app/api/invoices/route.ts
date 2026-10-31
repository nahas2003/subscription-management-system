/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/invoices
 * Methods: GET (list invoices), POST (create invoice)
 */

import { createInvoice } from '@/features/invoices/invoice-service';
import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleGetInvoices(queryParams: Record<string, string | undefined>) {
  try {
    const filters = {
      customerId: queryParams.customerId,
      subscriptionId: queryParams.subscriptionId,
      status: queryParams.status as any,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      isOverdueOnly: queryParams.isOverdueOnly === 'true',
    };

    const invoices = await invoiceRepository.listInvoices(filters);
    return successResponse(invoices, 'Invoices retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve invoices', 'INTERNAL_SERVER_ERROR');
  }
}

export async function handlePostInvoice(payload: any) {
  try {
    if (!payload.customerId) {
      return errorResponse('Customer ID is required', 'VALIDATION_ERROR', { customerId: 'Required' });
    }
    if (!payload.dueDate) {
      return errorResponse('Due date is required', 'VALIDATION_ERROR', { dueDate: 'Required' });
    }
    if (!payload.lines || !Array.isArray(payload.lines) || payload.lines.length === 0) {
      return errorResponse('At least one line item is required', 'VALIDATION_ERROR', { lines: 'Must have >= 1 line' });
    }

    const created = createInvoice({
      customerId: payload.customerId,
      subscriptionId: payload.subscriptionId,
      invoiceDate: payload.invoiceDate,
      dueDate: payload.dueDate,
      billingPeriodStart: payload.billingPeriodStart,
      billingPeriodEnd: payload.billingPeriodEnd,
      lines: payload.lines,
      appliedDiscount: payload.appliedDiscount,
      notes: payload.notes,
      initialStatus: payload.initialStatus || 'draft',
    });

    const saved = await invoiceRepository.saveInvoice(
      created.invoice,
      created.lines,
      created.discountApplication
    );

    return successResponse(saved, 'Invoice created successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create invoice', 'BAD_REQUEST');
  }
}
