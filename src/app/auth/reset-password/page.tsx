'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { resetPassword } from '@/lib/actions/auth';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess('Password recovery email sent! Check your inbox for reset instructions.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#fcfaf1] text-[#211b15] font-sans flex flex-col justify-between">
      {/* Header */}
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

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8c591b] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8">
        <div className="rounded-[7.5px] border border-[#efe9e0] bg-white p-6 sm:p-8 shadow-ambrook-card space-y-6">
          <div className="text-center space-y-1">
            <h1 className="font-display text-3xl font-bold text-[#211b15]">Reset Password</h1>
            <p className="text-xs text-[#50463c]">
              Enter your corporate email address to receive secure recovery instructions.
            </p>
          </div>

          {error && (
            <div className="rounded-[3.75px] bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rounded-[3.75px] bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Registered Email Address" required>
              <Input
                type="email"
                name="email"
                placeholder="you@company.in"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />
            </FormField>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={loading}
            >
              Send Recovery Link
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-[#efe9e0]">
            <Link
              href="/login"
              className="text-xs text-[#50463c] hover:text-[#211b15] font-medium"
            >
              Remember your password? <strong className="text-[#8c591b]">Sign in here</strong>
            </Link>
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
