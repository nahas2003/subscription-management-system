'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, User, LogOut, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearSessionUser } from '@/lib/auth';

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

  const handleLogout = () => {
    clearSessionUser();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
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
        {/* Quick Role Switcher for Evaluation */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs bg-[#fcfaf1] border border-[#efe9e0] rounded-[3.75px] p-1">
          <span className="text-[#96897b] pl-1.5 text-[11px] font-bold flex items-center gap-1">
            <ArrowLeftRight className="h-3 w-3" />
            Switch View:
          </span>
          <Link
            href="/admin/dashboard"
            className={cn(
              'px-2 py-0.5 rounded-[3.75px] text-[11px] font-bold transition-colors',
              user.role === 'admin'
                ? 'bg-[#252a23] text-white shadow-xs'
                : 'text-[#50463c] hover:text-[#211b15]'
            )}
          >
            Admin
          </Link>
          <Link
            href="/staff/dashboard"
            className={cn(
              'px-2 py-0.5 rounded-[3.75px] text-[11px] font-bold transition-colors',
              user.role === 'staff'
                ? 'bg-[#e8b672] text-[#211b15] shadow-xs'
                : 'text-[#50463c] hover:text-[#211b15]'
            )}
          >
            Staff
          </Link>
          <Link
            href="/portal"
            className={cn(
              'px-2 py-0.5 rounded-[3.75px] text-[11px] font-bold transition-colors',
              user.role === 'customer'
                ? 'bg-[#7a9779] text-white shadow-xs'
                : 'text-[#50463c] hover:text-[#211b15]'
            )}
          >
            Customer
          </Link>
        </div>

        {/* Role badge */}
        <span
          className={cn(
            'inline-flex items-center rounded-[3.75px] border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',
            roleBadgeStyles[user.role]
          )}
        >
          {user.role}
        </span>

        {/* User profile info */}
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
        <button
          onClick={handleLogout}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[3.75px] text-[#50463c] hover:bg-[#fcedeb] hover:text-[#b83a2b] transition-colors ml-1"
          title="Log out from session"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
