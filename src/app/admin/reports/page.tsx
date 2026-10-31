'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { IndianRupee, Repeat, Receipt, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';

interface RevenueBreakdownRow {
  period: string;
  invoicedTotal: number;
  revenueReceived: number;
  outstandingBalance: number;
  activeSubscriptionsCount?: number;
  collectionRate: string;
}

const mockReportData: RevenueBreakdownRow[] = [
  {
    period: 'Current Period (October 2026)',
    invoicedTotal: 76700,
    revenueReceived: 40400,
    outstandingBalance: 36300,
    activeSubscriptionsCount: 3,
    collectionRate: '52.7%',
  },
  {
    period: 'Historical Baseline (Q1–Q3 2026)',
    invoicedTotal: 159700,
    revenueReceived: 159700,
    outstandingBalance: 0,
    activeSubscriptionsCount: 2,
    collectionRate: '100.0%',
  },
];

export default function ReportsPage() {
  const [metrics, setMetrics] = useState({
    revenue_received: 40400,
    invoiced_amount: 76700,
    outstanding_amount: 36300,
    overdue_amount: 18600,
    overdue_invoices_count: 1,
    active_subscriptions_count: 2,
  });
  const [reportRows, setReportRows] = useState<RevenueBreakdownRow[]>(mockReportData);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/reports/finance-summary');
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data);
        const invoiced = json.data.invoiced_amount || 0;
        const received = json.data.revenue_received || 0;
        const outstanding = json.data.outstanding_amount || 0;
        const rate = invoiced > 0 ? ((received / invoiced) * 100).toFixed(1) + '%' : '0.0%';

        setReportRows([
          {
            period: 'Current Period (October 2026)',
            invoicedTotal: invoiced,
            revenueReceived: received,
            outstandingBalance: outstanding,
            collectionRate: rate,
          },
          {
            period: 'Historical Baseline (Q1–Q3 2026)',
            invoicedTotal: 159700,
            revenueReceived: 159700,
            outstandingBalance: 0,
            collectionRate: '100.0%',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load finance summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunBilling = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/billing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        const count = json.data.summary.invoices_generated.length;
        setNotification(`Billing execution complete: ${count} new invoice(s) generated.`);
        await loadData();
      }
    } catch (err: any) {
      setNotification(`Billing execution error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<RevenueBreakdownRow>[] = [
    {
      header: 'Accounting Period',
      accessorKey: 'period',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Total Billed',
      cell: (item) => <MoneyDisplay amount={item.invoicedTotal} size="sm" />,
    },
    {
      header: 'Cash Collected',
      cell: (item) => (
        <MoneyDisplay amount={item.revenueReceived} size="sm" className="font-bold text-[#2b4c2b]" />
      ),
    },
    {
      header: 'Pending Balance',
      cell: (item) => (
        <MoneyDisplay amount={item.outstandingBalance} size="sm" className="font-bold text-[#b83a2b]" />
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
      title="Financial Analytics"
    >
      <div className="space-y-6">
        <PageHeader
          title="Financial Reports & Performance Analytics"
          description="Audited reconciliation of total billings, verified cash collections, and outstanding/overdue derived metrics."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={handleRunBilling}
            >
              Trigger Billing Run
            </Button>
          }
        />

        {notification && (
          <div className="p-3 bg-[#eef5ee] border border-[#c5d8c4] text-[#2b4c2b] rounded-[7.5px] text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7a9779]" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-[#50463c] hover:text-[#211b15]">
              ✕
            </button>
          </div>
        )}

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue Received"
            value={<MoneyDisplay amount={metrics.revenue_received} size="xl" className="text-[#2b4c2b]" />}
            subtitle="Verified payment allocations"
            icon={IndianRupee}
          />
          <StatCard
            title="Total Invoiced Amount"
            value={<MoneyDisplay amount={metrics.invoiced_amount} size="xl" />}
            subtitle="Confirmed billing statements"
            icon={Receipt}
          />
          <StatCard
            title="Outstanding Balance"
            value={<MoneyDisplay amount={metrics.outstanding_amount} size="xl" className="text-[#8c591b]" />}
            subtitle="Pending customer clearance"
            icon={Repeat}
          />
          <StatCard
            title="Overdue Receivables"
            value={<MoneyDisplay amount={metrics.overdue_amount} size="xl" className="text-[#b83a2b]" />}
            subtitle={`${metrics.overdue_invoices_count} invoice(s) past due`}
            icon={AlertTriangle}
          />
        </div>

        {/* Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#211b15]">FISCAL RECONCILIATION</h2>
            <span className="text-xs text-[#96897b]">Amounts in INR (₹)</span>
          </div>
          <DataTable
            columns={columns}
            data={reportRows}
            keyExtractor={(item) => item.period}
            isLoading={isLoading}
          />
        </div>
      </div>
    </AppShell>
  );
}
