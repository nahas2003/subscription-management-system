import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus } from '@/types/finance';
import { MoneyDisplay } from './money-display';
import { StatusBadge } from './status-badge';
import { isInvoiceOverdue } from '@/lib/calculations/finance';

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoice?: (invoice: Invoice) => void;
  onConfirmInvoice?: (invoiceId: string) => void;
  onOpenPaymentModal?: (invoice: Invoice) => void;
  isLoading?: boolean;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onSelectInvoice,
  onConfirmInvoice,
  onOpenPaymentModal,
  isLoading = false,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (overdueOnly && !isInvoiceOverdue(inv)) return false;

      if (search) {
        const q = search.toLowerCase();
        const matchesNumber = inv.invoice_number.toLowerCase().includes(q);
        const matchesCust = inv.customer_id.toLowerCase().includes(q);
        if (!matchesNumber && !matchesCust) return false;
      }

      return true;
    });
  }, [invoices, statusFilter, overdueOnly, search]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Filter Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={overdueOnly}
              onChange={(e) => setOverdueOnly(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
            />
            <span>Overdue Only</span>
          </label>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{filteredInvoices.length}</span> of {invoices.length} invoices
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Total (₹)</th>
              <th className="py-3 px-4 text-right">Paid (₹)</th>
              <th className="py-3 px-4 text-right">Balance (₹)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Loading invoices...
                </td>
              </tr>
            ) : filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No invoices found matching the current filters.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const isOverdue = isInvoiceOverdue(inv);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 font-mono">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      {inv.customer_id.slice(0, 12)}...
                    </td>
                    <td className="py-3 px-4 text-slate-700">{inv.invoice_date}</td>
                    <td className={`py-3 px-4 ${isOverdue ? 'font-semibold text-rose-600' : 'text-slate-700'}`}>
                      {inv.due_date}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900 font-mono">
                      <MoneyDisplay amount={inv.total} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700">
                      <MoneyDisplay amount={inv.amount_paid} />
                    </td>
                    <td className={`py-3 px-4 text-right font-mono font-semibold ${inv.balance_due > 0 ? (isOverdue ? 'text-rose-600' : 'text-amber-700') : 'text-slate-400'}`}>
                      <MoneyDisplay amount={inv.balance_due} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={inv.status} isOverdue={isOverdue} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      {onSelectInvoice && (
                        <button
                          onClick={() => onSelectInvoice(inv)}
                          className="px-2.5 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 text-slate-700 transition"
                        >
                          View
                        </button>
                      )}

                      {inv.status === 'draft' && onConfirmInvoice && (
                        <button
                          onClick={() => onConfirmInvoice(inv.id)}
                          className="px-2.5 py-1 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded hover:bg-indigo-100 transition font-medium"
                        >
                          Confirm
                        </button>
                      )}

                      {inv.status === 'confirmed' && inv.balance_due > 0 && onOpenPaymentModal && (
                        <button
                          onClick={() => onOpenPaymentModal(inv)}
                          className="px-2.5 py-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100 transition font-medium"
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
