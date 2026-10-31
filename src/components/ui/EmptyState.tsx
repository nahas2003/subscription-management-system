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
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center sm:p-12',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
        {renderIcon()}
      </div>

      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
