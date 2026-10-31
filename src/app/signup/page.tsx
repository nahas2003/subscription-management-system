'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Layers, ArrowRight, Lock, Mail, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { resolveUserFromCredentials, getRedirectForRole, saveSessionUser } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gstin, setGstin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = resolveUserFromCredentials(email);
      const userToSave = {
        ...user,
        name: name || user.name,
        companyName: companyName || user.companyName,
        gstin: gstin || user.gstin,
      };
      saveSessionUser(userToSave);
      const redirect = getRedirectForRole(userToSave.role);
      router.push(redirect);
    }, 500);
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
          <span className="text-[#50463c]">Already have an account?</span>
          <Link href="/login" className="font-bold text-[#8c591b] hover:underline">
            Sign In →
          </Link>
        </div>
      </header>

      {/* Main Single Registration Card */}
      <main className="max-w-lg w-full mx-auto px-4 py-8">
        <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-6 sm:p-8 shadow-ambrook-card space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-display text-3xl font-bold text-[#211b15]">Create Account</h1>
            <p className="text-xs text-[#50463c]">
              Register your business to manage subscriptions and 18% GST tax statements.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Full Name" required>
                <Input
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  leftIcon={<User className="h-4 w-4" />}
                  required
                />
              </FormField>
              <FormField label="Business / Entity Name" required>
                <Input
                  placeholder="e.g. Apex Technologies Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  leftIcon={<Building2 className="h-4 w-4" />}
                  required
                />
              </FormField>
            </div>

            <FormField label="Work Email Address" required>
              <Input
                type="email"
                placeholder="billing@yourcompany.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
            </FormField>

            <FormField label="Password" required>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />
            </FormField>

            <FormField label="GSTIN (15-digit Tax Identification Number)">
              <Input
                placeholder="e.g. 32AAAAA0000A1Z5 (Optional)"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Register & Enter Workspace →
            </Button>
          </form>

          <p className="text-[11px] text-[#96897b] text-center">
            By creating an account, you agree to BrightLoop Terms of Service and statutory GST compliance guidelines.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-[#96897b]">
        BrightLoop Subscription Management • Odoo x Make-A-Ton 9.0
      </footer>
    </div>
  );
}
