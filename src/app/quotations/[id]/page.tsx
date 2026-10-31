'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  User,
  Calendar,
  Repeat,
  AlertCircle,
  Send,
  CheckCircle2,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';

export default function QuotationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quotationId = params.id as string;

  const [quotation, setQuotation] = useState(store.getQuotationById(quotationId));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  if (!quotation) {
    return (
      <AppShell
        role="admin"
        currentPath="/quotations"
        user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
        title="Quotation Not Found"
      >
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Quotation Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            The quotation reference <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-rose-600">{quotationId}</code> was not found.
          </p>
          <div className="mt-6">
            <Link href="/quotations">
              <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Return to Quotations List
              </Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleMarkSent = () => {
    store.updateQuotationStatus(quotation.id, 'sent');
    setQuotation(store.getQuotationById(quotation.id));
    setSuccess('Quotation status marked as "Sent" to customer.');
  };

  const handleMarkAccepted = () => {
    store.updateQuotationStatus(quotation.id, 'accepted');
    setQuotation(store.getQuotationById(quotation.id));
    setSuccess('Quotation marked as "Accepted". Ready for 1-click subscription conversion!');
  };

  const handleConvertToSubscription = () => {
    setError(null);
    setSuccess(null);

    try {
      const newSub = store.convertQuotationToSubscription(quotation.id, paymentTerms);
      setSuccess(`Quotation converted successfully into Subscription ${newSub.subscription_number}! Redirecting to lifecycle manager...`);
      setTimeout(() => {
        router.push(`/subscriptions/${newSub.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to convert quotation');
    }
  };

  return (
    <AppShell
      role="admin"
      currentPath="/quotations"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title={`Quotation ${quotation.quotation_number}`}
    >
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/quotations"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Quotations
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs font-bold text-slate-800">{quotation.quotation_number}</span>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={quotation.status} size="md" />

            {quotation.status === 'draft' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSent}
                leftIcon={<Send className="h-3.5 w-3.5" />}
              >
                Mark as Sent
              </Button>
            )}

            {quotation.status === 'sent' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAccepted}
                leftIcon={<CheckCircle className="h-3.5 w-3.5 text-emerald-600" />}
              >
                Mark as Accepted
              </Button>
            )}

            {(quotation.status === 'accepted' || quotation.status === 'sent' || quotation.status === 'draft') && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleConvertToSubscription}
                leftIcon={<Repeat className="h-4 w-4" />}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                Convert to Subscription
              </Button>
            )}
          </div>
        </div>

        {/* Page Title & Status */}
        <PageHeader
          title={`Commercial Proposal: ${quotation.quotation_number}`}
          description={`Commercial pricing and contract terms for ${quotation.customer?.name || 'Customer'}`}
        />

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-xs">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center gap-2 shadow-xs">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Status Callout if Converted */}
        {quotation.status === 'converted' && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Quotation Converted into Active Contract</h4>
                <p className="text-xs text-indigo-700 mt-0.5">
                  Line items and pricing snapshots have been cloned into an active recurring subscription.
                </p>
              </div>
            </div>
            <Link href="/subscriptions">
              <Button variant="primary" size="sm">
                View Subscriptions
              </Button>
            </Link>
          </div>
        )}

        {/* Metadata Parameters Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span>Customer Details</span>
            </div>
            <div className="font-bold text-slate-900 text-base">{quotation.customer?.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{quotation.customer?.email}</div>
            <div className="mt-2 font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded inline-block">
              Code: {quotation.customer?.customer_code}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Quotation Date
            </div>
            <div className="font-bold text-slate-900 text-base">
              <DateDisplay date={quotation.quotation_date} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Date quotation generated</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Valid Until
            </div>
            <div className="font-bold text-slate-900 text-base">
              <DateDisplay date={quotation.valid_until} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Standard 30-day validity</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Contract Terms
            </div>
            <select
              disabled={quotation.status === 'converted'}
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="mt-1 w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 30">Net 30 Days (Standard)</option>
              <option value="Due on Receipt">Due on Receipt</option>
            </select>
          </div>
        </div>

        {/* Line Items Table Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50/75 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-indigo-600" />
              <span>Quotation Line Items &amp; Variant Adjustments</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">All figures in INR (₹) with 18% GST</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Description &amp; Variant</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Unit Price (₹)</th>
                  <th className="px-6 py-3 text-right">Tax Rate</th>
                  <th className="px-6 py-3 text-right">Subtotal (₹)</th>
                  <th className="px-6 py-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotation.lines.map((line) => (
                  <tr key={line.id} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {line.description_snapshot}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-800">{line.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <MoneyDisplay amount={line.unit_price} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right">{(line.tax_rate_snapshot * 100).toFixed(0)}%</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      <MoneyDisplay amount={line.line_subtotal} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      <MoneyDisplay amount={line.line_total} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-200 flex justify-end">
            <div className="w-80 space-y-2 text-right">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal (Net Amount):</span>
                <MoneyDisplay amount={quotation.subtotal} size="sm" className="font-semibold" />
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>GST Tax (18%):</span>
                <MoneyDisplay amount={quotation.tax_total} size="sm" className="font-semibold" />
              </div>
              {quotation.discount_total > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-medium">
                  <span>Special Discount:</span>
                  <span>-₹{quotation.discount_total.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Proposal Value:</span>
                <MoneyDisplay amount={quotation.total} size="lg" className="font-bold text-indigo-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
