'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  ShieldCheck,
  Users,
  User,
  ArrowRight,
  CheckCircle2,
  Lock,
  Receipt,
  Repeat,
  IndianRupee,
  Calendar,
  AlertCircle,
  Mail,
  KeyRound,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserRole, ROLE_VISIBILITY_DATA } from '@/types/auth';
import { resolveUserFromCredentials, getRedirectForRole, saveSessionUser } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [activeTabRole, setActiveTabRole] = useState<UserRole>('admin');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Single unified login form state on landing page
  const [landingEmail, setLandingEmail] = useState('admin@brightloop.in');
  const [landingPass, setLandingPass] = useState('admin1234');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectedUser = resolveUserFromCredentials(landingEmail);
  const detectedRole = detectedUser.role;
  const redirectPath = getRedirectForRole(detectedRole);

  const handleLandingLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      saveSessionUser(detectedUser);
      router.push(redirectPath);
    }, 500);
  };

  const handleFillDemo = (email: string, pass: string) => {
    setLandingEmail(email);
    setLandingPass(pass);
  };

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const activeRoleData = ROLE_VISIBILITY_DATA[activeTabRole];

  return (
    <div className="min-h-screen bg-[#fcfaf1] text-[#211b15] font-sans flex flex-col justify-between selection:bg-[#fdf6ed] selection:text-[#8c591b]">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#efe9e0] bg-[#fcfaf1]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Mark */}
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

          {/* Center Navigation Links (Anchor Scrolling) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#50463c]">
            <a href="#role-views" className="hover:text-[#211b15] transition-colors">
              Role Workspaces
            </a>
            <a href="#login-section" className="hover:text-[#211b15] transition-colors">
              Single Login
            </a>
            <a href="#features" className="hover:text-[#211b15] transition-colors">
              Billing Engine
            </a>
            <a href="#security" className="hover:text-[#211b15] transition-colors">
              Compliance & RBAC
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAuth('login')}
              className="inline-flex items-center justify-center h-9 px-3.5 text-xs font-bold text-[#211b15] rounded-[3.75px] border border-[#c7bcaf] bg-white hover:bg-[#efe9e0] transition-colors"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openAuth('signup')}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-3.5 py-1 text-xs font-bold text-[#8c591b] shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-[#e8b672]" />
            <span>SINGLE LOGIN • ROLE-BASED WORKSPACES • ODOO x MAKE-A-TON 9.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-[#211b15] leading-[1.08] tracking-tight">
            One Secure Login.{' '}
            <span className="underline decoration-[#e8b672] decoration-4 underline-offset-8">
              Three Dedicated Views
            </span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#50463c] max-w-2xl mx-auto leading-relaxed">
            No role selection required. Enter your credentials and BrightLoop automatically routes you
            to your designated workspace — whether you are an{' '}
            <strong className="text-[#211b15]">Executive Admin</strong>,{' '}
            <strong className="text-[#211b15]">Operations Staff</strong>, or{' '}
            <strong className="text-[#211b15]">Customer Subscriber</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openAuth('login')}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Your Workspace
            </Button>
            <a
              href="#role-views"
              className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-[3.75px] border border-[#c7bcaf] bg-white text-[#211b15] hover:bg-[#efe9e0] transition-colors"
            >
              Compare What Each User Sees ↓
            </a>
          </div>

          {/* Key Metric Ribbon */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-4 shadow-ambrook-card">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b]">Contracted MRR</span>
              <div className="font-display text-2xl font-bold text-[#211b15] mt-0.5">₹2,98,000</div>
              <span className="text-[10px] text-[#7a9779] font-medium">+12% vs last month</span>
            </div>
            <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-4 shadow-ambrook-card">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b]">Tax Compliance</span>
              <div className="font-display text-2xl font-bold text-[#211b15] mt-0.5">18% GST</div>
              <span className="text-[10px] text-[#50463c]">Auto SGST / CGST</span>
            </div>
            <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-4 shadow-ambrook-card">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b]">Billing Engine</span>
              <div className="font-display text-2xl font-bold text-[#211b15] mt-0.5">100% Safe</div>
              <span className="text-[10px] text-[#50463c]">Deterministic Idempotency</span>
            </div>
            <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-4 shadow-ambrook-card">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#96897b]">Unified Access</span>
              <div className="font-display text-2xl font-bold text-[#211b15] mt-0.5">Single Login</div>
              <span className="text-[10px] text-[#50463c]">Auto-Detected Role</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Role Showcase ("What Can Each User See?") */}
      <section id="role-views" className="py-16 sm:py-24 border-t border-[#efe9e0] bg-white px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c591b]">
              ROLE-BASED PERMISSION COMPARISON
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#211b15]">
              What Can Each Persona See?
            </h2>
            <p className="text-sm sm:text-base text-[#50463c] leading-relaxed">
              When a user logs in, BrightLoop automatically renders the exact permissions and views authorized for their account:
            </p>
          </div>

          {/* Interactive Role Switcher Tabs (For learning what each view contains) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xl mx-auto p-1.5 rounded-[7.5px] bg-[#fcfaf1] border border-[#efe9e0]">
            <button
              onClick={() => setActiveTabRole('admin')}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[3.75px] text-xs font-bold uppercase tracking-wider transition-all ${
                activeTabRole === 'admin'
                  ? 'bg-[#252a23] text-white shadow-xs'
                  : 'text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Persona</span>
            </button>
            <button
              onClick={() => setActiveTabRole('staff')}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[3.75px] text-xs font-bold uppercase tracking-wider transition-all ${
                activeTabRole === 'staff'
                  ? 'bg-[#e8b672] text-[#211b15] shadow-xs'
                  : 'text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Staff Persona</span>
            </button>
            <button
              onClick={() => setActiveTabRole('customer')}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[3.75px] text-xs font-bold uppercase tracking-wider transition-all ${
                activeTabRole === 'customer'
                  ? 'bg-[#7a9779] text-white shadow-xs'
                  : 'text-[#50463c] hover:text-[#211b15]'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Customer Persona</span>
            </button>
          </div>

          {/* Active Role Detailed Card */}
          <div className="rounded-[7.5px] border border-[#efe9e0] bg-[#fcfaf1] p-6 sm:p-10 shadow-ambrook-card grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Scope, Permissions, Access List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-[3.75px] bg-white border border-[#efe9e0] px-3 py-1 text-xs font-bold text-[#8c591b]">
                  <span>{activeRoleData.badge}</span>
                </div>
                <h3 className="font-display text-3xl font-bold text-[#211b15]">
                  {activeRoleData.title}
                </h3>
                <p className="text-sm text-[#50463c] leading-relaxed">
                  {activeRoleData.permissionsDescription}
                </p>
              </div>

              {/* What this role CAN see & do */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#211b15] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#7a9779]" />
                  What This User Sees Upon Logging In:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeRoleData.canAccess.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-[3.75px] bg-white p-2.5 border border-[#efe9e0]"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#7a9779] mt-0.5" />
                      <span className="text-[#211b15] font-medium leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Boundary */}
              {activeRoleData.cannotAccess.length > 0 && activeRoleData.cannotAccess[0] !== 'Zero platform restrictions — Full executive clearance' && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#b83a2b] flex items-center gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-[#b83a2b]" />
                    Restricted & Barred from Seeing:
                  </h4>
                  <ul className="space-y-1 text-xs text-[#50463c]">
                    {activeRoleData.cannotAccess.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#96897b] font-bold">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons for this role */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={activeRoleData.portalPath}
                  className="inline-flex items-center justify-center h-11 px-5 rounded-[3.75px] bg-[#e8b672] text-[#211b15] font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#dba35c] transition-colors"
                >
                  <span>Direct Preview to {activeRoleData.title}</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="inline-flex items-center justify-center h-11 px-5 rounded-[3.75px] border border-[#c7bcaf] bg-white text-[#211b15] text-xs font-bold hover:bg-[#efe9e0] transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5 mr-1.5 text-[#8c591b]" />
                  Sign In with Credentials
                </button>
              </div>
            </div>

            {/* Right Column: Realistic Live View Preview */}
            <div className="lg:col-span-5 rounded-[7.5px] border border-[#efe9e0] bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#efe9e0]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7a9779]" />
                  <span className="font-mono text-xs font-bold text-[#211b15] uppercase tracking-wider">
                    {activeRoleData.portalPath}
                  </span>
                </div>
                <span className="text-[10px] bg-[#efe9e0] text-[#50463c] px-2 py-0.5 rounded-[3.75px] font-bold uppercase">
                  Live View Preview
                </span>
              </div>

              {/* Sample KPI Grid for this role */}
              <div className="grid grid-cols-2 gap-2.5">
                {activeRoleData.sampleKpis.map((kpi, kIdx) => (
                  <div key={kIdx} className="rounded-[3.75px] bg-[#fcfaf1] p-3 border border-[#efe9e0]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#96897b] block">
                      {kpi.label}
                    </span>
                    <div className="font-display text-xl font-bold text-[#211b15] mt-0.5">
                      {kpi.value}
                    </div>
                    <span className="text-[10px] text-[#50463c] block mt-0.5">{kpi.sub}</span>
                  </div>
                ))}
              </div>

              {/* Live Preview Teaser */}
              <div className="rounded-[3.75px] border border-[#efe9e0] bg-[#fcfaf1] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#211b15]">
                  <span>Dedicated Modules Included:</span>
                </div>
                {activeTabRole === 'admin' && (
                  <div className="text-xs space-y-1 text-[#50463c]">
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>Catalogue & Plans</span>
                      <strong className="text-[#211b15]">4 Products, 4 Plans</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>Idempotent Billing</span>
                      <strong className="text-[#7a9779]">Automated Batch Job</strong>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Staff Governance</span>
                      <strong className="text-[#211b15]">RBAC Access Rules</strong>
                    </div>
                  </div>
                )}
                {activeTabRole === 'staff' && (
                  <div className="text-xs space-y-1 text-[#50463c]">
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>Quotations Workflow</span>
                      <strong className="text-[#211b15]">Draft → Confirm Order</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>Payment Reconciliation</span>
                      <strong className="text-[#7a9779]">NEFT, RTGS, Cheque</strong>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Customer Queue</span>
                      <strong className="text-[#211b15]">Overdue Follow-ups</strong>
                    </div>
                  </div>
                )}
                {activeTabRole === 'customer' && (
                  <div className="text-xs space-y-1 text-[#50463c]">
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>Subscription Renewal</span>
                      <strong className="text-[#211b15]">Cycle & Price Status</strong>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#efe9e0]">
                      <span>18% GST Statements</span>
                      <strong className="text-[#7a9779]">Itemized Tax Breakdown</strong>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Data Privacy</span>
                      <strong className="text-[#211b15]">100% Isolated Tenant</strong>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={activeRoleData.portalPath}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[3.75px] bg-[#252a23] text-white text-xs font-bold hover:bg-[#191d18] transition-colors"
              >
                <span>Enter Full {activeRoleData.title}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Unified Direct Login Section (Single Login — Role Auto-Detected) */}
      <section id="login-section" className="py-16 sm:py-24 border-t border-[#efe9e0] bg-[#fcfaf1] px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c591b]">
              SINGLE LOGIN ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#211b15]">
              Unified Sign In
            </h2>
            <p className="text-sm text-[#50463c] max-w-lg mx-auto">
              No role selection required. Enter any registered credentials below to be routed directly to your assigned workspace.
            </p>
          </div>

          <div className="max-w-lg mx-auto rounded-[7.5px] border border-[#efe9e0] bg-white p-6 sm:p-8 shadow-ambrook-card space-y-5">
            <form onSubmit={handleLandingLogin} className="space-y-4">
              <FormField label="Email Address" required>
                <Input
                  type="email"
                  placeholder="you@company.in"
                  value={landingEmail}
                  onChange={(e) => setLandingEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />
              </FormField>

              <FormField label="Password" required>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={landingPass}
                  onChange={(e) => setLandingPass(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
              </FormField>

              {/* Automatic Role Detection Indicator */}
              <div className="rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0] p-3 text-xs text-[#50463c] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    detectedRole === 'admin' ? 'bg-[#252a23]' : detectedRole === 'staff' ? 'bg-[#e8b672]' : 'bg-[#7a9779]'
                  }`} />
                  <div>
                    <span className="text-[#96897b] text-[10px] uppercase font-bold block">Assigned Workspace:</span>
                    <span className="font-bold text-[#211b15]">
                      {detectedRole === 'admin' && 'Administrator Executive Portal'}
                      {detectedRole === 'staff' && 'Operations Staff Desk'}
                      {detectedRole === 'customer' && 'Customer Self-Service Portal'}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-[#8c591b] font-bold">
                  {redirectPath}
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In to Workspace
              </Button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="pt-3 border-t border-[#efe9e0] text-center space-y-2">
              <span className="text-[11px] text-[#96897b] block font-medium">
                Try Instant Evaluation Credentials:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@brightloop.in', 'admin1234')}
                  className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                    landingEmail === 'admin@brightloop.in'
                      ? 'bg-[#252a23] text-white border-[#211b15]'
                      : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                  }`}
                >
                  Admin (admin@brightloop.in)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('deepa@brightloop.in', 'staff1234')}
                  className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                    landingEmail === 'deepa@brightloop.in'
                      ? 'bg-[#e8b672] text-[#211b15] border-[#dba35c]'
                      : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                  }`}
                >
                  Staff (deepa@brightloop.in)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('billing@apextech.in', 'client1234')}
                  className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                    landingEmail === 'billing@apextech.in'
                      ? 'bg-[#7a9779] text-white border-[#658764]'
                      : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                  }`}
                >
                  Customer (billing@apextech.in)
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openAuth('signup')}
                  className="text-xs text-[#8c591b] hover:underline font-bold"
                >
                  New Client? Create Business Account →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Platform Architecture Pillars */}
      <section id="features" className="py-16 sm:py-20 border-t border-[#efe9e0] bg-white px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c591b]">
              FINANCIAL ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#211b15]">
              Engineered for Audit-Grade Accuracy
            </h2>
            <p className="text-sm text-[#50463c]">
              Built to meet strict Indian commercial tax regulations and high-volume billing requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-[7.5px] border border-[#efe9e0] bg-[#fcfaf1] space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672]">
                <Repeat className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#211b15]">Idempotent Billing</h3>
              <p className="text-xs text-[#50463c] leading-relaxed">
                Deterministic hash keys guarantee no duplicate invoices are generated, even during server restarts or network retries.
              </p>
            </div>

            <div className="p-5 rounded-[7.5px] border border-[#efe9e0] bg-[#fcfaf1] space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672]">
                <Receipt className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#211b15]">Statutory 18% GST</h3>
              <p className="text-xs text-[#50463c] leading-relaxed">
                Automated 18% GST line-item application, input tax credit eligibility tags, and one-click GSTR-1 export format.
              </p>
            </div>

            <div className="p-5 rounded-[7.5px] border border-[#efe9e0] bg-[#fcfaf1] space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672]">
                <Calendar className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#211b15]">Lifecycle Rules</h3>
              <p className="text-xs text-[#50463c] leading-relaxed">
                Configurable pause windows, upgrade proration rules, cancellation periods, and automated renewal triggers.
              </p>
            </div>

            <div className="p-5 rounded-[7.5px] border border-[#efe9e0] bg-[#fcfaf1] space-y-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672]">
                <IndianRupee className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-[#211b15]">Offline Settlements</h3>
              <p className="text-xs text-[#50463c] leading-relaxed">
                Staff can record manual NEFT, RTGS, and physical cheques with UTR numbers to reconcile outstanding receivables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Charcoal Olive Footer */}
      <footer id="security" className="w-full bg-[#252a23] text-[#efe9e0] py-12 px-4 sm:px-8 font-sans border-t border-[#434f40]">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[#434f40] text-xs">
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[3.75px] bg-[#e8b672] text-[#211b15]">
                  <Layers className="h-4 w-4" />
                </div>
                <span className="font-display text-lg font-bold text-white">BRIGHTLOOP</span>
              </div>
              <p className="text-[#96897b] leading-relaxed">
                Single-company subscription management operating system built for Odoo x Make-A-Ton 9.0 Kochi.
              </p>
            </div>

            {/* Links 1: Portals */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-white">Role Portals</span>
              <ul className="space-y-1.5 text-[#96897b]">
                <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Admin Console</Link></li>
                <li><Link href="/staff/dashboard" className="hover:text-white transition-colors">Staff Operations Desk</Link></li>
                <li><Link href="/portal" className="hover:text-white transition-colors">Customer Self-Service</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Single Sign In</Link></li>
              </ul>
            </div>

            {/* Links 2: Modules */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-white">Modules</span>
              <ul className="space-y-1.5 text-[#96897b]">
                <li><Link href="/admin/products" className="hover:text-white transition-colors">Product Catalogue</Link></li>
                <li><Link href="/admin/plans" className="hover:text-white transition-colors">Subscription Plans</Link></li>
                <li><Link href="/admin/invoices" className="hover:text-white transition-colors">Tax Invoices (18% GST)</Link></li>
                <li><Link href="/admin/reports" className="hover:text-white transition-colors">Fiscal Reports & MRR</Link></li>
              </ul>
            </div>

            {/* Links 3: Compliance & Tech */}
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-white">Compliance & Tech</span>
              <ul className="space-y-1.5 text-[#96897b]">
                <li><span className="text-[#efe9e0]">Next.js 14 App Router</span></li>
                <li><span className="text-[#efe9e0]">TypeScript Strict Typing</span></li>
                <li><span className="text-[#efe9e0]">Ambrook Style Architecture</span></li>
                <li><span className="text-[#efe9e0]">Deterministic Idempotency</span></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#96897b] gap-3">
            <div>
              © 2026 BrightLoop OS • Team Member 2 (UI/UX Frontend Developer)
            </div>
            <div>
              Verified Odoo x Make-A-Ton 9.0 Architecture
            </div>
          </div>
        </div>
      </footer>

      {/* Global Unified Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
