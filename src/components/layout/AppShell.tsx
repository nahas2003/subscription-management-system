'use client';

import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader, UserRole } from './AppHeader';
import { cn } from '@/lib/utils';

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

  return (
    <div className="flex min-h-screen bg-[#fcfaf1] text-[#211b15] font-sans">
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
          user={user || { name: 'Demo User', email: 'demo@brightloop.in', role }}
          title={title}
          onMenuToggle={() => setMobileMenuOpen(true)}
          onLogout={() => {
            console.log('Logout clicked');
          }}
        />

        <main className={cn('flex-1 p-4 sm:p-6 lg:p-8', className)}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
