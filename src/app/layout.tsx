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
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
