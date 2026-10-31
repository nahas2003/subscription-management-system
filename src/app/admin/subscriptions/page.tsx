'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
import { Plus, Repeat, ArrowRight } from 'lucide-react';

interface SubscriptionRecord {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  productName: string;
  planName: string;
  frequency: string;
  recurringAmount: number;
  startDate: string;
  nextRenewal: string;
  status: SubscriptionStatus;
}

const mockSubscriptions: SubscriptionRecord[] = [
  {
    id: 'sub-01',
    subscriptionNumber: 'SUB-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Quality Management System',
    planName: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    recurringAmount: 118000,
    startDate: '2026-01-15',
    nextRenewal: '2027-01-15',
    status: 'Active',
  },
  {
    id: 'sub-02',
    subscriptionNumber: 'SUB-2026-0014',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Managed Cloud Infrastructure',
    planName: 'Pro Monthly Support',
    frequency: 'Monthly',
    recurringAmount: 15000,
    startDate: '2026-10-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
  {
    id: 'sub-03',
    subscriptionNumber: 'SUB-2026-0022',
    customerName: 'Kochi Logistics Hub',
    productName: 'Fleet Tracker & Subscriptions',
    planName: 'Standard Monthly Plan',
    frequency: 'Monthly',
    recurringAmount: 24000,
    startDate: '2026-10-10',
    nextRenewal: '2026-11-10',
    status: 'Confirmed',
  },
  {
    id: 'sub-04',
    subscriptionNumber: 'SUB-2025-0044',
    customerName: 'Malabar Retailers Ltd',
    productName: 'Event Management System',
    planName: 'Event Single Pass',
    frequency: 'Monthly',
    recurringAmount: 8500,
    startDate: '2025-06-01',
    nextRenewal: '2026-06-01',
    status: 'Closed',
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
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.customerName}</div>
          <div className="text-xs text-slate-500">{item.productName}</div>
        </div>
      ),
    },
    {
      header: 'Plan / Frequency',
      cell: (item) => (
        <div className="text-xs">
          <span className="text-slate-800 font-medium">{item.planName}</span>
          <span className="block text-slate-400">({item.frequency})</span>
        </div>
      ),
    },
    {
      header: 'Recurring',
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
          description="Track recurring customer contracts through the approved lifecycle: Draft → Quotation → Confirmed → Active → Closed."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Subscription
            </Button>
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
