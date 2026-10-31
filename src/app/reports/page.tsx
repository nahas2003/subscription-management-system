import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance & Operations Reports"
        description="Assigned to Member 4 & Member 2 — Task M4-05."
      />

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <BarChart3 className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Financial Reporting & Analytics</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Aggregates revenue received, invoiced totals, outstanding balances, and overdue invoices
          across selected date ranges.
        </p>
      </div>
    </div>
  );
}
