'use server';

import { createClient } from '@/lib/supabase/server';
import { Customer, Invoice, Payment, Subscription } from '@/types/database';

export interface PortalOverviewData {
  customer: Customer | null;
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
  summary: {
    activeSubscriptionsCount: number;
    pendingInvoicesCount: number;
    totalOutstandingAmount: number;
    lastPaymentAmount: number;
  };
}

/**
 * Customer Self-Service Data Fetcher
 * Strict Security Guard: Users can ONLY fetch records where customer_id === profile.customer_id
 * Document Reference: docs/04_Database_API_Contract.md Section 11 & Section 14
 */
export async function getCustomerPortalData(): Promise<PortalOverviewData> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return getEmptyPortalData();
  }

  // 1. Fetch user profile to resolve linked customer_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('customer_id, role')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.customer_id) {
    return getEmptyPortalData();
  }

  const customerId = profile.customer_id;

  // 2. Query customer details (strictly by customerId)
  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  // 3. Query subscriptions (strictly by customerId)
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  // 4. Query invoices (strictly by customerId)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('invoice_date', { ascending: false });

  // 5. Query payments (strictly by customerId)
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('customer_id', customerId)
    .order('payment_date', { ascending: false });

  const subsList = (subscriptions || []) as Subscription[];
  const invsList = (invoices || []) as Invoice[];
  const paysList = (payments || []) as Payment[];

  const activeSubs = subsList.filter((s) => s.status === 'active');
  const unpaidInvoices = invsList.filter((i) => i.status === 'confirmed' && i.balance_due > 0);
  const totalOutstanding = unpaidInvoices.reduce((acc, curr) => acc + (curr.balance_due || 0), 0);
  const lastPayment = paysList.length > 0 ? paysList[0].amount : 0;

  return {
    customer: customer as Customer | null,
    subscriptions: subsList,
    invoices: invsList,
    payments: paysList,
    summary: {
      activeSubscriptionsCount: activeSubs.length,
      pendingInvoicesCount: unpaidInvoices.length,
      totalOutstandingAmount: Math.round(totalOutstanding * 100) / 100,
      lastPaymentAmount: lastPayment,
    },
  };
}

function getEmptyPortalData(): PortalOverviewData {
  return {
    customer: null,
    subscriptions: [],
    invoices: [],
    payments: [],
    summary: {
      activeSubscriptionsCount: 0,
      pendingInvoicesCount: 0,
      totalOutstandingAmount: 0,
      lastPaymentAmount: 0,
    },
  };
}
