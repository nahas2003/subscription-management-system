import React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  FileText,
  Repeat,
  Receipt,
  Percent,
  CreditCard,
  BarChart3,
  ShieldCheck,
  User,
  X,
  Layers,
} from 'lucide-react';
import type { UserRole } from './AppHeader';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface AppSidebarProps {
  role: UserRole;
  currentPath?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  role,
  currentPath = '',
  isOpenMobile = false,
  onCloseMobile,
  className,
}) => {
  // Navigation sections based on role
  const getNavSections = (): NavSection[] => {
    if (role === 'admin') {
      return [
        {
          title: 'Core Operations',
          items: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { label: 'Customers', href: '/admin/customers', icon: Users },
            { label: 'Quotations', href: '/admin/quotations', icon: FileText },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat },
            { label: 'Invoices', href: '/admin/invoices', icon: Receipt },
            { label: 'Payments', href: '/admin/payments', icon: CreditCard },
          ],
        },
        {
          title: 'Catalogue & Pricing',
          items: [
            { label: 'Products', href: '/admin/products', icon: Package },
            { label: 'Plans', href: '/admin/plans', icon: Calendar },
            { label: 'Discounts', href: '/admin/discounts', icon: Percent },
          ],
        },
        {
          title: 'Management',
          items: [
            { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { label: 'Staff Management', href: '/admin/staff', icon: ShieldCheck },
          ],
        },
      ];
    }

    if (role === 'staff') {
      return [
        {
          title: 'Operations',
          items: [
            { label: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
            { label: 'Customers', href: '/staff/customers', icon: Users },
            { label: 'Quotations', href: '/staff/quotations', icon: FileText },
            { label: 'Subscriptions', href: '/staff/subscriptions', icon: Repeat },
            { label: 'Invoices', href: '/staff/invoices', icon: Receipt },
            { label: 'Payments', href: '/staff/payments', icon: CreditCard },
          ],
        },
      ];
    }

    // Customer Portal Navigation (Strictly isolated)
    return [
      {
        title: 'Customer Self-Service',
        items: [
          { label: 'Overview', href: '/portal', icon: LayoutDashboard },
          { label: 'My Subscriptions', href: '/portal/subscriptions', icon: Repeat },
          { label: 'My Invoices', href: '/portal/invoices', icon: Receipt },
          { label: 'My Payments', href: '/portal/payments', icon: CreditCard },
          { label: 'My Profile', href: '/portal/profile', icon: User },
        ],
      },
    ];
  };

  const sections = getNavSections();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Bright<span className="text-[#4F46E5]">Loop</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Subscription OS
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = currentPath === item.href || (item.href !== '/portal' && currentPath.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-[#4F46E5] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-[#4F46E5]'
                            : 'text-slate-400 group-hover:text-slate-600'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-semibold',
                          isActive
                            ? 'bg-indigo-200 text-[#4F46E5]'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* System & version footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-lg bg-slate-50 p-2.5 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">
              Odoo x Make-A-Ton 9.0
            </span>
            <span className="text-[10px] text-slate-400">
              Single-Company Architecture
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
