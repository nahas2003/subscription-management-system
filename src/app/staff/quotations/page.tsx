'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Plus, Eye } from 'lucide-react';

interface StaffQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  totalAmount: number;
  quotationDate: string;
  validUntil: string;
  status: string;
}

const mockQuotations: StaffQuotation[] = [
  {
    id: 'quo-01',
    quotationNumber: 'QUO-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    totalAmount: 118000,
    quotationDate: '2026-01-10',
    validUntil: '2026-02-10',
    status: 'Confirmed',
  },
  {
    id: 'quo-02',
    quotationNumber: 'QUO-2026-0012',
    customerName: 'Kochi Logistics Hub',
    totalAmount: 28320,
    quotationDate: '2026-02-10',
    validUntil: '2026-03-10',
    status: 'Confirmed',
  },
  {
    id: 'quo-03',
    quotationNumber: 'QUO-2026-0018',
    customerName: 'Malabar Retailers Ltd',
    totalAmount: 35400,
    quotationDate: '2026-02-28',
    validUntil: '2026-03-28',
    status: 'Sent',
  },
];

export default function StaffQuotationsPage() {
  const columns: Column<StaffQuotation>[] = [
    {
      header: 'Quote #',
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
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.totalAmount} size="sm" className="font-bold" />,
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
      align: 'right',
      cell: (item) => (
        <Link
          href={`/quotations/${item.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:text-[#6c3200] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
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
