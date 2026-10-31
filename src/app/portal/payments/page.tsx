'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { getCustomerPortalData } from '@/lib/actions/portal';

interface PaymentHistoryItem {
  id: string;
  paymentRef: string;
  invoiceNumber: string;
  paymentDate: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Confirmed';
}

const mockPayments: PaymentHistoryItem[] = [
  {
    id: 'pay-01',
    paymentRef: 'PAY-2026-0031',
    invoiceNumber: 'INV-2026-0019',
    paymentDate: '2026-10-04',
    amount: 17700,
    method: 'Bank Transfer (NEFT)',
    status: 'Paid',
  },
  {
    id: 'pay-02',
    paymentRef: 'PAY-2026-0021',
    invoiceNumber: 'INV-2026-0008',
    paymentDate: '2026-01-20',
    amount: 118000,
    method: 'RTGS Electronic Transfer',
    status: 'Paid',
  },
];

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>(mockPayments);
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
        if (data?.payments && data.payments.length > 0) {
          const mapped: PaymentHistoryItem[] = data.payments.map((p) => ({
            id: p.id,
paymentRef: (p as any).payment_reference || (p as any).payment_number || `PAY-${p.id.slice(0, 8)}`,
            invoiceNumber: (p as any).invoice_id ? `INV-${(p as any).invoice_id.slice(0, 8)}` : 'On Account',
            paymentDate: p.payment_date,
            method:
              p.payment_method === 'bank_transfer'
                ? 'Bank Transfer (NEFT)'
                : p.payment_method === 'upi'
                ? 'UPI Merchant Intent'
                : p.payment_method === 'credit_card'
                ? 'Credit Card'
                : 'Direct Settlement',
            amount: p.amount,
            status: 'Confirmed',
          }));
          setPayments(mapped);
        }
      } catch (err) {
        console.error('Failed to load customer payments:', err);
      }
    }
    loadData();
  }, []);

  const columns: Column<PaymentHistoryItem>[] = [
    {
      header: 'Payment Reference',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b]">
          {item.paymentRef}
        </span>
      ),
    },
    {
      header: 'Invoice #',
      cell: (item) => (
        <span className="font-mono text-xs text-[#211b15] font-medium">
          {item.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Payment Date',
      cell: (item) => <DateDisplay date={item.paymentDate} />,
    },
    {
      header: 'Method',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2 py-0.5 text-xs text-[#211b15] font-medium">
          {item.method}
        </span>
      ),
    },
    {
      header: 'Amount Credited',
      cell: (item) => <MoneyDisplay amount={item.amount} size="sm" className="font-bold text-[#2b4c2b]" />,
    },
    {
      header: 'Allocation Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="customer"
      currentPath="/portal/payments"
      user={{ name: customerName, email: customerEmail, role: 'customer' }}
      title="Payment History"
    >
      <div className="space-y-6">
        <PageHeader
          title="Payment Receipts & History"
          description="Verified bank allocations, electronic receipts, and credit confirmations against past invoices."
          breadcrumbs={[
            { label: 'Portal', href: '/portal' },
            { label: 'Payments' },
          ]}
        />

        <DataTable
          columns={columns}
          data={payments}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
