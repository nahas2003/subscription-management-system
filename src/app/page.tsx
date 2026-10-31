import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              B
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
              Customer Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <span>Odoo x Make-A-Ton 9.0 Hackathon 2026</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Modern Subscription-to-Cash <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Lifecycle Automation
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Integrated recurring billing, catalog management, quotations, customer portal, and financial reconciliation in Indian Rupees (₹).
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.02]"
          >
            Access System Dashboard
          </Link>
          <Link
            href="/auth/register"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-6 py-3 rounded-xl transition-all"
          >
            Customer Self-Service
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Automated Billing Runs</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Deterministic period calculation, unique constraint duplicate prevention, and automated invoice creation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quotation to Subscription</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Seamlessly transition custom customer quotes into active recurring subscriptions with snapshot pricing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Customer Isolation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              PostgreSQL Row Level Security ensures customers only ever view their own subscriptions and payments.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        BrightLoop Subscription Management System &bull; Single-Company Architecture &bull; Member 1 Base Foundation
      </footer>
    </main>
  );
}
