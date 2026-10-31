'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';

interface StaffPaymentItem {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Confirmed';
}

const mockPayments: StaffPaymentItem[] = [
  {
    id: 'sp-01',
    paymentRef: 'PAY-2026-0031',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    paymentDate: '2026-10-04',
    amount: 17700,
    method: 'Bank Transfer (NEFT)',
    status: 'Paid',
  },
  {
    id: 'sp-02',
    paymentRef: 'PAY-2026-0028',
    invoiceNumber: 'INV-2026-0014',
    customerName: 'Kochi Logistics Hub',
    paymentDate: '2026-09-22',
    amount: 23600,
    method: 'Corporate Cheque',
    status: 'Paid',
  },
  {
    id: 'sp-03',
    paymentRef: 'PAY-2026-0033',
    invoiceNumber: 'INV-2026-0045',
    customerName: 'Kerala Ayurveda Solutions',
    paymentDate: '2026-10-29',
    amount: 9440,
    method: 'UPI Merchant Intent',
    status: 'Confirmed',
  },
];

export default function StaffPaymentsPage() {
  const columns: Column<StaffPaymentItem>[] = [
    {
      header: 'Payment Reference',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-[#211b15] font-medium">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      accessorKey: 'method',
      className: 'text-xs text-[#50463c]',
    },
    {
      header: 'Amount Credited',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-[#2b4c2b]" />,
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
          title="Recorded Customer Payments"
          description="Verified bank transactions and offline cheques processed by staff members."
        />

        <DataTable
          columns={columns}
          data={mockPayments}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
