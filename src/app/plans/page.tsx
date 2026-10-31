'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  CheckCircle,
  AlertCircle,
  Calendar,
  PauseCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';
import { PlanRow } from '@/types/database';
import { PlanFrequency } from '@/types/domain';

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanRow[]>(store.getPlans());
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('499');
  const [frequency, setFrequency] = useState<PlanFrequency>('monthly');
  const [minimumQuantity, setMinimumQuantity] = useState('1');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableUntil, setAvailableUntil] = useState('');
  const [allowPause, setAllowPause] = useState(true);
  const [allowEarlyClose, setAllowEarlyClose] = useState(true);
  const [autoClose, setAutoClose] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!name.trim()) throw new Error('Plan name is required.');
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Plan price must be a valid non-negative number.');
      }
      const parsedMinQty = parseFloat(minimumQuantity);
      if (isNaN(parsedMinQty) || parsedMinQty <= 0) {
        throw new Error('Minimum quantity must be greater than zero.');
      }

      const newPlan = store.createPlan({
        name: name.trim(),
        description: description.trim() || null,
        price: parsedPrice,
        frequency,
        minimum_quantity: parsedMinQty,
        available_from: availableFrom || null,
        available_until: availableUntil || null,
        allow_pause: allowPause,
        allow_early_close: allowEarlyClose,
        auto_close: autoClose,
      });

      setPlans(store.getPlans());
      setSuccess(`Subscription Plan "${newPlan.name}" (${newPlan.frequency}) created successfully!`);
      setName('');
      setDescription('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create plan');
    }
  };

  const totalPlans = plans.length;
  const monthlyPlans = plans.filter((p) => p.frequency === 'monthly').length;
  const yearlyPlans = plans.filter((p) => p.frequency === 'yearly').length;

  return (
    <AppShell
      role="admin"
      currentPath="/plans"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title="Recurring Plans"
    >
      <div className="space-y-6">
        <PageHeader
          title="Recurring Subscription Plans"
          description="Define billing frequencies, minimum order commitments, pause rules, and lifecycle policies (Task M3-03)."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Plan
            </Button>
          }
        />

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Plan Schemes"
            value={totalPlans}
            subtitle="Configured billing schedules"
            icon={<Calendar className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Monthly Recurrence"
            value={monthlyPlans}
            subtitle="Standard 30-day billing cycles"
            icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Annual Commitments"
            value={yearlyPlans}
            subtitle="12-month advance contracts"
            icon={<Layers className="h-5 w-5 text-purple-600" />}
          />
          <StatCard
            title="Pause Policy Enabled"
            value={plans.filter((p) => p.allow_pause).length}
            subtitle="Customers can pause service"
            icon={<PauseCircle className="h-5 w-5 text-blue-600" />}
          />
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-xs font-medium">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Plans List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                    {plan.frequency}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
                {plan.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{plan.description}</p>}

                <div className="mt-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <MoneyDisplay amount={plan.price} size="xl" className="font-extrabold text-slate-900" />
                    <span className="text-xs text-slate-400 font-medium">/ {plan.frequency}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Min Commitment: <strong>{plan.minimum_quantity} unit(s)</strong>
                  </div>
                </div>

                {/* Lifecycle & Policy Flags */}
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <PauseCircle className="w-3.5 h-3.5 text-slate-400" />
                      Pause Allowed
                    </span>
                    <strong className={plan.allow_pause ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {plan.allow_pause ? 'Yes' : 'No'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                      Early Close Allowed
                    </span>
                    <strong className={plan.allow_early_close ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                      {plan.allow_early_close ? 'Yes' : 'No'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Auto-Close on Term
                    </span>
                    <strong className={plan.auto_close ? 'text-amber-700 font-bold' : 'text-slate-400'}>
                      {plan.auto_close ? 'Yes' : 'No (Auto-Renew)'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Availability:</span>
                <span className="font-medium text-slate-600">
                  {plan.available_from ? `${plan.available_from} to ${plan.available_until || 'ongoing'}` : 'Always Active'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Plan Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Create Subscription Plan</h2>
              <p className="text-xs text-slate-500 mb-4">
                Set billing frequency, minimum commitment quantity, and operational lifecycle rules.
              </p>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. QMS Enterprise Yearly"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Frequency *
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as PlanFrequency)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="499"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Min Qty *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={minimumQuantity}
                      onChange={(e) => setMinimumQuantity(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Plan terms and SLA coverage..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Policy Checkboxes */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowPause}
                      onChange={(e) => setAllowPause(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Allow customers/staff to pause subscription
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowEarlyClose}
                      onChange={(e) => setAllowEarlyClose(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Allow early contract closure
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoClose}
                      onChange={(e) => setAutoClose(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Auto-close at end of period (do not renew)
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Create Plan
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
