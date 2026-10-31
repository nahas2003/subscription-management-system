'use client';

import React, { useState, useEffect } from 'react';
import { Payment } from '@/types/finance';
import { PaymentsTable } from '@/components/finance/payments-table';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/payments');
      const json = await res.json();
      if (json.success) {
        setPayments(json.data);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Ledger</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical record of all settled and allocated customer payments in INR (₹).
        </p>
      </div>

      <PaymentsTable payments={payments} isLoading={isLoading} />
    </div>
  );
}
