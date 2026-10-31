'use client';

import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceLine } from '@/types/finance';
import { MoneyDisplay } from '@/components/finance/money-display';
import { StatusBadge } from '@/components/finance/status-badge';
import { PrintableInvoice } from '@/components/finance/printable-invoice';
import { isInvoiceOverdue } from '@/lib/calculations/finance';

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedLines, setSelectedLines] = useState<InvoiceLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Demo active customer ID
  const activeCustomerId = 'cust_demo_001';

  const loadCustomerInvoices = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/customer/invoices?customerId=${activeCustomerId}`);
      const json = await res.json();
      if (json.success) {
        setInvoices(json.data);
      }
    } catch (err) {
      console.error('Failed to load customer invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerInvoices();
  }, []);

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.total, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.amount_paid, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.balance_due, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your billing statements, view tax receipts, and track payment settlement.
          </p>
        </div>
      </div>

      {/* Customer Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Billed</span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            <MoneyDisplay amount={totalInvoiced} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Settled</span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono">
            <MoneyDisplay amount={totalPaid} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</span>
          <div className={`mt-2 text-2xl font-bold font-mono ${totalOutstanding > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
            <MoneyDisplay amount={totalOutstanding} />
          </div>
        </div>
      </div>

      {/* Printable Invoice View Mode */}
      {selectedInvoice ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedInvoice(null)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            ← Back to Invoices List
          </button>
          <PrintableInvoice
            invoice={selectedInvoice}
            lines={selectedLines}
            customerName="BrightLoop Partner Organization"
          />
        </div>
      ) : (
        /* Invoices Table */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-sm text-slate-800">
            Billing Statements
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Invoice Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total (₹)</th>
                  <th className="py-3 px-4 text-right">Settled (₹)</th>
                  <th className="py-3 px-4 text-right">Balance Due (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Loading your statements...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No invoices currently issued for your account.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isOverdue = isInvoiceOverdue(inv);

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                        <td className="py-3 px-4">{inv.invoice_date}</td>
                        <td className={`py-3 px-4 ${isOverdue ? 'text-rose-600 font-semibold' : ''}`}>{inv.due_date}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                          <MoneyDisplay amount={inv.total} />
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-700">
                          <MoneyDisplay amount={inv.amount_paid} />
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          <MoneyDisplay amount={inv.balance_due} />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={inv.status} isOverdue={isOverdue} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setSelectedLines([]); // Loaded in full integration
                            }}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold transition"
                          >
                            View / Print
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
