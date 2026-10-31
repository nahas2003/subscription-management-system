import React from 'react';
import { Invoice, InvoiceLine, PaymentAllocation } from '@/types/finance';
import { MoneyDisplay } from './money-display';
import { StatusBadge } from './status-badge';
import { isInvoiceOverdue } from '@/lib/calculations/finance';

interface InvoiceDetailProps {
  invoice: Invoice;
  lines: InvoiceLine[];
  allocations?: PaymentAllocation[];
  onConfirm?: (invoiceId: string) => void;
  onCancel?: (invoiceId: string) => void;
  onOpenPaymentModal?: (invoice: Invoice) => void;
  onClose?: () => void;
}

export const InvoiceDetail: React.FC<InvoiceDetailProps> = ({
  invoice,
  lines,
  allocations = [],
  onConfirm,
  onCancel,
  onOpenPaymentModal,
  onClose,
}) => {
  const isOverdue = isInvoiceOverdue(invoice);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {invoice.invoice_number}
            </h2>
            <StatusBadge status={invoice.status} isOverdue={isOverdue} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Customer ID: <span className="font-mono text-slate-700">{invoice.customer_id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {invoice.status === 'draft' && onConfirm && (
            <button
              onClick={() => onConfirm(invoice.id)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
            >
              Confirm Invoice
            </button>
          )}

          {invoice.status === 'confirmed' && invoice.balance_due > 0 && onOpenPaymentModal && (
            <button
              onClick={() => onOpenPaymentModal(invoice)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
            >
              Record Payment
            </button>
          )}

          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && invoice.amount_paid === 0 && onCancel && (
            <button
              onClick={() => onCancel(invoice.id)}
              className="px-3 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-sm transition"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Meta Information Cards */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-100 text-sm">
        <div>
          <span className="text-slate-500 block">Invoice Date</span>
          <span className="font-semibold text-slate-800">{invoice.invoice_date}</span>
        </div>
        <div>
          <span className="text-slate-500 block">Due Date</span>
          <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
            {invoice.due_date} {isOverdue && '(Past Due)'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Billing Period</span>
          <span className="font-semibold text-slate-800">
            {invoice.billing_period_start && invoice.billing_period_end
              ? `${invoice.billing_period_start} to ${invoice.billing_period_end}`
              : 'N/A (One-off)'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Currency</span>
          <span className="font-semibold text-slate-800">{invoice.currency} (₹)</span>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="p-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Invoice Line Items
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Tax (18% GST)</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((line) => (
                <tr key={line.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {line.description_snapshot}
                  </td>
                  <td className="py-3 px-4 text-right">{line.quantity}</td>
                  <td className="py-3 px-4 text-right font-mono">
                    <MoneyDisplay amount={line.unit_price} />
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600">
                    <MoneyDisplay amount={line.tax_amount} />
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 font-mono">
                    <MoneyDisplay amount={line.line_total} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Totals Breakdown */}
        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <MoneyDisplay amount={invoice.subtotal} />
            </div>
            {invoice.discount_total > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount Applied:</span>
                <span>-<MoneyDisplay amount={invoice.discount_total} /></span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST (18%):</span>
              <MoneyDisplay amount={invoice.tax_total} />
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-base">
              <span>Total Amount:</span>
              <MoneyDisplay amount={invoice.total} />
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Amount Paid:</span>
              <span className="text-emerald-700 font-medium">
                <MoneyDisplay amount={invoice.amount_paid} />
              </span>
            </div>
            <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between font-bold text-base">
              <span className="text-slate-800">Balance Due:</span>
              <span className={invoice.balance_due > 0 ? (isOverdue ? 'text-rose-600' : 'text-amber-700') : 'text-slate-500'}>
                <MoneyDisplay amount={invoice.balance_due} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
