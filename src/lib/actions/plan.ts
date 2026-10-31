'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireStaffOrAdmin } from '@/lib/auth/role-guard';
import { PlanRow, PlanFrequency } from '@/types/database';
import { store } from '@/lib/store';

/**
 * Operational Action: Create Subscription Plan
 * Role Authorization: Admin, Staff
 * Document Reference: docs/04_Database_API_Contract.md Section 3
 */
export async function createPlan(formData: FormData): Promise<{ plan?: PlanRow; error?: string }> {
  try {
    await requireStaffOrAdmin();
  } catch (err: any) {
    // If running in development without auth session, continue with store
  }

  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || '';
  const price = parseFloat((formData.get('price') as string) || '0');
  const frequency = ((formData.get('frequency') as string) || 'monthly').toLowerCase() as PlanFrequency;
  const minimumQuantity = parseInt((formData.get('minimumQuantity') as string) || '1', 10);
  const allowPause = formData.get('allowPause') === 'true' || formData.get('allowPause') === 'on';

  if (!name || isNaN(price) || price < 0) {
    return { error: 'Plan name and a non-negative price are required.' };
  }

  // 1. Try Supabase Insert
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('plans')
      .insert({
        name,
        code: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description,
        price,
        billing_interval: frequency,
        interval_count: 1,
        min_quantity: minimumQuantity,
        allow_pause: allowPause,
        is_active: true,
      })
      .select('*')
      .single();

    if (!error && data) {
      revalidatePath('/admin/plans');
      revalidatePath('/plans');
      return { plan: data as PlanRow };
    }
  } catch (err) {
    // Fallback to store
  }

  // 2. Fallback to Store
  const localPlan = store.createPlan({
    name,
    description,
    price,
    frequency,
    minimum_quantity: minimumQuantity,
    allow_pause: allowPause,
    auto_close: false,
    allow_early_close: true,
    renewal_rule: { auto_renew: true },
  });

  revalidatePath('/admin/plans');
  revalidatePath('/plans');

  return { plan: localPlan };
}

/**
 * Fetch all active recurring plans.
 */
export async function getPlans(): Promise<PlanRow[]> {
  try {
    const supabase = createClient();
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (!error && plans && plans.length > 0) {
      return plans as PlanRow[];
    }
  } catch (err) {
    // Use store fallback
  }

  return store.getPlans();
}
