'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, FileText, CheckCircle2 } from 'lucide-react';

interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  planName: string;
  createdAt: string;
  validUntil: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Quotation' | 'Confirmed';
}

const mockQuotations: QuotationRecord[] = [
  {
    id: 'quo-01',
    quotationNumber: 'QUO-2026-0031',
    customerName: 'Cochin Tech Solutions',
    planName: 'Enterprise Annual License',
    createdAt: '2026-10-20',
    validUntil: '2026-11-05',
    subtotal: 100000,
    taxAmount: 18000,
    total: 118000,
    status: 'Quotation',
  },
  {
    id: 'quo-02',
    quotationNumber: 'QUO-2026-0028',
    customerName: 'Apex Technologies Pvt Ltd',
    planName: 'Pro Monthly Support Plan',
    createdAt: '2026-09-15',
    validUntil: '2026-09-30',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    status: 'Confirmed',
  },
  {
    id: 'quo-03',
    quotationNumber: 'QUO-2026-0035',
    customerName: 'Kerala Spice Exporters',
    planName: 'Quality Management System',
    createdAt: '2026-10-30',
    validUntil: '2026-11-15',
    subtotal: 100000,
    taxAmount: 18000,
    total: 118000,
    status: 'Draft',
  },
];

export default function QuotationsPage() {
  const columns: Column<QuotationRecord>[] = [
    {
      header: 'Quotation #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-indigo-600">
          {item.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.customerName}</div>
          <div className="text-xs text-slate-500">{item.planName}</div>
        </div>
      ),
    },
    {
      header: 'Created On',
      cell: (item) => <DateDisplay date={item.createdAt} />,
    },
    {
      header: 'Valid Until',
      cell: (item) => <DateDisplay date={item.validUntil} />,
    },
    {
      header: 'Tax (18%)',
      cell: (item) => <MoneyDisplay amount={item.taxAmount} size="sm" />,
    },
    {
      header: 'Total Value',
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-semibold" />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/quotations"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Quotations Management"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Quotations"
          description="Prepare, send, and confirm subscription quotations following the Draft → Quotation → Confirmed workflow."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Draft Quotation
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockQuotations}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
