'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Search, Building2, Mail, Phone, Eye } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstin: string;
  activeSubscriptionsCount: number;
  status: 'Active' | 'Draft';
  createdAt: string;
}

const mockCustomers: CustomerRecord[] = [
  {
    id: 'cust-01',
    name: 'Siddharth Menon',
    email: 'billing@apextech.in',
    phone: '+91 98470 12345',
    companyName: 'Apex Technologies Pvt Ltd',
    gstin: '32AAAAA0000A1Z5',
    activeSubscriptionsCount: 2,
    status: 'Active',
    createdAt: '2026-01-10',
  },
  {
    id: 'cust-02',
    name: 'Fathima Raheem',
    email: 'ops@kochi-logistics.com',
    phone: '+91 94471 98765',
    companyName: 'Kochi Logistics Hub',
    gstin: '32BBBBB1111B2Z6',
    activeSubscriptionsCount: 1,
    status: 'Active',
    createdAt: '2026-02-14',
  },
];

export default function StaffCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Business Name',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.companyName}</div>
          <div className="text-xs text-slate-500">Contact: {item.name}</div>
        </div>
      ),
    },
    {
      header: 'Email & Phone',
      cell: (item) => (
        <div className="text-xs text-slate-600">
          <div>{item.email}</div>
          <div className="text-slate-400">{item.phone}</div>
        </div>
      ),
    },
    {
      header: 'Active Subs',
      align: 'center',
      cell: (item) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
          {item.activeSubscriptionsCount}
        </span>
      ),
    },
    {
      header: 'GSTIN',
      accessorKey: 'gstin',
      className: 'font-mono text-xs text-slate-600',
    },
    {
      header: 'Created On',
      cell: (item) => <DateDisplay date={item.createdAt} />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="staff"
      currentPath="/staff/customers"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'staff' }}
      title="Customers"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Directory"
          description="Operational customer registry. Create new customer accounts and view contact details."
        />

        <div className="max-w-md w-full">
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
