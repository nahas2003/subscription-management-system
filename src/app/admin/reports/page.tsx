'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { IndianRupee, Receipt, Repeat, TrendingUp } from 'lucide-react';

interface RevenueBreakdownRow {
  period: string;
  invoicedTotal: number;
  revenueReceived: number;
  outstandingBalance: number;
  activeSubscriptionsCount: number;
  collectionRate: string;
}

const mockReportData: RevenueBreakdownRow[] = [
  {
    period: 'October 2026',
    invoicedTotal: 53100,
    revenueReceived: 0,
    outstandingBalance: 53100,
    activeSubscriptionsCount: 3,
    collectionRate: '0.0%',
  },
  {
    period: 'September 2026',
    invoicedTotal: 41300,
    revenueReceived: 41300,
    outstandingBalance: 0,
    activeSubscriptionsCount: 3,
    collectionRate: '100.0%',
  },
  {
    period: 'August 2026',
    invoicedTotal: 118000,
    revenueReceived: 118000,
    outstandingBalance: 0,
    activeSubscriptionsCount: 2,
    collectionRate: '100.0%',
  },
  {
    period: 'July 2026',
    invoicedTotal: 18000,
    revenueReceived: 18000,
    outstandingBalance: 0,
    activeSubscriptionsCount: 2,
    collectionRate: '100.0%',
  },
];

export default function ReportsPage() {
  const columns: Column<RevenueBreakdownRow>[] = [
    {
      header: 'Accounting Period',
      accessorKey: 'period',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Total Invoiced',
      cell: (item) => <MoneyDisplay amount={item.invoicedTotal} size="sm" />,
    },
    {
      header: 'Revenue Collected',
      cell: (item) => <MoneyDisplay amount={item.revenueReceived} size="sm" className="font-bold text-[#2b4c2b]" />,
    },
    {
      header: 'Outstanding Balance',
      cell: (item) => (
        <MoneyDisplay
          amount={item.outstandingBalance}
          size="sm"
          className={item.outstandingBalance > 0 ? 'font-bold text-[#b83a2b]' : 'text-[#50463c]'}
        />
      ),
    },
    {
      header: 'Collection Rate',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2.5 py-0.5 text-xs font-bold text-[#211b15]">
          {item.collectionRate}
        </span>
      ),
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/reports"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Financial & Subscription Reports"
    >
      <div className="space-y-6">
        <PageHeader
          title="Financial Reports & Analytics"
          description="Reconciled revenue metrics, collection rates, and subscription distributions across fiscal periods."
        />

        {/* Top Report Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue Collected"
            value={<MoneyDisplay amount={177400} size="xl" />}
            subtitle="YTD Verified Collections"
            icon={IndianRupee}
          />
          <StatCard
            title="Total Outstanding"
            value={<MoneyDisplay amount={53100} size="xl" />}
            subtitle="Across 2 unpaid invoices"
            icon={Receipt}
          />
          <StatCard
            title="Annualized Recurring"
            value={<MoneyDisplay amount={298000} size="xl" />}
            subtitle="Contracted Run-Rate"
            icon={Repeat}
          />
          <StatCard
            title="Collection Efficiency"
            value="89.2%"
            subtitle="+4.5% vs previous quarter"
            icon={TrendingUp}
          />
        </div>

        {/* Monthly Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#211b15]">FISCAL RECONCILIATION</h2>
            <span className="text-xs text-[#96897b]">Amounts in INR (₹)</span>
          </div>
          <DataTable
            columns={columns}
            data={mockReportData}
            keyExtractor={(item) => item.period}
          />
        </div>
      </div>
    </AppShell>
  );
}
