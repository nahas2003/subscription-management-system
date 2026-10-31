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

  let badgeStyle = 'bg-[#efe9e0] text-[#50463c] border-[#c7bcaf]';
  let dotStyle = 'bg-[#96897b]';

  if (normalized === 'active' || normalized === 'paid') {
    // Settled & Active: Sage green accent
    badgeStyle = 'bg-[#eef5ee] text-[#2b4c2b] border-[#c5d8c4]';
    dotStyle = 'bg-[#7a9779]';
  } else if (normalized === 'confirmed') {
    // Confirmed: Deep olive tone
    badgeStyle = 'bg-[#efe9e0] text-[#211b15] border-[#c7bcaf] font-semibold';
    dotStyle = 'bg-[#434f40]';
  } else if (normalized === 'overdue') {
    // Overdue: Terracotta rust
    badgeStyle = 'bg-[#fcedeb] text-[#8f2115] border-[#e8b0a9] font-bold';
    dotStyle = 'bg-[#b83a2b]';
  } else if (normalized === 'quotation' || normalized === 'pending') {
    // Pending / Quotation: Honey amber accent
    badgeStyle = 'bg-[#fdf6ed] text-[#7d4e13] border-[#e8b672]/60 font-semibold';
    dotStyle = 'bg-[#e8b672]';
  } else if (normalized === 'draft') {
    // Draft: Neutral bone surface
    badgeStyle = 'bg-[#efe9e0]/80 text-[#50463c] border-[#c7bcaf]';
    dotStyle = 'bg-[#96897b]';
  } else if (normalized === 'closed') {
    // Closed: Saddle / Bone
    badgeStyle = 'bg-[#efe9e0] text-[#50463c] border-[#c7bcaf]';
    dotStyle = 'bg-[#96897b]';
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-sans font-medium rounded-[3.75px] border tracking-wider uppercase select-none',
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
