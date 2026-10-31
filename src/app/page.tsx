import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck, Users, User, ArrowRight, Lock } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">BrightLoop</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-md shadow-blue-500/10"
            >
              Customer Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span>Odoo x Make-A-Ton 9.0 Hackathon 2026</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Modern Subscription-to-Cash <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Lifecycle Automation
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unified recurring billing, catalog management, quotations, customer portal, and financial reconciliation in Indian Rupees (₹).
        </p>

        {/* Interface Role Portals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {/* Admin Portal Card */}
          <Link
            href="/admin/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
          >
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                Admin Portal
              </h2>
              <p className="text-sm text-slate-400">
                Full executive oversight: revenue metrics, plans, catalogue, staff management, and system reports.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-purple-400 group-hover:gap-2 transition-all">
              <span>Enter Admin Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>

          {/* Staff Portal Card */}
          <Link
            href="/staff/dashboard"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
          >
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Staff Portal
              </h2>
              <p className="text-sm text-slate-400">
                Operational execution: customer management, quotation generation, subscription lifecycle, and manual payments.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-blue-400 group-hover:gap-2 transition-all">
              <span>Enter Staff Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>

          {/* Customer Portal Card */}
          <Link
            href="/portal"
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
          >
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <User className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                Customer Portal
              </h2>
              <p className="text-sm text-slate-400">
                Customer self-service: strictly isolated view of active subscriptions, invoices, and payments.
              </p>
            </div>
            <div className="mt-6 flex items-center text-sm font-semibold text-emerald-400 group-hover:gap-2 transition-all">
              <span>Enter Customer View</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-800/80 pt-12">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3 text-sm">
              01
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Automated Billing Runs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic period calculation, unique constraint duplicate prevention, and automated invoice creation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-3 text-sm">
              02
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Quotation to Subscription</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly transition custom customer quotes into active recurring subscriptions with snapshot pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-3 text-sm">
              03
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Customer Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PostgreSQL Row Level Security ensures customers only ever view their own subscriptions and payments.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        BrightLoop Subscription Management System &bull; Single-Company Architecture &bull; Odoo x Make-A-Ton 9.0 Kochi Hackathon
      </footer>
    </main>
  );
}
