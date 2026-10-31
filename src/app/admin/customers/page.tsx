'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Plus, Search, Building2, Mail, Phone, Eye, X } from 'lucide-react';

interface CustomerRow {
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

const mockCustomers: CustomerRow[] = [
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

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCustomers = mockCustomers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term)
    );
  });

  const columns: Column<CustomerRow>[] = [
    {
      header: 'Customer / Business',
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
        <div className="text-xs text-[#50463c] space-y-0.5">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-[#50463c]" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-1 text-[#96897b]">
            <Phone className="h-3 w-3" />
            <span>{item.phone}</span>
          </div>
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
      cell: (item) => (
        <span className="font-mono text-xs text-[#50463c]">{item.gstin}</span>
      ),
    },
    {
      header: 'Created On',
      cell: (item) => <DateDisplay date={item.createdAt} />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Action',
      align: 'right',
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCustomer(item)}
          leftIcon={<Eye className="h-3.5 w-3.5" />}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/customers"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Customer Management"
    >
      <div className="space-y-6">
        <PageHeader
          title="Customer Directory"
          description="Manage BrightLoop business accounts, billing profiles, and contact details."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add New Customer
            </Button>
          }
        />

        {/* Filter bar */}
        <div className="flex items-center gap-3">
          <div className="max-w-md w-full">
            <Input
              placeholder="Search by company name, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          emptyMessage="No customers match your search criteria."
        />

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[3.75px] bg-[#fdf6ed] text-[#8c591b]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-[#211b15]">{selectedCustomer.companyName}</h3>
                    <span className="text-xs text-[#96897b]">ID: {selectedCustomer.id}</span>
                  </div>
                </div>
                <StatusBadge status={selectedCustomer.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Primary Contact</span>
                  <span className="font-semibold text-[#211b15]">{selectedCustomer.name}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Email Address</span>
                  <span className="font-semibold text-[#211b15]">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Phone</span>
                  <span className="font-semibold text-[#211b15]">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Tax / GSTIN</span>
                  <span className="font-mono text-xs font-bold text-[#8c591b]">{selectedCustomer.gstin}</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Active Subscriptions</span>
                  <span className="font-bold text-[#8c591b]">{selectedCustomer.activeSubscriptionsCount} Active</span>
                </div>
                <div>
                  <span className="text-xs text-[#96897b] block font-bold uppercase">Member Since</span>
                  <DateDisplay date={selectedCustomer.createdAt} format="long" />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#efe9e0]">
                <Button variant="outline" size="md" onClick={() => setSelectedCustomer(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Customer Modal */}
        {isCreateModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">ADD CUSTOMER ACCOUNT</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-[#50463c] hover:text-[#211b15]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <FormField label="Company / Entity Name" required>
                  <Input placeholder="e.g. Acme Corporation Pvt Ltd" />
                </FormField>
                <FormField label="Contact Person Name" required>
                  <Input placeholder="e.g. Rahul Sharma" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Email" required>
                    <Input type="email" placeholder="billing@acme.in" />
                  </FormField>
                  <FormField label="Phone Number" required>
                    <Input placeholder="+91 98765 43210" />
                  </FormField>
                </div>
                <FormField label="GSTIN (Optional)">
                  <Input placeholder="e.g. 32AAAAA0000A1Z5" />
                </FormField>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
                <Button variant="outline" size="md" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Create Customer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
