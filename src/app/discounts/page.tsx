'use client';

import React, { useState, useEffect } from 'react';
import { Discount } from '@/types/finance';
import { MoneyDisplay } from '@/components/finance/money-display';
import { PageHeader } from '@/components/ui/page-header';
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minPurchase, setMinPurchase] = useState<number>(2000);
  const [usageLimit, setUsageLimit] = useState<number>(100);

  const loadDiscounts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/discounts');
      const json = await res.json();
      if (json.success) {
        setDiscounts(json.data);
      }
    } catch (err: any) {
      console.error('Failed to load discounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts();
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
          usageLimit: Number(usageLimit),
        }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Failed to create discount');
      }

      setNotification({
        type: 'success',
        message: `Discount code ${json.data.code} created successfully!`,
      });
      setIsModalOpen(false);
      setName('');
      setCode('');
      setValue(10);
      setMinPurchase(2000);
      await loadDiscounts();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Discounts & Tax Engine"
        description="Configure fixed and percentage promotional rules, minimum spend thresholds, usage quotas, and statutory 18% GST rules (Member 4 — Task M4-03)."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Promo Code
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

      {/* Tax Engine Standard Banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
        <div className="text-xs text-indigo-900 leading-relaxed">
          <strong>GST Compliance Engine Active:</strong> All BrightLoop invoices automatically apply
          tax-exclusive <strong>18% Integrated Goods and Services Tax (GST)</strong> on the net
          taxable amount (post-discount). Subtotal capping guarantees zero negative invoice values.
        </div>
      </div>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map((disc) => (
          <div
            key={disc.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md">
                  {disc.code}
                </span>
                <h3 className="font-bold text-slate-900 mt-2 text-base">{disc.name}</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>

            <div className="border-t border-b border-slate-100 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Benefit:</span>
                <strong className="text-indigo-600 text-sm">
                  {disc.discount_type === 'percentage' ? `${disc.value}% Off` : `₹${disc.value} Flat Off`}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Minimum Spend:</span>
                <strong className="text-slate-800">
                  {disc.minimum_purchase ? `₹${disc.minimum_purchase.toLocaleString('en-IN')}` : 'None'}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Usage Quota:</span>
                <strong className="text-slate-800">
                  {disc.usage_count} / {disc.usage_limit || '∞'}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Valid through Dec 31, 2026</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create Promotional Discount</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Campaign / Rule Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Enterprise Offer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Promo Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENTERPRISE20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Min Purchase (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
