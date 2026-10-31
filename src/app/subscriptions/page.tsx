'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Repeat, Search, ArrowRight, PauseCircle, Calendar, PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { store } from '@/lib/store';
import { SubscriptionWithDetails } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithDetails[]>(store.getSubscriptions());
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = subscriptions.filter((s) => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesSearch =
      s.subscription_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Monitor active subscription commitments, renewal schedules, and lifecycle status progression (Task M3-05)."
        actions={
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New via Quotation
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by sub # or customer..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-500 font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="quotation">Quotation</option>
            <option value="confirmed">Confirmed</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Subscription #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Plan / Lines</th>
                <th className="px-6 py-3.5">Start Date</th>
                <th className="px-6 py-3.5">Next Billing</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Recurring Amount</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const total = sub.lines.reduce((sum, l) => sum + l.line_total, 0);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-indigo-600">
                        <Link href={`/subscriptions/${sub.id}`} className="hover:underline">
                          {sub.subscription_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{sub.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-400">{sub.customer?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 text-xs">
                          {sub.plan ? sub.plan.name : `${sub.lines.length} Line Item(s)`}
                        </div>
                        {sub.plan && (
                          <div className="text-[11px] text-slate-400 uppercase tracking-wider">
                            Frequency: {sub.plan.frequency}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {formatDate(sub.start_date)}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-indigo-700">
                        {formatDate(sub.next_billing_date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={sub.status} />
                          {sub.is_paused && <StatusBadge status="paused" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {formatCurrency(total)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/subscriptions/${sub.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Lifecycle <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
