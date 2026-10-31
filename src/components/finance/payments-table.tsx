import React, { useState, useMemo } from 'react';
import { Payment } from '@/types/finance';
import { MoneyDisplay } from './money-display';

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
}

export const PaymentsTable: React.FC<PaymentsTableProps> = ({
  payments,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.payment_method !== methodFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchesRef = p.payment_reference.toLowerCase().includes(q);
        const matchesCust = p.customer_id.toLowerCase().includes(q);
        if (!matchesRef && !matchesCust) return false;
      }
      return true;
    });
  }, [payments, methodFilter, search]);

  const methodLabels: Record<string, string> = {
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    credit_card: 'Credit Card',
    cash: 'Cash',
    other: 'Other',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Search reference or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Methods</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredPayments.length}</span> recorded payments
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Payment Ref #</th>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4">Note / Memo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Loading payment history...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No recorded payments found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                    {p.payment_reference}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">
                    {p.customer_id.slice(0, 12)}...
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                      {methodLabels[p.payment_method] || p.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {p.payment_date.slice(0, 10)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700 font-mono">
                    <MoneyDisplay amount={p.amount} />
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 max-w-xs truncate">
                    {p.note || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
