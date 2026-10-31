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
import { Plus, X } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'Active' | 'Closed';
  createdAt: string;
  lastLogin: string;
}

const mockStaff: StaffUser[] = [
  {
    id: 'usr-001',
    name: 'Anand Kumar',
    email: 'admin@brightloop.in',
    role: 'admin',
    status: 'Active',
    createdAt: '2025-01-10',
    lastLogin: '2026-10-31',
  },
  {
    id: 'usr-002',
    name: 'Deepa Krishnan',
    email: 'deepa@brightloop.in',
    role: 'staff',
    status: 'Active',
    createdAt: '2025-04-12',
    lastLogin: '2026-10-30',
  },
  {
    id: 'usr-003',
    name: 'Manoj Pillai',
    email: 'manoj@brightloop.in',
    role: 'staff',
    status: 'Active',
    createdAt: '2025-07-01',
    lastLogin: '2026-10-28',
  },
];

export default function StaffPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const columns: Column<StaffUser>[] = [
    {
      header: 'Staff Member',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.name}</div>
          <div className="text-xs text-[#96897b]">{item.email}</div>
        </div>
      ),
    },
    {
      header: 'Role Assignment',
      cell: (item) => (
        <span
          className={`inline-flex rounded-[3.75px] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
            item.role === 'admin'
              ? 'bg-[#252a23] text-[#efe9e0] border border-[#434f40]'
              : 'bg-[#fdf6ed] text-[#7d4e13] border border-[#e8b672]/60'
          }`}
        >
          {item.role}
        </span>
      ),
    },
    {
      header: 'Created Date',
      cell: (item) => <DateDisplay date={item.createdAt} />,
    },
    {
      header: 'Last Active',
      cell: (item) => <DateDisplay date={item.lastLogin} />,
    },
    {
      header: 'Account Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/staff"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Staff Management"
    >
      <div className="space-y-6">
        <PageHeader
          title="Staff & User Roles"
          description="Admin-only configuration: invite staff members and configure access permissions."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddStaffOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Staff Member
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockStaff}
          keyExtractor={(item) => item.id}
        />

        {/* Add Staff Dialog */}
        {isAddStaffOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">ADD STAFF ACCOUNT</h3>
                <button
                  onClick={() => setIsAddStaffOpen(false)}
                  className="text-[#50463c] hover:text-[#211b15]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <FormField label="Full Name" required>
                  <Input placeholder="e.g. Priya Varma" />
                </FormField>
                <FormField label="Corporate Email" required>
                  <Input type="email" placeholder="priya@brightloop.in" />
                </FormField>
                <FormField label="Initial Temporary Password" required>
                  <Input type="password" placeholder="Min. 8 chars, 1 uppercase, 1 symbol" />
                </FormField>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
                <Button variant="outline" size="md" onClick={() => setIsAddStaffOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsAddStaffOpen(false)}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
