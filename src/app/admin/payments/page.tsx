'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, CheckCircle2, X } from 'lucide-react';
import { store } from '@/lib/store';

interface PaymentRecord {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: 'Confirmed' | 'Paid' | 'Failed';
  bankReference?: string;
}

const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-01',
    paymentRef: 'PAY-2026-0031',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    paymentDate: '2026-10-04',
    amount: 17700,
    paymentMethod: 'Bank Transfer (NEFT)',
    status: 'Paid',
    bankReference: 'HDFC202610049921',
  },
  {
    id: 'pay-02',
    paymentRef: 'PAY-2026-0028',
    invoiceNumber: 'INV-2026-0014',
    customerName: 'Kochi Logistics Hub',
    paymentDate: '2026-09-22',
    amount: 23600,
    paymentMethod: 'Corporate Cheque #49281',
    status: 'Paid',
    bankReference: 'SBI-CHQ-49281',
  },
  {
    id: 'pay-03',
    paymentRef: 'PAY-2026-0021',
    invoiceNumber: 'INV-2026-0008',
    customerName: 'Apex Technologies Pvt Ltd',
    paymentDate: '2026-08-30',
    amount: 118000,
    paymentMethod: 'RTGS Electronic Transfer',
    status: 'Paid',
    bankReference: 'AXIS202608301129',
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
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-[#50463c]">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2 py-0.5 text-xs text-[#211b15] font-medium">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Amount Received',
      cell: (item) => (
        <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-[#2b4c2b]" />
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
      title="Payment Settlements"
    >
      <div className="space-y-6">
        <PageHeader
          title="Payment Receipts & Settlements"
          description="Track incoming wire transfers, offline cheques, and UPI allocations mapped directly to issued invoices."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsRecordModalOpen(true)}
            >
              Record Payment
            </Button>
          }
        />

        {notification && (
          <div className="flex items-center justify-between rounded-[7.5px] border border-[#c5d8c4] bg-[#eef5ee] p-4 text-[#2b4c2b] shadow-xs font-sans">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#7a9779]" />
              <span className="text-sm font-medium">{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold text-[#2b4c2b] hover:underline"
            >
              Dismiss
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">RECORD PAYMENT ALLOCATION</h3>
                <button
                  onClick={() => setIsRecordModalOpen(false)}
                  className="text-[#50463c] hover:text-[#211b15]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRecordSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
                    Select Outstanding Invoice *
                  </label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => {
                      setSelectedInvoiceId(e.target.value);
                      const inv = invoices.find((i) => i.id === e.target.value);
                      if (inv) setAmount(inv.balance_due);
                    }}
                    className="w-full p-2 text-xs border border-[#c7bcaf] rounded-[3.75px] bg-[#fcfaf1] text-[#211b15] focus:outline-none focus:border-[#8c591b]"
                  >
                    {invoices.length === 0 && (
                      <option value="">No outstanding invoices (using demo balance)</option>
                    )}
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number} (Due: ₹{inv.balance_due?.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2 text-xs border border-[#c7bcaf] rounded-[3.75px] bg-white text-[#211b15] focus:outline-none focus:border-[#8c591b]"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
                    <option value="upi">UPI Merchant Transfer</option>
                    <option value="credit_card">Corporate Credit Card</option>
                    <option value="cash">Cash / Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
                    Reference / Transaction Note
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. UTR-982301928"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#efe9e0]">
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
