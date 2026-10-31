'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Repeat,
  PauseCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { store } from '@/lib/store';
import { SubscriptionStatus, ALLOWED_SUBSCRIPTION_TRANSITIONS } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubscriptionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const subId = params.id as string;

  const [sub, setSub] = useState(store.getSubscriptionById(subId));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!sub) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-slate-900">Subscription Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The requested subscription does not exist.</p>
        <Link
          href="/subscriptions"
          className="mt-4 inline-block px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
        >
          Back to Subscriptions
        </Link>
      </div>
    );
  }

  const allowedNext = ALLOWED_SUBSCRIPTION_TRANSITIONS[sub.status] || [];

  const handleTransition = (newStatus: SubscriptionStatus) => {
    setError(null);
    setSuccess(null);

    const result = store.transitionSubscriptionStatus(sub.id, newStatus);
    if (!result.success) {
      setError(result.error || 'Transition failed');
    } else {
      setSub(store.getSubscriptionById(sub.id));
      setSuccess(`Subscription state updated successfully to "${newStatus.toUpperCase()}".`);
    }
  };

  const handleTogglePause = () => {
    setError(null);
    setSuccess(null);

    const result = store.togglePauseSubscription(sub.id);
    if (!result.success) {
      setError(result.error || 'Pause toggle failed');
    } else {
      setSub(store.getSubscriptionById(sub.id));
      setSuccess(
        result.is_paused
          ? 'Subscription has been PAUSED. Recurring billing will be held until resumed.'
          : 'Subscription has been RESUMED to live active billing.'
      );
    }
  };

  const recurringTotal = sub.lines.reduce((sum, l) => sum + l.line_total, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link
          href="/subscriptions"
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subscriptions
        </Link>
      </div>

      <PageHeader
        title={`Subscription: ${sub.subscription_number}`}
        description={`Customer commitment for ${sub.customer?.name || 'Customer'}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={sub.status} />
            {sub.is_paused && <StatusBadge status="paused" />}

            {/* Pause/Resume button (Active status only) */}
            {sub.status === 'active' && (
              <button
                onClick={handleTogglePause}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              >
                {sub.is_paused ? (
                  <>
                    <PlayCircle className="w-3.5 h-3.5 text-emerald-600" /> Resume Subscription
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-3.5 h-3.5 text-amber-600" /> Pause Subscription
                  </>
                )}
              </button>
            )}
          </div>
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

      {/* Lifecycle Progression Control Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Repeat className="w-4 h-4 text-indigo-600" />
            <span>Documented Lifecycle State Machine</span>
          </div>
          <div className="text-xs text-slate-400">
            Current: <strong className="text-indigo-600 uppercase font-mono">{sub.status}</strong>
          </div>
        </div>

        {/* State Pipeline Diagram */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs mb-6">
          {(['draft', 'quotation', 'confirmed', 'active', 'closed'] as SubscriptionStatus[]).map(
            (stage, idx) => {
              const isCurrent = sub.status === stage;
              return (
                <div
                  key={stage}
                  className={`p-3 rounded-lg border font-semibold uppercase tracking-wider ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-normal opacity-70 mb-0.5">Step {idx + 1}</div>
                  {stage}
                </div>
              );
            }
          )}
        </div>

        {/* Transition Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            {allowedNext.length > 0
              ? `Allowed state transitions: ${allowedNext.map((s: string) => `"${s.toUpperCase()}"`).join(', ')}`
              : 'This subscription is in the terminal "CLOSED" state. No future recurring invoices will be produced.'}
          </div>

          <div className="flex items-center gap-2">
            {allowedNext.map((nextStage: SubscriptionStatus) => (
              <button
                key={nextStage}
                onClick={() => handleTransition(nextStage)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 ${
                  nextStage === 'closed'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {nextStage === 'closed' ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Transition to {nextStage.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Key Metadata */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Customer</div>
          <div className="font-bold text-slate-900 mt-1">{sub.customer?.name}</div>
          <div className="text-xs text-slate-500">{sub.customer?.email}</div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{sub.customer?.customer_code}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Start Date</div>
          <div className="font-semibold text-slate-900 mt-1">{formatDate(sub.start_date)}</div>
          <div className="text-xs text-slate-500">Commencement Date</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Next Billing Date</div>
          <div className="font-semibold text-indigo-700 mt-1">{formatDate(sub.next_billing_date)}</div>
          <div className="text-xs text-slate-500">Recurring Billing Schedule</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Payment Terms</div>
          <div className="font-semibold text-slate-900 mt-1">{sub.payment_terms}</div>
          <div className="text-xs text-slate-500">Invoice Terms</div>
        </div>
      </div>

      {/* Subscription Lines Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50 flex items-center justify-between">
          <span>Active Subscription Line Items & Pricing Snapshots</span>
          <span className="text-xs text-slate-500 font-normal">
            Preserved agreed contractual lines
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Item Description</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Tax Rate</th>
                <th className="px-6 py-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sub.lines.map((line) => (
                <tr key={line.id}>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {line.description_snapshot}
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-800">{line.quantity}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(line.unit_price)}</td>
                  <td className="px-6 py-4 text-right">{(line.tax_rate_snapshot * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(line.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recurring Summary */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <div className="w-72 space-y-2 text-right">
            <div className="flex justify-between text-base font-bold text-slate-900">
              <span>Recurring Billing Total:</span>
              <span className="text-indigo-600">{formatCurrency(recurringTotal)}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Invoices generated by Member 4 will bill this exact amount per period.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
