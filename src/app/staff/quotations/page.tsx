'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { QuotationStatus } from '@/types/domain';
import { Plus, Eye } from 'lucide-react';

interface StaffQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  totalAmount: number;
  quotationDate: string;
  validUntil: string;
  status: QuotationStatus | string;
}

const mockQuotations: StaffQuotation[] = [
  {
    id: 'quo-01',
    quotationNumber: 'QUO-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    totalAmount: 118000,
    quotationDate: '2026-01-10',
    validUntil: '2026-02-10',
    status: 'converted',
  },
  {
    id: 'quo-02',
    quotationNumber: 'QUO-2026-0012',
    customerName: 'Kochi Logistics Hub',
    totalAmount: 28320,
    quotationDate: '2026-02-10',
    validUntil: '2026-03-10',
    status: 'confirmed',
  },
  {
    id: 'quo-03',
    quotationNumber: 'QUO-2026-0018',
    customerName: 'Malabar Retailers Ltd',
    totalAmount: 35400,
    quotationDate: '2026-02-28',
    validUntil: '2026-03-28',
    status: 'sent',
  },
];

export default function StaffQuotationsPage() {
  const columns: Column<StaffQuotation>[] = [
    {
      header: 'Quote #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
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
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.totalAmount} size="sm" className="font-semibold" />,
    },
    {
      header: 'Date',
      cell: (item) => <DateDisplay date={item.quotationDate} />,
    },
    {
      header: 'Valid Until',
      cell: (item) => <DateDisplay date={item.validUntil} />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <Link
          href="/quotations"
          className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors inline-block"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
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
          description="Prepare customer estimates and track client confirmation (Task M3-04)."
          action={
            <Link href="/quotations/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                Create Quotation
              </Button>
            </Link>
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
