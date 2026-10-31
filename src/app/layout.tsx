import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'BrightLoop Subscription Management',
  description: 'BrightLoop Subscription Operations Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex text-slate-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
