'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';
import { Plus, Receipt, AlertCircle } from 'lucide-react';

interface AdminInvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockInvoices: AdminInvoiceItem[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-10-25',
    dueDate: '2026-11-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 0,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'Malabar Retailers Ltd',
    issueDate: '2026-10-05',
    dueDate: '2026-10-20',
    subtotal: 30000,
    taxAmount: 5400,
    total: 35400,
    amountPaid: 0,
    balanceDue: 35400,
    status: 'Overdue',
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-09-25',
    dueDate: '2026-10-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 17700,
    balanceDue: 0,
    status: 'Paid',
  },
  {
    id: 'inv-04',
    invoiceNumber: 'INV-2026-0005',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-01-15',
    dueDate: '2026-01-25',
    subtotal: 100000,
    taxAmount: 18000,
    total: 118000,
    amountPaid: 118000,
    balanceDue: 0,
    status: 'Paid',
  },
];

export default function InvoicesPage() {
  const columns: Column<AdminInvoiceItem>[] = [
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
      header: 'GST (18%)',
      cell: (item) => <MoneyDisplay amount={item.taxAmount} size="sm" />,
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
      role="admin"
      currentPath="/admin/invoices"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Invoices"
    >
      <div className="space-y-6">
        <PageHeader
          title="Invoices & Recurring Billing"
          description="Manage generated customer invoices, monitor payment settlements, and review overdue derived balances."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Generate Invoice
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockInvoices}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
