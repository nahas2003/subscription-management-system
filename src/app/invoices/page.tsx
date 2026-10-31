import React from 'react';
import { Receipt, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing"
        description="Assigned to Member 4 (Finance Operations Developer) — Task M4-01 & M4-02."
      />

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <Receipt className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Member 4 Financial Module</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          This area manages recurring invoice generation from active subscriptions (Task M4-01),
          idempotent billing execution (Task M4-02), and invoice lifecycle (Draft &rarr; Confirmed &rarr; Paid).
        </p>
        <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-mono">
          Ready to consume subscriptions from Member 3 via <code className="text-indigo-600">store.getSubscriptions()</code>.
        </div>
      </div>
    </div>
  );
}
