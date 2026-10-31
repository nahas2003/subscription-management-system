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
  totalInvoiced?: number;
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
    totalInvoiced: 135700,
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
    totalInvoiced: 28320,
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
    totalInvoiced: 35400,
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
    totalInvoiced: 82600,
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
        totalInvoiced: 0,
        status: 'Active',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setCustomers((prev) => [newCustomer, ...prev]);
    } catch {
      // Fallback state update for standalone dev
      const newCustomer: CustomerRecord = {
        id: `cust-${Date.now()}`,
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
    } finally {
      setLoading(false);
      setIsCreateModalOpen(false);
    }
  }

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Customer / Company',
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
      header: 'Contact Info',
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
      header: 'GSTIN / Tax ID',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-[#8c591b] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 rounded-[3.75px]">
          {item.gstin}
        </span>
      ),
    },
    {
      header: 'Subscriptions',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-2 py-0.5 text-xs font-bold text-[#8c591b]">
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
          className="inline-flex items-center gap-1 text-xs font-bold text-[#8c591b] hover:text-[#6c3200] transition-colors"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#96897b]" />
            <input
              type="text"
              placeholder="Search by company, contact, email or GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#c7bcaf] rounded-[3.75px] text-sm bg-white placeholder:text-[#96897b] focus:outline-none focus:border-[#8c591b]"
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
                  type="button"
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

                <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
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
