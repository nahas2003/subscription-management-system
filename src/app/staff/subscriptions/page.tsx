'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Plus, Eye } from 'lucide-react';

interface StaffSubscription {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  productName: string;
  recurringAmount: number;
  startDate: string;
  nextRenewal: string;
  status: SubscriptionStatus;
}

const mockSubscriptions: StaffSubscription[] = [
  {
    id: 'sub-01',
    subscriptionNumber: 'SUB-2026-0012',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Quality Management System',
    recurringAmount: 118000,
    startDate: '2026-01-15',
    nextRenewal: '2027-01-15',
    status: 'Active',
  },
  {
    id: 'sub-02',
    subscriptionNumber: 'SUB-2026-0018',
    customerName: 'Kochi Logistics Hub',
    productName: 'Managed Cloud Infrastructure',
    recurringAmount: 15000,
    startDate: '2026-06-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
  {
    id: 'sub-03',
    subscriptionNumber: 'SUB-2026-0022',
    customerName: 'Malabar Retailers Ltd',
    productName: 'Managed Cloud Infrastructure',
    recurringAmount: 15000,
    startDate: '2026-08-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
];

export default function StaffSubscriptionsPage() {
  const columns: Column<StaffSubscription>[] = [
    {
      header: 'Sub #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.subscriptionNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Product',
      accessorKey: 'productName',
      className: 'text-xs text-[#96897b]',
    },
    {
      header: 'Recurring',
      cell: (item) => <MoneyDisplay amount={item.recurringAmount} size="sm" className="font-bold" />,
    },
    {
      header: 'Start Date',
      cell: (item) => <DateDisplay date={item.startDate} />,
    },
    {
      header: 'Next Renewal',
      cell: (item) => <DateDisplay date={item.nextRenewal} />,
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
          href={`/subscriptions/${item.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:text-[#6c3200] transition-colors"
          title="Manage Lifecycle"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Manage</span>
        </Link>
      ),
    },
  ];

  return (
    <AppShell
      role="staff"
      currentPath="/staff/subscriptions"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Subscriptions"
    >
      <div className="space-y-6">
        <PageHeader
          title="Active Subscriptions"
          description="Operational subscription lifecycle monitoring and renewal tracking."
          action={
            <Link href="/quotations/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
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
