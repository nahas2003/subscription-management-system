'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus } from 'lucide-react';

interface StaffPaymentItem {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: 'Confirmed' | 'Paid';
}

const mockStaffPayments: StaffPaymentItem[] = [
  {
    id: 'pay-01',
    paymentRef: 'PAY-2026-0019-01',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    amount: 17700,
    paymentDate: '2026-10-02',
    method: 'Bank Transfer (NEFT)',
    status: 'Confirmed',
  },
  {
    id: 'pay-02',
    paymentRef: 'PAY-2026-0022-01',
    invoiceNumber: 'INV-2026-0022',
    customerName: 'Kochi Logistics Hub',
    amount: 28320,
    paymentDate: '2026-10-12',
    method: 'UPI Merchant Intent',
    status: 'Confirmed',
  },
];

export default function StaffPaymentsPage() {
  const columns: Column<StaffPaymentItem>[] = [
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
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      accessorKey: 'method',
      className: 'text-xs text-slate-600',
    },
    {
      header: 'Amount Credited',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-emerald-700" />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="staff"
      currentPath="/staff/payments"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Payments"
    >
      <div className="space-y-6">
        <PageHeader
          title="Payment Records"
          description="View and verify recorded customer payments."
        />

        <DataTable
          columns={columns}
          data={mockStaffPayments}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
