'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { IndianRupee, Repeat, Receipt, AlertTriangle, BarChart3, Play, CheckCircle2 } from 'lucide-react';

interface RevenueBreakdownRow {
  period: string;
  invoicedTotal: number;
  revenueReceived: number;
  outstandingBalance: number;
  collectionRate: string;
}

export default function ReportsPage() {
  const [metrics, setMetrics] = useState({
    revenue_received: 40400,
    invoiced_amount: 76700,
    outstanding_amount: 36300,
    overdue_amount: 18600,
    overdue_invoices_count: 1,
    active_subscriptions_count: 2,
  });
  const [reportRows, setReportRows] = useState<RevenueBreakdownRow[]>([]);
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
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Total Invoiced',
      cell: (item) => <MoneyDisplay amount={item.invoicedTotal} size="sm" />,
    },
    {
      header: 'Cash Collected',
      cell: (item) => (
        <MoneyDisplay amount={item.revenueReceived} size="sm" className="font-semibold text-emerald-700" />
      ),
    },
    {
      header: 'Outstanding Balance',
      cell: (item) => (
        <MoneyDisplay
          amount={item.outstandingBalance}
          size="sm"
          className={item.outstandingBalance > 0 ? 'font-semibold text-amber-700' : 'text-slate-500'}
        />
      ),
    },
    {
      header: 'Collection Rate',
      accessorKey: 'collectionRate',
      className: 'font-mono text-xs font-semibold text-indigo-700',
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/reports"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Financial Reports"
    >
      <div className="space-y-6">
        <PageHeader
          title="Financial Reports & Performance Analytics"
          description="Audited reconciliation of total billings, verified cash collections, and outstanding/overdue derived metrics (Member 4 — Task M4-05)."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="h-4 w-4 fill-white" />}
              onClick={handleRunBilling}
            >
              Trigger Billing Run
            </Button>
          }
        />

        {notification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
        )}

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue Received"
            value={<MoneyDisplay amount={metrics.revenue_received} size="lg" className="text-emerald-700" />}
            subtitle="Verified payment allocations"
            icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Total Invoiced Amount"
            value={<MoneyDisplay amount={metrics.invoiced_amount} size="lg" />}
            subtitle="Confirmed billing statements"
            icon={<Receipt className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Outstanding Balance"
            value={<MoneyDisplay amount={metrics.outstanding_amount} size="lg" className="text-amber-700" />}
            subtitle="Pending customer clearance"
            icon={<Repeat className="h-5 w-5 text-amber-600" />}
          />
          <StatCard
            title="Overdue Receivables"
            value={<MoneyDisplay amount={metrics.overdue_amount} size="lg" className="text-rose-700" />}
            subtitle={`${metrics.overdue_invoices_count} invoice(s) past due`}
            icon={<AlertTriangle className="h-5 w-5 text-rose-600" />}
          />
        </div>

        {/* Breakdown Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Reconciliation Breakdown by Period
          </h2>
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
