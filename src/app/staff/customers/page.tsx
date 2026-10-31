'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  gstin: string;
  status: 'Active' | 'Closed';
  createdAt: string;
  activeSubscriptionsCount: number;
}

const mockCustomers: CustomerRecord[] = [
  {
    id: 'cust-001',
    name: 'Sarah Mathew',
    companyName: 'Apex Technologies Pvt Ltd',
    email: 'billing@apextech.in',
    phone: '+91 98470 12345',
    gstin: '32AABCA1234A1Z5',
    status: 'Active',
    createdAt: '2025-06-15',
    activeSubscriptionsCount: 2,
  },
  {
    id: 'cust-002',
    name: 'Jamsheed V. P.',
    companyName: 'Kochi Logistics Hub',
    email: 'finance@kochilogistics.com',
    phone: '+91 94471 67890',
    gstin: '32BBCDE5678B2Z1',
    status: 'Active',
    createdAt: '2025-08-20',
    activeSubscriptionsCount: 1,
  },
  {
    id: 'cust-003',
    name: 'Anjali Menon',
    companyName: 'Kerala Ayurveda Solutions',
    email: 'accounts@keralaayur.org',
    phone: '+91 97450 99887',
    gstin: '32CCDEF9012C3Z8',
    status: 'Active',
    createdAt: '2026-01-10',
    activeSubscriptionsCount: 0,
  },
  {
    id: 'cust-004',
    name: 'Rohan Nambiar',
    companyName: 'Malabar Retailers Ltd',
    email: 'admin@malabarretail.com',
    phone: '+91 98950 33445',
    gstin: '32DDEFG3456D4Z4',
    status: 'Active',
    createdAt: '2025-11-05',
    activeSubscriptionsCount: 1,
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
          <div className="font-bold text-[#211b15]">{item.companyName}</div>
          <div className="text-xs text-[#96897b]">Contact: {item.name}</div>
        </div>
      ),
    },
    {
      header: 'Email & Phone',
      cell: (item) => (
        <div className="text-xs text-[#50463c]">
          <div>{item.email}</div>
          <div className="text-[#96897b]">{item.phone}</div>
        </div>
      ),
    },
    {
      header: 'Active Subs',
      align: 'center',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 text-xs font-bold text-[#8c591b]">
          {item.activeSubscriptionsCount}
        </span>
      ),
    },
    {
      header: 'GSTIN',
      accessorKey: 'gstin',
      className: 'font-mono text-xs text-[#50463c]',
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
          description="Operational directory for customer contact information and active subscriptions."
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
          emptyMessage="No customer records found."
        />
      </div>
    </AppShell>
  );
}
