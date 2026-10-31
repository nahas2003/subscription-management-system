'use client';

import React, { useState, useEffect } from 'react';
import { Payment, Invoice, PaymentMethod } from '@/types/finance';
import { PaymentsTable } from '@/components/finance/payments-table';
import { PaymentModal } from '@/components/finance/payment-modal';
import { MoneyDisplay } from '@/components/finance/money-display';
import { PageHeader } from '@/components/ui/page-header';
import { store } from '@/lib/store';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  Building2,
  Wallet,
  ArrowUpRight,
  X,
} from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [unsettledInvoices, setUnsettledInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [payRes, invRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/invoices?status=confirmed'),
      ]);
      const [payJson, invJson] = await Promise.all([payRes.json(), invRes.json()]);

      if (payJson.success) setPayments(payJson.data);
      if (invJson.success) {
        // Only invoices with positive balance due
        const dueList = (invJson.data as Invoice[]).filter((i) => i.balance_due > 0);
        setUnsettledInvoices(dueList);
        if (dueList.length > 0 && !selectedInvoice) {
          setSelectedInvoice(dueList[0]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load payments data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordPayment = async (params: {
    invoiceId: string;
    customerId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    note?: string;
  }) => {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Payment recording failed');
    }
    setNotification({
      type: 'success',
      message: `Payment of ₹${params.amount.toLocaleString('en-IN')} recorded successfully!`,
    });
    setIsRecordModalOpen(false);
    await loadData();
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  // Group by payment method
  const upiTotal = payments
    .filter((p) => p.payment_method === 'upi')
    .reduce((sum, p) => sum + p.amount, 0);
  const bankTransferTotal = payments
    .filter((p) => p.payment_method === 'bank_transfer')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Recording & Ledger"
        description="Manual payment recording, transaction reconciliation, payment allocations, and real-time outstanding balance settlement (Member 4 — Task M4-04)."
        actions={
          unsettledInvoices.length > 0 ? (
            <button
              onClick={() => {
                if (unsettledInvoices.length > 0) {
                  setSelectedInvoice(unsettledInvoices[0]);
                }
                setIsRecordModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Record Payment
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-medium px-3 py-1.5 bg-slate-100 rounded-lg">
              No outstanding invoices to settle
            </div>
          )
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

      {/* Overview Tallies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Settled</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            <MoneyDisplay amount={totalCollected} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {payments.length} verified payment receipt(s)
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Bank Transfers (NEFT/RTGS)</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            <MoneyDisplay amount={bankTransferTotal} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Corporate wire transactions</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">UPI Instant Settlements</span>
            <ArrowUpRight className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-purple-600 font-mono">
            <MoneyDisplay amount={upiTotal} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">VPA / QR Intent payments</span>
        </div>
      </div>

      {/* Payment Selection Selector if modal opened */}
      {isRecordModalOpen && unsettledInvoices.length > 0 && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Select Invoice to Settle</h3>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Outstanding Invoice:
              </label>
              <select
                value={selectedInvoice.id}
                onChange={(e) => {
                  const inv = unsettledInvoices.find((i) => i.id === e.target.value);
                  if (inv) setSelectedInvoice(inv);
                }}
                className="w-full p-2.5 text-sm border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                {unsettledInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoice_number} — Due: ₹{inv.balance_due.toLocaleString('en-IN')} (Customer: {inv.customer_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <PaymentModal
                invoice={selectedInvoice}
                isOpen={true}
                onClose={() => setIsRecordModalOpen(false)}
                onRecordPayment={handleRecordPayment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <PaymentsTable payments={payments} isLoading={isLoading} />
    </div>
  );
}
