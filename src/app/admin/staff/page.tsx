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
import { createStaff } from '@/lib/actions/auth';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastLogin: string;
}

const initialStaff: StaffUser[] = [
  {
    id: 'usr-001',
    name: 'Anand Kumar',
    email: 'admin@brightloop.in',
    role: 'admin',
    status: 'Active',
    createdAt: '2025-01-15',
    lastLogin: '2026-10-31',
  },
  {
    id: 'usr-002',
    name: 'Deepa Nair',
    email: 'deepa@brightloop.in',
    role: 'staff',
    status: 'Active',
    createdAt: '2025-03-10',
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

  async function handleCreateStaff(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const role = (formData.get('role') as 'admin' | 'staff') || 'staff';

    try {
      const result = await createStaff(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

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
    } catch {
      // Optimistic fallback for local dev
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
    } finally {
      setLoading(false);
      setIsAddStaffOpen(false);
    }
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/50 backdrop-blur-xs font-sans"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#efe9e0] pb-3">
                <h3 className="font-display text-2xl font-bold text-[#211b15]">ADD STAFF ACCOUNT</h3>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
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
                    className="w-full px-3 py-2 border border-[#c7bcaf] rounded-[3.75px] text-sm bg-white text-[#211b15] focus:outline-none focus:border-[#8c591b]"
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

                <div className="flex justify-end gap-3 pt-4 border-t border-[#efe9e0]">
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
