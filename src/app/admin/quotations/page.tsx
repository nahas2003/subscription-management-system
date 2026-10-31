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

interface QuotationRecord {
  id: string;
  quotationNumber: string;
  customerName: string;
  planName: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: SubscriptionStatus;
  createdAt: string;
  validUntil: string;
}

const mockQuotations: QuotationRecord[] = [
  {
    id: 'quot-01',
    quotationNumber: 'QTN-2026-0081',
    customerName: 'Apex Technologies Pvt Ltd',
    planName: 'Enterprise Annual Plan',
    subtotal: 100000,
    taxAmount: 18000,
    total: 118000,
    status: 'Active',
    createdAt: '2026-01-10',
    validUntil: '2026-02-10',
  },
  {
    id: 'quot-02',
    quotationNumber: 'QTN-2026-0084',
    customerName: 'Kochi Logistics Hub',
    planName: 'Standard Monthly Plan',
    subtotal: 20000,
    taxAmount: 3600,
    total: 23600,
    status: 'Confirmed',
    createdAt: '2026-10-01',
    validUntil: '2026-11-01',
  },
  {
    id: 'quot-03',
    quotationNumber: 'QTN-2026-0087',
    customerName: 'Kerala Ayurveda Solutions',
    planName: 'Starter Quarterly',
    subtotal: 8000,
    taxAmount: 1440,
    total: 9440,
    status: 'Draft',
    createdAt: '2026-10-18',
    validUntil: '2026-11-18',
  },
];

export default function QuotationsPage() {
  const columns: Column<QuotationRecord>[] = [
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
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.customerName}</div>
          <div className="text-xs text-[#96897b]">{item.planName}</div>
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
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-bold" />,
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
          description="Draft and manage subscription sales estimates with automatic 18% GST calculation before conversion to active orders."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Quotation
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
