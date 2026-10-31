import React from 'react';
import { cn } from '@/lib/utils';

export interface MoneyDisplayProps {
  amount: number | string | null | undefined;
  currency?: string;
  className?: string;
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  useDisplayFont?: boolean;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  currency = '₹',
  className,
  showSign = false,
  size = 'md',
  useDisplayFont = false,
}) => {
  const numericVal = typeof amount === 'number' ? amount : parseFloat(String(amount || 0));
  const isValid = !isNaN(numericVal);
  const safeVal = isValid ? numericVal : 0;

  const formattedNumber = Math.abs(safeVal).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isNegative = safeVal < 0;
  const sign = isNegative ? '-' : showSign && safeVal > 0 ? '+' : '';

  const sizes = {
    sm: 'text-xs font-medium font-sans',
    md: 'text-sm font-semibold font-sans',
    lg: 'text-base font-bold font-sans',
    xl: 'text-3xl font-display font-bold tracking-tight',
  };

  return (
    <span
      className={cn(
        'inline-flex items-baseline tabular-nums text-[#211b15]',
        sizes[size],
        useDisplayFont && 'font-display',
        isNegative && 'text-[#b83a2b]',
        className
      )}
    >
      <span className="mr-0.5 select-none font-sans font-medium">{currency}</span>
      <span>
        {sign}
        {formattedNumber}
      </span>
    </span>
  );
};
