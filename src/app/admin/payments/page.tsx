'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Plus, CheckCircle2, X } from 'lucide-react';

interface PaymentRecord {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: 'Paid' | 'Confirmed' | 'Draft';
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
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const columns: Column<PaymentRecord>[] = [
    {
      header: 'Payment Reference',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-[#211b15] font-medium">
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
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Payment Method',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2 py-0.5 text-xs text-[#211b15] font-medium">
          {item.paymentMethod}
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-[#2b4c2b]" />,
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
          <div className="flex items-center justify-between rounded-[7.5px] border border-[#c5d8c4] bg-[#eef5ee] p-4 text-[#2b4c2b] shadow-xs font-sans">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#7a9779]" />
              <span className="text-sm">
                <strong>Payment Logged:</strong> Payment allocation recorded and balance settled.
              </span>
            </div>
            <button
              onClick={() => setSuccessNotice(false)}
              className="text-xs font-bold text-[#2b4c2b] hover:underline"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">RECORD MANUAL PAYMENT</h3>
                <button
                  onClick={() => setIsRecordModalOpen(false)}
                  className="text-[#50463c] hover:text-[#211b15]"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
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
