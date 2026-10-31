'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Repeat, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SubscriptionDetail {
  id: string;
  subscriptionNumber: string;
  productName: string;
  planName: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  recurringPrice: number;
  startDate: string;
  nextRenewal: string;
  status: SubscriptionStatus;
  terms: string;
}

const mockSubscriptions: SubscriptionDetail[] = [
  {
    id: 'sub-001',
    subscriptionNumber: 'SUB-2026-0001',
    productName: 'Quality Management System',
    planName: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    recurringPrice: 118000,
    startDate: '2026-01-15',
    nextRenewal: '2027-01-15',
    status: 'Active',
    terms: '12-month minimum contract with automatic renewal unless cancelled 30 days prior.',
  },
  {
    id: 'sub-002',
    subscriptionNumber: 'SUB-2026-0014',
    productName: 'Managed Cloud Infrastructure',
    planName: 'Pro Monthly Support',
    frequency: 'Monthly',
    recurringPrice: 15000,
    startDate: '2026-10-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
    terms: 'Monthly recurring SLA coverage, billed 1st of each calendar month.',
  },
  {
    id: 'sub-003',
    subscriptionNumber: 'SUB-2025-0089',
    productName: 'Event Management System',
    planName: 'Standard Event Pass',
    frequency: 'Monthly',
    recurringPrice: 8500,
    startDate: '2025-11-01',
    nextRenewal: '2026-05-01',
    status: 'Closed',
    terms: 'Contract ended on schedule.',
  },
];

export default function CustomerSubscriptionsPage() {
  const [selectedSub, setSelectedSub] = useState<SubscriptionDetail | null>(null);

  const columns: Column<SubscriptionDetail>[] = [
    {
      header: 'Sub #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.subscriptionNumber}
        </span>
      ),
    },
    {
      header: 'Product & Plan',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.productName}</div>
          <div className="text-xs text-slate-500">{item.planName}</div>
        </div>
      ),
    },
    {
      header: 'Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          {item.frequency}
        </span>
      ),
    },
    {
      header: 'Recurring Price',
      cell: (item) => <MoneyDisplay amount={item.recurringPrice} size="sm" />,
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
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedSub(item)}
          leftIcon={<Eye className="h-3.5 w-3.5" />}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal/subscriptions"
      user={{ name: 'Apex Technologies Pvt Ltd', email: 'billing@apextech.in', role: 'customer' }}
      title="My Subscriptions"
    >
      <div className="space-y-6">
        <PageHeader
          title="My Subscriptions"
          description="View your active and historical subscription contracts with BrightLoop."
          breadcrumbs={[
            { label: 'Portal', href: '/portal' },
            { label: 'My Subscriptions' },
          ]}
        />

        <DataTable
          columns={columns}
          data={mockSubscriptions}
          keyExtractor={(item) => item.id}
        />

        {/* Subscription Detail Modal */}
        {selectedSub && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <Repeat className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedSub.productName}</h3>
                    <span className="font-mono text-xs text-slate-400">{selectedSub.subscriptionNumber}</span>
                  </div>
                </div>
                <StatusBadge status={selectedSub.status} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Plan Name</span>
                  <span className="font-medium text-slate-800">{selectedSub.planName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Billing Cycle</span>
                  <span className="font-medium text-slate-800">{selectedSub.frequency}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Recurring Amount</span>
                  <MoneyDisplay amount={selectedSub.recurringPrice} size="lg" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Next Renewal Date</span>
                  <DateDisplay date={selectedSub.nextRenewal} format="long" />
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600">
                <span className="font-semibold text-slate-700 block mb-1">Contract Terms & Notes:</span>
                {selectedSub.terms}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" size="md" onClick={() => setSelectedSub(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
