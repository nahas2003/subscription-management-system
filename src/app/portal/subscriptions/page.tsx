'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, SubscriptionStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Repeat, Eye } from 'lucide-react';

interface SubscriptionDetail {
  id: string;
  subscriptionNumber: string;
  productName: string;
  planName: string;
  frequency: string;
  recurringPrice: number;
  startDate: string;
  nextRenewal: string;
  status: SubscriptionStatus;
  terms: string;
}

const mockSubscriptions: SubscriptionDetail[] = [
  {
    id: 'sub-01',
    subscriptionNumber: 'SUB-2026-0012',
    productName: 'Quality Management System',
    planName: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    recurringPrice: 118000,
    startDate: '2026-01-15',
    nextRenewal: '2027-01-15',
    status: 'Active',
    terms: 'Enterprise SLA with 99.9% uptime guarantee, 24/7 dedicated support phone line, and unlimited audit user seats.',
  },
  {
    id: 'sub-02',
    subscriptionNumber: 'SUB-2026-0018',
    productName: 'Managed Cloud Infrastructure',
    planName: 'Pro Monthly Support',
    frequency: 'Monthly',
    recurringPrice: 15000,
    startDate: '2026-06-01',
    nextRenewal: '2026-11-01',
    status: 'Active',
    terms: 'Managed high-availability cluster in Mumbai region with daily encrypted snapshots and automated security patching.',
  },
];

export default function CustomerSubscriptionsPage() {
  const [selectedSub, setSelectedSub] = useState<SubscriptionDetail | null>(null);

  const columns: Column<SubscriptionDetail>[] = [
    {
      header: 'Sub #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.subscriptionNumber}
        </span>
      ),
    },
    {
      header: 'Product & Plan',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.productName}</div>
          <div className="text-xs text-[#96897b]">{item.planName}</div>
        </div>
      ),
    },
    {
      header: 'Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2 py-0.5 text-xs font-bold text-[#211b15]">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[3.75px] bg-[#fdf6ed] text-[#8c591b]">
                    <Repeat className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#211b15]">{selectedSub.productName}</h3>
                    <span className="font-mono text-xs text-[#96897b]">{selectedSub.subscriptionNumber}</span>
                  </div>
                </div>
                <StatusBadge status={selectedSub.status} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Plan Name</span>
                  <span className="font-semibold text-[#211b15]">{selectedSub.planName}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Billing Cycle</span>
                  <span className="font-semibold text-[#211b15]">{selectedSub.frequency}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Recurring Amount</span>
                  <MoneyDisplay amount={selectedSub.recurringPrice} size="lg" />
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Next Renewal Date</span>
                  <DateDisplay date={selectedSub.nextRenewal} format="long" />
                </div>
              </div>

              <div className="rounded-[3.75px] bg-[#efe9e0]/40 p-3.5 border border-[#c7bcaf] text-xs text-[#50463c]">
                <span className="font-bold text-[#211b15] block mb-1">Contract Terms & Notes:</span>
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
