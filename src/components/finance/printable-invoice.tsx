import React from 'react';
import { Invoice, InvoiceLine } from '@/types/finance';
import { MoneyDisplay } from './money-display';

interface PrintableInvoiceProps {
  invoice: Invoice;
  lines: InvoiceLine[];
  customerName?: string;
  customerAddress?: string;
}

/**
 * Print-ready, high-resolution A4 tax invoice template for BrightLoop.
 * Automatically triggers browser print dialog when Print is clicked.
 */
export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  invoice,
  lines,
  customerName = 'Valued Customer',
  customerAddress = 'Bangalore / Kochi, India',
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border border-slate-200 rounded-xl shadow-lg print:border-none print:shadow-none print:p-0">
      {/* Print Action Bar (Hidden during actual printing) */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200 print:hidden">
        <span className="text-sm text-slate-500 font-medium">
          Tax Invoice Preview — Print or Save as PDF
        </span>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-2"
        >
          <span>🖨️ Print / Save as PDF</span>
        </button>
      </div>

      {/* Invoice Document Content */}
      <div className="space-y-6 text-slate-800">
        {/* Header: Company & Invoice Type */}
        <div className="flex justify-between items-start border-b border-slate-300 pb-6">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 tracking-tight">BRIGHTLOOP</h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
              AI-Native Software Studio
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Brightloop Software Private Limited<br />
              Kochi Infopark, Kerala, India<br />
              GSTIN: 32AABCB1234F1Z9<br />
              Email: billing@brightloop.in | Web: brightloop.in
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-900">
              TAX INVOICE
            </h2>
            <p className="text-sm font-mono font-bold text-slate-800 mt-1">
              #{invoice.invoice_number}
            </p>
            <div className="mt-2 text-xs space-y-1 text-slate-600">
              <p>Invoice Date: <span className="font-semibold text-slate-900">{invoice.invoice_date}</span></p>
              <p>Due Date: <span className="font-semibold text-slate-900">{invoice.due_date}</span></p>
              {invoice.billing_period_start && invoice.billing_period_end && (
                <p>Period: <span className="font-semibold text-slate-900">{invoice.billing_period_start} to {invoice.billing_period_end}</span></p>
              )}
            </div>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-slate-500 uppercase tracking-wider mb-1">Billed To:</h3>
            <p className="font-bold text-sm text-slate-900">{customerName}</p>
            <p className="text-slate-600 mt-0.5">{customerAddress}</p>
            <p className="text-slate-500 mt-1 font-mono">Account ID: {invoice.customer_id}</p>
          </div>

          <div className="text-right">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Status:</h3>
            <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
              invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {invoice.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Itemized Lines Table */}
        <div className="mt-6 border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-800 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-right">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                <th className="py-2.5 px-3 text-right">GST Rate</th>
                <th className="py-2.5 px-3 text-right">GST Amount (₹)</th>
                <th className="py-2.5 px-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lines.map((l) => (
                <tr key={l.id}>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{l.description_snapshot}</td>
                  <td className="py-2.5 px-3 text-right">{l.quantity}</td>
                  <td className="py-2.5 px-3 text-right font-mono"><MoneyDisplay amount={l.unit_price} /></td>
                  <td className="py-2.5 px-3 text-right">{(((l.tax_rate_snapshot ?? (l as any).tax_rate ?? 0) * 100).toFixed(0))}%</td>
                  <td className="py-2.5 px-3 text-right font-mono"><MoneyDisplay amount={l.tax_amount} /></td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900"><MoneyDisplay amount={l.line_total} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex justify-end pt-2">
          <div className="w-full max-w-xs space-y-1.5 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <MoneyDisplay amount={invoice.subtotal} />
            </div>
            {invoice.discount_total > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount Applied:</span>
                <span>-<MoneyDisplay amount={invoice.discount_total} /></span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>GST (18%):</span>
              <MoneyDisplay amount={invoice.tax_total} />
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
              <span>Total Amount:</span>
              <MoneyDisplay amount={invoice.total} />
            </div>
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Amount Settled:</span>
              <span className="text-emerald-700 font-bold"><MoneyDisplay amount={invoice.amount_paid} /></span>
            </div>
            <div className="border-t border-dashed border-slate-300 pt-1.5 flex justify-between font-extrabold text-sm">
              <span className="text-slate-800">Balance Due:</span>
              <span className={invoice.balance_due > 0 ? 'text-amber-700' : 'text-slate-500'}>
                <MoneyDisplay amount={invoice.balance_due} />
              </span>
            </div>
          </div>
        </div>

        {/* Bank & Payment Instructions */}
        <div className="border-t border-slate-200 pt-6 text-xs text-slate-600 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-slate-800 uppercase mb-1">Bank Transfer & UPI Details:</h4>
            <p>Bank: HDFC Bank Limited</p>
            <p>Account Name: Brightloop Software Private Limited</p>
            <p>Account Number: 50200012345678</p>
            <p>IFSC Code: HDFC0001234</p>
            <p className="font-semibold text-slate-800 mt-1">UPI ID: brightloop@hdfcbank</p>
          </div>

          <div className="text-right flex flex-col justify-end">
            <p className="text-slate-400 italic">This is a computer-generated tax invoice.</p>
            <p className="font-bold text-slate-800 mt-1">For Brightloop Software Private Limited</p>
            <p className="text-xs text-slate-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};
