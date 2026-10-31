'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Package, Layers, Sparkles, X, CheckCircle, AlertCircle } from 'lucide-react';
import { createProduct } from '@/lib/actions/product';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  variants: {
    name: string;
    adjustment: number;
  }[];
  status: 'Active' | 'Draft';
  description: string;
}

const mockProducts: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'Quality Management System',
    category: 'Enterprise Software',
    basePrice: 100000,
    variants: [
      { name: 'Standard (Up to 25 users)', adjustment: 0 },
      { name: 'Multi-Site Audit Engine', adjustment: 18000 },
      { name: 'Odoo Brand Co-Edition', adjustment: 560 },
    ],
    status: 'Active',
    description: 'ISO-compliant quality management system with automated workflows and compliance auditing.',
  },
  {
    id: 'prod-02',
    name: 'Managed Cloud Infrastructure',
    category: 'Cloud Services',
    basePrice: 15000,
    variants: [
      { name: 'Standard 99.5% SLA', adjustment: 0 },
      { name: '24/7 Dedicated Support', adjustment: 5600 },
      { name: 'Custom VPC Tunneling', adjustment: 560 }, // Reference from brief
    ],
    status: 'Active',
    description: 'Production container clusters with automated backups, VPC peering, and monitoring.',
  },
  {
    id: 'prod-03',
    name: 'Event Management System',
    category: 'Platform',
    basePrice: 8500,
    variants: [
      { name: 'Single Event Pass', adjustment: 0 },
      { name: 'Multi-Track Live Streaming', adjustment: 3500 },
    ],
    status: 'Active',
    description: 'Ticketing, attendee badging, and stage agenda management for tech summits.',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Enterprise Software');
  const [basePrice, setBasePrice] = useState('50000');
  const [description, setDescription] = useState('');
  const [variantName, setVariantName] = useState('');
  const [variantAdjustment, setVariantAdjustment] = useState('0');

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('basePrice', basePrice);
    formData.append('description', description);
    if (variantName.trim()) {
      formData.append('variantName', variantName);
      formData.append('variantAdjustment', variantAdjustment);
    }

    const res = await createProduct(formData);
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      const newProd: ProductItem = {
        id: res.product?.id || `prod-${Date.now()}`,
        name: name,
        category: category,
        basePrice: parseFloat(basePrice) || 0,
        variants: variantName.trim()
          ? [{ name: variantName, adjustment: parseFloat(variantAdjustment) || 0 }]
          : [{ name: 'Standard Edition', adjustment: 0 }],
        status: 'Active',
        description: description,
      };

      setProducts([newProd, ...products]);
      setSuccess(`Product "${name}" added successfully.`);
      setIsModalOpen(false);

      // Reset form
      setName('');
      setDescription('');
      setVariantName('');
      setVariantAdjustment('0');
    }
  };

  const columns: Column<ProductItem>[] = [
    {
      header: 'Product Name',
      cell: (item) => (
        <div>
          <div className="font-semibold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-500 max-w-sm truncate">{item.description}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {item.category}
        </span>
      ),
    },
    {
      header: 'Base Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-semibold" />,
    },
    {
      header: 'Configured Variants',
      cell: (item) => (
        <div className="text-xs space-y-1">
          {item.variants.map((v, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>{v.name}</span>
              {v.adjustment > 0 && (
                <span className="font-mono text-[11px] font-semibold text-emerald-700">
                  (+<MoneyDisplay amount={v.adjustment} size="sm" />)
                </span>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ];

  return (
    <AppShell
      role="admin"
      currentPath="/admin/products"
      user={{ name: 'System Admin', email: 'admin@brightloop.in', role: 'admin' }}
      title="Product Catalogue"
    >
      <div className="space-y-6">
        <PageHeader
          title="Products & Services Catalogue"
          description="Define core software solutions, consulting packages, and variant price adjustments (Task M3-02)."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              New Product
            </Button>
          }
        />

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(item) => item.id}
        />
      </div>

      {/* Modal Dialog for New Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Solution or Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Healthcare Compliance Engine"
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Platform">Platform</option>
                    <option value="Consulting Service">Consulting Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of product capability..."
                  className="w-full text-sm px-3.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Additive Variant Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-800">Additive Variant Configuration</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Variant Name</label>
                    <input
                      type="text"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="e.g. Odoo Brand Co-Edition"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Price Adjustment (+₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={variantAdjustment}
                      onChange={(e) => setVariantAdjustment(e.target.value)}
                      placeholder="e.g. 560"
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
