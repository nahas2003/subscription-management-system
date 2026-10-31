/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/discounts
 * Methods: GET (list discounts), POST (create discount rule)
 */

import { discountService } from '@/features/discounts/discount-service';
import { errorResponse, successResponse } from '@/lib/api-response';
import { NextResponse } from 'next/server';

async function handleGetDiscounts(onlyActiveStr?: string) {
  try {
    const onlyActive = onlyActiveStr !== 'false';
    const list = await discountService.listDiscounts(onlyActive);
    return successResponse(list, 'Discounts retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve discounts', 'INTERNAL_SERVER_ERROR');
  }
}

async function handlePostDiscount(payload: any) {
  try {
    if (!payload.name) {
      return errorResponse('Discount name is required', 'VALIDATION_ERROR', { name: 'Required' });
    }
    if (!payload.discountType || !['fixed', 'percentage'].includes(payload.discountType)) {
      return errorResponse('Valid discount type (fixed or percentage) is required', 'VALIDATION_ERROR', { discountType: 'Invalid' });
    }
    if (payload.value === undefined || payload.value <= 0) {
      return errorResponse('Discount value must be greater than zero', 'VALIDATION_ERROR', { value: 'Must be > 0' });
    }

    const created = await discountService.createDiscount({
      name: payload.name,
      code: payload.code,
      discountType: payload.discountType,
      value: payload.value,
      minimumPurchase: payload.minimumPurchase,
      minimumQuantity: payload.minimumQuantity,
      startsAt: payload.startsAt,
      endsAt: payload.endsAt,
      usageLimit: payload.usageLimit,
      scopeType: payload.scopeType,
    });

    return successResponse(created, 'Discount rule created successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to create discount', 'BAD_REQUEST');
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActive = searchParams.get('onlyActive') || undefined;
  const res = await handleGetDiscounts(onlyActive);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await handlePostDiscount(body);
    return NextResponse.json(res, { status: res.success ? 200 : 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 400 });
  }
}
