import React from 'react';
import { cn } from '@/lib/utils';

export type SubscriptionStatus = 'Draft' | 'Quotation' | 'Confirmed' | 'Active' | 'Closed';
export type InvoiceStatus = 'Draft' | 'Confirmed' | 'Paid' | 'Overdue';
export type StatusType = SubscriptionStatus | InvoiceStatus | string;

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = 'md',
}) => {
  const normalized = (status || '').toLowerCase().trim();

  // Status mapping matching strict design tokens and lifecycle requirements
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotStyle = 'bg-slate-400';

  if (normalized === 'active' || normalized === 'paid' || normalized === 'confirmed') {
    // Semantic Success: #15803D
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotStyle = 'bg-emerald-600';
  } else if (normalized === 'overdue') {
    // Semantic Danger: #DC2626
    badgeStyle = 'bg-red-50 text-red-800 border-red-200 font-semibold';
    dotStyle = 'bg-red-600';
  } else if (normalized === 'quotation' || normalized === 'pending') {
    // Semantic Warning: #D97706
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    dotStyle = 'bg-amber-600';
  } else if (normalized === 'draft') {
    // Semantic Info: #0284C7
    badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200';
    dotStyle = 'bg-sky-600';
  } else if (normalized === 'closed') {
    badgeStyle = 'bg-slate-100 text-slate-600 border-slate-300';
    dotStyle = 'bg-slate-400';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border tracking-wide uppercase',
        badgeStyle,
        sizes[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotStyle)} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};
