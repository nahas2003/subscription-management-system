/**
 * BrightLoop Subscription Management System
 * API Endpoint: /api/discounts
 * Methods: GET (list discounts), POST (create discount rule)
 */

import { discountService } from '@/features/discounts/discount-service';
import { errorResponse, successResponse } from '@/lib/api-response';

export async function handleGetDiscounts(onlyActiveStr?: string) {
  try {
    const onlyActive = onlyActiveStr !== 'false';
    const list = await discountService.listDiscounts(onlyActive);
    return successResponse(list, 'Discounts retrieved successfully');
  } catch (err: any) {
    return errorResponse(err.message || 'Failed to retrieve discounts', 'INTERNAL_SERVER_ERROR');
  }
}

export async function handlePostDiscount(payload: any) {
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
