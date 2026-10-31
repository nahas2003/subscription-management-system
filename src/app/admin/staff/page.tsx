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
import { Plus, X } from 'lucide-react';
import { createStaff } from '@/lib/actions/auth';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'Active' | 'Closed';
  createdAt: string;
  lastLogin: string;
}

const initialStaff: StaffUser[] = [
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
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaff);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleCreateStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const role = (formData.get('role') as 'admin' | 'staff') || 'staff';

    const result = await createStaff(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Add optimistic item to local list
    const newStaffItem: StaffUser = {
      id: `usr-${Date.now()}`,
      name: fullName,
      email,
      role,
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10),
      lastLogin: new Date().toISOString().slice(0, 10),
    };

    setStaffList((prev) => [newStaffItem, ...prev]);
    setLoading(false);
    setIsAddStaffOpen(false);
  }

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
          description="Admin-only configuration: provision staff accounts and configure role permissions."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setError(null);
                setIsAddStaffOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Staff Member
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={staffList}
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
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
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

              <form onSubmit={handleCreateStaff} className="space-y-3">
                <FormField label="Full Name" required>
                  <Input name="fullName" required placeholder="e.g. Priya Varma" />
                </FormField>
                <FormField label="Corporate Email" required>
                  <Input name="email" type="email" required placeholder="priya@brightloop.in" />
                </FormField>
                <FormField label="Role Assignment" required>
                  <select
                    name="role"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="staff">Staff (Operational Specialist)</option>
                    <option value="admin">Admin (System Administrator)</option>
                  </select>
                </FormField>
                <FormField label="Initial Password" required>
                  <Input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Min. 8 chars, 1 uppercase, 1 symbol"
                  />
                </FormField>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsAddStaffOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
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
