import React from 'react';
import { InvoiceStatus } from '@/types/finance';

interface StatusBadgeProps {
  status: InvoiceStatus;
  isOverdue?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isOverdue = false,
  className = '',
}) => {
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = 'Draft';

  switch (status) {
    case 'draft':
      badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
      label = 'Draft';
      break;
    case 'confirmed':
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      label = 'Confirmed';
      break;
    case 'paid':
      badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      label = 'Paid';
      break;
    case 'cancelled':
      badgeClasses = 'bg-zinc-100 text-zinc-500 border-zinc-200';
      label = 'Cancelled';
      break;
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses} ${className}`}
      >
        {label}
      </span>
      {isOverdue && status !== 'paid' && status !== 'cancelled' && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
          Overdue
        </span>
      )}
    </div>
  );
};
