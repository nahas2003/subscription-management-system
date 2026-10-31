'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { CreditCard, CheckCircle2 } from 'lucide-react';

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
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-semibold text-emerald-700" />,
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
      user={{ name: 'Apex Technologies Pvt Ltd', email: 'billing@apextech.in', role: 'customer' }}
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
          data={mockPayments}
          keyExtractor={(item) => item.id}
          emptyMessage="No payment records found."
        />
      </div>
    </AppShell>
  );
}
