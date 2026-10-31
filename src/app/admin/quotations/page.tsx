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

interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  planName?: string;
  totalAmount: number;
  quotationDate: string;
  validUntil: string;
  status: string;
  linesCount?: number;
}

const mockQuotations: QuotationRecord[] = [
  {
    id: 'quo-01',
    quotationNumber: 'QUO-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    planName: 'Enterprise Annual Plan',
    totalAmount: 118000,
    quotationDate: '2026-01-10',
    validUntil: '2026-02-10',
    status: 'Confirmed',
    linesCount: 2,
  },
  {
    id: 'quo-02',
    quotationNumber: 'QUO-2026-0012',
    customerName: 'Kochi Logistics Hub',
    planName: 'Standard Monthly Plan',
    totalAmount: 28320,
    quotationDate: '2026-02-10',
    validUntil: '2026-03-10',
    status: 'Confirmed',
    linesCount: 1,
  },
  {
    id: 'quo-03',
    quotationNumber: 'QUO-2026-0018',
    customerName: 'Malabar Retailers Ltd',
    planName: 'Consulting Retainer Monthly',
    totalAmount: 35400,
    quotationDate: '2026-02-28',
    validUntil: '2026-03-28',
    status: 'Draft',
    linesCount: 3,
  },
  {
    id: 'quo-04',
    quotationNumber: 'QUO-2026-0021',
    customerName: 'Travancore Analytics',
    planName: 'Starter Quarterly',
    totalAmount: 59000,
    quotationDate: '2026-03-01',
    validUntil: '2026-04-01',
    status: 'Draft',
    linesCount: 1,
  },
];

export default function QuotationsPage() {
  const columns: Column<QuotationRecord>[] = [
    {
      header: 'Quote #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer & Plan',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.customerName}</div>
          {item.planName && <div className="text-xs text-[#96897b]">{item.planName}</div>}
        </div>
      ),
    },
    {
      header: 'Total (inc. 18% GST)',
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
      role="admin"
      currentPath="/admin/quotations"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Quotations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Quotations"
          description="Prepare, send, and confirm subscription quotations following the Draft → Quotation → Confirmed workflow."
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
