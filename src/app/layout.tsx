import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrightLoop | Subscription Management System',
  description: 'Enterprise Subscription-to-Cash Automation Platform | Odoo x Make-A-Ton 9.0',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
