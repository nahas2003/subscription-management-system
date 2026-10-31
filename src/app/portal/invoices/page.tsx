'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Receipt, Eye, FileText, Download, CheckCircle2 } from 'lucide-react';
import { getCustomerPortalData } from '@/lib/actions/portal';

interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  taxRate: number;
  lineTotal: number;
}

interface InvoiceDetailItem {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  lines: InvoiceLineItem[];
}

const mockInvoices: InvoiceDetailItem[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0042',
    issueDate: '2026-10-25',
    dueDate: '2026-11-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 0,
    balanceDue: 17700,
    status: 'Confirmed',
    lines: [
      {
        description: 'Managed Cloud Infrastructure - Pro Support (Nov 2026)',
        qty: 1,
        unitPrice: 15000,
        taxRate: 0.18,
        lineTotal: 17700,
      },
    ],
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0019',
    issueDate: '2026-09-25',
    dueDate: '2026-10-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 17700,
    balanceDue: 0,
    status: 'Paid',
    lines: [
      {
        description: 'Managed Cloud Infrastructure - Pro Support (Oct 2026)',
        qty: 1,
        unitPrice: 15000,
        taxRate: 0.18,
        lineTotal: 17700,
      },
    ],
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0008',
    issueDate: '2026-01-15',
    dueDate: '2026-01-30',
    subtotal: 100000,
    taxAmount: 18000,
    total: 118000,
    amountPaid: 118000,
    balanceDue: 0,
    status: 'Paid',
    lines: [
      {
        description: 'Quality Management System - Enterprise Annual License (2026-2027)',
        qty: 1,
        unitPrice: 100000,
        taxRate: 0.18,
        lineTotal: 118000,
      },
    ],
  },
];

export default function CustomerInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetailItem | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDetailItem[]>(mockInvoices);
  const [customerName, setCustomerName] = useState('Apex Technologies Pvt Ltd');
  const [customerEmail, setCustomerEmail] = useState('billing@apextech.in');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCustomerPortalData();
        if (data?.customer) {
          setCustomerName(data.customer.name);
          setCustomerEmail(data.customer.email);
        }
        if (data?.invoices && data.invoices.length > 0) {
          const mapped: InvoiceDetailItem[] = data.invoices.map((i) => ({
            id: i.id,
            invoiceNumber: i.invoice_number,
            issueDate: i.invoice_date,
            dueDate: i.due_date || i.invoice_date,
            subtotal: i.subtotal,
            taxAmount: i.tax_total,
            discountAmount: i.discount_total || 0,
            total: i.total,
            amountPaid: i.amount_paid ?? (i.total - (i.balance_due || 0)),
            balanceDue: i.balance_due,
            status: (i.status === 'paid' ? 'Paid' : i.status === 'confirmed' ? 'Confirmed' : 'Draft') as InvoiceStatus,
            lines: [
              {
                description: `Recurring Subscription Billing Statement (${i.invoice_number})`,
                qty: 1,
                unitPrice: i.subtotal,
                taxRate: 0.18,
                lineTotal: i.total,
              },
            ],
          }));
          setInvoices(mapped);
        }
      } catch (err) {
        console.error('Error loading invoices:', err);
      }
    }
    loadData();
  }, []);

  const columns: Column<InvoiceDetailItem>[] = [
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.invoiceNumber}
        </span>
      ),
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
      header: 'Subtotal',
      cell: (item) => <MoneyDisplay amount={item.subtotal} size="sm" />,
    },
    {
      header: 'GST (18%)',
      cell: (item) => <MoneyDisplay amount={item.taxAmount} size="sm" />,
    },
    {
      header: 'Total',
      cell: (item) => <MoneyDisplay amount={item.total} size="sm" className="font-bold" />,
    },
    {
      header: 'Balance Due',
      cell: (item) => (
        <MoneyDisplay
          amount={item.balanceDue}
          size="sm"
          className={item.balanceDue > 0 ? 'font-bold text-[#b83a2b]' : 'text-[#7a9779]'}
        />
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Statement',
      cell: (item) => (
        <button
          onClick={() => setSelectedInvoice(item)}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:text-[#6c3200] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal/invoices"
      user={{ name: customerName, email: customerEmail, role: 'customer' }}
      title="My Invoices"
    >
      <div className="space-y-6">
        <PageHeader
          title="Invoices &amp; Statements"
          description="View recurring billing statements, tax breakdowns, and settlement history."
          breadcrumbs={[
            { label: 'Portal', href: '/portal' },
            { label: 'My Invoices' },
          ]}
        />

        <DataTable
          columns={columns}
          data={invoices}
          keyExtractor={(item) => item.id}
        />

        {/* Invoice Statement Modal */}
        {selectedInvoice && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-2xl rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-6 animate-in zoom-in-95">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#efe9e0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-bold text-[#211b15]">
                      {selectedInvoice.invoiceNumber}
                    </span>
                    <StatusBadge status={selectedInvoice.status} size="md" />
                  </div>
                  <div className="text-xs text-[#96897b]">
                    Billed to: <strong className="text-[#211b15]">{customerName}</strong> (GSTIN: 32AAAAA0000A1Z5)
                  </div>
                </div>

                <div className="text-right text-xs text-[#96897b]">
                  <div>Issue: <DateDisplay date={selectedInvoice.issueDate} /></div>
                  <div>Due: <strong className="text-[#211b15]"><DateDisplay date={selectedInvoice.dueDate} /></strong></div>
                </div>
              </div>

              {/* Line items table */}
              <div className="rounded-[3.75px] border border-[#efe9e0] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#efe9e0]/60 border-b border-[#efe9e0] text-[#50463c] font-bold uppercase">
                    <tr>
                      <th className="px-3 py-2">Item Description</th>
                      <th className="px-3 py-2 text-center">Qty</th>
                      <th className="px-3 py-2 text-right">Unit Price</th>
                      <th className="px-3 py-2 text-right">GST Rate</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efe9e0] text-[#211b15]">
                    {selectedInvoice.lines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-[#fcfaf1]">
                        <td className="px-3 py-2 font-medium">{line.description}</td>
                        <td className="px-3 py-2 text-center">{line.qty}</td>
                        <td className="px-3 py-2 text-right">
                          <MoneyDisplay amount={line.unitPrice} size="sm" />
                        </td>
                        <td className="px-3 py-2 text-right">{(line.taxRate * 100).toFixed(0)}%</td>
                        <td className="px-3 py-2 text-right font-semibold">
                          <MoneyDisplay amount={line.lineTotal} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary Breakdown */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs text-[#50463c]">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal</span>
                    <MoneyDisplay amount={selectedInvoice.subtotal} size="sm" />
                  </div>
                  <div className="flex justify-between">
                    <span>Applicable GST (18%)</span>
                    <MoneyDisplay amount={selectedInvoice.taxAmount} size="sm" />
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#efe9e0] font-bold text-sm text-[#211b15]">
                    <span>Grand Total</span>
                    <MoneyDisplay amount={selectedInvoice.total} size="sm" />
                  </div>
                  <div className="flex justify-between text-xs text-[#7a9779]">
                    <span>Amount Paid</span>
                    <MoneyDisplay amount={selectedInvoice.amountPaid} size="sm" />
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#efe9e0] font-bold text-sm text-[#b83a2b]">
                    <span>Balance Due</span>
                    <MoneyDisplay amount={selectedInvoice.balanceDue} size="sm" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-[#efe9e0]">
                <div className="text-[11px] text-[#96897b]">
                  Payment methods accepted: Direct Bank Transfer (NEFT/RTGS) &amp; Corporate Cheque.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
