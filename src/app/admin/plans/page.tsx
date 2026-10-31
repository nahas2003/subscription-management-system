'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Calendar, ShieldCheck, X, CheckCircle, AlertCircle } from 'lucide-react';
import { createPlan } from '@/lib/actions/plan';

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  basePrice: number;
  minQty: number;
  renewalRule: string;
  pauseAllowed: boolean;
  earlyCloseAllowed: boolean;
  status: 'Active' | 'Draft';
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-01',
    name: 'Enterprise Annual License',
    frequency: 'Yearly',
    basePrice: 100000,
    minQty: 1,
    renewalRule: 'Automatic annual renewal on anniversary',
    pauseAllowed: false,
    earlyCloseAllowed: true,
    status: 'Active',
  },
  {
    id: 'plan-02',
    name: 'Pro Monthly Support Plan',
    frequency: 'Monthly',
    basePrice: 15000,
    minQty: 1,
    renewalRule: 'Billed 1st of every month',
    pauseAllowed: true,
    earlyCloseAllowed: true,
    status: 'Active',
  },
  {
    id: 'plan-03',
    name: 'Weekly Sprint Retainer',
    frequency: 'Weekly',
    basePrice: 5000,
    minQty: 2,
    renewalRule: 'Billed every Monday',
    pauseAllowed: true,
    earlyCloseAllowed: false,
    status: 'Active',
  },
  {
    id: 'plan-04',
    name: 'Daily Dedicated Resource',
    frequency: 'Daily',
    basePrice: 1200,
    minQty: 5,
    renewalRule: 'Pre-paid daily allocation',
    pauseAllowed: false,
    earlyCloseAllowed: true,
    status: 'Draft',
  },
];

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [price, setPrice] = useState('15000');
  const [minQty, setMinQty] = useState('1');
  const [allowPause, setAllowPause] = useState(true);
  const [allowEarlyClose, setAllowEarlyClose] = useState(true);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('frequency', frequency.toLowerCase());
    formData.append('price', price);
    formData.append('minimumQuantity', minQty);
    formData.append('allowPause', allowPause ? 'true' : 'false');
    formData.append('allowEarlyClose', allowEarlyClose ? 'true' : 'false');

    const res = await createPlan(formData);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      const newPlan: SubscriptionPlan = {
        id: res.plan?.id || `plan-${Date.now()}`,
        name: name,
        frequency: frequency,
        basePrice: parseFloat(price) || 0,
        minQty: parseInt(minQty, 10) || 1,
        renewalRule: `Recurring ${frequency.toLowerCase()} billing cycle`,
        pauseAllowed: allowPause,
        earlyCloseAllowed: allowEarlyClose,
        status: 'Active',
      };

      setPlans([newPlan, ...plans]);
      setSuccess(`Subscription plan "${name}" configured successfully.`);
      setIsModalOpen(false);

      // Reset
      setName('');
      setPrice('15000');
    }
  };

  const columns: Column<SubscriptionPlan>[] = [
    {
      header: 'Plan Name',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span className="font-semibold text-slate-900">{item.name}</span>
        </div>
      ),
    },
    {
      header: 'Billing Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
          {item.frequency}
        </span>
      ),
    },
    {
      header: 'Base Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-semibold" />,
    },
    {
      header: 'Min Quantity',
      cell: (item) => <span className="font-mono text-xs">{item.minQty} unit(s)</span>,
    },
    {
      header: 'Pause Allowed',
      cell: (item) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            item.pauseAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {item.pauseAllowed ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      header: 'Early Close',
      cell: (item) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            item.earlyCloseAllowed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {item.earlyCloseAllowed ? 'Allowed' : 'Locked'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/plans"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Subscription Plans"
    >
      <div className="space-y-6">
        <PageHeader
          title="Subscription Plans"
          description="Configure recurring billing frequencies (Daily, Weekly, Monthly, Yearly), pricing tiers, and cancellation policies (Task M3-03)."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create New Plan
            </Button>
          }
        />

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={plans}
          keyExtractor={(item) => item.id}
        />
      </div>

      {/* Modal Dialog for New Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Configure New Subscription Plan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Retainer"
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price per Period (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Commitment Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800">Policy Rules</div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPause}
                      onChange={(e) => setAllowPause(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow Temporary Pause</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowEarlyClose}
                      onChange={(e) => setAllowEarlyClose(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow Early Close</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Configure Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
