'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, SubscriptionStatus, InvoiceStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { DataTable, Column } from '@/components/ui/DataTable';
import {
  Repeat,
  Calendar,
  Receipt,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface CustomerSubscription {
  id: string;
  productName: string;
  planName: string;
  frequency: string;
  price: number;
  nextRenewal: string;
  status: SubscriptionStatus;
}

interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  dueDate: string;
  total: number;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockSubscriptions: CustomerSubscription[] = [
  {
    id: 'sub-01',
    productName: 'Quality Management System',
    planName: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    price: 118000,
    nextRenewal: '2027-01-15',
    status: 'Active',
  },
  {
    id: 'sub-02',
    productName: 'Managed Cloud Infrastructure',
    planName: 'Pro Monthly Support',
    frequency: 'Monthly',
    price: 15000,
    nextRenewal: '2026-11-01',
    status: 'Active',
  },
];

const mockInvoices: CustomerInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    dueDate: '2026-11-05',
    total: 17700,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0019',
    dueDate: '2026-10-05',
    total: 17700,
    balanceDue: 0,
    status: 'Paid',
  },
];

export default function CustomerPortalOverview() {
  const subColumns: Column<CustomerSubscription>[] = [
    {
      header: 'Product / Plan',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.productName}</div>
          <div className="text-xs text-[#96897b]">{item.planName} ({item.frequency})</div>
        </div>
      ),
    },
    {
      header: 'Recurring Price',
      cell: (item) => <MoneyDisplay amount={item.price} size="sm" />,
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

  const invColumns: Column<CustomerInvoice>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.invoiceNumber}
        </span>
      ),
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
          className={item.balanceDue > 0 ? 'font-bold text-[#b83a2b]' : 'text-[#50463c]'}
        />
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal"
      user={{ name: 'Apex Technologies Pvt Ltd', email: 'billing@apextech.in', role: 'customer' }}
      title="Customer Portal"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Overview"
          description="Manage your active subscriptions, view billing history, and review statements."
          action={
            <div className="flex items-center gap-2 rounded-[3.75px] bg-white border border-[#efe9e0] px-3 py-1.5 text-xs font-bold text-[#2b4c2b] shadow-xs">
              <ShieldCheck className="h-4 w-4 text-[#7a9779]" />
              <span>Isolated Customer Access</span>
            </div>
          }
        />

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Subscriptions"
            value="2"
            subtitle="All services running normally"
            icon={Repeat}
          />
          <StatCard
            title="Next Renewal Date"
            value="01 Nov"
            subtitle="Pro Monthly Support"
            icon={Calendar}
          />
          <StatCard
            title="Unpaid Invoices"
            value="1"
            subtitle="Due in 5 days"
            icon={Receipt}
          />
          <StatCard
            title="Total Outstanding"
            value={<MoneyDisplay amount={17700} size="xl" />}
            subtitle="Current billing cycle"
            icon={CreditCard}
          />
        </div>

        {/* Active Subscriptions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#211b15]">YOUR SUBSCRIPTIONS</h2>
            <Link
              href="/portal/subscriptions"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:underline"
            >
              <span>View all subscriptions</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <DataTable
            columns={subColumns}
            data={mockSubscriptions}
            keyExtractor={(item) => item.id}
          />
        </div>

        {/* Recent Invoices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-[#211b15]">RECENT INVOICES</h2>
            <Link
              href="/portal/invoices"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:underline"
            >
              <span>View all invoices</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <DataTable
            columns={invColumns}
            data={mockInvoices}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>
    </AppShell>
  );
}
