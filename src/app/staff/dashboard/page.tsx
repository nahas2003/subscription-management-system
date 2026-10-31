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
  Repeat,
  Receipt,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface StaffTaskQuotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  amount: number;
  validUntil: string;
  status: 'Draft' | 'Quotation' | 'Confirmed';
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
    id: 'q-01',
    quotationNumber: 'QUO-2026-0031',
    customerName: 'Cochin Tech Solutions',
    amount: 45000,
    validUntil: '2026-11-05',
    status: 'Quotation',
  },
  {
    id: 'q-02',
    quotationNumber: 'QUO-2026-0034',
    customerName: 'Kerala Spice Exporters',
    amount: 118000,
    validUntil: '2026-11-12',
    status: 'Draft',
  },
];

const mockStaffInvoices: StaffTaskInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    dueDate: '2026-11-05',
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
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
        <span className="font-mono text-xs font-semibold text-indigo-600">
          {item.quotationNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-medium text-slate-800',
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
        <span className="font-mono text-xs font-semibold text-slate-800">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      className: 'font-medium text-slate-800',
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
          className={item.balanceDue > 0 ? 'font-bold text-amber-700' : 'text-slate-500'}
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
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedInvoice(item);
            setRecordPaymentModal(true);
          }}
          leftIcon={<CreditCard className="h-3.5 w-3.5" />}
        >
          Record Payment
        </Button>
      ),
    },
  ];

  const handleConfirmPayment = () => {
    setRecordPaymentModal(false);
    setPaymentSuccess(true);
  };

  return (
    <AppShell
      role="staff"
      currentPath="/staff/dashboard"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Staff Operations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Staff Operations Dashboard"
          description="Daily operational workflow: customer quotations, subscription activation, and manual payment verification."
        />

        {paymentSuccess && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div className="text-sm">
                <strong>Payment Successfully Recorded:</strong> Manual allocation settled against {selectedInvoice?.invoiceNumber}.
              </div>
            </div>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Operational KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Quotations"
            value="2"
            subtitle="Awaiting customer confirmation"
            icon={FileText}
          />
          <StatCard
            title="Invoices Awaiting Payment"
            value="2"
            subtitle="Total balance: ₹53,100"
            icon={Receipt}
          />
          <StatCard
            title="Overdue Accounts"
            value="1"
            subtitle="Follow-up needed"
            icon={Clock}
          />
          <StatCard
            title="Customers Managed"
            value="14"
            subtitle="Active accounts"
            icon={Users}
          />
        </div>

        {/* Action Tables */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Quotations In Progress</h2>
              <span className="text-xs text-slate-400">2 pending</span>
            </div>
            <DataTable
              columns={quoColumns}
              data={mockStaffQuotations}
              keyExtractor={(item) => item.id}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Outstanding Invoices for Payment</h2>
              <span className="text-xs text-slate-400">Action: Record verified payments</span>
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
