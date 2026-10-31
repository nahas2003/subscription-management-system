/**
 * BrightLoop Subscription Management System
 * Module: Finance Operations (Member 4)
 * Discount Management Service
 * Document Reference: docs/04_Database_API_Contract.md (Section 8)
 */

import { evaluateDiscountEligibility } from '@/lib/calculations/finance';
import { Discount } from '@/types/finance';

let inMemoryDiscounts: Map<string, Discount> = new Map([
  [
    'disc_launch_10',
    {
      id: 'disc_launch_10',
      name: 'Launch Special 10%',
      code: 'LAUNCH10',
      discount_type: 'percentage',
      value: 10,
      minimum_purchase: 2000,
      minimum_quantity: null,
      starts_at: '2026-10-01T00:00:00Z',
      ends_at: '2026-12-31T23:59:59Z',
      usage_limit: 500,
      usage_count: 12,
      scope_type: 'subscription',
      is_active: true,
      created_at: '2026-10-01T00:00:00Z',
    },
  ],
  [
    'disc_welcome_500',
    {
      id: 'disc_welcome_500',
      name: 'Welcome Flat ₹500 Off',
      code: 'WELCOME500',
      discount_type: 'fixed',
      value: 500,
      minimum_purchase: 5000,
      minimum_quantity: null,
      starts_at: '2026-10-01T00:00:00Z',
      ends_at: '2026-12-31T23:59:59Z',
      usage_limit: 200,
      usage_count: 5,
      scope_type: 'global',
      is_active: true,
      created_at: '2026-10-01T00:00:00Z',
    },
  ],
]);

export interface CreateDiscountInput {
  name: string;
  code?: string;
  discountType: 'fixed' | 'percentage';
  value: number;
  minimumPurchase?: number | null;
  minimumQuantity?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  usageLimit?: number | null;
  scopeType?: 'subscription' | 'product' | 'global';
}

export const discountService = {
  reset() {
    inMemoryDiscounts.clear();
  },

  async listDiscounts(onlyActive: boolean = true): Promise<Discount[]> {
    let list = Array.from(inMemoryDiscounts.values());
    if (onlyActive) {
      list = list.filter((d) => d.is_active);
    }
    return list;
  },

  async findDiscountByCode(code: string): Promise<Discount | null> {
    const normalized = code.trim().toUpperCase();
    for (const d of inMemoryDiscounts.values()) {
      if (d.code && d.code.toUpperCase() === normalized) {
        return d;
      }
    }
    return null;
  },

  async createDiscount(input: CreateDiscountInput): Promise<Discount> {
    if (!input.name) throw new Error('Discount name is required');
    if (input.value <= 0) throw new Error('Discount value must be greater than zero');
    if (input.discountType === 'percentage' && input.value > 100) {
      throw new Error('Percentage discount cannot exceed 100%');
    }

    const id = `disc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const discount: Discount = {
      id,
      name: input.name,
      code: input.code ? input.code.trim().toUpperCase() : undefined,
      discount_type: input.discountType,
      value: input.value,
      minimum_purchase: input.minimumPurchase ?? null,
      minimum_quantity: input.minimumQuantity ?? null,
      starts_at: input.startsAt ?? null,
      ends_at: input.endsAt ?? null,
      usage_limit: input.usageLimit ?? null,
      usage_count: 0,
      scope_type: input.scopeType || 'subscription',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    inMemoryDiscounts.set(id, discount);
    return discount;
  },

  async applyDiscountByCode(params: {
    code: string;
    subtotal: number;
    totalQuantity: number;
    asOfDate?: string;
  }): Promise<{
    discount: Discount;
    calculatedDiscountAmount: number;
  }> {
    const { code, subtotal, totalQuantity, asOfDate } = params;
    const discount = await this.findDiscountByCode(code);

    if (!discount) {
      throw new Error(`Discount with code "${code}" not found.`);
    }

    const evaluation = evaluateDiscountEligibility({
      discount,
      subtotal,
      totalQuantity,
      asOfDate,
    });

    if (!evaluation.isEligible) {
      throw new Error(evaluation.ineligibilityReason || 'Discount is not eligible.');
    }

    return {
      discount,
      calculatedDiscountAmount: evaluation.calculatedDiscountAmount,
    };
  },
};
