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
import { SubscriptionStatus } from '@/types/domain';
import { Plus, Eye } from 'lucide-react';

interface SubscriptionRecord {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  productName: string;
  planFrequency: string;
  recurringAmount: number;
  startDate: string;
  nextRenewal: string;
  status: SubscriptionStatus | string;
}

const mockSubscriptions: SubscriptionRecord[] = [
  {
    id: 'sub-01',
    subscriptionNumber: 'SUB-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Quality Management System',
    planFrequency: 'Yearly',
    recurringAmount: 118000,
    startDate: '2026-01-15',
    nextRenewal: '2027-01-15',
    status: 'active',
  },
  {
    id: 'sub-02',
    subscriptionNumber: 'SUB-2026-0014',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Managed Cloud Infrastructure',
    planFrequency: 'Monthly',
    recurringAmount: 15000,
    startDate: '2026-10-01',
    nextRenewal: '2026-11-01',
    status: 'active',
  },
  {
    id: 'sub-03',
    subscriptionNumber: 'SUB-2026-0019',
    customerName: 'Kochi Logistics Hub',
    productName: 'Managed Cloud Infrastructure',
    planFrequency: 'Monthly',
    recurringAmount: 24000,
    startDate: '2026-02-15',
    nextRenewal: '2026-03-15',
    status: 'paused',
  },
  {
    id: 'sub-04',
    subscriptionNumber: 'SUB-2026-0022',
    customerName: 'Malabar Retailers Ltd',
    productName: 'Event Management System',
    planFrequency: 'Yearly',
    recurringAmount: 35400,
    startDate: '2026-03-01',
    nextRenewal: '2027-03-01',
    status: 'confirmed',
  },
];

export default function SubscriptionsPage() {
  const columns: Column<SubscriptionRecord>[] = [
    {
      header: 'Sub #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.subscriptionNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Product',
      accessorKey: 'productName',
      className: 'text-xs text-slate-600',
    },
    {
      header: 'Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {item.planFrequency}
        </span>
      ),
    },
    {
      header: 'Recurring (₹)',
      cell: (item) => <MoneyDisplay amount={item.recurringAmount} size="sm" className="font-semibold" />,
    },
    {
      header: 'Start Date',
      cell: (item) => <DateDisplay date={item.startDate} />,
    },
    {
      header: 'Next Billing',
      cell: (item) => <DateDisplay date={item.nextRenewal} />,
    },
    {
      header: 'Lifecycle Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <Link
          href={`/subscriptions/${item.id}`}
          className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors inline-block"
          title="Manage Lifecycle"
        >
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/subscriptions"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Subscriptions"
    >
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions Lifecycle"
          description="Track recurring customer contracts through the approved lifecycle: Draft → Quotation → Confirmed → Active → Closed (Task M3-05)."
          action={
            <Link href="/quotations/new">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                New via Quotation
              </Button>
            </Link>
          }
        />

        <DataTable
          columns={columns}
          data={mockSubscriptions}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
