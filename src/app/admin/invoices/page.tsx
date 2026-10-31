'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

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
    id: 'inv-101',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-10-22',
    dueDate: '2026-11-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 0,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'Malabar Retailers Ltd',
    issueDate: '2026-10-06',
    dueDate: '2026-10-20',
    subtotal: 30000,
    taxAmount: 5400,
    total: 35400,
    amountPaid: 0,
    balanceDue: 35400,
    status: 'Overdue',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    issueDate: '2026-09-21',
    dueDate: '2026-10-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 17700,
    balanceDue: 0,
    status: 'Paid',
  },
  {
    id: 'inv-104',
    invoiceNumber: 'INV-2026-0014',
    customerName: 'Kochi Logistics Hub',
    issueDate: '2026-09-10',
    dueDate: '2026-09-24',
    subtotal: 20000,
    taxAmount: 3600,
    total: 23600,
    amountPaid: 23600,
    balanceDue: 0,
    status: 'Paid',
  },
];

export default function InvoicesPage() {
  const columns: Column<AdminInvoiceItem>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
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
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-bold" />,
    },
    {
      header: 'Balance Due',
      cell: (item) => (
        <MoneyDisplay
          amount={item.balanceDue}
          size="sm"
          className={item.balanceDue > 0 ? 'font-bold text-[#b83a2b]' : 'text-[#50463c]'}
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
      title="Invoices & Billing"
    >
      <div className="space-y-6">
        <PageHeader
          title="Tax Invoices & Accounts Receivable"
          description="Detailed breakdown of recurring and one-off tax invoices, balance settlements, and statutory 18% GST."
          action={
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export GSTR-1 CSV
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
