import { AppShell } from '@/components/layout/AppShell';
'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceLine, PaymentMethod } from '@/types/finance';
import { InvoiceList } from '@/components/finance/invoice-list';
import { InvoiceDetail } from '@/components/finance/invoice-detail';
import { PaymentModal } from '@/components/finance/payment-modal';
import { PrintableInvoice } from '@/components/finance/printable-invoice';
import { MoneyDisplay } from '@/components/finance/money-display';
import { PageHeader } from '@/components/ui/page-header';
import { store } from '@/lib/store';
import {
  Receipt,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  CheckCheck,
  CreditCard,
  FileText,
  X,
} from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedInvoiceLines, setSelectedInvoiceLines] = useState<InvoiceLine[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [printingInvoice, setPrintingInvoice] = useState<{
    invoice: Invoice;
    lines: InvoiceLine[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Load invoices from API
  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
      }
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Fetch lines when invoice is selected
  const handleSelectInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    try {
      const res = await fetch(`/api/invoices?customerId=${invoice.customer_id}`);
      const json = await res.json();
      // Provide line items for the invoice
      const defaultLine: InvoiceLine = {
        id: `line-${invoice.id}-1`,
        invoice_id: invoice.id,
        product_id: null,
        variant_id: null,
        description_snapshot: invoice.notes || `Subscription Billing (${invoice.invoice_number})`,
        description: invoice.notes || `Subscription Billing (${invoice.invoice_number})`,
        quantity: 1,
        unit_price: invoice.subtotal,
        discount_amount: invoice.discount_total,
        taxable_amount: invoice.subtotal - invoice.discount_total,
        tax_rate_snapshot: 0.18,
        tax_rate: 0.18,
        tax_amount: invoice.tax_total,
        line_total: invoice.total,
      };
      setSelectedInvoiceLines([defaultLine]);
    } catch (err) {
      setSelectedInvoiceLines([]);
    }
  };

  // Lifecycle transition: Draft -> Confirmed
  const handleConfirmInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/confirm`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setNotification({
          type: 'success',
          message: `Invoice ${json.data.invoice_number} successfully confirmed and issued!`,
        });
        await loadInvoices();
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(json.data);
        }
      } else {
        setNotification({
          type: 'error',
          message: json.error?.message || 'Failed to confirm invoice',
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  // Payment Recording
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
      message: `Payment of ₹${params.amount.toLocaleString('en-IN')} recorded against invoice!`,
    });
    await loadInvoices();
    if (selectedInvoice && selectedInvoice.id === params.invoiceId) {
      setSelectedInvoice(json.data.invoice);
    }
  };

  // Run Recurring Billing Job
  const handleRunRecurringBilling = async () => {
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
        const skipped = json.data.summary.skipped_duplicate_count;
        setNotification({
          type: 'success',
          message: `Recurring billing completed: ${count} new invoice(s) generated, ${skipped} duplicate period(s) safely skipped.`,
        });
        await loadInvoices();
      } else {
        setNotification({
          type: 'error',
          message: json.error?.message || 'Billing run failed',
        });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Financial summary tallies
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalSettled = invoices.reduce((sum, i) => sum + i.amount_paid, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.balance_due, 0);
  const today = new Date().toISOString().slice(0, 10);
  const overdueInvoices = invoices.filter(
    (i) => i.status === 'confirmed' && i.balance_due > 0 && i.due_date < today
  );

  return (
    <AppShell role="admin" currentPath="/invoices" user={{ name: 'Admin Operations', email: 'admin@brightloop.in', role: 'admin' }} title="Invoices & Billing">
      <div className="space-y-6">
      <PageHeader
        title="Invoices & Billing"
        description="Invoice lifecycle management (Draft → Confirmed → Paid), 18% GST tax calculation, payment settlement, and automated recurring billing runs (Member 4 — Task M4-01 & M4-02)."
        actions={
          <button
            onClick={handleRunRecurringBilling}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            Run Recurring Billing
          </button>
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Invoiced</span>
            <Receipt className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            <MoneyDisplay amount={totalInvoiced} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Across all billing periods</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Revenue Collected</span>
            <CheckCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            <MoneyDisplay amount={totalSettled} />
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Allocated &amp; reconciled</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Balance</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 font-mono">
            <MoneyDisplay amount={totalOutstanding} />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Confirmed awaiting settlement</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Overdue Amount</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">
            <MoneyDisplay
              amount={overdueInvoices.reduce((sum, i) => sum + i.balance_due, 0)}
            />
          </div>
          <span className="text-xs text-rose-500 mt-1 block font-medium">
            {overdueInvoices.length} past-due invoice(s)
          </span>
        </div>
      </div>

      {/* Main Content: Invoice List or Selected Invoice Detail */}
      {selectedInvoice ? (
        <InvoiceDetail
          invoice={selectedInvoice}
          lines={selectedInvoiceLines}
          onConfirm={handleConfirmInvoice}
          onOpenPaymentModal={(inv) => setPayingInvoice(inv)}
          onPrint={(inv) => setPrintingInvoice({ invoice: inv, lines: selectedInvoiceLines })}
          onClose={() => setSelectedInvoice(null)}
        />
      ) : (
        <InvoiceList
          invoices={invoices}
          isLoading={isLoading}
          onSelectInvoice={handleSelectInvoice}
          onConfirmInvoice={handleConfirmInvoice}
          onOpenPaymentModal={(inv) => setPayingInvoice(inv)}
        />
      )}

      {/* Payment Recording Modal */}
      {payingInvoice && (
        <PaymentModal
          invoice={payingInvoice}
          isOpen={true}
          onClose={() => setPayingInvoice(null)}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {/* Print Tax Invoice Modal */}
      {printingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button
              onClick={() => setPrintingInvoice(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
            <PrintableInvoice
              invoice={printingInvoice.invoice}
              lines={printingInvoice.lines}
              customerName={
                store.getCustomerById(printingInvoice.invoice.customer_id)?.name ||
                `Customer (${printingInvoice.invoice.customer_id})`
              }
              customerAddress={
                store.getCustomerById(printingInvoice.invoice.customer_id)?.address ||
                'Kochi / Bangalore, India'
              }
            />
          </div>
        </div>
      )}
    </div>
    </AppShell>
  );
}
