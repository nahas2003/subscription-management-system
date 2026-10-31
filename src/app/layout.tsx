import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrightLoop Subscription Management',
  description: 'BrightLoop Subscription Management System | Odoo x Make-A-Ton 9.0',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8FAFC] antialiased">{children}</body>
    </html>
  );
}
