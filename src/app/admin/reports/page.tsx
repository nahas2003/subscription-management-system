'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { IndianRupee, Repeat, Receipt, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';

interface RevenueBreakdownRow {
  period: string;
  invoicedTotal: number;
  revenueReceived: number;
  outstandingBalance: number;
  collectionRate: string;
}

const mockReportData: RevenueBreakdownRow[] = [
  {
    period: 'October 2026',
    invoicedTotal: 70800,
    revenueReceived: 17700,
    outstandingBalance: 53100,
    collectionRate: '25.0%',
  },
  {
    period: 'September 2026',
    invoicedTotal: 17700,
    revenueReceived: 17700,
    outstandingBalance: 0,
    collectionRate: '100.0%',
  },
  {
    period: 'August 2026',
    invoicedTotal: 24000,
    revenueReceived: 24000,
    outstandingBalance: 0,
    collectionRate: '100.0%',
  },
  {
    period: 'January 2026',
    invoicedTotal: 118000,
    revenueReceived: 118000,
    outstandingBalance: 0,
    collectionRate: '100.0%',
  },
];

export default function ReportsPage() {
  const columns: Column<RevenueBreakdownRow>[] = [
    {
      header: 'Accounting Period',
      accessorKey: 'period',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Total Invoiced',
      cell: (item) => <MoneyDisplay amount={item.invoicedTotal} size="sm" />,
    },
    {
      header: 'Revenue Collected',
      cell: (item) => <MoneyDisplay amount={item.revenueReceived} size="sm" className="font-bold text-emerald-700" />,
    },
    {
      header: 'Outstanding Balance',
      cell: (item) => (
        <MoneyDisplay
          amount={item.outstandingBalance}
          size="sm"
          className={item.outstandingBalance > 0 ? 'font-bold text-amber-700' : 'text-slate-500'}
        />
      ),
    },
    {
      header: 'Collection Rate',
      cell: (item) => (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
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
            title="Avg Collection Efficiency"
            value="89.2%"
            subtitle="+4.5% vs previous quarter"
            icon={TrendingUp}
          />
        </div>

        {/* Monthly Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Fiscal Period Reconciliation</h2>
            <span className="text-xs text-slate-400">All amounts in INR (₹)</span>
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
