import React from 'react';
import { cn } from '@/lib/utils';
import { Inbox, LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  action,
  className,
}) => {
  const renderIcon = () => {
    if (!Icon) return <Inbox className="h-6 w-6" />;
    if (React.isValidElement(Icon)) return Icon;
    const Component = Icon as React.ComponentType<{ className?: string }>;
    return <Component className="h-6 w-6" />;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[7.5px] border border-dashed border-[#c7bcaf] bg-white p-8 text-center sm:p-12 font-sans',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[3.75px] bg-[#efe9e0] text-[#211b15] mb-4">
        {renderIcon()}
      </div>

      <h3 className="text-base font-bold text-[#211b15]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[#50463c] max-w-sm">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
