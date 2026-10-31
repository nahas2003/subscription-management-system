'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  FileText,
  Repeat,
  Receipt,
  Tag,
  CreditCard,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', icon: Users, badge: 'Member 3' },
  { label: 'Products', href: '/products', icon: Package, badge: 'Member 3' },
  { label: 'Plans', href: '/plans', icon: Layers, badge: 'Member 3' },
  { label: 'Quotations', href: '/quotations', icon: FileText, badge: 'Member 3' },
  { label: 'Subscriptions', href: '/subscriptions', icon: Repeat, badge: 'Member 3' },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Discounts', href: '/discounts', icon: Tag },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 min-h-screen">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-white font-bold text-lg flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-xs text-white">
              BL
            </span>
            BrightLoop
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Subscription Operations</p>
        </div>
      </div>

      <div className="px-3 py-2 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
        Operational Navigation
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-normal',
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Session: <strong>Staff / Ops</strong></span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          Branch: <code className="text-indigo-400">product-dev</code>
        </div>
      </div>
    </aside>
  );
}
