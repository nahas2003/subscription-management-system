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
        'rounded-[7.5px] border border-[#efe9e0] bg-white p-5 shadow-ambrook-card transition-all duration-200',
        onClick && 'cursor-pointer hover:border-[#e8b672] hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b] font-sans">
            {title}
          </span>
          <div className="font-display text-3xl sm:text-4xl font-bold text-[#211b15] mt-0.5 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3.75px] bg-[#fcfaf1] text-[#211b15] border border-[#efe9e0]">
            {renderIcon()}
          </div>
        )}
      </div>

      {(subtitle || trend || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-[#50463c] pt-2.5 border-t border-[#efe9e0] font-sans">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  'rounded-[3.75px] px-1.5 py-0.5 text-xs font-semibold',
                  trend.isPositive
                    ? 'bg-[#eef5ee] text-[#434f40] border border-[#c5d8c4]'
                    : 'bg-[#fcedeb] text-[#b83a2b] border border-[#e8b0a9]'
                )}
              >
                {trend.value}
              </span>
              {trend.label && <span className="text-[#96897b]">{trend.label}</span>}
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
