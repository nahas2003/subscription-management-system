import React from 'react';
import { cn } from '@/lib/utils';

export interface DateDisplayProps {
  date: string | Date | null | undefined;
  className?: string;
  format?: 'short' | 'medium' | 'long' | 'iso';
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  className,
  format = 'medium',
}) => {
  if (!date) {
    return <span className={cn('text-slate-400 italic text-sm', className)}>-</span>;
  }

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return <span className={cn('text-slate-400 italic text-sm', className)}>Invalid date</span>;
  }

  let formatted = '';
  if (format === 'iso') {
    formatted = d.toISOString().split('T')[0];
  } else if (format === 'short') {
    formatted = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } else if (format === 'long') {
    formatted = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } else {
    // medium default: '31 Oct 2026'
    formatted = d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <span className={cn('text-sm text-slate-700 whitespace-nowrap', className)}>
      {formatted}
    </span>
  );
};
