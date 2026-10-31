import React, { useState } from 'react';
import { Invoice, PaymentMethod } from '@/types/finance';
import { MoneyDisplay } from './money-display';

interface PaymentParams {
  invoiceId: string;
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  note?: string;
}

interface PaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (params: PaymentParams) => Promise<void>;
  onRecordPayment?: (params: PaymentParams) => Promise<void>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onSubmit,
  onRecordPayment,
}) => {
  const [amount, setAmount] = useState<number>(invoice.balance_due);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError('Payment amount must be greater than zero.');
      return;
    }
    if (amount > invoice.balance_due) {
      setError(`Payment cannot exceed outstanding balance of ₹${invoice.balance_due}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      const submitFn = onSubmit || onRecordPayment;
      if (submitFn) {
        await submitFn({
          invoiceId: invoice.id,
          customerId: invoice.customer_id,
          amount,
          paymentMethod,
          paymentDate,
          note: note.trim() || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to record payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'upi', label: 'UPI (Instant / Auto-allocated)' },
    { value: 'bank_transfer', label: 'Bank Transfer (NEFT / RTGS)' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Record Payment</h2>
            <p className="text-xs text-gray-500">
              Invoice #{invoice.invoice_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Invoice Total:</span>
              <MoneyDisplay amount={invoice.total} size="sm" />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Already Paid:</span>
              <MoneyDisplay amount={invoice.amount_paid} size="sm" />
            </div>
            <div className="mt-1 flex justify-between border-t border-gray-200 pt-1 text-sm font-semibold text-gray-900">
              <span>Outstanding Balance:</span>
              <MoneyDisplay
                amount={invoice.balance_due}
                size="sm"
                className="text-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Payment Amount (INR ₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={invoice.balance_due}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {paymentMethods.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Transaction Note / Reference ID
            </label>
            <input
              type="text"
              placeholder="e.g. UPI/2026/01928374 or Bank UTR number"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'Recording...' : 'Confirm & Allocate Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
