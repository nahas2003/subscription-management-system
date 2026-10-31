'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { getCustomerPortalData } from '@/lib/actions/portal';

interface PaymentHistoryItem {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  paymentDate: string;
  method: string;
  amount: number;
  status: 'Confirmed' | 'Paid';
}

const mockPayments: PaymentHistoryItem[] = [
  {
    id: 'pay-001',
    paymentRef: 'PAY-2026-0019-01',
    invoiceNumber: 'INV-2026-0019',
    paymentDate: '2026-10-02',
    method: 'Bank Transfer (NEFT)',
    amount: 17700,
    status: 'Confirmed',
  },
  {
    id: 'pay-002',
    paymentRef: 'PAY-2026-0005-01',
    invoiceNumber: 'INV-2026-0005',
    paymentDate: '2026-01-20',
    method: 'Corporate Wire (RTGS)',
    amount: 118000,
    status: 'Confirmed',
  },
];

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>(mockPayments);
  const [customerName, setCustomerName] = useState('Apex Technologies Pvt Ltd');
  const [customerEmail, setCustomerEmail] = useState('billing@apextech.in');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCustomerPortalData();
        if (data?.customer) {
          setCustomerName(data.customer.name);
          setCustomerEmail(data.customer.email);
        }
        if (data?.payments && data.payments.length > 0) {
          const mapped: PaymentHistoryItem[] = data.payments.map((p) => ({
            id: p.id,
            paymentRef: p.payment_reference || `PAY-${p.id.slice(0, 8)}`,
            invoiceNumber: 'On Account',
            paymentDate: p.payment_date,
            method:
              p.payment_method === 'bank_transfer'
                ? 'Bank Transfer (NEFT)'
                : p.payment_method === 'upi'
                ? 'UPI Merchant Intent'
                : p.payment_method === 'credit_card'
                ? 'Credit Card'
                : 'Direct Settlement',
            amount: p.amount,
            status: 'Confirmed',
          }));
          setPayments(mapped);
        }
      } catch (err) {
        console.error('Failed to load customer payments:', err);
      }
    }
    loadData();
  }, []);

  const columns: Column<PaymentHistoryItem>[] = [
    {
      header: 'Payment Reference',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-indigo-600 font-medium">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
          {item.method}
        </span>
      ),
    },
    {
      header: 'Amount Credited',
      cell: (item) => (
        <MoneyDisplay amount={item.amount} size="sm" className="font-semibold text-emerald-700" />
      ),
    },
    {
      header: 'Allocation Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal/payments"
      user={{ name: customerName, email: customerEmail, role: 'customer' }}
      title="Payment History"
    >
      <div className="space-y-6">
        <PageHeader
          title="Payment History"
          description="Record of verified manual and electronic payments allocated against your account."
          breadcrumbs={[
            { label: 'Portal', href: '/portal' },
            { label: 'Payments' },
          ]}
        />

        <DataTable
          columns={columns}
          data={payments}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
