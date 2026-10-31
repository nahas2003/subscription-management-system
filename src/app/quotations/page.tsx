'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, ArrowRight, Calendar, User } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { store } from '@/lib/store';
import { QuotationWithLines } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationWithLines[]>(store.getQuotations());
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      q.quotation_number.toLowerCase().includes(search.toLowerCase()) ||
      (q.customer?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Prepare commercial proposals, calculate pricing lines, and convert accepted quotes to subscriptions (Task M3-04)."
        actions={
          <Link
            href="/quotations/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Quotation
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
            placeholder="Search by quote # or customer..."
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
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="converted">Converted</option>
            <option value="expired">Expired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Quotation #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Quote Date</th>
                <th className="px-6 py-3.5">Valid Until</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No quotations found.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-indigo-600">
                      <Link href={`/quotations/${quote.id}`} className="hover:underline">
                        {quote.quotation_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{quote.customer?.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-400">{quote.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {formatDate(quote.quotation_date)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {formatDate(quote.valid_until)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(quote.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/quotations/${quote.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Details <ArrowRight className="w-3.5 h-3.5" />
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
  );
}
