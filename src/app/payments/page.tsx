import React from 'react';
import { CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Recording"
        description="Assigned to Member 4 (Finance Operations Developer) — Task M4-04."
      />

      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center max-w-lg mx-auto shadow-sm">
        <CreditCard className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">Member 4 Payment Allocation</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Record payment method, amount, date, and note against confirmed invoices. Maintains outstanding balances
          and transitions invoices to Paid when settled.
        </p>
      </div>
    </div>
  );
}
