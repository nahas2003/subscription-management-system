'use client';

import React, { useState, useEffect } from 'react';
import { Payment } from '@/types/finance';
import { MoneyDisplay } from '@/components/finance/money-display';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeCustomerId = 'cust_demo_001';

  const loadCustomerPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/customer/payments?customerId=${activeCustomerId}`);
      const json = await res.json();
      if (json.success) {
        setPayments(json.data);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerPayments();
  }, []);

  const totalSettled = payments.reduce((sum, p) => sum + p.amount, 0);

  const methodLabels: Record<string, string> = {
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    credit_card: 'Credit / Debit Card',
    cash: 'Cash',
    other: 'Other',
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Receipts</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical record of all payments received and applied to your subscriptions and invoices.
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm max-w-xs">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount Settled</span>
        <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono">
          <MoneyDisplay amount={totalSettled} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-sm text-slate-800">
          Receipt History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs">
              <tr>
                <th className="py-3 px-4">Receipt Ref #</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4">Reference Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">Loading receipts...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">No payment receipts found for your account.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.payment_reference}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                        {methodLabels[p.payment_method] || p.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-4">{p.payment_date.slice(0, 10)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      <MoneyDisplay amount={p.amount} />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{p.note || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
