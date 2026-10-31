import React from 'react';
import { cn } from '@/lib/utils';

export interface MoneyDisplayProps {
  amount: number | string | null | undefined;
  currency?: string;
  className?: string;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  currency = '₹',
  className,
  showSign = false,
  size = 'md',
}) => {
  const numericVal = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  const isValid = !isNaN(numericVal);
  const safeVal = isValid ? numericVal : 0;

  // Format with thousands separator and strict 2 decimal places
  const formattedNumber = Math.abs(safeVal).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isNegative = safeVal < 0;
  const sign = isNegative ? '-' : showSign && safeVal > 0 ? '+' : '';

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-base font-semibold',
    xl: 'text-2xl font-bold tracking-tight',
  };

  return (
    <span
      className={cn(
        'inline-flex items-baseline tabular-nums text-slate-900',
        sizes[size],
        isNegative && 'text-red-600',
        className
      )}
    >
      <span className="mr-0.5 select-none">{currency}</span>
      <span>
        {sign}
        {formattedNumber}
      </span>
    </span>
  );
};
