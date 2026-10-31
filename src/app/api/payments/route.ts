/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/payments
 * Methods: GET (list payments), POST (record manual payment)
 */

import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { paymentRepository } from '@/features/payments/payment-repository';
import { recordInvoicePayment } from '@/features/payments/payment-service';
import { errorResponse, successResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

export async function handleGetPayments(queryParams: Record<string, string | undefined>) {
  try {
    const filters = {
      customerId: queryParams.customerId,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    };

    const payments = await paymentRepository.listPayments(filters);
    return successResponse(payments, 'Payments retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve payments', 'INTERNAL_SERVER_ERROR');
  }
}

export async function handlePostPayment(payload: any) {
  try {
    if (!payload.customerId) {
      return errorResponse('Customer ID is required', 'VALIDATION_ERROR', { customerId: 'Required' });
    }
    if (!payload.invoiceId) {
      return errorResponse('Invoice ID is required', 'VALIDATION_ERROR', { invoiceId: 'Required' });
    }
    if (!payload.amount || payload.amount <= 0) {
      return errorResponse('Payment amount must be greater than zero', 'VALIDATION_ERROR', { amount: 'Must be > 0' });
    }
    if (!payload.paymentMethod) {
      return errorResponse('Payment method is required', 'VALIDATION_ERROR', { paymentMethod: 'Required' });
    }

    const invoice = await invoiceRepository.getInvoiceById(payload.invoiceId);
    if (!invoice) {
      return errorResponse(`Invoice with ID ${payload.invoiceId} not found`, 'NOT_FOUND');
    }

    const existingAllocations = await paymentRepository.getAllocationsForInvoice(invoice.id);

    const result = recordInvoicePayment({
      input: {
        customerId: payload.customerId,
        invoiceId: payload.invoiceId,
        amount: payload.amount,
        paymentMethod: payload.paymentMethod,
        paymentDate: payload.paymentDate,
        note: payload.note,
        recordedBy: payload.recordedBy || 'admin_user',
      },
      invoice,
      existingAllocations,
    });

    await paymentRepository.savePaymentAndAllocation({
      payment: result.payment,
      allocation: result.allocation,
      updatedInvoice: result.updatedInvoice,
    });

    return successResponse(
      {
        payment: result.payment,
        allocation: result.allocation,
        invoice: result.updatedInvoice,
      },
      'Payment recorded and allocated successfully'
    );
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to record payment', 'BAD_REQUEST');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryParams: Record<string, string | undefined> = {};
  searchParams.forEach((val, key) => {
    queryParams[key] = val;
  });
  const res = await handleGetPayments(queryParams);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await handlePostPayment(body);
    return NextResponse.json(res, { status: res.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
