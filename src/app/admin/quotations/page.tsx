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

interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  totalAmount: number;
  quotationDate: string;
  validUntil: string;
  status: QuotationStatus | string;
  linesCount: number;
}

const mockQuotations: QuotationRecord[] = [
  {
    id: 'quo-01',
    quotationNumber: 'QUO-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    totalAmount: 118000,
    quotationDate: '2026-01-10',
    validUntil: '2026-02-10',
    status: 'converted',
    linesCount: 2,
  },
  {
    id: 'quo-02',
    quotationNumber: 'QUO-2026-0012',
    customerName: 'Kochi Logistics Hub',
    totalAmount: 28320,
    quotationDate: '2026-02-10',
    validUntil: '2026-03-10',
    status: 'confirmed',
    linesCount: 1,
  },
  {
    id: 'quo-03',
    quotationNumber: 'QUO-2026-0018',
    customerName: 'Malabar Retailers Ltd',
    totalAmount: 35400,
    quotationDate: '2026-02-28',
    validUntil: '2026-03-28',
    status: 'sent',
    linesCount: 3,
  },
  {
    id: 'quo-04',
    quotationNumber: 'QUO-2026-0021',
    customerName: 'Travancore Analytics',
    totalAmount: 59000,
    quotationDate: '2026-03-01',
    validUntil: '2026-04-01',
    status: 'draft',
    linesCount: 1,
  },
];

export default function QuotationsPage() {
  const columns: Column<QuotationRecord>[] = [
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
      header: 'Total (inc. GST)',
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
        <div className="flex items-center gap-1.5">
          <Link
            href="/quotations"
            className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            title="Inspect Quotations"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/quotations"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Quotations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Quotations"
          description="Prepare, send, and confirm subscription quotations following the Draft → Quotation → Confirmed workflow (Task M3-04)."
          action={
            <Link href="/quotations/new">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Draft Quotation
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
