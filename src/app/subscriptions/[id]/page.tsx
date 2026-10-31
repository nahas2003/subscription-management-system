'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Repeat,
  PauseCircle,
  PlayCircle,
  XCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  Receipt,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';
import { SubscriptionStatus, ALLOWED_SUBSCRIPTION_TRANSITIONS } from '@/types/domain';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const subId = params.id as string;

  const [sub, setSub] = useState(store.getSubscriptionById(subId));
  const [events, setEvents] = useState(store.getSubscriptionEvents(subId));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!sub) {
    return (
      <AppShell
        role="admin"
        currentPath="/subscriptions"
        user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
        title="Subscription Not Found"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Subscription Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            The subscription identifier <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-600">{subId}</code> does not match any registered subscription contract in BrightLoop.
          </p>
          <div className="mt-6">
            <Link href="/subscriptions">
              <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Return to Subscriptions List
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
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
    <AppShell
      role="admin"
      currentPath="/subscriptions"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title={`Subscription ${sub.subscription_number}`}
    >
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Subscriptions
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-slate-800">{sub.subscription_number}</span>
          </div>

          <div className="flex items-center gap-2">
            {sub.status === 'active' && (
              <button
                onClick={handleTogglePause}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                  sub.is_paused
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                }`}
              >
                {sub.is_paused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                {sub.is_paused ? 'Resume Subscription' : 'Pause Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Page Header */}
        <PageHeader
          title={sub.subscription_number}
          description={`Contract for ${sub.customer?.name || 'Customer'} • Managed under BrightLoop Single-Company Operations`}
          action={
            <div className="flex items-center gap-2">
              <StatusBadge status={sub.status} size="md" />
              {sub.is_paused && (
                <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-300">
                  Service Suspended
                </span>
              )}
            </div>
          }
        />

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2 shadow-xs">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-xs">
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Interactive Lifecycle Progression Stepper */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Repeat className="h-4 w-4 text-indigo-600" />
              <span>Lifecycle State Progression (Document 04 §6.2)</span>
            </div>
            <span className="text-xs text-slate-400">Strict deterministic state sequence</span>
          </div>

          <div className="flex items-center justify-between relative max-w-3xl mx-auto px-4 py-2">
            {['draft', 'quotation', 'confirmed', 'active', 'closed'].map((stage, idx) => {
              const stages = ['draft', 'quotation', 'confirmed', 'active', 'closed'];
              const currentIdx = stages.indexOf(sub.status === 'paused' ? 'active' : sub.status);
              const isCompleted = idx < currentIdx;
              const isCurrent = stages[idx] === (sub.status === 'paused' ? 'active' : sub.status);

              return (
                <div key={stage} className="flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md scale-110'
                        : isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 uppercase tracking-wider ${
                      isCurrent
                        ? 'text-indigo-600 font-bold'
                        : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
            <div className="absolute top-7 left-12 right-12 h-1 bg-slate-200 -z-0" />
          </div>

          {/* Transition Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              Current Active State:{' '}
              <span className="font-bold uppercase text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {sub.status}
              </span>
              {sub.is_paused && (
                <span className="ml-2 text-amber-600 font-semibold">(Service Paused)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {allowedNext.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No further lifecycle transitions (Terminal State)</span>
              ) : (
                allowedNext.map((nextStage: SubscriptionStatus) => (
                  <button
                    key={nextStage}
                    onClick={() => handleTransition(nextStage)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
                      nextStage === 'closed'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10'
                    }`}
                  >
                    {nextStage === 'closed' ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Move to {nextStage.toUpperCase()}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Contract Key Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span>Customer Details</span>
            </div>
            <div className="font-bold text-slate-900 text-base">{sub.customer?.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{sub.customer?.email}</div>
            <div className="mt-2 inline-block font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Code: {sub.customer?.customer_code}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Start Date
            </div>
            <div className="font-bold text-slate-900 text-base">
              <DateDisplay date={sub.start_date} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Agreement Effective Date</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Next Billing Renewal
            </div>
            <div className="font-bold text-indigo-700 text-base">
              <DateDisplay date={sub.next_billing_date} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Scheduled for recurring run</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Payment Terms
            </div>
            <div className="font-bold text-slate-900 text-base">{sub.payment_terms}</div>
            <div className="text-xs text-slate-500 mt-1">Invoice settlement window</div>
          </div>
        </div>

        {/* Contractual Snapshot Line Items */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50/75 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-indigo-600" />
              <span>Contract Snapshot Line Items</span>
            </span>
            <span className="text-xs text-slate-500 font-normal">
              Preserved pricing snapshot from quotation
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Item Description</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Unit Price (₹)</th>
                  <th className="px-6 py-3 text-right">GST Rate</th>
                  <th className="px-6 py-3 text-right">Line Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sub.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {line.description_snapshot}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-800">{line.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <MoneyDisplay amount={line.unit_price} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">{(line.tax_rate_snapshot * 100).toFixed(0)}%</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      <MoneyDisplay amount={line.line_total} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 bg-slate-50/80 border-t border-slate-200 flex justify-end">
            <div className="w-80 space-y-1.5 text-right">
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Recurring Billing Total:</span>
                <MoneyDisplay amount={recurringTotal} size="lg" className="font-bold text-indigo-700" />
              </div>
              <div className="text-[11px] text-slate-500">
                Automated billing runs will generate invoices matching this exact contracted amount.
              </div>
            </div>
          </div>
        </div>

        {/* Audit Trail & Transition History */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50/75 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Immutable Audit Trail &amp; Lifecycle History (Doc 04 §6.3)</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {events.length} event{events.length === 1 ? '' : 's'} logged
            </span>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No transition events recorded yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
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
                    {evt.notes && <div className="text-slate-600 text-xs pl-0.5">{evt.notes}</div>}
                  </div>
                  <div className="text-left sm:text-right text-slate-400 shrink-0">
                    <div className="font-medium text-slate-700 flex items-center sm:justify-end gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                      <span>{evt.actor_name || 'Staff / Admin'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      <DateDisplay date={evt.created_at} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
