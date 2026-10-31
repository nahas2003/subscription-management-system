'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';
import { SubscriptionWithDetails } from '@/types/domain';
import {
  Repeat,
  Search,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function SubscriptionsPage() {
  const [subscriptions] = useState<SubscriptionWithDetails[]>(store.getSubscriptions());
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = subscriptions.filter((s) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paused' ? s.is_paused : s.status === statusFilter);
    const matchesSearch =
      s.subscription_number.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.plan?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate high-level metrics
  const totalCount = subscriptions.length;
  const activeCount = subscriptions.filter((s) => s.status === 'active' && !s.is_paused).length;
  const pausedCount = subscriptions.filter((s) => s.is_paused || s.status === 'paused').length;
  const totalMonthlyRunRate = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      const lineSum = s.lines.reduce((lSum, l) => lSum + l.line_total, 0);
      return sum + lineSum;
    }, 0);

  const filterTabs = [
    { id: 'all', label: 'All Subscriptions', count: totalCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'confirmed', label: 'Confirmed', count: subscriptions.filter((s) => s.status === 'confirmed').length },
    { id: 'paused', label: 'Paused', count: pausedCount },
    { id: 'closed', label: 'Closed', count: subscriptions.filter((s) => s.status === 'closed').length },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/subscriptions"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title="Subscriptions"
    >
      <div className="space-y-6">
        <PageHeader
          title="Subscriptions & Lifecycle Management"
          description="Track recurring customer commitments, manage lifecycle transitions, and view audit trails (Task M3-05)."
          action={
            <Link href="/quotations/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                New via Quotation
              </Button>
            </Link>
          }
        />

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Contracts"
            value={totalCount}
            subtitle="Across all customer tiers"
            icon={<Repeat className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Active & Generating"
            value={activeCount}
            subtitle="Recurring billing enabled"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Active Monthly Commitment"
            value={<MoneyDisplay amount={totalMonthlyRunRate} size="lg" className="font-bold text-slate-900" />}
            subtitle="Current MRR equivalent in INR"
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Paused / Pending"
            value={pausedCount}
            subtitle="Service temporarily suspended"
            icon={<Clock className="h-5 w-5 text-amber-500" />}
          />
        </div>

        {/* Search and Filter Tabs */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === tab.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      statusFilter === tab.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sub #, customer, plan..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Subscriptions Table Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Subscription #</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Plan / Product</th>
                  <th className="px-5 py-3.5">Start Date</th>
                  <th className="px-5 py-3.5">Next Billing</th>
                  <th className="px-5 py-3.5">Lifecycle Status</th>
                  <th className="px-5 py-3.5">Recurring Total (₹)</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No subscriptions match your query</p>
                      <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((sub) => {
                    const total = sub.lines.reduce((sum, l) => sum + l.line_total, 0);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-4 font-mono font-semibold text-indigo-600">
                          <Link href={`/subscriptions/${sub.id}`} className="hover:underline">
                            {sub.subscription_number}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900">{sub.customer?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-400">{sub.customer?.email}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-slate-800 text-xs">
                            {sub.plan ? sub.plan.name : `${sub.lines.length} Line Item(s)`}
                          </div>
                          {sub.plan && (
                            <span className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 uppercase tracking-wider">
                              {sub.plan.frequency}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <DateDisplay date={sub.start_date} />
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-indigo-700">
                          <DateDisplay date={sub.next_billing_date} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <StatusBadge status={sub.status} size="sm" />
                            {sub.is_paused && (
                              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                                Paused
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <MoneyDisplay amount={total} size="sm" className="font-bold text-slate-900" />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/subscriptions/${sub.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                          >
                            Manage <ArrowRight className="h-3 w-3" />
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
    </AppShell>
  );
}
