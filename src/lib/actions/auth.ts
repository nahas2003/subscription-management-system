'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Profile } from '@/types/database';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '';

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch user role to determine smart redirect
  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    revalidatePath('/', 'layout');

    if (redirectTo) {
      redirect(redirectTo);
    }

    if (profile?.role === 'admin') {
      redirect('/admin/dashboard');
    } else if (profile?.role === 'staff') {
      redirect('/staff/dashboard');
    } else {
      redirect('/portal');
    }
  }

  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function signupCustomer(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const phone = (formData.get('phone') as string) || null;

  const supabase = createClient();

  // Create auth account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'customer',
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Create customer and profile record if user created
  if (authData.user) {
    // Insert into customers table
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: fullName,
        email,
        phone,
        currency: 'INR',
        is_active: true,
      })
      .select('id')
      .single();

    if (!customerError && customerData) {
      // Upsert profile
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role: 'customer',
        customer_id: customerData.id,
        phone,
        is_active: true,
      });
    }
  }

  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    user,
    profile: profile as Profile | null,
  };
}

/**
 * Admin-Only Action: Provision a new staff member account.
 * Document Reference: docs/04_Database_API_Contract.md Section 13.2
 */
export async function createStaff(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = (formData.get('role') as string) || 'staff';

  if (!fullName || !email || !password) {
    return { error: 'Full name, email, and password are required.' };
  }

  const supabase = createClient();

  // 1. Enforce that caller is an Admin
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) {
    return { error: 'Authentication required' };
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .single();

  if (callerProfile?.role !== 'admin') {
    return { error: 'Access denied: Only Admin accounts can create staff.' };
  }

  // 2. Create the user in Supabase Auth
  const { data: newUserData, error: createError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role === 'admin' ? 'admin' : 'staff',
      },
    },
  });

  if (createError) {
    return { error: createError.message };
  }

  if (newUserData.user) {
    // 3. Upsert into public.profiles
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: newUserData.user.id,
      email,
      full_name: fullName,
      role: role === 'admin' ? 'admin' : 'staff',
      customer_id: null,
      is_active: true,
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  revalidatePath('/admin/staff');
  return { success: true };
}

/**
 * Fetch all staff and admin accounts for management table.
 */
export async function getStaffList(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['admin', 'staff'])
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as Profile[];
}

/**
 * Password recovery request action.
 */
export async function resetPassword(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email is required' };

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

/**
 * Customer Self-Service Profile Update Action.
 * Restricts updates strictly to the authenticated customer's own record.
 */
export async function updateCustomerProfile(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const phone = formData.get('phone') as string;
  const billingAddress = formData.get('billingAddress') as string;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Authentication required' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.customer_id) {
    return { error: 'No linked customer record found' };
  }

  const { error } = await supabase
    .from('customers')
    .update({
      phone: phone || null,
      billing_address: billingAddress || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile.customer_id);

  if (error) return { error: error.message };

  revalidatePath('/portal/profile');
  return { success: true };
}
