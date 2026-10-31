import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  icon?: LucideIcon | React.ComponentType<{ className?: string }> | React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  badge,
  className,
  onClick,
}) => {
  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    const Component = Icon as React.ComponentType<{ className?: string }>;
    return <Component className="h-5 w-5" />;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all',
        onClick && 'cursor-pointer hover:border-indigo-300 hover:shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
            {renderIcon()}
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-xs',
                  trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                )}
              >
                {trend.value}
              </span>
              {trend.label && <span className="text-slate-400">{trend.label}</span>}
            </div>
          ) : subtitle ? (
            <span>{subtitle}</span>
          ) : (
            <div />
          )}

          {badge && <div>{badge}</div>}
        </div>
      )}
    </div>
  );
};
