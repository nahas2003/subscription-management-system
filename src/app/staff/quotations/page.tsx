'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus } from 'lucide-react';

interface StaffQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  createdAt: string;
  validUntil: string;
  total: number;
  status: 'Draft' | 'Quotation' | 'Confirmed';
}

const mockQuotations: StaffQuotation[] = [
  {
    id: 'q-01',
    quotationNumber: 'QUO-2026-0031',
    customerName: 'Cochin Tech Solutions',
    createdAt: '2026-10-20',
    validUntil: '2026-11-05',
    total: 118000,
    status: 'Quotation',
  },
  {
    id: 'q-02',
    quotationNumber: 'QUO-2026-0034',
    customerName: 'Kerala Spice Exporters',
    createdAt: '2026-10-28',
    validUntil: '2026-11-12',
    total: 45000,
    status: 'Draft',
  },
];

export default function StaffQuotationsPage() {
  const columns: Column<StaffQuotation>[] = [
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
      accessorKey: 'customerName',
      className: 'font-semibold text-slate-800',
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
      role="staff"
      currentPath="/staff/quotations"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Quotations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Quotations"
          description="Prepare customer estimates and track client confirmation."
          action={
            <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
              Create Quotation
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
