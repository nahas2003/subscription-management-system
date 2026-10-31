'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  basePrice: number;
  minQty: number;
  status: 'Active' | 'Closed';
  renewalRule: string;
  pauseAllowed: boolean;
  earlyCloseAllowed: boolean;
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-01',
    name: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    basePrice: 100000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Auto-renews every 12 months with 30-day notice window',
    pauseAllowed: true,
    earlyCloseAllowed: false,
  },
  {
    id: 'plan-02',
    name: 'Pro Monthly Support',
    frequency: 'Monthly',
    basePrice: 15000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Billed on 1st of every month, 7-day payment grace period',
    pauseAllowed: true,
    earlyCloseAllowed: true,
  },
  {
    id: 'plan-03',
    name: 'Standard Monthly Plan',
    frequency: 'Monthly',
    basePrice: 20000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Billed monthly on subscription creation anniversary',
    pauseAllowed: false,
    earlyCloseAllowed: true,
  },
  {
    id: 'plan-04',
    name: 'Starter Weekly Trial',
    frequency: 'Weekly',
    basePrice: 3000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Billed every 7 days up to maximum 4 cycles',
    pauseAllowed: false,
    earlyCloseAllowed: true,
  },
];

export default function PlansPage() {
  const columns: Column<SubscriptionPlan>[] = [
    {
      header: 'Plan Name',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.name}</div>
          <div className="text-xs text-[#96897b]">{item.renewalRule}</div>
        </div>
      ),
    },
    {
      header: 'Billing Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 text-xs font-bold text-[#8c591b]">
          {item.frequency}
        </span>
      ),
    },
    {
      header: 'Plan Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-bold" />,
    },
    {
      header: 'Min Quantity',
      accessorKey: 'minQty',
      align: 'center',
      className: 'font-mono text-xs font-bold text-[#211b15]',
    },
    {
      header: 'Lifecycle Rules',
      cell: (item) => (
        <div className="text-xs space-y-0.5 text-[#50463c]">
          <div>Pause: <span className={item.pauseAllowed ? 'text-[#2b4c2b] font-bold' : 'text-[#96897b]'}>{item.pauseAllowed ? 'Allowed' : 'Disabled'}</span></div>
          <div>Early Close: <span className={item.earlyCloseAllowed ? 'text-[#2b4c2b] font-bold' : 'text-[#96897b]'}>{item.earlyCloseAllowed ? 'Allowed' : 'Disabled'}</span></div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/plans"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Subscription Plans"
    >
      <div className="space-y-6">
        <PageHeader
          title="Subscription Plans"
          description="Configure recurring billing frequencies (Daily, Weekly, Monthly, Yearly), pricing tiers, and cancellation policies."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Plan
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockPlans}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
