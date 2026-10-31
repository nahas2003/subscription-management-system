import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Users, User, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-3xl w-full text-center space-y-4 mb-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4F46E5] text-white shadow-md mb-2">
          <Layers className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Bright<span className="text-[#4F46E5]">Loop</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Unified Subscription Management System for Odoo x Make-A-Ton 9.0.
          Select an interface role to explore the system:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Admin Card */}
        <Link
          href="/admin/dashboard"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#4F46E5] hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
              Admin Portal
            </h2>
            <p className="text-sm text-slate-500">
              Full executive oversight: revenue metrics, plans, catalogue, staff management, and system reports.
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-[#4F46E5] group-hover:gap-2 transition-all">
            <span>Enter Admin Dashboard</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Staff Card */}
        <Link
          href="/staff/dashboard"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#4F46E5] hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
              Staff Portal
            </h2>
            <p className="text-sm text-slate-500">
              Operational execution: customer management, quotation generation, subscription lifecycle, and manual payments.
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-[#4F46E5] group-hover:gap-2 transition-all">
            <span>Enter Staff Dashboard</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>

        {/* Customer Card */}
        <Link
          href="/portal"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#4F46E5] hover:shadow-md transition-all"
        >
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <User className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
              Customer Portal
            </h2>
            <p className="text-sm text-slate-500">
              Customer self-service: strictly isolated view of active subscriptions, invoices, and payments.
            </p>
          </div>
          <div className="mt-6 flex items-center text-sm font-semibold text-[#4F46E5] group-hover:gap-2 transition-all">
            <span>Enter Customer View</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </Link>
      </div>

      <div className="mt-12 text-center text-xs text-slate-400">
        BrightLoop Subscription OS • Single-Company Architecture Baseline • Team Member 2 (UI/UX)
      </div>
    </div>
  );
}
