/**
 * BrightLoop Subscription Management System
 * Customer Portal API: /api/customer/payments
 * Security: Strict customer record isolation
 */

import { paymentRepository } from '@/features/payments/payment-repository';
import { errorResponse, successResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

async function handleGetCustomerPayments(authenticatedCustomerId: string) {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId') || '';
  const res = await handleGetCustomerPayments(customerId);
  return NextResponse.json(res, { status: res.success ? 200 : (res.error?.code === 'UNAUTHORIZED' ? 401 : 400) });
}
