'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface DiscountRecord {
  id: string;
  name: string;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  minPurchase: number;
  status: 'Active' | 'Closed';
  validFrom: string;
  validUntil: string;
}

const mockDiscounts: DiscountRecord[] = [
  {
    id: 'disc-01',
    name: 'Early Adopter QMS Discount',
    code: 'EARLYBIRD10',
    type: 'Percentage',
    value: 10,
    minPurchase: 50000,
    status: 'Active',
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
  },
  {
    id: 'disc-02',
    name: 'Make-A-Ton Hackathon Promo',
    code: 'MAKEATON9',
    type: 'Percentage',
    value: 15,
    minPurchase: 10000,
    status: 'Active',
    validFrom: '2026-10-01',
    validUntil: '2026-11-15',
  },
  {
    id: 'disc-03',
    name: 'Annual Pre-payment Waiver',
    code: 'ANNUALFLAT',
    type: 'Fixed',
    value: 5000,
    minPurchase: 80000,
    status: 'Active',
    validFrom: '2026-06-01',
    validUntil: '2027-05-31',
  },
];

export default function DiscountsPage() {
  const columns: Column<DiscountRecord>[] = [
    {
      header: 'Promo Name & Code',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.name}</div>
          <span className="font-mono text-xs font-bold text-[#8c591b] bg-[#fdf6ed] px-1.5 py-0.5 rounded-[3.75px] border border-[#e8b672]/60">
            {item.code}
          </span>
        </div>
      ),
    },
    {
      header: 'Discount Value',
      cell: (item) => (
        <span className="font-bold text-[#2b4c2b] text-sm">
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
              Add Discount Rule
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
