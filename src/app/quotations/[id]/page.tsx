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
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge } from '@/components/ui/status-badge';
import { store } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';

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
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold text-slate-900">Quotation Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The requested quotation does not exist.</p>
        <Link
          href="/quotations"
          className="mt-4 inline-block px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg"
        >
          Back to Quotations
        </Link>
      </div>
    );
  }

  const handleMarkSent = () => {
    store.updateQuotationStatus(quotation.id, 'sent');
    setQuotation(store.getQuotationById(quotation.id));
    setSuccess('Quotation status marked as "Sent".');
  };

  const handleMarkAccepted = () => {
    store.updateQuotationStatus(quotation.id, 'accepted');
    setQuotation(store.getQuotationById(quotation.id));
    setSuccess('Quotation status marked as "Accepted". Ready for subscription conversion!');
  };

  const handleConvertToSubscription = () => {
    setError(null);
    setSuccess(null);

    try {
      const newSub = store.convertQuotationToSubscription(quotation.id, paymentTerms);
      setSuccess(`Quotation converted successfully into Subscription ${newSub.subscription_number}!`);
      setTimeout(() => {
        router.push(`/subscriptions/${newSub.id}`);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to convert quotation');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link
          href="/quotations"
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations
        </Link>
      </div>

      <PageHeader
        title={`Quotation: ${quotation.quotation_number}`}
        description={`Issued for ${quotation.customer?.name || 'Customer'}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={quotation.status} />

            {quotation.status === 'draft' && (
              <button
                onClick={handleMarkSent}
                className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Mark as Sent
              </button>
            )}

            {quotation.status === 'sent' && (
              <button
                onClick={handleMarkAccepted}
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Mark as Accepted
              </button>
            )}

            {(quotation.status === 'accepted' || quotation.status === 'sent' || quotation.status === 'draft') && (
              <button
                onClick={handleConvertToSubscription}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Repeat className="w-4 h-4" /> Convert to Subscription
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

      {/* Quotation Metadata Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Customer</div>
          <div className="font-bold text-slate-900 mt-1">{quotation.customer?.name}</div>
          <div className="text-xs text-slate-500">{quotation.customer?.email}</div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">{quotation.customer?.customer_code}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Quotation Date</div>
          <div className="font-semibold text-slate-900 mt-1">{formatDate(quotation.quotation_date)}</div>
          <div className="text-xs text-slate-500">Issued Date</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Valid Until</div>
          <div className="font-semibold text-slate-900 mt-1">{formatDate(quotation.valid_until)}</div>
          <div className="text-xs text-slate-500">Expiry Window</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Payment Terms</div>
          <select
            disabled={quotation.status === 'converted'}
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="mt-1 px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
          >
            <option value="Net 15">Net 15 Days</option>
            <option value="Net 30">Net 30 Days</option>
            <option value="Due on Receipt">Due on Receipt</option>
          </select>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 font-semibold text-sm text-slate-900 bg-slate-50">
          Quotation Lines & Itemized Snapshot
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-center">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Tax Rate</th>
                <th className="px-6 py-3 text-right">Subtotal</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotation.lines.map((line) => (
                <tr key={line.id}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{line.description_snapshot}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-800">{line.quantity}</td>
                  <td className="px-6 py-4 text-right">{formatCurrency(line.unit_price)}</td>
                  <td className="px-6 py-4 text-right">{(line.tax_rate_snapshot * 100).toFixed(0)}%</td>
                  <td className="px-6 py-4 text-right font-medium">{formatCurrency(line.line_subtotal)}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatCurrency(line.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <div className="w-72 space-y-2 text-right">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(quotation.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Tax Total:</span>
              <span className="font-semibold">{formatCurrency(quotation.tax_total)}</span>
            </div>
            {quotation.discount_total > 0 && (
              <div className="flex justify-between text-xs text-emerald-600">
                <span>Discount Applied:</span>
                <span className="font-semibold">-{formatCurrency(quotation.discount_total)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="text-indigo-600">{formatCurrency(quotation.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
