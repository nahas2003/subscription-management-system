'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Search, Building2, Mail, Phone, Eye, X } from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  gstin: string;
  activeSubscriptionsCount: number;
  totalInvoiced: number;
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
    totalInvoiced: 135700,
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
    totalInvoiced: 28320,
    status: 'Active',
    createdAt: '2026-02-14',
  },
  {
    id: 'cust-03',
    name: 'Anand Varma',
    email: 'finance@malabarretail.in',
    phone: '+91 97455 54321',
    companyName: 'Malabar Retailers Ltd',
    gstin: '32CCCCC2222C3Z7',
    activeSubscriptionsCount: 0,
    totalInvoiced: 35400,
    status: 'Active',
    createdAt: '2026-03-01',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Customer / Business',
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
        <div className="text-xs text-slate-600 space-y-0.5">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-slate-400" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
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
        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-[#4F46E5]">
          {item.activeSubscriptionsCount}
        </span>
      ),
    },
    {
      header: 'GSTIN',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-600">{item.gstin}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedCustomer.companyName}</h3>
                    <span className="text-xs text-slate-500">ID: {selectedCustomer.id}</span>
                  </div>
                </div>
                <StatusBadge status={selectedCustomer.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Primary Contact</span>
                  <span className="font-medium text-slate-800">{selectedCustomer.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-800">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Phone</span>
                  <span className="font-medium text-slate-800">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Tax / GSTIN</span>
                  <span className="font-mono text-xs font-semibold text-slate-700">{selectedCustomer.gstin}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Active Subscriptions</span>
                  <span className="font-bold text-[#4F46E5]">{selectedCustomer.activeSubscriptionsCount} Active</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Member Since</span>
                  <DateDisplay date={selectedCustomer.createdAt} format="long" />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900">Add Customer Account</h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
