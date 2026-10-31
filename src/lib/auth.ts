export type UserRole = 'admin' | 'staff' | 'customer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  gstin?: string;
}

export const KNOWN_ACCOUNTS: AuthUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Anand Kumar',
    email: 'admin@brightloop.in',
    role: 'admin',
    companyName: 'BrightLoop Global HQ',
  },
  {
    id: 'usr-staff-1',
    name: 'Deepa Krishnan',
    email: 'deepa@brightloop.in',
    role: 'staff',
    companyName: 'BrightLoop Operations Desk',
  },
  {
    id: 'usr-staff-2',
    name: 'Manoj Pillai',
    email: 'manoj@brightloop.in',
    role: 'staff',
    companyName: 'BrightLoop Operations Desk',
  },
  {
    id: 'usr-cust-1',
    name: 'Sarah Mathew',
    email: 'billing@apextech.in',
    role: 'customer',
    companyName: 'Apex Technologies Pvt Ltd',
    gstin: '32AAAAA0000A1Z5',
  },
  {
    id: 'usr-cust-2',
    name: 'Jamsheed V. P.',
    email: 'finance@kochilogistics.com',
    role: 'customer',
    companyName: 'Kochi Logistics Hub',
    gstin: '32BBCDE5678B2Z1',
  },
  {
    id: 'usr-cust-3',
    name: 'Anjali Menon',
    email: 'accounts@keralaayur.org',
    role: 'customer',
    companyName: 'Kerala Ayurveda Solutions',
    gstin: '32CCDEF9012C3Z8',
  },
  {
    id: 'usr-cust-4',
    name: 'Rohan Nambiar',
    email: 'admin@malabarretail.com',
    role: 'customer',
    companyName: 'Malabar Retailers Ltd',
    gstin: '32DDEFG3456D4Z4',
  },
];

const STORAGE_KEY = 'brightloop_auth_user';

export function resolveUserFromCredentials(email: string): AuthUser {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const found = KNOWN_ACCOUNTS.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (found) return found;

  // Inference rules for custom demo inputs:
  if (normalizedEmail.includes('admin') || (normalizedEmail.endsWith('@brightloop.in') && !normalizedEmail.includes('staff'))) {
    return {
      id: `usr-admin-${Date.now()}`,
      name: formatEmailToName(normalizedEmail),
      email,
      role: 'admin',
      companyName: 'BrightLoop HQ',
    };
  }

  if (normalizedEmail.includes('staff') || normalizedEmail.includes('ops') || normalizedEmail.endsWith('@brightloop.in')) {
    return {
      id: `usr-staff-${Date.now()}`,
      name: formatEmailToName(normalizedEmail),
      email,
      role: 'staff',
      companyName: 'BrightLoop Operations Desk',
    };
  }

  // All other users default to customer role:
  const domain = email.split('@')[1] || 'client';
  const orgName = domain.split('.')[0].toUpperCase() + ' Ltd';
  return {
    id: `usr-cust-${Date.now()}`,
    name: formatEmailToName(normalizedEmail),
    email,
    role: 'customer',
    companyName: orgName,
  };
}

function formatEmailToName(email: string): string {
  const prefix = email.split('@')[0] || 'User';
  return prefix
    .split(/[\._\-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getRedirectForRole(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'staff':
      return '/staff/dashboard';
    case 'customer':
    default:
      return '/portal';
  }
}

export function saveSessionUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      // Ignore local storage errors
    }
  }
}

export function getSessionUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as AuthUser;
    } catch (e) {
      // Ignore
    }
  }
  return null;
}

export function clearSessionUser(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }
}
