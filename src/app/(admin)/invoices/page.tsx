'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceLine, PaymentMethod } from '@/types/finance';
import { InvoiceList } from '@/components/finance/invoice-list';
import { InvoiceDetail } from '@/components/finance/invoice-detail';
import { PaymentModal } from '@/components/finance/payment-modal';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLine[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch invoices from API endpoint
  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/invoices');
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleConfirmInvoice = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/confirm`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await loadInvoices();
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
          setSelectedInvoice(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to confirm invoice:', err);
    }
  };

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
    await loadInvoices();
    if (selectedInvoice && selectedInvoice.id === params.invoiceId) {
      setSelectedInvoice(json.data.invoice);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage billing lifecycles, track settlement statuses, and resolve outstanding balances.
          </p>
        </div>
      </div>

      {selectedInvoice ? (
        <InvoiceDetail
          invoice={selectedInvoice}
          lines={invoiceLines}
          onConfirm={handleConfirmInvoice}
          onOpenPaymentModal={(inv) => setPayingInvoice(inv)}
          onClose={() => setSelectedInvoice(null)}
        />
      ) : (
        <InvoiceList
          invoices={invoices}
          isLoading={isLoading}
          onSelectInvoice={(inv) => {
            setSelectedInvoice(inv);
            setInvoiceLines([]); // Populated from API in full integration
          }}
          onConfirmInvoice={handleConfirmInvoice}
          onOpenPaymentModal={(inv) => setPayingInvoice(inv)}
        />
      )}

      {payingInvoice && (
        <PaymentModal
          invoice={payingInvoice}
          isOpen={!!payingInvoice}
          onClose={() => setPayingInvoice(null)}
          onSubmit={handleRecordPayment}
        />
      )}
    </div>
  );
}
