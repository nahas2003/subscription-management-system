'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/dashboard';

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signupCustomer(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const phone = (formData.get('phone') as string) || null;

  const supabase = await createClient();

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
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}

export async function getCurrentUser() {
  const supabase = await createClient();
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
    profile,
  };
}
