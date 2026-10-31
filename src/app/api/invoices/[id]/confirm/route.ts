/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/invoices/[id]/confirm
 * Method: POST (confirm draft invoice)
 */

import { invoiceRepository } from '@/features/invoices/invoice-repository';
import { transitionToConfirmed } from '@/features/invoices/invoice-service';
import { errorResponse, successResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

export async function handleConfirmInvoice(invoiceId: string) {
  try {
    const existing = await invoiceRepository.getInvoiceById(invoiceId);
    if (!existing) {
      return errorResponse(`Invoice with ID ${invoiceId} not found`, 'NOT_FOUND');
    }

    const confirmed = transitionToConfirmed(existing);
    await invoiceRepository.updateInvoice(confirmed);

    return successResponse(confirmed, 'Invoice confirmed successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to confirm invoice', 'BAD_REQUEST');
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const invoiceId = params.id;
  const res = await handleConfirmInvoice(invoiceId);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}
