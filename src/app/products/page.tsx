'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Tag,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { DateDisplay } from '@/components/ui/DateDisplay';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/store';
import { ProductWithVariants } from '@/types/domain';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithVariants[]>(store.getProducts());
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [productType, setProductType] = useState('Software Product');
  const [salesPrice, setSalesPrice] = useState('499');
  const [costPrice, setCostPrice] = useState('150');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [variants, setVariants] = useState<{ name: string; price_adjustment: number }[]>([
    { name: 'Standard Edition', price_adjustment: 0 },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addVariantField = () => {
    setVariants([...variants, { name: '', price_adjustment: 0 }]);
  };

  const removeVariantField = (idx: number) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: 'name' | 'price_adjustment', value: any) => {
    const updated = [...variants];
    if (field === 'price_adjustment') {
      updated[idx].price_adjustment = parseFloat(value) || 0;
    } else {
      updated[idx].name = value;
    }
    setVariants(updated);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!name.trim()) throw new Error('Product name is required.');
      const parsedSalesPrice = parseFloat(salesPrice);
      if (isNaN(parsedSalesPrice) || parsedSalesPrice < 0) {
        throw new Error('Sales price must be a valid non-negative number.');
      }

      const parsedCostPrice = costPrice.trim() ? parseFloat(costPrice) : null;

      const validVariants = variants
        .filter((v) => v.name.trim().length > 0)
        .map((v) => ({ name: v.name.trim(), price_adjustment: v.price_adjustment }));

      const newProd = store.createProduct(
        {
          name: name.trim(),
          product_type: productType,
          sales_price: parsedSalesPrice,
          cost_price: parsedCostPrice,
          description: description.trim() || null,
          notes: notes.trim() || null,
        },
        validVariants
      );

      setProducts(store.getProducts());
      setSuccess(`Product "${newProd.name}" with ${newProd.variants.length} variant(s) created successfully!`);
      setName('');
      setDescription('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  const totalProducts = products.length;
  const totalVariants = products.reduce((sum, p) => sum + p.variants.length, 0);
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.sales_price, 0) / totalProducts : 0;

  return (
    <AppShell
      role="admin"
      currentPath="/products"
      user={{ name: 'Catalogue Manager', email: 'catalog@brightloop.in', role: 'admin' }}
      title="Products &amp; Variants"
    >
      <div className="space-y-6">
        <PageHeader
          title="Products &amp; Variants Catalog"
          description="Manage subscription products, service offerings, and brand edition variants with dynamic price adjustments (Task M3-02)."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowModal(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Product &amp; Variants
            </Button>
          }
        />

        {/* Top KPI Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Catalog Items"
            value={totalProducts}
            subtitle="Base subscription software & services"
            icon={<Package className="h-5 w-5 text-indigo-600" />}
          />
          <StatCard
            title="Total Variants"
            value={totalVariants}
            subtitle="Configured add-ons and brand tiers"
            icon={<Tag className="h-5 w-5 text-purple-600" />}
          />
          <StatCard
            title="Average Base Price"
            value={<MoneyDisplay amount={avgPrice} size="lg" className="font-bold text-slate-900" />}
            subtitle="Standard non-adjusted base price"
            icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Single-Company Catalog"
            value="BrightLoop"
            subtitle="Single unified merchant entity"
            icon={<Layers className="h-5 w-5 text-emerald-600" />}
          />
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 shadow-xs font-medium">
            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Variant Pricing Rule Callout */}
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-900 shadow-xs">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Variant Pricing Rule:</span> Selecting a product variant dynamically adds its price adjustment to the base sales price. For example, selecting the{' '}
            <strong>Odoo Brand Co-Edition</strong> variant on QMS adds <strong>+₹560</strong> to base price (₹499 + ₹560 = <strong>₹1,059</strong>).
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider mb-2">
                      {prod.product_type}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900">{prod.name}</h2>
                    {prod.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{prod.description}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <MoneyDisplay amount={prod.sales_price} size="lg" className="font-bold text-slate-900" />
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Base Sales Price</div>
                    {prod.cost_price !== null && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Cost: {formatCurrency(prod.cost_price)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Variants Section */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Configured Brand Variants ({prod.variants.length})</span>
                  </div>

                  {prod.variants.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No variants configured (Base tier only).</div>
                  ) : (
                    <div className="space-y-2">
                      {prod.variants.map((v) => {
                        const effectivePrice = prod.sales_price + v.price_adjustment;
                        return (
                          <div
                            key={v.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 text-xs"
                          >
                            <span className="font-medium text-slate-800">{v.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-mono">
                                {v.price_adjustment >= 0 ? `+${formatCurrency(v.price_adjustment)}` : formatCurrency(v.price_adjustment)}
                              </span>
                              <span className="font-bold text-indigo-700 bg-white px-2.5 py-1 rounded border border-indigo-100 shadow-xs">
                                Total: {formatCurrency(effectivePrice)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Status: <strong className="text-emerald-700 font-semibold">Active</strong>
                </span>
                <span>Updated: {formatDate(prod.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Add Product &amp; Variants</h2>
              <p className="text-xs text-slate-500 mb-4">
                Configure product details, base sales price, and associated brand/feature variants in INR.
              </p>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Quality Management System (QMS)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Type
                    </label>
                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Software Product">Software Product</option>
                      <option value="Software Platform">Software Platform</option>
                      <option value="Development Service">Development Service</option>
                      <option value="Cloud Service">Cloud Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      required
                      value={salesPrice}
                      onChange={(e) => setSalesPrice(e.target.value)}
                      placeholder="499"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Cost Price (₹)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      placeholder="150"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key features and capabilities..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Variants Configuration Section */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Product Variants &amp; Price Adjustments
                    </label>
                    <button
                      type="button"
                      onClick={addVariantField}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Variant
                    </button>
                  </div>

                  <div className="space-y-2">
                    {variants.map((v, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Variant Name (e.g. Odoo Brand Co-Edition)"
                          value={v.name}
                          onChange={(e) => updateVariant(i, 'name', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400 font-mono">+₹</span>
                          <input
                            type="number"
                            step="1"
                            placeholder="Adj Amount"
                            value={v.price_adjustment}
                            onChange={(e) => updateVariant(i, 'price_adjustment', e.target.value)}
                            className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                          />
                        </div>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariantField(i)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Product
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
