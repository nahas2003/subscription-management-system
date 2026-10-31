import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile, UserRole } from '@/types/database';

export interface AuthContextResult {
  userId: string;
  email: string;
  profile: Profile;
}

/**
 * Server-side authorization guard.
 * Validates that the request has an active session and that the user's role
 * is in the allowedRoles list. Redirects if unauthorized.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthContextResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile || !profile.is_active) {
    redirect('/auth/login?error=account_inactive');
  }

  if (!allowedRoles.includes(profile.role as UserRole)) {
    // If not authorized for this area, redirect to their assigned home
    if (profile.role === 'admin') {
      redirect('/admin/dashboard');
    } else if (profile.role === 'staff') {
      redirect('/staff/dashboard');
    } else {
      redirect('/portal');
    }
  }

  return {
    userId: user.id,
    email: user.email || profile.email,
    profile: profile as Profile,
  };
}

export async function requireAdmin(): Promise<AuthContextResult> {
  return requireRole(['admin']);
}

export async function requireStaffOrAdmin(): Promise<AuthContextResult> {
  return requireRole(['admin', 'staff']);
}

export async function requireCustomer(): Promise<AuthContextResult> {
  return requireRole(['customer']);
}
