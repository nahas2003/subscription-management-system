'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, Lock, Mail, Building2, KeyRound, ShieldCheck, Users, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { resolveUserFromCredentials, getRedirectForRole, saveSessionUser, KNOWN_ACCOUNTS } from '@/lib/auth';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('admin@brightloop.in');
  const [password, setPassword] = useState('admin1234');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Real-time detection of role based strictly on credentials
  const detectedUser = resolveUserFromCredentials(email);
  const detectedRole = detectedUser.role;
  const redirectPath = getRedirectForRole(detectedRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userToSave = {
        ...detectedUser,
        name: name || detectedUser.name,
        companyName: companyName || detectedUser.companyName,
        gstin: gstin || detectedUser.gstin,
      };
      saveSessionUser(userToSave);
      onClose();
      router.push(redirectPath);
    }, 500);
  };

  const handleApplyDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b15]/60 backdrop-blur-xs font-sans animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-[7.5px] border border-[#efe9e0] bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#50463c] hover:text-[#211b15] p-1.5 rounded-[3.75px] hover:bg-[#efe9e0] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 rounded-[3.75px] bg-[#fdf6ed] border border-[#e8b672]/60 px-2.5 py-0.5 text-xs font-bold text-[#8c591b]">
            <span>UNIFIED SECURE LOGIN</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#211b15]">
            {mode === 'login' ? 'Sign In to BrightLoop' : 'Create Customer Account'}
          </h2>
          <p className="text-xs sm:text-sm text-[#50463c]">
            Enter your credentials. The platform will automatically route you to your authorized workspace view.
          </p>
        </div>

        {/* Mode Switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-[#efe9e0] mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-[#e8b672] text-[#211b15]'
                : 'border-transparent text-[#96897b] hover:text-[#211b15]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#e8b672] text-[#211b15]'
                : 'border-transparent text-[#96897b] hover:text-[#211b15]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Full Name" required>
                  <Input
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormField>
                <FormField label="Business / Company Name" required>
                  <Input
                    placeholder="e.g. Apex Technologies Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField label="GSTIN (Tax Identification Number)">
                <Input
                  placeholder="e.g. 32AAAAA0000A1Z5 (Optional)"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </FormField>
            </>
          )}

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

          {/* Automatic Role Detection Preview Banner */}
          <div className="rounded-[3.75px] bg-[#fcfaf1] border border-[#efe9e0] p-3 text-xs text-[#50463c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                detectedRole === 'admin' ? 'bg-[#252a23]' : detectedRole === 'staff' ? 'bg-[#e8b672]' : 'bg-[#7a9779]'
              }`} />
              <div>
                <span className="text-[#96897b] text-[10px] uppercase font-bold block">Detected Access View:</span>
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {mode === 'login' ? `Sign In to Workspace` : `Create Account & Enter Portal`}
            </Button>
          </div>
        </form>

        {/* Demo Fast-Fill Pill Footer */}
        <div className="mt-6 pt-4 border-t border-[#efe9e0] text-center">
          <span className="text-[11px] text-[#96897b] block mb-2 font-medium">
            Test Instant Login as:
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
    </div>
  );
};
