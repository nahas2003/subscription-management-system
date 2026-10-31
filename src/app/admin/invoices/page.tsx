'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';
import { Plus, Receipt, AlertCircle, Play, CheckCircle2 } from 'lucide-react';
import { store } from '@/lib/store';

interface AdminInvoiceItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
}

const mockInvoices: AdminInvoiceItem[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    customerName: 'Acme Corporation Ltd',
    issueDate: '2026-10-15',
    dueDate: '2026-11-15',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 0,
    balanceDue: 17700,
    status: 'Confirmed',
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0038',
    customerName: 'BrightWave Logistics',
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    subtotal: 20000,
    taxAmount: 3600,
    total: 23600,
    amountPaid: 5000,
    balanceDue: 18600,
    status: 'Overdue',
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0019',
    customerName: 'Apex Global Media',
    issueDate: '2026-10-10',
    dueDate: '2026-10-25',
    subtotal: 30000,
    taxAmount: 5400,
    total: 35400,
    amountPaid: 35400,
    balanceDue: 0,
    status: 'Paid',
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<AdminInvoiceItem[]>(mockInvoices);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const today = new Date().toISOString().slice(0, 10);
        const mapped: AdminInvoiceItem[] = json.data.map((inv: any) => {
          let derivedStatus: InvoiceStatus = 'Confirmed';
          if (inv.status === 'paid') derivedStatus = 'Paid';
          else if (inv.status === 'draft') derivedStatus = 'Draft';
          else if (inv.balance_due > 0 && inv.due_date < today) derivedStatus = 'Overdue';

          const cust = store.getCustomerById(inv.customer_id);
          const customerName = cust ? cust.name : `Customer (${inv.customer_id})`;

          return {
            id: inv.id,
            invoiceNumber: inv.invoice_number,
            customerName,
            issueDate: inv.invoice_date,
            dueDate: inv.due_date,
            subtotal: inv.subtotal,
            taxAmount: inv.tax_total,
            total: inv.total,
            amountPaid: inv.amount_paid,
            balanceDue: inv.balance_due,
            status: derivedStatus,
          };
        });
        setInvoices(mapped);
      }
    } catch (err) {
      console.error('Failed to load admin invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleRunBilling = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/billing/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json.success) {
        const count = json.data.summary.invoices_generated.length;
        setNotification(`Recurring billing complete: ${count} invoice(s) generated.`);
        await fetchInvoices();
      }
    } catch (err: any) {
      setNotification(`Billing execution error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<AdminInvoiceItem>[] = [
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
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Issue Date',
      cell: (item) => <DateDisplay date={item.issueDate} />,
    },
    {
      header: 'Due Date',
      cell: (item) => <DateDisplay date={item.dueDate} />,
    },
    {
      header: 'GST (18%)',
      cell: (item) => <MoneyDisplay amount={item.taxAmount} size="sm" />,
    },
    {
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-semibold" />,
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

  return (
    <AppShell
      role="admin"
      currentPath="/admin/invoices"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Invoices"
    >
      <div className="space-y-6">
        <PageHeader
          title="Invoices & Recurring Billing"
          description="Manage generated customer invoices, monitor payment settlements, and trigger idempotent billing runs (Member 4 — Task M4-01 & M4-02)."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={handleRunBilling}
              leftIcon={<Play className="h-4 w-4 fill-white" />}
            >
              Run Billing Cycle
            </Button>
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
          data={invoices}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />
      </div>
    </AppShell>
  );
}
