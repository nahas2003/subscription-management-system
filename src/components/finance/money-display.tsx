import React from 'react';
import { formatINR } from '@/lib/calculations/finance';

interface MoneyDisplayProps {
  amount: number;
  className?: string;
  isPositiveGood?: boolean;
  size?: string;
}

/**
 * Reusable component for displaying currency in INR (₹)
 * Example: ₹15,400.50
 */
export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  className = '',
  isPositiveGood = true,
}) => {
  const formatted = formatINR(amount);

  return (
    <span className={`font-medium tracking-tight ${className}`}>
      {formatted}
    </span>
  );
};
