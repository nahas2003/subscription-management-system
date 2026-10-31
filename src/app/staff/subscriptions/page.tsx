'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
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

const mockStaffSubscriptions: StaffSubscription[] = [
  {
    id: 'sub-01',
    subscriptionNumber: 'SUB-2026-0001',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Quality Management System',
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
    recurringAmount: 15000,
    startDate: '2026-10-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
];

export default function StaffSubscriptionsPage() {
  const columns: Column<StaffSubscription>[] = [
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
      header: 'Recurring',
      cell: (item) => <MoneyDisplay amount={item.recurringAmount} size="sm" className="font-semibold" />,
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
      role="staff"
      currentPath="/staff/subscriptions"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Subscriptions"
    >
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions"
          description="Operational subscription lifecycle monitoring (Task M3-05)."
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
          data={mockStaffSubscriptions}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
