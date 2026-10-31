'use client';

import React, { useState } from 'react';
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
    paymentRef: 'PAY-2026-0019-01',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    amount: 17700,
    paymentDate: '2026-10-02',
    paymentMethod: 'Bank Transfer (NEFT)',
    status: 'Confirmed',
  },
  {
    id: 'pay-02',
    paymentRef: 'PAY-2026-0005-01',
    invoiceNumber: 'INV-2026-0005',
    customerName: 'Apex Technologies Pvt Ltd',
    amount: 118000,
    paymentDate: '2026-01-20',
    paymentMethod: 'Corporate Wire (RTGS)',
    status: 'Confirmed',
  },
  {
    id: 'pay-03',
    paymentRef: 'PAY-2026-0022-01',
    invoiceNumber: 'INV-2026-0022',
    customerName: 'Kochi Logistics Hub',
    amount: 28320,
    paymentDate: '2026-10-12',
    paymentMethod: 'UPI Merchant Intent',
    status: 'Confirmed',
  },
];

export default function PaymentsPage() {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const columns: Column<PaymentRecord>[] = [
    {
      header: 'Payment Reference',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800">
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
      header: 'Payment Method',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700 font-medium">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-emerald-700" />,
    },
    {
      header: 'Allocation Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/payments"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Payments & Allocations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Manual Payments & Allocations"
          description="Record verified manual bank transfers, NEFT, and cheque payments against outstanding customer invoices."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsRecordModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Record Payment
            </Button>
          }
        />

        {successNotice && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span className="text-sm">
                <strong>Payment Logged:</strong> Payment allocation recorded and balance recalculated.
              </span>
            </div>
            <button
              onClick={() => setSuccessNotice(false)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={mockPayments}
          keyExtractor={(item) => item.id}
        />

        {/* Record Payment Modal */}
        {isRecordModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900">Record Manual Payment</h3>
                <button
                  onClick={() => setIsRecordModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <FormField label="Invoice Number" required>
                  <Input placeholder="e.g. INV-2026-0042" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Amount Received (₹)" required>
                    <Input type="number" placeholder="17700.00" />
                  </FormField>
                  <FormField label="Payment Date" required>
                    <Input type="date" defaultValue="2026-10-31" />
                  </FormField>
                </div>
                <FormField label="Payment Method" required>
                  <Input placeholder="e.g. Bank Transfer (NEFT) / Cheque" />
                </FormField>
                <FormField label="Bank Reference / UTR Number">
                  <Input placeholder="e.g. HDFC20261031001882" />
                </FormField>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setIsRecordModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsRecordModalOpen(false);
                    setSuccessNotice(true);
                  }}
                >
                  Confirm & Allocate
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
