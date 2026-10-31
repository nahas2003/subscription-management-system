'use client';

import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader, UserRole } from './AppHeader';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions/auth';

export interface AppShellProps {
  role: UserRole;
  currentPath?: string;
  user?: {
    name: string;
    email: string;
    role: UserRole;
  };
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  role,
  currentPath = '',
  user,
  children,
  title,
  className,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar navigation */}
      <AppSidebar
        role={role}
        currentPath={currentPath}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content column */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader
          user={user || { name: `${role.toUpperCase()} User`, email: `${role}@brightloop.in`, role }}
          title={title}
          onMenuToggle={() => setMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        <main className={cn('flex-1 p-4 sm:p-6 lg:p-8', className)}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
