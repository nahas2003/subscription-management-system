'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { resolveUserFromCredentials, getRedirectForRole, saveSessionUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@brightloop.in');
  const [password, setPassword] = useState('admin1234');
  const [isLoading, setIsLoading] = useState(false);

  const detectedUser = resolveUserFromCredentials(email);
  const detectedRole = detectedUser.role;
  const redirectPath = getRedirectForRole(detectedRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      saveSessionUser(detectedUser);
      router.push(redirectPath);
    }, 500);
  };

  const handleApplyDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#fcfaf1] text-[#211b15] font-sans flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[3.75px] bg-[#252a23] text-[#e8b672] shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-[#211b15]">
              BRIGHT<span className="text-[#8c591b]">LOOP</span>
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#96897b]">
              Subscription OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-[#50463c]">New subscriber?</span>
          <Link href="/signup" className="font-bold text-[#8c591b] hover:underline">
            Create Account →
          </Link>
        </div>
      </header>

      {/* Main Single Login Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-6 sm:p-8 shadow-ambrook-card space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-display text-3xl font-bold text-[#211b15]">Sign In</h1>
            <p className="text-xs text-[#50463c]">
              Enter your corporate credentials to access your designated workspace.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email Address" required>
              <Input
                type="email"
                placeholder="you@company.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
            </FormField>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#211b15]">Password *</label>
                <Link href="/auth/reset-password" className="text-[11px] text-[#8c591b] hover:underline font-medium">Forgot password?</Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </div>

            {/* Role detection indicator */}
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
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* One-Click Demo Credentials */}
          <div className="pt-2 text-center border-t border-[#efe9e0]">
            <span className="text-[11px] text-[#96897b] block mb-2 font-medium">
              Demo Credentials:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleApplyDemo('admin@brightloop.in', 'admin1234')}
                className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                  email === 'admin@brightloop.in'
                    ? 'bg-[#252a23] text-white border-[#211b15]'
                    : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                }`}
              >
                Admin (admin@brightloop.in)
              </button>
              <button
                type="button"
                onClick={() => handleApplyDemo('deepa@brightloop.in', 'staff1234')}
                className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                  email === 'deepa@brightloop.in'
                    ? 'bg-[#e8b672] text-[#211b15] border-[#dba35c]'
                    : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                }`}
              >
                Staff (deepa@brightloop.in)
              </button>
              <button
                type="button"
                onClick={() => handleApplyDemo('billing@apextech.in', 'client1234')}
                className={`text-xs px-2.5 py-1 rounded-[3.75px] border transition-colors ${
                  email === 'billing@apextech.in'
                    ? 'bg-[#7a9779] text-white border-[#658764]'
                    : 'bg-[#fcfaf1] text-[#211b15] border-[#efe9e0] hover:bg-[#efe9e0]'
                }`}
              >
                Customer (billing@apextech.in)
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-[#96897b]">
        BrightLoop Subscription Management • Odoo x Make-A-Ton 9.0
      </footer>
    </div>
  );
}
