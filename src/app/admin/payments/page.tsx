'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Plus, CreditCard, X, CheckCircle2 } from 'lucide-react';
import { store } from '@/lib/store';

interface PaymentRecord {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: 'Confirmed' | 'Paid';
}

const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-01',
    paymentRef: 'PAY-2026-001',
    invoiceNumber: 'INV-2026-002',
    customerName: 'Apex Global Media',
    amount: 35400,
    paymentDate: '2026-10-12',
    paymentMethod: 'Bank Transfer (NEFT)',
    status: 'Confirmed',
  },
  {
    id: 'pay-02',
    paymentRef: 'PAY-2026-002',
    invoiceNumber: 'INV-2026-003',
    customerName: 'BrightWave Logistics',
    amount: 5000,
    paymentDate: '2026-10-05',
    paymentMethod: 'UPI Merchant Intent',
    status: 'Confirmed',
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [payRes, invRes] = await Promise.all([
        fetch('/api/payments'),
        fetch('/api/invoices?status=confirmed'),
      ]);
      const [payJson, invJson] = await Promise.all([payRes.json(), invRes.json()]);

      if (payJson.success && payJson.data.length > 0) {
        const mapped: PaymentRecord[] = payJson.data.map((p: any) => {
          const cust = store.getCustomerById(p.customer_id);
          const customerName = cust ? cust.name : `Customer (${p.customer_id})`;
          return {
            id: p.id,
            paymentRef: p.payment_number || `PAY-${p.id.slice(0, 8)}`,
            invoiceNumber: p.invoice_id ? `INV-${p.invoice_id.slice(0, 8)}` : 'On Account',
            customerName,
            amount: p.amount,
            paymentDate: p.payment_date ? p.payment_date.slice(0, 10) : '2026-10-31',
            paymentMethod:
              p.payment_method === 'bank_transfer'
                ? 'Bank Transfer (NEFT)'
                : p.payment_method === 'upi'
                ? 'UPI Merchant Intent'
                : 'Direct Settlement',
            status: 'Confirmed',
          };
        });
        setPayments(mapped);
      }

      if (invJson.success) {
        const due = (invJson.data as any[]).filter((i) => i.balance_due > 0);
        setInvoices(due);
        if (due.length > 0 && !selectedInvoiceId) {
          setSelectedInvoiceId(due[0].id);
          setAmount(due[0].balance_due);
        }
      }
    } catch (err) {
      console.error('Failed to load admin payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const inv = invoices.find((i) => i.id === selectedInvoiceId);
      if (!inv) throw new Error('Please select an invoice');

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: inv.customer_id,
          invoiceId: inv.id,
          amount: Number(amount),
          paymentMethod,
          paymentDate: new Date().toISOString(),
          note,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Payment recording failed');

      setNotification(`Payment of ₹${Number(amount).toLocaleString('en-IN')} recorded successfully!`);
      setIsRecordModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const columns: Column<PaymentRecord>[] = [
    {
      header: 'Payment Ref',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-900">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-indigo-600 font-medium">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Amount Received',
      cell: (item) => (
        <MoneyDisplay amount={item.amount} size="sm" className="font-semibold text-emerald-700" />
      ),
    },
    {
      header: 'Ledger Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/payments"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Payments"
    >
      <div className="space-y-6">
        <PageHeader
          title="Payment Ledger & Allocation"
          description="Track incoming customer remittances, allocate against confirmed invoices, and maintain financial settlement trails (Member 4 — Task M4-04)."
          action={
            invoices.length > 0 ? (
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setIsRecordModalOpen(true)}
              >
                Record Payment
              </Button>
            ) : undefined
          }
        />

        {notification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={payments}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />

        {/* Record Payment Dialog */}
        {isRecordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Record Manual Remittance</h3>
                <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRecordSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Select Invoice *
                  </label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => {
                      setSelectedInvoiceId(e.target.value);
                      const inv = invoices.find((i) => i.id === e.target.value);
                      if (inv) setAmount(inv.balance_due);
                    }}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
                  >
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} (Due: ₹{inv.balance_due.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Amount to Credit (₹) *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="upi">UPI Merchant Transfer</option>
                    <option value="credit_card">Corporate Credit Card</option>
                    <option value="cash">Cash / Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Reference / Transaction Note
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. UTR-982301928"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="md" type="button" onClick={() => setIsRecordModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit">
                    Record Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
