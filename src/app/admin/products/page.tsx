'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Plus, Package, Layers, Sparkles } from 'lucide-react';

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
          description="Define core software solutions, consulting packages, and variant price adjustments."
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Product
            </Button>
          }
        />

        <DataTable
          columns={columns}
          data={mockProducts}
          keyExtractor={(item) => item.id}
        />
      </div>
    </AppShell>
  );
}
