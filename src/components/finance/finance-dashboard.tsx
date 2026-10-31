import React, { useState } from 'react';
import { FinanceDashboardMetrics, Invoice, Payment } from '@/types/finance';
import { MoneyDisplay } from './money-display';
import { StatusBadge } from './status-badge';
import { isInvoiceOverdue } from '@/lib/calculations/finance';

interface FinanceDashboardProps {
  metrics: FinanceDashboardMetrics;
  recentInvoices?: Invoice[];
  recentPayments?: Payment[];
  onTriggerBillingRun?: () => void;
  onFilterChange?: (filters: { periodStart?: string; periodEnd?: string }) => void;
  onSelectInvoice?: (invoice: Invoice) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  metrics,
  recentInvoices = [],
  recentPayments = [],
  onTriggerBillingRun,
  onFilterChange,
  onSelectInvoice,
}) => {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Billing Action */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleApplyFilter} className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium text-xs">From:</span>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium text-xs">To:</span>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Apply Filters
          </button>
        </form>

        {onTriggerBillingRun && (
          <button
            onClick={onTriggerBillingRun}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <span>⚡ Run Recurring Billing</span>
          </button>
        )}
      </div>

      {/* 4 Primary Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue Received (Collections) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Revenue Received (Cash)
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-700 font-mono tracking-tight">
            <MoneyDisplay amount={metrics.revenue_received} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Settled collections in selected period
          </p>
        </div>

        {/* Card 2: Invoiced Amount */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Invoiced
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
            <MoneyDisplay amount={metrics.invoiced_amount} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total value of billings issued
          </p>
        </div>

        {/* Card 3: Outstanding Balance */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Outstanding Balance
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-700 font-mono tracking-tight">
            <MoneyDisplay amount={metrics.outstanding_amount} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unpaid balance on confirmed invoices
          </p>
        </div>

        {/* Card 4: Overdue Invoices Alert */}
        <div className={`p-5 rounded-xl shadow-sm border ${metrics.overdue_invoices_count > 0 ? 'bg-rose-50/50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Overdue Invoices
            </span>
            {metrics.overdue_invoices_count > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-xs font-bold">
                {metrics.overdue_invoices_count} Due
              </span>
            )}
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-700 font-mono tracking-tight">
            <MoneyDisplay amount={metrics.overdue_amount} />
          </div>
          <p className="text-xs text-rose-600 mt-1">
            {metrics.overdue_invoices_count} invoices requiring follow-up
          </p>
        </div>
      </div>

      {/* Mini Tables Grid: Recent Invoices & Recent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Invoices</h3>
            <span className="text-xs text-slate-400">Latest 5</span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            {recentInvoices.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No invoices issued yet.</p>
            ) : (
              recentInvoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onSelectInvoice && onSelectInvoice(inv)}
                  className="py-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition"
                >
                  <div>
                    <span className="font-semibold text-slate-800 font-mono text-xs block">
                      {inv.invoice_number}
                    </span>
                    <span className="text-xs text-slate-400">Due: {inv.due_date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-slate-900 font-mono text-xs block">
                      <MoneyDisplay amount={inv.total} />
                    </span>
                    <StatusBadge status={inv.status} isOverdue={isInvoiceOverdue(inv)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Collections */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Collections</h3>
            <span className="text-xs text-slate-400">Latest 5</span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            {recentPayments.length === 0 ? (
              <p className="text-center py-6 text-slate-400 text-xs">No payments recorded yet.</p>
            ) : (
              recentPayments.slice(0, 5).map((p) => (
                <div key={p.id} className="py-2.5 flex justify-between items-center px-2">
                  <div>
                    <span className="font-semibold text-slate-800 font-mono text-xs block">
                      {p.payment_reference}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{p.payment_method}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-700 font-mono text-xs block">
                      +<MoneyDisplay amount={p.amount} />
                    </span>
                    <span className="text-xs text-slate-400">{p.payment_date.slice(0, 10)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
