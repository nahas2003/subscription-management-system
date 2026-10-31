'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';

interface StaffInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockStaffInvoices: StaffInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-10-25',
    dueDate: '2026-11-05',
    total: 17700,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'Malabar Retailers Ltd',
    issueDate: '2026-10-05',
    dueDate: '2026-10-20',
    total: 35400,
    balanceDue: 35400,
    status: 'Overdue',
  },
];

export default function StaffInvoicesPage() {
  const columns: Column<StaffInvoice>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-indigo-600">
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
      header: 'Issue Date',
      cell: (item) => <DateDisplay date={item.issueDate} />,
    },
    {
      header: 'Due Date',
      cell: (item) => <DateDisplay date={item.dueDate} />,
    },
    {
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-semibold" />,
    },
    {
      header: 'Balance Due',
      cell: (item) => (
        <MoneyDisplay
          amount={item.balanceDue}
          size="sm"
          className={item.balanceDue > 0 ? 'font-bold text-amber-700' : 'text-slate-500'}
        />
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="staff"
      currentPath="/staff/invoices"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Invoices"
    >
      <div className="space-y-6">
        <PageHeader
          title="Invoices"
          description="View recurring customer invoices and overdue accounts."
        />

        <DataTable
          columns={columns}
          data={mockStaffInvoices}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
