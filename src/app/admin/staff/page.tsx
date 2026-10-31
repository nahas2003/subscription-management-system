'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, ShieldCheck, UserCheck, X } from 'lucide-react';

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
    id: 'usr-01',
    name: 'Gokul Krishnan',
    email: 'admin@brightloop.in',
    role: 'admin',
    status: 'Active',
    createdAt: '2026-01-01',
    lastLogin: '2026-10-31',
  },
  {
    id: 'usr-02',
    name: 'Nahas K',
    email: 'staff.operations@brightloop.in',
    role: 'staff',
    status: 'Active',
    createdAt: '2026-01-15',
    lastLogin: '2026-10-30',
  },
  {
    id: 'usr-03',
    name: 'Ananya Nair',
    email: 'finance.lead@brightloop.in',
    role: 'staff',
    status: 'Active',
    createdAt: '2026-02-01',
    lastLogin: '2026-10-28',
  },
];

export default function StaffManagementPage() {
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const columns: Column<StaffUser>[] = [
    {
      header: 'Staff Member',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-500">{item.email}</div>
        </div>
      ),
    },
    {
      header: 'Role Assignment',
      cell: (item) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
            item.role === 'admin'
              ? 'bg-purple-100 text-purple-700 border border-purple-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900">Add Staff Account</h3>
                <button
                  onClick={() => setIsAddStaffOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
