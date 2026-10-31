'use client';

import React, { useState, useEffect } from 'react';
import { FinanceDashboardMetrics, Invoice, Payment } from '@/types/finance';
import { FinanceDashboard } from '@/components/finance/finance-dashboard';

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

  const loadData = async (filterParams: { periodStart?: string; periodEnd?: string } = {}) => {
    try {
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
    } catch (err) {
      console.error('Failed to load reports data:', err);
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
        body: JSON.stringify({ subscriptions: [] }), // Connects to subscription repo
      });
      const json = await res.json();
      if (json.success) {
        alert(`Billing run completed! Invoices generated: ${json.data.summary.invoices_generated.length}`);
        await loadData();
      }
    } catch (err) {
      console.error('Billing run trigger failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Reports & Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time metrics for cash collections, total billings, outstanding debt, and overdue follow-ups.
        </p>
      </div>

      <FinanceDashboard
        metrics={metrics}
        recentInvoices={recentInvoices}
        recentPayments={recentPayments}
        onTriggerBillingRun={handleTriggerBilling}
        onFilterChange={loadData}
      />
    </div>
  );
}
