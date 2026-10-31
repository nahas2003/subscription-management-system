'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireStaffOrAdmin } from '@/lib/auth/role-guard';
import { Customer } from '@/types/database';

/**
 * Operational Action: Create Customer
 * Allowed Roles: Admin, Staff
 * Document Reference: docs/04_Database_API_Contract.md Section 13.1
 */
export async function createCustomer(formData: FormData): Promise<{ customer?: Customer; error?: string }> {
  // 1. Role Authorization Guard
  await requireStaffOrAdmin();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = (formData.get('phone') as string) || null;
  const billingAddress = (formData.get('billingAddress') as string) || null;
  const shippingAddress = (formData.get('shippingAddress') as string) || billingAddress;
  const notes = (formData.get('notes') as string) || null;

  if (!name || !email) {
    return { error: 'Customer Name and Email are strictly required.' };
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from('customers')
    .insert({
      name,
      email,
      phone,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      currency: 'INR',
      is_active: true,
      notes,
    })
    .select('*')
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/customers');
  revalidatePath('/staff/customers');
  return { customer: data as Customer };
}

/**
 * Fetch all active customers for staff & admin tables.
 */
export async function getCustomers(): Promise<Customer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Customer[];
}

/**
 * Toggle customer active/inactive status
 */
export async function toggleCustomerStatus(customerId: string, isActive: boolean): Promise<{ success?: boolean; error?: string }> {
  await requireStaffOrAdmin();
  const supabase = createClient();

  const { error } = await supabase
    .from('customers')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', customerId);

  if (error) return { error: error.message };

  revalidatePath('/admin/customers');
  revalidatePath('/staff/customers');
  return { success: true };
}
