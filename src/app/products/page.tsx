'use client';

import React, { useState } from 'react';
import { Package, Plus, Trash2, CheckCircle, AlertCircle, Tag, Info } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
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

      // Filter valid variants
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
      setNotes('');
      setVariants([{ name: 'Standard Edition', price_adjustment: 0 }]);
      setShowModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Product Variants"
        description="Configure catalogue software products, pricing, and variant adjustments (Task M3-02)."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        }
      />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Note about Variant Pricing from Problem Statement */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-900">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Variant Pricing Rule:</span> Selecting a product variant dynamically applies its
          additive price adjustment to the base sales price. For example, selecting the{' '}
          <strong>Odoo Brand Co-Edition</strong> variant on QMS adds <strong>+$560.00</strong> to the base price ($499 +
          $560 = <strong>$1,059.00</strong>).
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 uppercase tracking-wider mb-1.5">
                    {prod.product_type}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">{prod.name}</h2>
                  {prod.description && <p className="text-xs text-slate-500 mt-1">{prod.description}</p>}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">{formatCurrency(prod.sales_price)}</div>
                  <div className="text-[11px] text-slate-400">Base Sales Price</div>
                  {prod.cost_price !== null && (
                    <div className="text-[11px] text-slate-400">Cost: {formatCurrency(prod.cost_price)}</div>
                  )}
                </div>
              </div>

              {/* Variants Section */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Available Variants ({prod.variants.length})</span>
                </div>

                {prod.variants.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No variants configured (Base item only).</div>
                ) : (
                  <div className="space-y-1.5">
                    {prod.variants.map((v) => {
                      const effectivePrice = prod.sales_price + v.price_adjustment;
                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                        >
                          <span className="font-medium text-slate-800">{v.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">
                              {v.price_adjustment >= 0 ? `+${formatCurrency(v.price_adjustment)}` : formatCurrency(v.price_adjustment)}
                            </span>
                            <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
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

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: <strong className="text-emerald-600 font-semibold">Active</strong></span>
              <span>Updated: {formatDate(prod.updated_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Add Product & Variants</h2>
            <p className="text-xs text-slate-500 mb-4">
              Configure product details, base sales price, and associated brand/feature variants.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Quality Management System (QMS)"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Software Product">Software Product</option>
                    <option value="Software Platform">Software Platform</option>
                    <option value="Development Service">Development Service</option>
                    <option value="Cloud Service">Cloud Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Base Sales Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
                    placeholder="499.00"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Cost Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="150.00"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
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
                  <label className="block text-xs font-semibold text-slate-800 uppercase">
                    Product Variants & Price Adjustments
                  </label>
                  <button
                    type="button"
                    onClick={addVariantField}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
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
                        <span className="text-xs text-slate-400 font-mono">+$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price Adjustment"
                          value={v.price_adjustment}
                          onChange={(e) => updateVariant(i, 'price_adjustment', e.target.value)}
                          className="w-24 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantField(i)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
