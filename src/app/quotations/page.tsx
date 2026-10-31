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
import { QuotationWithLines } from '@/types/domain';
import {
  FileText,
  Plus,
  Search,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function QuotationsPage() {
  const [quotations] = useState<QuotationWithLines[]>(store.getQuotations());
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      q.quotation_number.toLowerCase().includes(search.toLowerCase()) ||
      (q.customer?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.customer?.customer_code || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalQuotes = quotations.length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'accepted').length;
  const convertedQuotes = quotations.filter((q) => q.status === 'converted').length;
  const pipelineValue = quotations
    .filter((q) => q.status === 'sent' || q.status === 'accepted')
    .reduce((sum, q) => sum + q.total, 0);

  const filterTabs = [
    { id: 'all', label: 'All Quotations', count: totalQuotes },
    { id: 'draft', label: 'Draft', count: quotations.filter((q) => q.status === 'draft').length },
    { id: 'sent', label: 'Sent', count: quotations.filter((q) => q.status === 'sent').length },
    { id: 'accepted', label: 'Accepted', count: acceptedQuotes },
    { id: 'converted', label: 'Converted', count: convertedQuotes },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/quotations"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title="Quotations"
    >
      <div className="space-y-6">
        <PageHeader
          title="Quotations & Proposal Pipeline"
          description="Prepare commercial pricing proposals, apply product variant pricing, and convert accepted quotes to active subscriptions (Task M3-04)."
          action={
            <Link href="/quotations/new">
              <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />}>
                Create Quotation
              </Button>
            </Link>
          }
        />

        {/* Top KPI StatCards Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Proposals"
            value={totalQuotes}
            subtitle="Generated in the system"
            icon={<FileText className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Accepted &amp; Ready"
            value={acceptedQuotes}
            subtitle="Ready for 1-click conversion"
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          />
          <StatCard
            title="Open Pipeline Value"
            value={<MoneyDisplay amount={pipelineValue} size="lg" className="font-bold text-slate-900" />}
            subtitle="Active proposals awaiting conversion"
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Converted Subscriptions"
            value={convertedQuotes}
            subtitle="Active recurring revenue"
            icon={<Layers className="h-5 w-5 text-purple-600" />}
          />
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search quote # or customer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/75 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Quotation #</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Line Items</th>
                  <th className="px-5 py-3.5">Created Date</th>
                  <th className="px-5 py-3.5">Valid Until</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Total Amount (₹)</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No quotations match your criteria</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting filters or creating a new proposal</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono font-semibold text-indigo-600">
                        <Link href={`/quotations/${quote.id}`} className="hover:underline">
                          {quote.quotation_number}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">{quote.customer?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-400">{quote.customer?.email}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        <span className="font-medium text-slate-800">{quote.lines.length} Line Item{quote.lines.length === 1 ? '' : 's'}</span>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <DateDisplay date={quote.quotation_date} />
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <DateDisplay date={quote.valid_until} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={quote.status} size="sm" />
                      </td>
                      <td className="px-5 py-4">
                        <MoneyDisplay amount={quote.total} size="sm" className="font-bold text-slate-900" />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/quotations/${quote.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors"
                        >
                          View / Convert <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
