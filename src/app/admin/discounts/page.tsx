'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Percent, Tag, X, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

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
    value: 15,
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
    value: 5000,
    minPurchase: 20000,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    status: 'Active',
  },
  {
    id: 'disc-03',
    name: 'Early Adopter Q1 Pass',
    code: 'EARLYBIRD',
    type: 'Percentage',
    value: 20,
    minPurchase: 10000,
    validFrom: '2026-01-01',
    validUntil: '2026-03-31',
    status: 'Closed',
  },
];

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountRecord[]>(mockDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minPurchase, setMinPurchase] = useState(2000);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/discounts?onlyActive=false');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const mapped: DiscountRecord[] = json.data.map((d: any) => ({
          id: d.id,
          name: d.name,
          code: d.code,
          type: d.discount_type === 'percentage' ? 'Percentage' : 'Fixed',
          value: d.value,
          minPurchase: d.minimum_purchase || 0,
          validFrom: d.starts_at ? d.starts_at.slice(0, 10) : '2026-10-01',
          validUntil: d.ends_at ? d.ends_at.slice(0, 10) : '2026-12-31',
          status: d.is_active ? 'Active' : 'Closed',
        }));
        setDiscounts(mapped);
      }
    } catch (err) {
      console.error('Failed to load discounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          code: code.toUpperCase(),
          discountType,
          value: Number(value),
          minimumPurchase: Number(minPurchase),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to create discount');

      setNotification(`Promo code ${json.data.code} created successfully!`);
      setIsModalOpen(false);
      setName('');
      setCode('');
      await fetchDiscounts();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const columns: Column<DiscountRecord>[] = [
    {
      header: 'Promo Code',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
          {item.code}
        </span>
      ),
    },
    {
      header: 'Campaign Name',
      accessorKey: 'name',
      className: 'font-semibold text-slate-800',
    },
    {
      header: 'Benefit Value',
      cell: (item) => (
        <span className="font-semibold text-emerald-700">
          {item.type === 'Percentage' ? `${item.value}% Off` : `₹${item.value} Flat Off`}
        </span>
      ),
    },
    {
      header: 'Min Purchase',
      cell: (item) =>
        item.minPurchase > 0 ? (
          <MoneyDisplay amount={item.minPurchase} size="sm" />
        ) : (
          <span className="text-slate-400 text-xs">No limit</span>
        ),
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
      cell: (item) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
            item.status === 'Active'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/discounts"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Discounts & Promos"
    >
      <div className="space-y-6">
        <PageHeader
          title="Promotional Discounts & Coupons"
          description="Manage promotional campaigns, define purchase thresholds, and configure discount deduction rules (Member 4 — Task M4-03)."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Discount Code
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
          data={discounts}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg">Create Promo Code</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDiscount} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Campaign Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Q4 Special Offer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Promo Code *
                  </label>
                  <Input
                    required
                    placeholder="e.g. SAVE20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Type *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Value *
                    </label>
                    <Input
                      type="number"
                      required
                      min="1"
                      value={value}
                      onChange={(e) => setValue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Minimum Spend Threshold (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="md" type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit">
                    Create Promo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
