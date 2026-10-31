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
  Repeat,
  IndianRupee,
  AlertTriangle,
  Receipt,
  Plus,
  Play,
  Users,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface AdminSubscriptionRow {
  id: string;
  customerName: string;
  productName: string;
  planName: string;
  recurringAmount: number;
  nextRenewal: string;
  status: SubscriptionStatus;
}

interface AdminInvoiceRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockAdminSubscriptions: AdminSubscriptionRow[] = [
  {
    id: 'sub-01',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Quality Management System',
    planName: 'Enterprise Annual Plan',
    recurringAmount: 118000,
    nextRenewal: '2027-01-15',
    status: 'Active',
  },
  {
    id: 'sub-02',
    customerName: 'Apex Technologies Pvt Ltd',
    productName: 'Managed Cloud Infrastructure',
    planName: 'Pro Monthly Support',
    recurringAmount: 15000,
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
  {
    id: 'sub-03',
    customerName: 'Kochi Logistics Hub',
    productName: 'Fleet Tracker & Subscriptions',
    planName: 'Standard Monthly Plan',
    recurringAmount: 24000,
    nextRenewal: '2026-11-10',
    status: 'Confirmed',
  },
  {
    id: 'sub-04',
    customerName: 'Kerala Ayurveda Solutions',
    productName: 'E-Commerce Subscription API',
    planName: 'Starter Quarterly',
    recurringAmount: 9500,
    nextRenewal: '2026-10-15',
    status: 'Draft',
  },
];

const mockAdminInvoices: AdminInvoiceRow[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Apex Technologies Pvt Ltd',
    dueDate: '2026-11-05',
    total: 17700,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'Malabar Retailers Ltd',
    dueDate: '2026-10-20',
    total: 35400,
    balanceDue: 35400,
    status: 'Overdue',
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Technologies Pvt Ltd',
    dueDate: '2026-10-05',
    total: 17700,
    balanceDue: 0,
    status: 'Paid',
  },
];

export default function AdminDashboardPage() {
  const [billingRunning, setBillingRunning] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState(false);

  const subColumns: Column<AdminSubscriptionRow>[] = [
    {
      header: 'Customer',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.customerName}</div>
          <div className="text-xs text-slate-500">{item.productName}</div>
        </div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'planName',
      className: 'text-xs text-slate-600',
    },
    {
      header: 'Recurring',
      cell: (item) => <MoneyDisplay amount={item.recurringAmount} size="sm" />,
    },
    {
      header: 'Next Renewal',
      cell: (item) => <DateDisplay date={item.nextRenewal} />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  const invColumns: Column<AdminInvoiceRow>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-indigo-600">
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
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" />,
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
  ];

  const handleRunBilling = () => {
    setBillingRunning(true);
    // Simulate idempotent billing run
    setTimeout(() => {
      setBillingRunning(false);
      setBillingModalOpen(false);
      setBillingSuccess(true);
    }, 1000);
  };

  return (
    <AppShell
      role="admin"
      currentPath="/admin/dashboard"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Admin Dashboard"
    >
      <div className="space-y-6">
        <PageHeader
          title="Executive Dashboard"
          description="High-level operational metrics, recurring subscription lifecycle, and revenue status."
          action={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setBillingModalOpen(true)}
                leftIcon={<Play className="h-4 w-4 text-[#4F46E5]" />}
              >
                Run Recurring Billing
              </Button>
            </div>
          }
        />

        {billingSuccess && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <div className="text-sm">
                <strong>Billing Run Completed:</strong> Idempotent generation checked 2 active subscriptions. 0 duplicate invoices generated.
              </div>
            </div>
            <button
              onClick={() => setBillingSuccess(false)}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Subscriptions"
            value="18"
            subtitle="+3 renewed this week"
            icon={Repeat}
          />
          <StatCard
            title="Revenue Received"
            value={<MoneyDisplay amount={348500} size="xl" />}
            subtitle="Current Fiscal Month"
            icon={IndianRupee}
          />
          <StatCard
            title="Outstanding Balance"
            value={<MoneyDisplay amount={53100} size="xl" />}
            subtitle="Pending collection"
            icon={Receipt}
          />
          <StatCard
            title="Overdue Invoices"
            value="1"
            subtitle="₹35,400 past due date"
            icon={AlertTriangle}
            badge={<span className="text-xs font-bold text-red-600">Action Required</span>}
          />
        </div>

        {/* Dual Grid: Recent Subscriptions and Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Active Subscriptions</h2>
              <span className="text-xs text-slate-400">Total: 4 records</span>
            </div>
            <DataTable
              columns={subColumns}
              data={mockAdminSubscriptions}
              keyExtractor={(item) => item.id}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Recent Invoices & Overdue</h2>
              <span className="text-xs text-slate-400">Total: 3 records</span>
            </div>
            <DataTable
              columns={invColumns}
              data={mockAdminInvoices}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>

        {/* Billing Trigger Dialog */}
        <ConfirmDialog
          isOpen={billingModalOpen}
          onClose={() => setBillingModalOpen(false)}
          onConfirm={handleRunBilling}
          title="Trigger Recurring Billing Job"
          description="This will execute the idempotent recurring billing generator for all active subscriptions due on or before today. Idempotency keys prevent duplicate invoices."
          confirmText="Run Billing Now"
          isLoading={billingRunning}
        />
      </div>
    </AppShell>
  );
}
