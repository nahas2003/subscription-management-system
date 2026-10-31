import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeStatus =
  | 'draft'
  | 'quotation'
  | 'confirmed'
  | 'active'
  | 'closed'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted'
  | 'paid'
  | 'overdue'
  | 'paused';

interface StatusBadgeProps {
  status: BadgeStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (normalized === 'active' || normalized === 'paid' || normalized === 'accepted') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (normalized === 'confirmed' || normalized === 'converted' || normalized === 'sent') {
    style = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (normalized === 'draft' || normalized === 'quotation') {
    style = 'bg-slate-100 text-slate-700 border-slate-300';
  } else if (normalized === 'paused' || normalized === 'expired') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (normalized === 'closed' || normalized === 'rejected' || normalized === 'overdue') {
    style = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider',
        style,
        className
      )}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
