import { AppShell } from '@/components/layout/AppShell';
'use client';

import React, { useState, useEffect } from 'react';
import { FinanceDashboardMetrics, Invoice, Payment } from '@/types/finance';
import { FinanceDashboard } from '@/components/finance/finance-dashboard';
import { PageHeader } from '@/components/ui/page-header';
import { BarChart3, Play, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<FinanceDashboardMetrics>({
    currency: 'INR',
    active_subscriptions_count: 0,
    revenue_received: 0,
    invoiced_amount: 0,
    outstanding_amount: 0,
    overdue_invoices_count: 0,
    overdue_amount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadData = async (filterParams: { periodStart?: string; periodEnd?: string } = {}) => {
    try {
      setIsLoading(true);
      const qs = new URLSearchParams(filterParams as Record<string, string>).toString();
      const [summaryRes, invRes, payRes] = await Promise.all([
        fetch(`/api/reports/finance-summary${qs ? '?' + qs : ''}`),
        fetch('/api/invoices'),
        fetch('/api/payments'),
      ]);

      const [summaryJson, invJson, payJson] = await Promise.all([
        summaryRes.json(),
        invRes.json(),
        payRes.json(),
      ]);

      if (summaryJson.success) setMetrics(summaryJson.data);
      if (invJson.success) setRecentInvoices(invJson.data);
      if (payJson.success) setRecentPayments(payJson.data);
    } catch (err: any) {
      console.error('Failed to load reports data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTriggerBilling = async () => {
    try {
      const res = await fetch('/api/billing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        const count = json.data.summary.invoices_generated.length;
        const skipped = json.data.summary.skipped_duplicate_count;
        setNotification({
          type: 'success',
          message: `Billing execution complete: ${count} new invoice(s) generated, ${skipped} duplicate period(s) skipped.`,
        });
        await loadData();
      } else {
        setNotification({
          type: 'error',
          message: json.error?.message || 'Billing run failed',
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <AppShell role="admin" currentPath="/reports" user={{ name: 'Admin Operations', email: 'admin@brightloop.in', role: 'admin' }} title="Finance Reports">
      <div className="space-y-6">
      <PageHeader
        title="Financial Reports & Analytics"
        description="Cash collections vs. invoiced billing reconciliation, outstanding debt tracking, and automated billing runs (Member 4 — Task M4-05)."
        actions={
          <button
            onClick={handleTriggerBilling}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            Trigger Billing Run
          </button>
        }
      />

      {/* Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Finance Dashboard Engine */}
      <FinanceDashboard
        metrics={metrics}
        recentInvoices={recentInvoices}
        recentPayments={recentPayments}
        onTriggerBillingRun={handleTriggerBilling}
        onFilterChange={loadData}
      />
    </div>
    </AppShell>
  );
}
