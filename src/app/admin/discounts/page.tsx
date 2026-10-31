'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Percent, Tag, X, CheckCircle2 } from 'lucide-react';

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
      cell: (item) =>
        item.minPurchase > 0 ? (
          <MoneyDisplay amount={item.minPurchase} size="sm" />
        ) : (
          <span className="text-[#96897b] text-xs">No limit</span>
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
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
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
          description="Manage promotional campaigns, define purchase thresholds, and configure discount deduction rules."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Discount Rule
            </Button>
          }
        />

        {notification && (
          <div className="p-3 bg-[#eef5ee] border border-[#c5d8c4] text-[#2b4c2b] rounded-[7.5px] text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7a9779]" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-[#50463c] hover:text-[#211b15]">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans">
            <div className="w-full max-w-md rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">Create Promo Code</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#50463c] hover:text-[#211b15]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDiscount} className="space-y-4 text-sm">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
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
                    <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
                      Type *
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as any)}
                      className="w-full p-2 text-xs border border-[#c7bcaf] rounded-[3.75px] bg-white text-[#211b15] focus:outline-none focus:border-[#8c591b]"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#50463c] block mb-1">
                    Minimum Spend Threshold (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#efe9e0]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Promo Code
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
