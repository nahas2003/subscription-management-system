'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  Package,
  Repeat,
  Server,
  Headphones,
  Wrench,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';

type CategoryFilter = 'all' | 'subscriptions' | 'products' | 'services';

interface PlanItem {
  id: string;
  name: string;
  code: string;
  frequency: string;
  intervalText: string;
  price: number;
  trialDays: number;
  highlight?: boolean;
  badge?: string;
  renewalRule: string;
  pauseAllowed: boolean;
  cancellationAllowed: boolean;
  description: string;
  features: string[];
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  productType: 'Software Solution' | 'Core Platform';
  price: number;
  priceNote: string;
  status: 'Active';
  description: string;
  features: string[];
  variants?: { name: string; price: number }[];
}

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  serviceType: 'Managed Service' | 'Technical Support' | 'Professional Service';
  price: number;
  billingFrequency: 'Monthly' | 'One-time';
  description: string;
  deliverables: string[];
}

const subscriptionPlans: PlanItem[] = [
  {
    id: 'plan-01',
    name: 'Monthly Pro Subscription',
    code: 'PLAN-MONTHLY',
    frequency: 'Monthly',
    intervalText: 'Billed every month',
    price: 15000,
    trialDays: 14,
    renewalRule: 'Auto-renews monthly on the 1st of each billing cycle',
    pauseAllowed: true,
    cancellationAllowed: true,
    description:
      'Standard recurring subscription for growing enterprises needing full ERP core operations and automated billing.',
    features: [
      'Full BrightLoop Cloud ERP Core instance access',
      'Automated 18% GST tax invoice calculation',
      'Customer self-service portal with payment history',
      'UPI, NEFT/RTGS, and Net Banking payment support',
      'Up to 25 staff and admin user accounts',
      'Standard email technical support during business hours',
    ],
  },
  {
    id: 'plan-02',
    name: 'Enterprise Annual Plan',
    code: 'PLAN-ANNUAL',
    frequency: 'Yearly',
    intervalText: 'Billed annually (Save over 40%)',
    price: 100000,
    trialDays: 30,
    highlight: true,
    badge: 'Best Value • Annual Commitment',
    renewalRule: 'Auto-renews yearly with automated 30-day advance renewal notification',
    pauseAllowed: true,
    cancellationAllowed: true,
    description:
      'Comprehensive organization-wide license combining the complete ERP platform with Quality Management and 24/7 SLA.',
    features: [
      'Everything in Monthly Pro included',
      'Includes Quality Management System (QMS) module',
      '24/7 Priority SLA helpdesk with 1-hour response time',
      'Dedicated Technical Account Manager',
      'Multi-site, multi-currency, and multi-warehouse deployment',
      'Deterministic batch billing engine with audit logging',
      'Custom invoice templates with digital stamp/signature',
    ],
  },
  {
    id: 'plan-03',
    name: 'Consulting Retainer Monthly',
    code: 'PLAN-RETAINER',
    frequency: 'Monthly Retainer',
    intervalText: '3-month minimum commitment',
    price: 20000,
    trialDays: 0,
    renewalRule: 'Auto-renews monthly; requires 30-day notice prior to quarter end',
    pauseAllowed: false,
    cancellationAllowed: false,
    description:
      'Dedicated technical and business advisory retainer for complex ERP customization, integration, and performance audits.',
    features: [
      '20 hours of monthly dedicated solution architecture advisory',
      'Custom API integrations and legacy ERP workflow mapping',
      'Database health monitoring and query optimization',
      'Quarterly executive architecture and security review',
      'Direct communication channel with core engineering team',
    ],
  },
];

const catalogueProducts: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'BrightLoop Cloud ERP Core',
    category: 'Enterprise Software',
    productType: 'Core Platform',
    price: 15000,
    priceNote: 'per month / instance',
    status: 'Active',
    description:
      'Multi-tenant business ERP platform unifying accounting, real-time stock inventory, purchase orders, customer invoicing, and recurring subscription automation.',
    features: [
      'Automated recurring billing and invoice scheduling',
      'GST compliance (18% & 5% tax categories with SGST/CGST breakdown)',
      'Quotations workflow (Draft → Sent → Confirmed Order)',
      'Payment tracking with partial settlement and balance due calculations',
      'Role-based permissions (Admin, Staff, Customer Portal)',
    ],
    variants: [
      { name: 'Standard Instance (Up to 25 Users)', price: 15000 },
      { name: 'Multi-Tenant Enterprise Cluster', price: 35000 },
    ],
  },
  {
    id: 'prod-02',
    name: 'Quality Management System (QMS)',
    category: 'Compliance & Auditing',
    productType: 'Software Solution',
    price: 100000,
    priceNote: 'base license',
    status: 'Active',
    description:
      'ISO-compliant quality assurance engine featuring batch tracing, non-conformance logs, inspection checkpoints, and external audit management.',
    features: [
      'Complete batch and lot traceability with raw-material genealogy',
      'Inspection checklists for incoming, in-process, and finished goods',
      'Corrective and Preventive Action (CAPA) tracking',
      'Exportable compliance audit reports for regulatory reviews',
    ],
    variants: [
      { name: 'Single Site Standard', price: 100000 },
      { name: 'Multi-Site Audit Engine', price: 118000 },
    ],
  },
];

