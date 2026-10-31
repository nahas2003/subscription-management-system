'use client';

import React, { useState } from 'react';
import { Layers, Plus, CheckCircle, AlertCircle, Calendar, PauseCircle, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { store } from '@/lib/store';
import { PlanRow } from '@/types/database';
import { PlanFrequency } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/utils';

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Configure recurring billing frequencies, minimum order quantities, and lifecycle rules (Task M3-03)."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        }
      />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  {plan.frequency}
                </span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Active
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{plan.name}</h2>
              {plan.description && <p className="text-xs text-slate-500 mt-1">{plan.description}</p>}

              <div className="mt-4 pb-4 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">{formatCurrency(plan.price)}</span>
                  <span className="text-xs text-slate-500">/ {plan.frequency}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Minimum Quantity: <strong>{plan.minimum_quantity}</strong>
                </div>
              </div>

              {/* Lifecycle & Policy Flags */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <PauseCircle className="w-3.5 h-3.5 text-slate-400" />
                    Pause Allowed
                  </span>
                  <strong className={plan.allow_pause ? 'text-emerald-600' : 'text-slate-400'}>
                    {plan.allow_pause ? 'Yes' : 'No'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    Early Close Allowed
                  </span>
                  <strong className={plan.allow_early_close ? 'text-emerald-600' : 'text-slate-400'}>
                    {plan.allow_early_close ? 'Yes' : 'No'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Auto-Close on End
                  </span>
                  <strong className={plan.auto_close ? 'text-amber-600' : 'text-slate-400'}>
                    {plan.auto_close ? 'Yes' : 'No (Renew)'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Availability:{' '}
              {plan.available_from ? `${plan.available_from} to ${plan.available_until || 'ongoing'}` : 'Always available'}
            </div>
          </div>
        ))}
      </div>

      {/* Create Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Create Subscription Plan</h2>
            <p className="text-xs text-slate-500 mb-4">
              Set billing frequency, minimum commitment quantity, and operational lifecycle rules.
            </p>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. QMS Enterprise Yearly"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Frequency *
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as PlanFrequency)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499.00"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Min Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={minimumQuantity}
                    onChange={(e) => setMinimumQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Plan summary and features..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-700 uppercase mb-1">
                  Plan Lifecycle Rules
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowPause}
                    onChange={(e) => setAllowPause(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Allow customers/staff to pause subscription</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowEarlyClose}
                    onChange={(e) => setAllowEarlyClose(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Allow early termination / cancellation</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoClose}
                    onChange={(e) => setAutoClose(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Automatically close on expiry date (do not auto-renew)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
