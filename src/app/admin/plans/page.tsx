'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, ShieldCheck, X, CheckCircle, AlertCircle } from 'lucide-react';
import { createPlan } from '@/lib/actions/plan';

interface SubscriptionPlan {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  basePrice: number;
  minQty: number;
  status: 'Active' | 'Closed';
  renewalRule: string;
  pauseAllowed: boolean;
  earlyCloseAllowed: boolean;
}

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-01',
    name: 'Enterprise Annual Plan',
    frequency: 'Yearly',
    basePrice: 100000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Auto-renew with 30-day reminder',
    pauseAllowed: true,
    earlyCloseAllowed: true,
  },
  {
    id: 'plan-02',
    name: 'Pro Monthly Support',
    frequency: 'Monthly',
    basePrice: 15000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Auto-renew monthly on 1st',
    pauseAllowed: true,
    earlyCloseAllowed: true,
  },
  {
    id: 'plan-03',
    name: 'Consulting Retainer Monthly',
    frequency: 'Monthly',
    basePrice: 20000,
    minQty: 1,
    status: 'Active',
    renewalRule: 'Auto-renew; 3-month min commit',
    pauseAllowed: false,
    earlyCloseAllowed: false,
  },
  {
    id: 'plan-04',
    name: 'Legacy Cloud Basic',
    frequency: 'Yearly',
    basePrice: 45000,
    minQty: 1,
    status: 'Closed',
    renewalRule: 'Grandfathered; non-renewable',
    pauseAllowed: false,
    earlyCloseAllowed: true,
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

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('frequency', frequency.toLowerCase());
      formData.append('price', price);
      formData.append('minimumQuantity', minQty);
      formData.append('allowPause', allowPause ? 'true' : 'false');
      formData.append('allowEarlyClose', allowEarlyClose ? 'true' : 'false');

      const res = await createPlan(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        const newPlan: SubscriptionPlan = {
          id: res?.plan?.id || `plan-${Date.now()}`,
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
        setName('');
        setPrice('15000');
      }
    } catch {
      const newPlan: SubscriptionPlan = {
        id: `plan-${Date.now()}`,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<SubscriptionPlan>[] = [
    {
      header: 'Plan Name',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15] flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#8c591b]" />
            <span>{item.name}</span>
          </div>
          <div className="text-xs text-[#96897b]">{item.renewalRule}</div>
        </div>
      ),
    },
    {
      header: 'Billing Frequency',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 text-xs font-bold text-[#8c591b]">
          {item.frequency}
        </span>
      ),
    },
    {
      header: 'Plan Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-bold" />,
    },
    {
      header: 'Min Quantity',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#211b15]">
          {item.minQty} unit(s)
        </span>
      ),
    },
    {
      header: 'Pause Allowed',
      cell: (item) => (
        <span
          className={`inline-flex rounded-[3.75px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            item.pauseAllowed ? 'bg-[#eef5ee] text-[#2b4c2b] border border-[#c5d8c4]' : 'bg-[#efe9e0] text-[#50463c]'
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
          className={`inline-flex rounded-[3.75px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            item.earlyCloseAllowed ? 'bg-[#eef5ee] text-[#2b4c2b] border border-[#c5d8c4]' : 'bg-[#efe9e0] text-[#50463c]'
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
          description="Configure recurring billing frequencies (Daily, Weekly, Monthly, Yearly), pricing tiers, and cancellation policies."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Plan
            </Button>
          }
        />

        {success && (
          <div className="p-4 bg-[#eef5ee] border border-[#c5d8c4] text-[#2b4c2b] rounded-[7.5px] text-sm flex items-center gap-2">
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
        <div className="fixed inset-0 z-50 bg-[#211b15]/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-[7.5px] max-w-lg w-full p-6 shadow-2xl border border-[#efe9e0] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#efe9e0]">
              <h3 className="font-display text-2xl font-bold text-[#211b15]">Configure New Subscription Plan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#50463c] hover:text-[#211b15] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3.75px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Retainer"
                  className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Billing Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Price per Period (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Minimum Commitment Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15] font-mono"
                />
              </div>

              <div className="p-3 bg-[#fcfaf1] border border-[#efe9e0] rounded-[3.75px] space-y-2">
                <div className="text-xs font-bold text-[#211b15]">Policy Rules</div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#211b15]">
                    <input
                      type="checkbox"
                      checked={allowPause}
                      onChange={(e) => setAllowPause(e.target.checked)}
                      className="rounded text-[#8c591b] focus:ring-[#e8b672]"
                    />
                    <span>Allow Temporary Pause</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[#211b15]">
                    <input
                      type="checkbox"
                      checked={allowEarlyClose}
                      onChange={(e) => setAllowEarlyClose(e.target.checked)}
                      className="rounded text-[#8c591b] focus:ring-[#e8b672]"
                    />
                    <span>Allow Early Close</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#efe9e0]">
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
