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
import { createCustomer } from '@/lib/actions/customer';

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

const initialCustomers: CustomerRecord[] = [
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
    status: 'Draft',
    createdAt: '2026-03-01',
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleCreateCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const companyName = formData.get('companyName') as string;
    const contactName = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || '';
    const gstin = (formData.get('gstin') as string) || '';

    const res = await createCustomer(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    const newCustomer: CustomerRecord = {
      id: res.customer?.id || `cust-${Date.now()}`,
      name: contactName,
      email,
      phone,
      companyName: companyName || contactName,
      gstin: gstin || '32UNREGISTERED',
      activeSubscriptionsCount: 0,
      totalInvoiced: 0,
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setLoading(false);
    setIsCreateModalOpen(false);
  }

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Customer / Company',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-[#4F46E5] font-bold text-xs shrink-0">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{item.companyName}</div>
            <div className="text-xs text-slate-500">Contact: {item.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Info',
      cell: (item) => (
        <div className="space-y-0.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-slate-400" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{item.phone}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'GSTIN / Tax ID',
      cell: (item) => (
        <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {item.gstin}
        </span>
      ),
    },
    {
      header: 'Subscriptions',
      cell: (item) => (
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {item.activeSubscriptionsCount} Active
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Created Date',
      cell: (item) => <DateDisplay date={item.createdAt} />,
    },
    {
      header: 'Actions',
      cell: (item) => (
        <button
          onClick={() => setSelectedCustomer(item)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Details</span>
        </button>
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
          title="Customer Accounts"
          description="Manage client organizations, linked billing profiles, and tax registration identifiers."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setError(null);
                setIsCreateModalOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Customer
            </Button>
          }
        />

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, contact, email or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
        />

        {/* Customer Details Modal */}
        {selectedCustomer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-5 w-5 text-[#4F46E5]" />
                  <div>
                    <h3 className="font-bold text-slate-900">{selectedCustomer.companyName}</h3>
                    <span className="text-xs text-slate-400">ID: {selectedCustomer.id}</span>
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
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateCustomer} className="space-y-3">
                <FormField label="Company / Entity Name" required>
                  <Input name="companyName" required placeholder="e.g. Acme Corporation Pvt Ltd" />
                </FormField>
                <FormField label="Contact Person Name" required>
                  <Input name="name" required placeholder="e.g. Rahul Sharma" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Email" required>
                    <Input name="email" type="email" required placeholder="billing@acme.in" />
                  </FormField>
                  <FormField label="Phone Number">
                    <Input name="phone" placeholder="+91 98765 43210" />
                  </FormField>
                </div>
                <FormField label="GSTIN / Tax ID (Optional)">
                  <Input name="gstin" placeholder="e.g. 32AAAAA0000A1Z5" />
                </FormField>
                <FormField label="Registered Billing Address">
                  <Input name="billingAddress" placeholder="e.g. Infopark Phase 1, Kochi, Kerala" />
                </FormField>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" size="md" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Customer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