const catalogueServices: ServiceItem[] = [
  {
    id: 'serv-01',
    name: 'Managed Cloud Infrastructure',
    category: 'Cloud Operations',
    serviceType: 'Managed Service',
    price: 15000,
    billingFrequency: 'Monthly',
    description:
      'Dedicated high-availability Kubernetes cluster hosting with automated daily backup snapshots, DDoS mitigation, and 99.9% uptime SLA.',
    deliverables: [
      'Automated daily database backups with point-in-time recovery',
      'Multi-region failover and load balancing',
      'Continuous uptime monitoring and security patching',
      'Managed SSL/TLS certificates and encrypted storage',
    ],
  },
  {
    id: 'serv-02',
    name: 'Priority SLA Support Add-on',
    category: 'Technical Support',
    serviceType: 'Technical Support',
    price: 5000,
    billingFrequency: 'Monthly',
    description:
      'Round-the-clock technical assistance with guaranteed 1-hour initial response time for mission-critical operations and a named support lead.',
    deliverables: [
      '24/7/365 emergency incident helpline',
      'Guaranteed 1-hour first response SLA for Severity 1 tickets',
      'Dedicated technical support account representative',
      'Monthly incident summaries and root-cause analysis reports',
    ],
  },
  {
    id: 'serv-03',
    name: 'Implementation & Customization Pack',
    category: 'Onboarding & Migration',
    serviceType: 'Professional Service',
    price: 25000,
    billingFrequency: 'One-time',
    description:
      'Comprehensive onboarding package including data migration from legacy spreadsheets or ERP systems, invoice template customization, and staff workflow training.',
    deliverables: [
      'Legacy customer, product, and inventory balance migration',
      'Customized PDF invoice layout with corporate branding',
      'Tailored quotation and approval workflow setup',
      'Hands-on staff and administrator onboarding sessions',
    ],
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  return (
    <div className="min-h-screen bg-[#fcfaf1] text-[#211b15] font-sans flex flex-col justify-between selection:bg-[#fdf6ed] selection:text-[#8c591b]">
      {/* 1. Header with Single Sign In Link */}
      <header className="sticky top-0 z-40 w-full border-b border-[#efe9e0] bg-[#fcfaf1]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672] shadow-sm">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#211b15] leading-none">
                BRIGHT<span className="text-[#8c591b]">LOOP</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#96897b] leading-none mt-1">
                Subscription OS
              </span>
            </div>
          </Link>

          {/* Catalog Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#50463c]">
            <a href="#subscriptions" className="hover:text-[#211b15] transition-colors">
              Subscription Plans
            </a>
            <a href="#products" className="hover:text-[#211b15] transition-colors">
              Products
            </a>
            <a href="#services" className="hover:text-[#211b15] transition-colors">
              Services &amp; Support
            </a>
          </nav>

          {/* Exactly ONE Single Sign In Link */}
          <div className="flex items-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-4 text-xs font-bold text-[#211b15] rounded-[3.75px] border border-[#c7bcaf] bg-white hover:bg-[#efe9e0] hover:border-[#211b15] shadow-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Page Hero Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 border-b border-[#efe9e0] bg-white">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-3.5 py-1 text-xs font-bold text-[#8c591b]">
            <Sparkles className="h-3.5 w-3.5 text-[#e8b672]" />
            <span>OFFICIAL CATALOGUE • PRODUCTS, SERVICES &amp; SUBSCRIPTIONS</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#211b15] tracking-tight">
            Products, Services &amp; Subscriptions
          </h1>

          <p className="text-sm sm:text-base text-[#50463c] max-w-2xl mx-auto leading-relaxed">
            Browse our complete catalogue of enterprise software solutions, professional implementation services,
            and recurring subscription billing plans.
          </p>

          {/* Category Filter Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-[3.75px] transition-colors ${
                filter === 'all'
                  ? 'bg-[#252a23] text-white shadow-xs'
                  : 'bg-[#fcfaf1] border border-[#efe9e0] text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              All Offerings ({subscriptionPlans.length + catalogueProducts.length + catalogueServices.length})
            </button>
            <button
              onClick={() => setFilter('subscriptions')}
              className={`px-3.5 py-1.5 rounded-[3.75px] transition-colors ${
                filter === 'subscriptions'
                  ? 'bg-[#252a23] text-white shadow-xs'
                  : 'bg-[#fcfaf1] border border-[#efe9e0] text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              Subscription Plans ({subscriptionPlans.length})
            </button>
            <button
              onClick={() => setFilter('products')}
              className={`px-3.5 py-1.5 rounded-[3.75px] transition-colors ${
                filter === 'products'
                  ? 'bg-[#252a23] text-white shadow-xs'
                  : 'bg-[#fcfaf1] border border-[#efe9e0] text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              Products ({catalogueProducts.length})
            </button>
            <button
              onClick={() => setFilter('services')}
              className={`px-3.5 py-1.5 rounded-[3.75px] transition-colors ${
                filter === 'services'
                  ? 'bg-[#252a23] text-white shadow-xs'
                  : 'bg-[#fcfaf1] border border-[#efe9e0] text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              Services &amp; Support ({catalogueServices.length})
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Catalog Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 space-y-16">
        {/* SECTION 1: SUBSCRIPTION PLANS */}
        {(filter === 'all' || filter === 'subscriptions') && (
          <section id="subscriptions" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#efe9e0] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c591b]">
                  <Repeat className="h-4 w-4" />
                  <span>Recurring Billing Plans</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#211b15] mt-1">
                  Subscription Plans
                </h2>
              </div>
              <p className="text-xs text-[#50463c] sm:max-w-md">
                Standard recurring plans with automated 18% GST invoicing, self-service pause options, and renewal management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-[7.5px] border bg-white p-6 shadow-ambrook-card flex flex-col justify-between transition-all ${
                    plan.highlight
                      ? 'border-[#e8b672] ring-1 ring-[#e8b672]/50 relative'
                      : 'border-[#efe9e0]'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-[3.75px] text-[10px] font-bold uppercase tracking-wider bg-[#252a23] text-[#e8b672] shadow-xs">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-semibold text-[#96897b]">
                          {plan.code}
                        </span>
                        <StatusBadge status="Active" size="sm" />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#211b15] mt-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-[#50463c] mt-2 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3.5 rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0] space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <MoneyDisplay amount={plan.price} size="xl" useDisplayFont />
                        <span className="text-xs text-[#50463c] font-medium">/ {plan.frequency.toLowerCase()}</span>
                      </div>
                      <p className="text-[11px] text-[#96897b]">{plan.intervalText}</p>
                      {plan.trialDays > 0 && (
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7a9779] pt-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{plan.trialDays}-Day Free Trial Included</span>
                        </div>
                      )}
                    </div>

                    {/* Terms Checklist */}
                    <div className="space-y-2 text-xs border-t border-[#efe9e0] pt-3">
                      <div className="flex items-start gap-2 text-[#50463c]">
                        <Calendar className="h-4 w-4 text-[#8c591b] shrink-0 mt-0.5" />
                        <span className="leading-tight">{plan.renewalRule}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#50463c]">
                        <span>Pause: <strong className="text-[#211b15]">{plan.pauseAllowed ? 'Allowed' : 'Not Allowed'}</strong></span>
                        <span>Cancellation: <strong className="text-[#211b15]">{plan.cancellationAllowed ? 'Allowed' : 'Contracted'}</strong></span>
                      </div>
                    </div>

                    {/* Features Included */}
                    <div className="space-y-2 border-t border-[#efe9e0] pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b] block">
                        Included Features:
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[#211b15]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#7a9779] shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#efe9e0]">
                    <Link
                      href="/login"
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[3.75px] text-xs font-bold uppercase tracking-wider transition-colors ${
                        plan.highlight
                          ? 'bg-[#252a23] text-[#e8b672] hover:bg-[#1a1e19]'
                          : 'bg-[#fcfaf1] border border-[#c7bcaf] text-[#211b15] hover:bg-[#efe9e0]'
                      }`}
                    >
                      <span>Subscribe to {plan.name}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: PRODUCTS */}
        {(filter === 'all' || filter === 'products') && (
          <section id="products" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#efe9e0] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c591b]">
                  <Package className="h-4 w-4" />
                  <span>Software Catalog</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#211b15] mt-1">
                  Products
                </h2>
              </div>
              <p className="text-xs text-[#50463c] sm:max-w-md">
                Deployable enterprise software systems with standard and custom module configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalogueProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-ambrook-card flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c591b]">
                        {prod.category} • {prod.productType}
                      </span>
                      <StatusBadge status={prod.status} size="sm" />
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-bold text-[#211b15]">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-[#50463c] mt-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3.5 rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0] flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#96897b] block">
                          Base License
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <MoneyDisplay amount={prod.price} size="xl" useDisplayFont />
                          <span className="text-xs text-[#50463c] font-medium">/{prod.priceNote}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#7a9779] bg-[#eef4ee] px-2.5 py-1 rounded-[3.75px]">
                        18% GST Applicable
                      </span>
                    </div>

                    {/* Key Specifications */}
                    <div className="space-y-2 border-t border-[#efe9e0] pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b] block">
                        Platform Capabilities:
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {prod.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[#211b15]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#7a9779] shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Variants */}
                    {prod.variants && prod.variants.length > 0 && (
                      <div className="space-y-2 border-t border-[#efe9e0] pt-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b] block">
                          Available Variants:
                        </span>
                        <div className="space-y-1.5">
                          {prod.variants.map((v, vIdx) => (
                            <div
                              key={vIdx}
                              className="flex items-center justify-between p-2 rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0] text-xs"
                            >
                              <span className="text-[#211b15] font-medium">{v.name}</span>
                              <span className="font-mono font-bold text-[#8c591b]">
                                <MoneyDisplay amount={v.price} size="sm" />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#efe9e0]">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[3.75px] bg-[#fcfaf1] border border-[#c7bcaf] text-[#211b15] text-xs font-bold uppercase tracking-wider hover:bg-[#efe9e0] transition-colors"
                    >
                      <span>Inquire / Request Quotation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: SERVICES */}
        {(filter === 'all' || filter === 'services') && (
          <section id="services" className="space-y-6 scroll-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#efe9e0] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8c591b]">
                  <Wrench className="h-4 w-4" />
                  <span>Professional Services &amp; Support</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#211b15] mt-1">
                  Services
                </h2>
              </div>
              <p className="text-xs text-[#50463c] sm:max-w-md">
                Infrastructure maintenance, 24/7 technical helpdesk, and customized onboarding services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catalogueServices.map((serv) => (
                <div
                  key={serv.id}
                  className="rounded-[7.5px] border border-[#efe9e0] bg-white p-6 shadow-ambrook-card flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c591b]">
                        {serv.category}
                      </span>
                      <span className="text-[10px] font-semibold bg-[#efe9e0] text-[#50463c] px-2 py-0.5 rounded-[3.75px]">
                        {serv.serviceType}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold text-[#211b15]">
                        {serv.name}
                      </h3>
                      <p className="text-xs text-[#50463c] mt-2 leading-relaxed">
                        {serv.description}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-3.5 rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#96897b] block">
                        Service Fee
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <MoneyDisplay amount={serv.price} size="xl" useDisplayFont />
                        <span className="text-xs text-[#50463c] font-medium">/ {serv.billingFrequency.toLowerCase()}</span>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-2 border-t border-[#efe9e0] pt-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b] block">
                        Service Deliverables:
                      </span>
                      <ul className="space-y-1.5 text-xs">
                        {serv.deliverables.map((deliv, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-[#211b15]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#7a9779] shrink-0 mt-0.5" />
                            <span className="leading-tight">{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#efe9e0]">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[3.75px] bg-[#fcfaf1] border border-[#c7bcaf] text-[#211b15] text-xs font-bold uppercase tracking-wider hover:bg-[#efe9e0] transition-colors"
                    >
                      <span>Engage Service</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 4. Minimal Clean Footer */}
      <footer className="border-t border-[#efe9e0] bg-[#fcfaf1] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#50463c]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672]">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-[#211b15]">BRIGHTLOOP</span>
            <span className="text-[#96897b]">© {new Date().getFullYear()} BrightLoop Subscription Management System.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#subscriptions" className="hover:text-[#211b15] transition-colors">
              Subscriptions
            </a>
            <a href="#products" className="hover:text-[#211b15] transition-colors">
              Products
            </a>
            <a href="#services" className="hover:text-[#211b15] transition-colors">
              Services
            </a>
            <Link href="/login" className="font-bold text-[#8c591b] hover:underline">
              Sign In →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
