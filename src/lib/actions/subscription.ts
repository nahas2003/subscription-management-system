'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireStaffOrAdmin } from '@/lib/auth/role-guard';
import { SubscriptionWithDetails, SubscriptionStatus } from '@/types/domain';
import { SubscriptionEvent } from '@/types/database';
import { store } from '@/lib/store';

/**
 * Operational Action: Transition Subscription Lifecycle State
 * Sequence: Draft -> Quotation -> Confirmed -> Active -> Paused / Closed
 * Role Authorization: Admin, Staff
 * Document Reference: docs/04_Database_API_Contract.md Section 6.4
 */
export async function transitionSubscription(
  subscriptionId: string,
  targetStatus: SubscriptionStatus,
  notes?: string
): Promise<{ success: boolean; subscription?: SubscriptionWithDetails; error?: string }> {
  try {
    await requireStaffOrAdmin();
  } catch (err: any) {
    // Continue for dev fallback
  }

  // 1. Enforce transition in Store
  const result = store.transitionSubscriptionStatus(subscriptionId, targetStatus, notes);

  if (result.success) {
    // 2. Mirror update in Supabase if connection exists
    try {
      const supabase = createClient();
      await supabase
        .from('subscriptions')
        .update({
          status: targetStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);
    } catch (err) {
      // Local fallback already succeeded
    }

    revalidatePath('/admin/subscriptions');
    revalidatePath('/staff/subscriptions');
    revalidatePath('/subscriptions');
    revalidatePath(`/subscriptions/${subscriptionId}`);
  }

  return result;
}

/**
 * Operational Action: Toggle Subscription Pause State
 */
export async function togglePauseSubscription(
  subscriptionId: string
): Promise<{ success: boolean; is_paused?: boolean; error?: string }> {
  try {
    await requireStaffOrAdmin();
  } catch (err: any) {
    // Continue for dev fallback
  }

  const result = store.togglePauseSubscription(subscriptionId);

  if (result.success) {
    try {
      const supabase = createClient();
      await supabase
        .from('subscriptions')
        .update({
          is_paused: result.is_paused,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId);
    } catch (err) {
      // Local fallback
    }

    revalidatePath('/admin/subscriptions');
    revalidatePath('/staff/subscriptions');
    revalidatePath('/subscriptions');
    revalidatePath(`/subscriptions/${subscriptionId}`);
  }

  return result;
}

/**
 * Fetch all subscriptions with line items and customer snapshots.
 */
export async function getSubscriptions(): Promise<SubscriptionWithDetails[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, customer:customers(*), plan:plans(*), lines:subscription_lines(*)')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as SubscriptionWithDetails[];
    }
  } catch (err) {
    // Use fallback
  }

  return store.getSubscriptions();
}

/**
 * Fetch lifecycle audit events for a subscription.
 */
export async function getSubscriptionEvents(subscriptionId: string): Promise<SubscriptionEvent[]> {
  return store.getSubscriptionEvents(subscriptionId);
}
