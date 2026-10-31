/**
 * BrightLoop Subscription Management System
 * Customer Portal API: /api/customer/payments
 * Security: Strict customer record isolation
 */

import { paymentRepository } from '@/features/payments/payment-repository';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleGetCustomerPayments(authenticatedCustomerId: string) {
  try {
    if (!authenticatedCustomerId) {
      return errorResponse('Authentication required. Customer identity missing.', 'UNAUTHORIZED');
    }

    // STRICT ISOLATION: Only fetch payments belonging to this customer
    const payments = await paymentRepository.listPayments({
      customerId: authenticatedCustomerId,
    });

    return successResponse(payments, 'Customer payments retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve customer payments', 'INTERNAL_SERVER_ERROR');
  }
}
