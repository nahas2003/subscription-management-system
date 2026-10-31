'use client';

import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { store } from '@/lib/store';
import { CustomerRow } from '@/types/database';
import { formatDate } from '@/lib/utils';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>(store.getCustomers());
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!name.trim()) throw new Error('Customer name is required.');
      if (!email.trim()) throw new Error('Customer email is required.');

      const newCustomer = store.createCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
      });

      setCustomers(store.getCustomers());
      setSuccess(`Customer ${newCustomer.name} (${newCustomer.customer_code}) created successfully!`);
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Directory"
        description="Manage BrightLoop business customer records, account codes, and contact details (Task M3-01)."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        }
      />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or code..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> of {customers.length} customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Customer Code</th>
                <th className="px-6 py-3.5">Customer Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Address</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-600">
                      {customer.customer_code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{customer.name}</div>
                      {customer.notes && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">{customer.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                      {customer.address ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No address provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Add New Customer</h2>
            <p className="text-xs text-slate-500 mb-4">
              Enter the business customer profile details. Customer code is generated automatically.
            </p>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Customer / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. billing@acme.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0100"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Operational or account notes..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
