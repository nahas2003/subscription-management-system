'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, User, LogOut, ArrowLeftRight } from 'lucide-react';
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
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    staff: 'bg-blue-100 text-blue-700 border-blue-200',
    customer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-slate-800 hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for Hackathon Demonstrations */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg p-1">
          <span className="text-slate-400 pl-1.5 text-[11px] font-medium flex items-center gap-1">
            <ArrowLeftRight className="h-3 w-3" />
            Switch:
          </span>
          <Link
            href="/admin/dashboard"
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
              user.role === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-600'
            )}
          >
            Admin
          </Link>
          <Link
            href="/staff/dashboard"
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
              user.role === 'staff'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-600'
            )}
          >
            Staff
          </Link>
          <Link
            href="/portal"
            className={cn(
              'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
              user.role === 'customer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-600'
            )}
          >
            Customer
          </Link>
        </div>

        {/* Role badge */}
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider',
            roleBadgeStyles[user.role]
          )}
        >
          {user.role}
        </span>

        {/* User profile dropdown info */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-[#4F46E5]">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex md:flex-col text-left">
            <span className="text-xs font-medium text-slate-800 leading-none">
              {user.name}
            </span>
            <span className="text-[11px] text-slate-400 leading-none mt-1">
              {user.email}
            </span>
          </div>
        </div>

        {/* Logout action */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors ml-1"
            title="Log out from session"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
};
