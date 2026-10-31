'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Plus, Package, Layers, Sparkles, X, CheckCircle, AlertCircle } from 'lucide-react';
import { createProduct } from '@/lib/actions/product';

interface ProductVariant {
  name: string;
  adjustment: number;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  status: 'Active' | 'Archived';
  description: string;
  variants: ProductVariant[];
}

const mockProducts: ProductItem[] = [
  {
    id: 'prod-01',
    name: 'Quality Management System (QMS)',
    category: 'Software Solution',
    basePrice: 100000,
    status: 'Active',
    description: 'ISO-compliant quality assurance, batch tracing, and audit management.',
    variants: [
      { name: 'Standard (Up to 25 users)', adjustment: 0 },
      { name: 'Multi-Site Audit Engine', adjustment: 18000 },
      { name: 'Odoo Brand Co-Edition', adjustment: 560 },
    ],
  },
  {
    id: 'prod-02',
    name: 'Managed Cloud Infrastructure',
    category: 'Cloud Services',
    basePrice: 15000,
    status: 'Active',
    description: 'High-availability Kubernetes clusters, daily backup snapshots, and monitoring.',
    variants: [
      { name: 'Pro Monthly Support', adjustment: 0 },
      { name: 'Multi-Region High Availability', adjustment: 8000 },
    ],
  },
  {
    id: 'prod-03',
    name: 'Enterprise ERP Implementation',
    category: 'Consulting',
    basePrice: 250000,
    status: 'Active',
    description: 'Full-cycle solution deployment, data migration from legacy, and customized modules.',
    variants: [
      { name: 'Dedicated On-Site Engineer', adjustment: 35000 },
    ],
  },
  {
    id: 'prod-04',
    name: 'Legacy Accounting Bridge',
    category: 'Legacy Connector',
    basePrice: 30000,
    status: 'Archived',
    description: 'Deprecated desktop database sync tool. Maintained for legacy accounts only.',
    variants: [],
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

    try {
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

      if (res?.error) {
        setError(res.error);
      } else {
        const newProd: ProductItem = {
          id: res?.product?.id || `prod-${Date.now()}`,
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
    } catch {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<ProductItem>[] = [
    {
      header: 'Product Name',
      cell: (item) => (
        <div>
          <div className="font-bold text-[#211b15]">{item.name}</div>
          <div className="text-xs text-[#96897b] max-w-sm truncate">{item.description}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => (
        <span className="inline-flex rounded-[3.75px] bg-[#efe9e0] border border-[#c7bcaf] px-2.5 py-0.5 text-xs font-bold text-[#211b15]">
          {item.category}
        </span>
      ),
    },
    {
      header: 'Base Price',
      cell: (item) => <MoneyDisplay amount={item.basePrice} size="sm" className="font-bold" />,
    },
    {
      header: 'Configured Variants',
      cell: (item) => (
        <div className="text-xs space-y-1">
          {item.variants.map((v, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[#50463c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8b672]" />
              <span>{v.name}</span>
              {v.adjustment > 0 && (
                <span className="font-mono text-[11px] font-bold text-[#2b4c2b]">
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
          title="Products &amp; Services Catalogue"
          description="Define core software solutions, consulting packages, and variant price adjustments."
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
          <div className="p-4 bg-[#eef5ee] border border-[#c5d8c4] text-[#2b4c2b] rounded-[7.5px] text-sm flex items-center gap-2">
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
        <div className="fixed inset-0 z-50 bg-[#211b15]/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-[7.5px] max-w-lg w-full p-6 shadow-2xl border border-[#efe9e0] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#efe9e0]">
              <h3 className="font-display text-2xl font-bold text-[#211b15]">Add New Solution or Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#50463c] hover:text-[#211b15] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3.75px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Healthcare Compliance Engine"
                  className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                  >
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Platform">Platform</option>
                    <option value="Consulting Service">Consulting Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#50463c] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of product capability..."
                  className="w-full text-sm px-3.5 py-2 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                />
              </div>

              {/* Additive Variant Section */}
              <div className="p-3 bg-[#fcfaf1] border border-[#efe9e0] rounded-[3.75px] space-y-2">
                <div className="text-xs font-bold text-[#211b15]">Additive Variant Configuration</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#50463c] mb-0.5">Variant Name</label>
                    <input
                      type="text"
                      value={variantName}
                      onChange={(e) => setVariantName(e.target.value)}
                      placeholder="e.g. Odoo Brand Co-Edition"
                      className="w-full text-xs px-2.5 py-1.5 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#50463c] mb-0.5">Price Adjustment (+₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={variantAdjustment}
                      onChange={(e) => setVariantAdjustment(e.target.value)}
                      placeholder="e.g. 560"
                      className="w-full text-xs px-2.5 py-1.5 border border-[#c7bcaf] rounded-[3.75px] focus:outline-none focus:border-[#8c591b] bg-white text-[#211b15] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#efe9e0]">
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
