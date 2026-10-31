'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, SubscriptionStatus, InvoiceStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  FileText,
  CreditCard,
  AlertCircle,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface StaffTaskQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  amount: number;
  validUntil: string;
  status: SubscriptionStatus;
}

interface StaffTaskInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  dueDate: string;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockStaffQuotations: StaffTaskQuotation[] = [
  {
    id: 'sq-01',
    quotationNumber: 'QTN-2026-0084',
    customerName: 'Kochi Logistics Hub',
    amount: 23600,
    validUntil: '2026-11-01',
    status: 'Confirmed',
  },
  {
    id: 'sq-02',
    quotationNumber: 'QTN-2026-0087',
    customerName: 'Kerala Ayurveda Solutions',
    amount: 9440,
    validUntil: '2026-11-18',
    status: 'Draft',
  },
];

const mockStaffInvoices: StaffTaskInvoice[] = [
  {
    id: 'si-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    dueDate: '2026-11-05',
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'si-02',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'Malabar Retailers Ltd',
    dueDate: '2026-10-20',
    balanceDue: 35400,
    status: 'Overdue',
  },
];

export default function StaffDashboardPage() {
  const [recordPaymentModal, setRecordPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<StaffTaskInvoice | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const quoColumns: Column<StaffTaskQuotation>[] = [
    {
      header: 'Quotation #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-bold text-[#211b15]',
    },
    {
      header: 'Value',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" />,
    },
    {
      header: 'Valid Until',
      cell: (item) => <DateDisplay date={item.validUntil} />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  const invColumns: Column<StaffTaskInvoice>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#211b15]">
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
      header: 'Due Date',
      cell: (item) => <DateDisplay date={item.dueDate} />,
    },
    {
      header: 'Balance Due',
      cell: (item) => (
        <MoneyDisplay
          amount={item.balanceDue}
          size="sm"
          className={item.balanceDue > 0 ? 'font-bold text-[#b83a2b]' : 'text-[#50463c]'}
        />
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedInvoice(item);
            setRecordPaymentModal(true);
          }}
        >
          Record Pay
        </Button>
      ),
    },
  ];

  const handleConfirmPayment = () => {
    setRecordPaymentModal(false);
    setPaymentSuccess(true);
    setTimeout(() => setPaymentSuccess(false), 4000);
  };

  return (
    <AppShell
      role="staff"
      currentPath="/staff/dashboard"
      user={{ name: 'Deepa Krishnan', email: 'deepa@brightloop.in', role: 'staff' }}
      title="Staff Console"
    >
      <div className="space-y-6">
        <PageHeader
          title="Operations Desk"
          description="Daily operational queue for customer onboarding, order confirmation, and payment reconciliation."
        />

        {paymentSuccess && (
          <div className="flex items-center justify-between rounded-[7.5px] border border-[#c5d8c4] bg-[#eef5ee] p-4 text-[#2b4c2b] shadow-xs font-sans">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#7a9779]" />
              <span className="text-sm">
                <strong>Payment Reconciled:</strong> Manual settlement logged for {selectedInvoice?.invoiceNumber}.
              </span>
            </div>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="text-xs font-bold text-[#2b4c2b] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Operational KPI Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Quotations"
            value="2"
            subtitle="Draft & Confirmed"
            icon={FileText}
          />
          <StatCard
            title="Overdue Invoices"
            value="1"
            subtitle="₹35,400 attention required"
            icon={AlertCircle}
          />
          <StatCard
            title="Pending Collections"
            value={<MoneyDisplay amount={53100} size="xl" />}
            subtitle="Open invoices balance"
            icon={CreditCard}
          />
          <StatCard
            title="Assigned Accounts"
            value="4"
            subtitle="Active accounts"
            icon={Users}
          />
        </div>

        {/* Action Tables */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-[#211b15]">QUOTATIONS IN PROGRESS</h2>
              <span className="text-xs text-[#96897b]">2 pending</span>
            </div>
            <DataTable
              columns={quoColumns}
              data={mockStaffQuotations}
              keyExtractor={(item) => item.id}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-[#211b15]">OUTSTANDING INVOICES</h2>
              <span className="text-xs text-[#96897b]">Record verified payments</span>
            </div>
            <DataTable
              columns={invColumns}
              data={mockStaffInvoices}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>

        {/* Record Payment Dialog */}
        {selectedInvoice && (
          <ConfirmDialog
            isOpen={recordPaymentModal}
            onClose={() => setRecordPaymentModal(false)}
            onConfirm={handleConfirmPayment}
            title={`Record Payment for ${selectedInvoice.invoiceNumber}`}
            description={`Allocate manual payment of ₹${selectedInvoice.balanceDue.toLocaleString('en-IN')} for ${selectedInvoice.customerName}. This will update the invoice to Paid if settled.`}
            confirmText="Confirm Manual Payment"
          />
        )}
      </div>
    </AppShell>
  );
}
