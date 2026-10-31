'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Percent, Tag } from 'lucide-react';

interface DiscountRecord {
  id: string;
  name: string;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  minPurchase: number;
  validFrom: string;
  validUntil: string;
  status: 'Active' | 'Closed';
}

const mockDiscounts: DiscountRecord[] = [
  {
    id: 'disc-01',
    name: 'Diwali Enterprise Promotion',
    code: 'FESTIVE15',
    type: 'Percentage',
    value: 15, // 15%
    minPurchase: 50000,
    validFrom: '2026-10-15',
    validUntil: '2026-11-15',
    status: 'Active',
  },
  {
    id: 'disc-02',
    name: 'New Startup Credit',
    code: 'STARTUP5K',
    type: 'Fixed',
    value: 5000, // ₹5,000 off
    minPurchase: 20000,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'disc-03',
    name: 'Early Adopter Q1 Pass',
    code: 'EARLY2026',
    type: 'Percentage',
    value: 20,
    minPurchase: 10000,
    validFrom: '2026-01-01',
    validUntil: '2026-03-31',
    status: 'Closed',
  },
];

export default function DiscountsPage() {
  const columns: Column<DiscountRecord>[] = [
    {
      header: 'Promo Name & Code',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
            {item.code}
          </span>
        </div>
      ),
    },
    {
      header: 'Discount Value',
      cell: (item) => (
        <span className="font-bold text-emerald-700 text-sm">
          {item.type === 'Percentage' ? `${item.value}% OFF` : <MoneyDisplay amount={item.value} size="sm" />}
        </span>
      ),
    },
    {
      header: 'Min Purchase',
      cell: (item) => <MoneyDisplay amount={item.minPurchase} size="sm" />,
    },
    {
      header: 'Valid From',
      cell: (item) => <DateDisplay date={item.validFrom} />,
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

  return (
    <AppShell
      role="admin"
      currentPath="/admin/discounts"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Discounts & Promotions"
    >
      <div className="space-y-6">
        <PageHeader
          title="Discounts & Coupons"
          description="Manage percentage and fixed-amount discounts, eligibility thresholds, and promotion validity dates."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Discount
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockDiscounts}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
