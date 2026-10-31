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
  companyName: string;
  email: string;
  phone: string;
  gstin: string;
  status: 'Active' | 'Draft' | 'Closed';
  createdAt: string;
  activeSubscriptionsCount: number;
}

const initialCustomers: CustomerRecord[] = [
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

    try {
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
    } catch {
      const newCustomer: CustomerRecord = {
        id: `cust-${Date.now()}`,
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
    } finally {
      setLoading(false);
      setIsCreateModalOpen(false);
    }
  }

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Business / Customer',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#fdf6ed] text-[#8c591b] font-bold text-xs shrink-0 border border-[#e8b672]/30">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-[#211b15]">{item.companyName}</div>
            <div className="text-xs text-[#96897b]">Contact: {item.name}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email & Phone',
      cell: (item) => (
        <div className="text-xs text-[#50463c] space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-[#96897b]" />
            <span>{item.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#96897b]">
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
        <span className="font-mono text-xs font-bold text-[#8c591b] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 rounded-[3.75px]">
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
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:text-[#6c3200] transition-colors"
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
            leftIcon={<Search className="h-4 w-4 text-[#96897b]" />}
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          emptyMessage="No customer records found."
        />
      </div>

      {/* Create Customer Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
              <h3 className="font-display text-2xl font-bold text-[#211b15]">ADD NEW CUSTOMER</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#50463c] hover:text-[#211b15]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[3.75px] text-red-600 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <FormField label="Company / Legal Entity Name" required>
                <Input name="companyName" placeholder="e.g. Apex Technologies Pvt Ltd" required />
              </FormField>

              <FormField label="Primary Contact Person" required>
                <Input name="name" placeholder="e.g. Siddharth Menon" required />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans">
          <div className="w-full max-w-md rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
              <h3 className="font-display text-2xl font-bold text-[#211b15]">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#50463c] hover:text-[#211b15]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Company</span>
                <p className="font-bold text-[#211b15]">{selectedCustomer.companyName}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Contact Person</span>
                <p className="text-[#50463c]">{selectedCustomer.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Email</span>
                  <p className="text-[#50463c] truncate">{selectedCustomer.email}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Phone</span>
                  <p className="text-[#50463c]">{selectedCustomer.phone || 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">GSTIN</span>
                <p className="font-mono text-xs font-bold text-[#8c591b]">{selectedCustomer.gstin}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#efe9e0]">
                <div>
                  <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Active Subs</span>
                  <p className="text-base font-bold text-[#8c591b]">{selectedCustomer.activeSubscriptionsCount}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#96897b] uppercase tracking-wider">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={selectedCustomer.status} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end border-t border-[#efe9e0] pt-3">
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
