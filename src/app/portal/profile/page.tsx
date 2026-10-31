'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function CustomerProfilePage() {
  return (
    <AppShell
      role="customer"
      currentPath="/portal/profile"
      user={{ name: 'Apex Technologies Pvt Ltd', email: 'billing@apextech.in', role: 'customer' }}
      title="Company Profile"
    >
      <div className="space-y-6 max-w-3xl">
        <PageHeader
          title="Account Profile"
          description="Manage your verified billing details, tax registration number, and primary contacts."
          action={
            <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Customer Profile</span>
            </div>
          }
        />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apex Technologies Pvt Ltd</h2>
              <span className="text-xs text-slate-500">Customer ID: CUST-2026-0012</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Company Registered Name">
                <Input defaultValue="Apex Technologies Pvt Ltd" disabled />
              </FormField>
              <FormField label="GSTIN / Tax ID">
                <Input defaultValue="32AAAAA0000A1Z5" disabled />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Primary Billing Email">
                <Input defaultValue="billing@apextech.in" leftIcon={<Mail className="h-4 w-4" />} />
              </FormField>
              <FormField label="Phone Contact">
                <Input defaultValue="+91 98470 12345" leftIcon={<Phone className="h-4 w-4" />} />
              </FormField>
            </div>

            <FormField label="Registered Billing Address">
              <Input defaultValue="Infopark Phase 2, Kakkanad, Kochi, Kerala 682030" leftIcon={<MapPin className="h-4 w-4" />} />
            </FormField>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="md">
              Update Contact Details
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
