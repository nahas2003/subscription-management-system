/**
 * BrightLoop Subscription Management System
 * Customer Portal API: /api/customer/invoices
 * Security: Strict customer record isolation (Document 01 & 04)
 */

import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleGetCustomerInvoices(authenticatedCustomerId: string) {
  try {
    if (!authenticatedCustomerId) {
      return errorResponse('Authentication required. Customer identity missing.', 'UNAUTHORIZED');
    }

    // STRICT ISOLATION: Only fetch invoices belonging to this customer
    const invoices = await invoiceRepository.listInvoices({
      customerId: authenticatedCustomerId,
    });

    return successResponse(invoices, 'Customer invoices retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve customer invoices', 'INTERNAL_SERVER_ERROR');
  }
}
