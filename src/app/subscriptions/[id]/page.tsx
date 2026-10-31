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
  Clock,
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
  const [events, setEvents] = useState(store.getSubscriptionEvents(subId));
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
      setEvents(store.getSubscriptionEvents(sub.id));
      setSuccess(`Subscription successfully moved to ${newStatus.toUpperCase()}`);
    }
  };

  const handleTogglePause = () => {
    setError(null);
    setSuccess(null);

    const result = store.togglePauseSubscription(sub.id);
    if (!result.success) {
      setError(result.error || 'Pause/Resume failed');
    } else {
      setSub(store.getSubscriptionById(sub.id));
      setEvents(store.getSubscriptionEvents(sub.id));
      setSuccess(`Subscription ${result.is_paused ? 'paused' : 'resumed'} successfully.`);
    }
  };

  const recurringTotal = sub.lines.reduce((acc, line) => acc + line.line_total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={sub.subscription_number}
        description={`Lifecycle state: ${sub.status.toUpperCase()} • Client: ${sub.customer?.name || 'Customer'}`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </Link>

            {sub.status === 'active' && (
              <button
                onClick={handleTogglePause}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-colors ${
                  sub.is_paused
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {sub.is_paused ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
                {sub.is_paused ? 'Resume Service' : 'Pause Service'}
              </button>
            )}
          </div>
        }
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Lifecycle Progress Bar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Strict Subscription Lifecycle Sequence (Draft &rarr; Quotation &rarr; Confirmed &rarr; Active &rarr; Closed)
        </div>

        <div className="flex items-center justify-between relative max-w-3xl">
          {['draft', 'quotation', 'confirmed', 'active', 'closed'].map((stage, idx) => {
            const stages = ['draft', 'quotation', 'confirmed', 'active', 'closed'];
            const currentIdx = stages.indexOf(sub.status === 'paused' ? 'active' : sub.status);
            const isCompleted = idx < currentIdx;
            const isCurrent = stages[idx] === (sub.status === 'paused' ? 'active' : sub.status);

            return (
              <div key={stage} className="flex flex-col items-center z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-2 uppercase tracking-wider ${
                    isCurrent ? 'text-indigo-600 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        </div>

        {/* Transition Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Current State: <span className="font-bold text-slate-900 uppercase">{sub.status}</span>
            {sub.is_paused && <span className="ml-2 text-amber-600 font-semibold">(Service Paused)</span>}
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

      {/* Audit & Lifecycle Transition History */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Audit & Lifecycle Transition History (Document 04 §6.3)</span>
          </span>
          <span className="text-xs text-slate-500 font-normal">
            {events.length} recorded event{events.length === 1 ? '' : 's'}
          </span>
        </div>
        {events.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">No transition events recorded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-semibold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {evt.event_type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {evt.from_status ? (
                        <>
                          <span className="text-slate-500 uppercase">{evt.from_status}</span>
                          <span className="mx-1 text-slate-400">&rarr;</span>
                          <span className="text-indigo-600 uppercase font-bold">{evt.to_status}</span>
                        </>
                      ) : (
                        <span className="text-emerald-600 uppercase font-bold">{evt.to_status}</span>
                      )}
                    </span>
                  </div>
                  {evt.notes && <div className="text-slate-600">{evt.notes}</div>}
                </div>
                <div className="text-right text-slate-400">
                  <div className="font-medium text-slate-600">{evt.actor_name || 'Staff / Admin'}</div>
                  <div>{formatDate(evt.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
