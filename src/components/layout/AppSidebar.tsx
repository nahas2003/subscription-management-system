import React from 'react';
import Link from 'next/link';
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
  const getNavSections = (): NavSection[] => {
    if (role === 'admin') {
      return [
        {
          items: [
            { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Catalogue & Pricing',
          items: [
            { label: 'Products', href: '/admin/products', icon: Package },
            { label: 'Subscription Plans', href: '/admin/plans', icon: Calendar },
            { label: 'Discounts & Rules', href: '/admin/discounts', icon: Percent },
          ],
        },
        {
          title: 'Sales & Operations',
          items: [
            { label: 'Customers', href: '/admin/customers', icon: Users },
            { label: 'Quotations', href: '/admin/quotations', icon: FileText },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat },
          ],
        },
        {
          title: 'Finance & Ledger',
          items: [
            { label: 'Invoices', href: '/admin/invoices', icon: Receipt },
            { label: 'Payments', href: '/admin/payments', icon: CreditCard },
            { label: 'Financial Reports', href: '/admin/reports', icon: BarChart3 },
          ],
        },
        {
          title: 'Administration',
          items: [
            { label: 'Staff & Team', href: '/admin/staff', icon: ShieldCheck },
          ],
        },
      ];
    }

    if (role === 'staff') {
      return [
        {
          items: [
            { label: 'Staff Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Operations Queue',
          items: [
            { label: 'Customers', href: '/staff/customers', icon: Users },
            { label: 'Quotations', href: '/staff/quotations', icon: FileText },
            { label: 'Subscriptions', href: '/staff/subscriptions', icon: Repeat },
          ],
        },
        {
          title: 'Billing & Collection',
          items: [
            { label: 'Invoices', href: '/staff/invoices', icon: Receipt },
            { label: 'Payments', href: '/staff/payments', icon: CreditCard },
          ],
        },
      ];
    }

    // Customer Portal
    return [
      {
        items: [
          { label: 'My Overview', href: '/portal', icon: LayoutDashboard },
        ],
      },
      {
        title: 'Billing & Account',
        items: [
          { label: 'My Subscriptions', href: '/portal/subscriptions', icon: Repeat },
          { label: 'My Invoices', href: '/portal/invoices', icon: Receipt },
          { label: 'Payment History', href: '/portal/payments', icon: CreditCard },
          { label: 'Company Profile', href: '/portal/profile', icon: User },
        ],
      },
    ];
  };

  const sections = getNavSections();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-[#211b15]/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#efe9e0] bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 font-sans',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between border-b border-[#efe9e0] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672] shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-[#211b15] leading-none">
                BRIGHT<span className="text-[#8c591b]">LOOP</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#96897b] leading-none mt-1">
                Subscription OS
              </span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-[3.75px] p-1 text-[#50463c] hover:bg-[#efe9e0] hover:text-[#211b15] lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (
                <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#96897b]">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  currentPath === item.href ||
                  (item.href !== '/portal' && item.href !== '/admin/dashboard' && item.href !== '/staff/dashboard' && currentPath.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center justify-between rounded-[3.75px] px-3 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-[#fbf2e3] text-[#211b15] font-bold border-l-2 border-[#e8b672] shadow-xs'
                        : 'text-[#50463c] hover:bg-[#efe9e0]/60 hover:text-[#211b15]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-[#8c591b]'
                            : 'text-[#96897b] group-hover:text-[#211b15]'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          'rounded-[3.75px] px-2 py-0.5 text-xs font-semibold',
                          isActive
                            ? 'bg-white text-[#211b15] border border-[#c7bcaf]/60'
                            : 'bg-[#efe9e0] text-[#50463c]'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info block */}
        <div className="border-t border-[#efe9e0] p-4 bg-[#fcfaf1]">
          <div className="rounded-[3.75px] bg-[#efe9e0]/70 p-3 text-xs text-[#50463c] border border-[#c7bcaf]/40">
            <div className="flex items-center justify-between font-bold text-[#211b15]">
              <span>Single Company</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#7a9779]" />
            </div>
            <p className="mt-1 text-[11px] text-[#96897b] leading-tight">
              BrightLoop Core v1.0 • Odoo Make-A-Ton
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
