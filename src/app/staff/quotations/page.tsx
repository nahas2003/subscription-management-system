'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface StaffQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  createdAt: string;
  validUntil: string;
  total: number;
  status: SubscriptionStatus;
}

const mockQuotations: StaffQuotation[] = [
  {
    id: 'sq-01',
    quotationNumber: 'QTN-2026-0084',
    customerName: 'Kochi Logistics Hub',
    createdAt: '2026-10-01',
    validUntil: '2026-11-01',
    total: 23600,
    status: 'Confirmed',
  },
  {
    id: 'sq-02',
    quotationNumber: 'QTN-2026-0087',
    customerName: 'Kerala Ayurveda Solutions',
    createdAt: '2026-10-18',
    validUntil: '2026-11-18',
    total: 9440,
    status: 'Draft',
  },
];

export default function StaffQuotationsPage() {
  const columns: Column<StaffQuotation>[] = [
    {
      header: 'Quotation #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-bold text-[#211b15]',
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
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-bold" />,
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
