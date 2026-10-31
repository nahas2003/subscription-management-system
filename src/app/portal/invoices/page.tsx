'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge, InvoiceStatus } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Eye } from 'lucide-react';

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
    issueDate: '2026-10-22',
    dueDate: '2026-11-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 0,
    balanceDue: 17700,
    status: 'Confirmed',
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
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0019',
    issueDate: '2026-09-21',
    dueDate: '2026-10-05',
    subtotal: 15000,
    taxAmount: 2700,
    total: 17700,
    amountPaid: 17700,
    balanceDue: 0,
    status: 'Paid',
    lines: [
      {
        description: 'Managed Cloud Infrastructure - Pro Support (Sep 2026)',
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
          variant="outline"
          size="sm"
          onClick={() => setSelectedInvoice(item)}
          leftIcon={<Eye className="h-3.5 w-3.5" />}
        >
          View Statement
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal/invoices"
      user={{ name: 'Apex Technologies Pvt Ltd', email: 'billing@apextech.in', role: 'customer' }}
      title="My Invoices"
    >
      <div className="space-y-6">
        <PageHeader
          title="Invoices & Statements"
          description="View recurring billing statements, tax breakdowns, and settlement history."
          breadcrumbs={[
            { label: 'Portal', href: '/portal' },
            { label: 'My Invoices' },
          ]}
        />

        <DataTable
          columns={columns}
          data={mockInvoices}
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
                    Billed to: <strong className="text-[#211b15]">Apex Technologies Pvt Ltd</strong> (GSTIN: 32AAAAA0000A1Z5)
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
                      <tr key={idx}>
                        <td className="px-3 py-2.5 font-medium">{line.description}</td>
                        <td className="px-3 py-2.5 text-center">{line.qty}</td>
                        <td className="px-3 py-2.5 text-right"><MoneyDisplay amount={line.unitPrice} size="sm" /></td>
                        <td className="px-3 py-2.5 text-right font-mono">{(line.taxRate * 100).toFixed(0)}%</td>
                        <td className="px-3 py-2.5 text-right font-bold"><MoneyDisplay amount={line.lineTotal} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-[#50463c]">
                    <span>Taxable Subtotal:</span>
                    <MoneyDisplay amount={selectedInvoice.subtotal} size="sm" />
                  </div>
                  <div className="flex justify-between text-[#50463c]">
                    <span>Applicable GST (18%):</span>
                    <MoneyDisplay amount={selectedInvoice.taxAmount} size="sm" />
                  </div>
                  <div className="flex justify-between text-[#211b15] font-bold border-t border-[#efe9e0] pt-2 text-sm">
                    <span>Total Invoice:</span>
                    <MoneyDisplay amount={selectedInvoice.total} size="lg" />
                  </div>
                  <div className="flex justify-between text-[#50463c]">
                    <span>Amount Paid:</span>
                    <MoneyDisplay amount={selectedInvoice.amountPaid} size="sm" />
                  </div>
                  <div className="flex justify-between text-[#8f2115] font-bold bg-[#fcedeb] p-2 rounded-[3.75px] border border-[#e8b0a9]">
                    <span>Balance Due:</span>
                    <MoneyDisplay amount={selectedInvoice.balanceDue} size="md" className="text-[#b83a2b]" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-[#efe9e0] pt-4">
                <Button variant="outline" size="md" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
