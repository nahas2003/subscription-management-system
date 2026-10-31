import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UserRole = 'admin' | 'staff' | 'customer';

export interface AppHeaderProps {
  user?: {
    name: string;
    email: string;
    role: UserRole;
  };
  onMenuToggle?: () => void;
  onLogout?: () => void;
  title?: string;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  user = { name: 'Demo User', email: 'demo@brightloop.in', role: 'admin' },
  onMenuToggle,
  onLogout,
  title,
  className,
}) => {
  const roleBadgeStyles: Record<UserRole, string> = {
    admin: 'bg-[#252a23] text-[#efe9e0] border-[#434f40]',
    staff: 'bg-[#fdf6ed] text-[#7d4e13] border-[#e8b672]/60',
    customer: 'bg-[#eef5ee] text-[#2b4c2b] border-[#c5d8c4]',
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#efe9e0] bg-white/95 px-4 backdrop-blur-md sm:px-6 font-sans',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[3.75px] border border-[#c7bcaf] text-[#211b15] hover:bg-[#efe9e0] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-sm font-bold uppercase tracking-wider text-[#50463c] hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span
          className={cn(
            'inline-flex items-center rounded-[3.75px] border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
            roleBadgeStyles[user.role]
          )}
        >
          {user.role}
        </span>

        {/* User profile dropdown info */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#efe9e0]">
          <div className="flex h-8 w-8 items-center justify-center rounded-[3.75px] bg-[#efe9e0] text-[#211b15] font-bold text-xs border border-[#c7bcaf]/40">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex md:flex-col text-left">
            <span className="text-xs font-bold text-[#211b15] leading-none">
              {user.name}
            </span>
            <span className="text-[11px] text-[#96897b] leading-none mt-1">
              {user.email}
            </span>
          </div>
        </div>

        {/* Logout action */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[3.75px] text-[#50463c] hover:bg-[#fdf6ed] hover:text-[#8c591b] transition-colors ml-1"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
