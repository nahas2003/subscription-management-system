import React from 'react';
import { Tag } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function DiscountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts & Promos"
        description="Assigned to Member 4 (Finance Operations Developer) — Task M4-03."
      />

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <Tag className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Member 4 Discount Management</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Admin-configured fixed amount and percentage discounts, threshold conditions, start/end dates,
          and usage limits to be applied to future invoices.
        </p>
      </div>
    </div>
  );
}
