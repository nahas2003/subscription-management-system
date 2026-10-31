'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Calendar, ShieldCheck } from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  basePrice: number;
  minQty: number;
  renewalRule: string;
  pauseAllowed: boolean;
  earlyCloseAllowed: boolean;
  status: 'Active' | 'Draft';
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-01',
    name: 'Enterprise Annual License',
    frequency: 'Yearly',
    basePrice: 100000,
    minQty: 1,
    renewalRule: 'Automatic annual renewal on anniversary',
    pauseAllowed: false,
    earlyCloseAllowed: true,
    status: 'Active',
  },
  {
    id: 'plan-02',
    name: 'Pro Monthly Support Plan',
    frequency: 'Monthly',
    basePrice: 15000,
    minQty: 1,
    renewalRule: 'Billed 1st of every month',
    pauseAllowed: true,
    earlyCloseAllowed: true,
    status: 'Active',
  },
  {
    id: 'plan-03',
    name: 'Weekly Sprint Retainer',
    frequency: 'Weekly',
    basePrice: 5000,
    minQty: 2,
    renewalRule: 'Billed every Monday',
    pauseAllowed: true,
    earlyCloseAllowed: false,
    status: 'Active',
  },
  {
    id: 'plan-04',
    name: 'Daily Dedicated Resource',
    frequency: 'Daily',
    basePrice: 1200,
    minQty: 5,
    renewalRule: 'Pre-paid daily allocation',
    pauseAllowed: false,
    earlyCloseAllowed: true,
    status: 'Draft',
  },
];

export default function PlansPage() {
  const columns: Column<SubscriptionPlan>[] = [
    {
      header: 'Plan Name',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-500">{item.renewalRule}</div>
        </div>
      ),
    },
    {
      header: 'Billing Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-[#4F46E5]">
          {item.frequency}
        </span>
      ),
    },
    {
      header: 'Plan Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-semibold" />,
    },
    {
      header: 'Min Quantity',
      accessorKey: 'minQty',
      align: 'center',
      className: 'font-mono text-xs',
    },
    {
      header: 'Lifecycle Rules',
      cell: (item) => (
        <div className="text-xs space-y-0.5 text-slate-600">
          <div>Pause: <span className={item.pauseAllowed ? 'text-emerald-700 font-medium' : 'text-slate-400'}>{item.pauseAllowed ? 'Allowed' : 'Disabled'}</span></div>
          <div>Early Close: <span className={item.earlyCloseAllowed ? 'text-emerald-700 font-medium' : 'text-slate-400'}>{item.earlyCloseAllowed ? 'Allowed' : 'Disabled'}</span></div>
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
              Create New Plan
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
