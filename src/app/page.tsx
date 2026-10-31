'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Package,
  Layers,
  FileText,
  Repeat,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { store } from '@/lib/store';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const [customers, setCustomers] = useState(store.getCustomers());
  const [products, setProducts] = useState(store.getProducts());
  const [plans, setPlans] = useState(store.getPlans());
  const [quotations, setQuotations] = useState(store.getQuotations());
  const [subscriptions, setSubscriptions] = useState(store.getSubscriptions());

  useEffect(() => {
    setCustomers(store.getCustomers());
    setProducts(store.getProducts());
    setPlans(store.getPlans());
    setQuotations(store.getQuotations());
    setSubscriptions(store.getSubscriptions());
  }, []);

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const confirmedSubscriptions = subscriptions.filter((s) => s.status === 'confirmed');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscription Operations Dashboard"
        description="Overview of customers, catalogue products, plans, quotations, and active subscriptions."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/quotations/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              New Quotation
            </Link>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Subscriptions
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {activeSubscriptions.length}
            </div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{subscriptions.length} total commitments</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
            <Repeat className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Customers
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{customers.length}</div>
            <div className="text-xs text-slate-500 mt-1">Single-Company Scope</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Quotations
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{quotations.length}</div>
            <div className="text-xs text-slate-500 mt-1">Ready for conversion</div>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Catalogue Items
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {products.length} Products / {plans.length} Plans
            </div>
            <div className="text-xs text-slate-500 mt-1">Active Catalogue</div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Subscriptions and Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Subscriptions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-indigo-600" />
              <span>Recent Subscriptions</span>
            </div>
            <Link
              href="/subscriptions"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {subscriptions.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">No subscriptions found.</div>
            ) : (
              subscriptions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-slate-900 flex items-center gap-2">
                      <Link href={`/subscriptions/${sub.id}`} className="hover:underline text-indigo-600">
                        {sub.subscription_number}
                      </Link>
                      <StatusBadge status={sub.status} />
                      {sub.is_paused && <StatusBadge status="paused" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Customer: <strong>{sub.customer?.name || 'Unknown'}</strong> &bull; Next Bill:{' '}
                      {formatDate(sub.next_billing_date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(sub.lines.reduce((sum, l) => sum + l.line_total, 0))}
                    </div>
                    <div className="text-xs text-slate-400">{sub.payment_terms}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quotations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Quotations Awaiting Action</span>
            </div>
            <Link
              href="/quotations"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {quotations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">No quotations found.</div>
            ) : (
              quotations.slice(0, 5).map((q) => (
                <div key={q.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-slate-900 flex items-center gap-2">
                      <Link href={`/quotations/${q.id}`} className="hover:underline text-indigo-600">
                        {q.quotation_number}
                      </Link>
                      <StatusBadge status={q.status} />
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Customer: <strong>{q.customer?.name || 'Unknown'}</strong> &bull; Valid Until:{' '}
                      {formatDate(q.valid_until)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatCurrency(q.total)}
                    </div>
                    <Link
                      href={`/quotations/${q.id}`}
                      className="text-xs text-indigo-600 hover:underline font-medium block mt-0.5"
                    >
                      Convert &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Member 3 Quick Operations Grid */}
      <div className="bg-slate-100 p-6 rounded-xl border border-slate-200">
        <div className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>Member 3 Operational Modules</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/customers"
            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
          >
            <Users className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-slate-900">Customer Directory</div>
            <div className="text-xs text-slate-500 mt-1">Manage accounts and contacts</div>
          </Link>

          <Link
            href="/products"
            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
          >
            <Package className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-slate-900">Products & Variants</div>
            <div className="text-xs text-slate-500 mt-1">Base prices and variant adjustments</div>
          </Link>

          <Link
            href="/plans"
            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
          >
            <Layers className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-slate-900">Subscription Plans</div>
            <div className="text-xs text-slate-500 mt-1">Frequency, min qty & pause rules</div>
          </Link>

          <Link
            href="/subscriptions"
            className="p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-400 hover:shadow-sm transition-all group"
          >
            <Repeat className="w-5 h-5 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <div className="font-semibold text-sm text-slate-900">Subscription Lifecycle</div>
            <div className="text-xs text-slate-500 mt-1">Draft &rarr; Confirmed &rarr; Active</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
