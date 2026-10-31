'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Calculator,
  Info,
  CheckCircle2,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function NewQuotationPage() {
  const router = useRouter();
  const customers = store.getCustomers();
  const products = store.getProducts();
  const plans = store.getPlans();

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [validDays, setValidDays] = useState('30');
  const [notes, setNotes] = useState('');

  // Line items state
  const [lines, setLines] = useState<
    {
      productId: string;
      variantId: string;
      planId: string;
      description: string;
      quantity: number;
      unitPrice: number;
      taxRate: number;
    }[]
  >([
    {
      productId: products[0]?.id || '',
      variantId: products[0]?.variants[0]?.id || '',
      planId: plans[0]?.id || '',
      description: `${products[0]?.name || ''} - ${products[0]?.variants[0]?.name || ''}`,
      quantity: 1,
      unitPrice: (products[0]?.sales_price || 0) + (products[0]?.variants[0]?.price_adjustment || 0),
      taxRate: 0.18, // 18% GST standard in India
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  // Compute live totals
  let subtotal = 0;
  let taxTotal = 0;

  lines.forEach((line) => {
    const lineSub = line.quantity * line.unitPrice;
    const lineTax = lineSub * (line.taxRate || 0);
    subtotal += lineSub;
    taxTotal += lineTax;
  });

  const total = subtotal + taxTotal;

  const handleProductChange = (index: number, newProdId: string) => {
    const prod = products.find((p) => p.id === newProdId);
    if (!prod) return;

    const firstVar = prod.variants[0];
    const unitPrice = prod.sales_price + (firstVar ? firstVar.price_adjustment : 0);
    const desc = firstVar ? `${prod.name} (${firstVar.name})` : prod.name;

    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      productId: prod.id,
      variantId: firstVar ? firstVar.id : '',
      description: desc,
      unitPrice: unitPrice,
    };
    setLines(updated);
  };

  const handleVariantChange = (index: number, newVarId: string) => {
    const currentLine = lines[index];
    const prod = products.find((p) => p.id === currentLine.productId);
    if (!prod) return;

    const selectedVar = prod.variants.find((v) => v.id === newVarId);
    const unitPrice = prod.sales_price + (selectedVar ? selectedVar.price_adjustment : 0);
    const desc = selectedVar ? `${prod.name} (${selectedVar.name})` : prod.name;

    const updated = [...lines];
    updated[index] = {
      ...updated[index],
      variantId: newVarId,
      description: desc,
      unitPrice: unitPrice,
    };
    setLines(updated);
  };

  const addLine = () => {
    const prod = products[0];
    const firstVar = prod?.variants[0];
    const unitPrice = (prod?.sales_price || 0) + (firstVar ? firstVar.price_adjustment : 0);

    setLines([
      ...lines,
      {
        productId: prod?.id || '',
        variantId: firstVar?.id || '',
        planId: plans[0]?.id || '',
        description: prod ? (firstVar ? `${prod.name} (${firstVar.name})` : prod.name) : 'Service line',
        quantity: 1,
        unitPrice: unitPrice,
        taxRate: 0.18,
      },
    ]);
  };

  const removeLine = (idx: number) => {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, i) => i !== idx));
  };

  const updateLine = (idx: number, field: string, val: any) => {
    const updated = [...lines];
    (updated[idx] as any)[field] = val;
    setLines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!customerId) throw new Error('Please select a customer.');
      if (lines.length === 0) throw new Error('At least one line item is required.');

      const d = new Date();
      d.setDate(d.getDate() + parseInt(validDays, 10));
      const validUntil = d.toISOString().split('T')[0];

      const quotation = store.createQuotation({
        customer_id: customerId,
        valid_until: validUntil,
        notes: notes.trim() || undefined,
        lines: lines.map((l) => ({
          product_id: l.productId || undefined,
          variant_id: l.variantId || undefined,
          plan_id: l.planId || undefined,
          description: l.description,
          quantity: l.quantity,
          unit_price: l.unitPrice,
          tax_rate: l.taxRate,
        })),
      });

      router.push(`/quotations/${quotation.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create quotation');
    }
  };

  return (
    <AppShell
      role="admin"
      currentPath="/quotations"
      user={{ name: 'Operations Staff', email: 'staff@brightloop.in', role: 'admin' }}
      title="Create Quotation"
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2">
          <Link
            href="/quotations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Quotations
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-bold text-slate-800">New Commercial Proposal</span>
        </div>

        <PageHeader
          title="Prepare New Quotation"
          description="Select customer, add catalogue items or variants, configure validity period, and calculate line totals with 18% GST (Task M3-04)."
        />

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm shadow-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer & Quotation Settings */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Customer *
              </label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quotation Validity *
              </label>
              <select
                value={validDays}
                onChange={(e) => setValidDays(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                <option value="15">15 Days</option>
                <option value="30">30 Days (Standard Proposal)</option>
                <option value="60">60 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Terms / Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Special enterprise pricing agreed"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {/* Quotation Line Items Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-indigo-600" />
                <span>Line Items &amp; Pricing Breakdown</span>
              </div>
              <button
                type="button"
                onClick={addLine}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="h-3.5 w-3.5" /> Add Another Line
              </button>
            </div>

            <div className="p-5 space-y-4">
              {lines.map((line, idx) => {
                const selectedProd = products.find((p) => p.id === line.productId);
                const lineSubtotal = line.quantity * line.unitPrice;
                const lineTax = lineSubtotal * line.taxRate;
                const lineTotal = lineSubtotal + lineTax;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative hover:border-slate-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Product
                        </label>
                        <select
                          value={line.productId}
                          onChange={(e) => handleProductChange(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({formatCurrency(p.sales_price)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Variant / Tier
                        </label>
                        <select
                          value={line.variantId}
                          onChange={(e) => handleVariantChange(idx, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
                        >
                          {selectedProd?.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name} ({v.price_adjustment >= 0 ? `+₹${v.price_adjustment}` : `-₹${Math.abs(v.price_adjustment)}`})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Recurring Plan
                        </label>
                        <select
                          value={line.planId}
                          onChange={(e) => updateLine(idx, 'planId', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
                        >
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.frequency})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end justify-between gap-2">
                        <div className="w-20">
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value, 10) || 1)}
                            className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-center font-bold"
                          />
                        </div>

                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove line"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-600">
                      <div>
                        Effective Unit Price:{' '}
                        <span className="font-bold text-slate-900">
                          <MoneyDisplay amount={line.unitPrice} size="sm" />
                        </span>{' '}
                        <span className="text-slate-400">| Tax: 18% GST</span>
                      </div>
                      <div className="font-bold text-slate-900">
                        Line Total: <MoneyDisplay amount={lineTotal} size="sm" className="text-indigo-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Pricing Summary */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Info className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>
                  Converting this quotation snapshots the agreed variant pricing and plan structure into an active contract.
                </span>
              </div>

              <div className="w-full sm:w-72 space-y-1.5 text-right">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <MoneyDisplay amount={subtotal} size="sm" className="font-semibold" />
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>GST Tax (18%):</span>
                  <MoneyDisplay amount={taxTotal} size="sm" className="font-semibold" />
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Proposal:</span>
                  <MoneyDisplay amount={total} size="lg" className="font-bold text-indigo-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/quotations">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Generate &amp; Review Quotation
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
