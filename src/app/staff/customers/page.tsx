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
  {
    id: 'cust-03',
    name: 'Anand Varma',
    email: 'finance@malabarretail.in',
    phone: '+91 97455 54321',
    companyName: 'Malabar Retailers Ltd',
    gstin: '32CCCCC2222C3Z7',
    activeSubscriptionsCount: 0,
    status: 'Draft',
    createdAt: '2026-03-01',
  },
];

export default function StaffCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchTerm.toLowerCase())
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
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setLoading(false);
    setIsCreateModalOpen(false);
  }

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Business / Customer',
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
      header: 'Email & Phone',
      cell: (item) => (
        <div className="text-xs text-slate-600 space-y-0.5">
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
      cell: (item) => (
        <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {item.gstin}
        </span>
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
      header: 'Actions',
      cell: (item) => (
        <button
          onClick={() => setSelectedCustomer(item)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </button>
      ),
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
          action={
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Customer
            </Button>
          }
        />

        <div className="max-w-md w-full">
          <Input
            placeholder="Search by company, contact, or GSTIN..."
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

      {/* Create Customer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Customer</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="mt-4 space-y-4">
              <FormField label="Company / Legal Entity Name" required>
                <Input name="companyName" placeholder="e.g. Apex Technologies Pvt Ltd" required />
              </FormField>

              <FormField label="Primary Contact Person" required>
                <Input name="name" placeholder="e.g. Siddharth Menon" required />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Email Address" required>
                  <Input name="email" type="email" placeholder="billing@apextech.in" required />
                </FormField>
                <FormField label="Phone Number">
                  <Input name="phone" placeholder="+91 98470 12345" />
                </FormField>
              </div>

              <FormField label="GSTIN (15-char Tax ID)">
                <Input name="gstin" placeholder="32AAAAA0000A1Z5" maxLength={15} />
              </FormField>

              <FormField label="Billing Address">
                <Input name="billingAddress" placeholder="Infopark Kochi, Kerala, India 682042" />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={loading}>
                  Save Customer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</span>
                <p className="font-semibold text-slate-900">{selectedCustomer.companyName}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Person</span>
                <p className="text-slate-800">{selectedCustomer.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</span>
                  <p className="text-slate-700 truncate">{selectedCustomer.email}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</span>
                  <p className="text-slate-700">{selectedCustomer.phone || 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">GSTIN</span>
                <p className="font-mono text-xs font-medium text-slate-800">{selectedCustomer.gstin}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Subs</span>
                  <p className="text-base font-bold text-indigo-600">{selectedCustomer.activeSubscriptionsCount}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedCustomer.status} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
