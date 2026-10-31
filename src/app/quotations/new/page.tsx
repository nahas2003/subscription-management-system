'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Trash2, ArrowLeft, CheckCircle2, Calculator, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
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
      taxRate: 0.1, // 10% demo tax
    },
  ]);

  const [error, setError] = useState<string | null>(null);

  // Compute live totals
  let subtotal = 0;
  let taxTotal = 0;

  lines.forEach((line) => {
    const lineSub = line.quantity * line.unitPrice;
    const lineTax = lineSub * lineRate(line.taxRate);
    subtotal += lineSub;
    taxTotal += lineTax;
  });

  const total = subtotal + taxTotal;

  function lineRate(rate: number) {
    return isNaN(rate) ? 0 : rate;
  }

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
        taxRate: 0.1,
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

      // Calculate validity date
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
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link
          href="/quotations"
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations
        </Link>
      </div>

      <PageHeader
        title="Prepare New Quotation"
        description="Select customer, add catalogue items or variants, configure validity period, and calculate line totals."
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer & Quotation Settings */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Select Customer *
            </label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Quotation Validity (Days) *
            </label>
            <select
              value={validDays}
              onChange={(e) => setValidDays(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="15">15 Days</option>
              <option value="30">30 Days (Standard)</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Quotation Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Special enterprise pricing agreed"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Quotation Line Items Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <span>Quotation Lines</span>
            </div>
            <button
              type="button"
              onClick={addLine}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line
            </button>
          </div>

          <div className="p-4 space-y-4">
            {lines.map((line, idx) => {
              const selectedProd = products.find((p) => p.id === line.productId);
              const lineSubtotal = line.quantity * line.unitPrice;
              const lineTax = lineSubtotal * line.taxRate;
              const lineTotal = lineSubtotal + lineTax;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Product Selection */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Product
                      </label>
                      <select
                        value={line.productId}
                        onChange={(e) => handleProductChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatCurrency(p.sales_price)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Variant Selection */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Variant / Brand
                      </label>
                      <select
                        value={line.variantId}
                        onChange={(e) => handleVariantChange(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        {selectedProd?.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.price_adjustment >= 0 ? `+${formatCurrency(v.price_adjustment)}` : formatCurrency(v.price_adjustment)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subscription Plan Link */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Subscription Plan
                      </label>
                      <select
                        value={line.planId}
                        onChange={(e) => updateLine(idx, 'planId', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      >
                        {plans.map((pl) => (
                          <option key={pl.id} value={pl.id}>
                            {pl.name} ({pl.frequency})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Description Snapshot */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Line Description
                      </label>
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(idx, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* Quantity, Unit Price, Tax, and Line Total */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[11px] text-slate-500 mr-1.5">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(idx, 'quantity', parseFloat(e.target.value) || 1)}
                          className="w-16 px-2 py-1 text-xs border border-slate-200 rounded bg-white text-center font-bold"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 mr-1.5">Unit Price:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 text-xs border border-slate-200 rounded bg-white text-right font-bold"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-500 mr-1.5">Tax:</span>
                        <select
                          value={line.taxRate}
                          onChange={(e) => updateLine(idx, 'taxRate', parseFloat(e.target.value))}
                          className="px-2 py-1 text-xs border border-slate-200 rounded bg-white"
                        >
                          <option value="0">0% (Exempt)</option>
                          <option value="0.05">5% GST</option>
                          <option value="0.10">10% Demo Tax</option>
                          <option value="0.18">18% Standard</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Line Subtotal: {formatCurrency(lineSubtotal)}</div>
                        <div className="text-sm font-bold text-slate-900">
                          Total: {formatCurrency(lineTotal)}
                        </div>
                      </div>

                      {lines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quotation Summary Totals Panel */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              * Line items preserve price and tax snapshots when accepted and converted to subscriptions.
            </div>

            <div className="w-64 space-y-2 text-right">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Calculated Tax:</span>
                <span className="font-semibold">{formatCurrency(taxTotal)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Quotation Total:</span>
                <span className="text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/quotations"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Create & Save Quotation
          </button>
        </div>
      </form>
    </div>
  );
}
