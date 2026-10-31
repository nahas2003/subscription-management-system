'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  status: 'Active' | 'Closed';
  variants: { name: string; adjustment: number }[];
  description: string;
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
      { name: 'Standard (up to 50 seats)', adjustment: 0 },
      { name: 'Enterprise (unlimited seats)', adjustment: 50000 },
    ],
  },
  {
    id: 'prod-02',
    name: 'Managed Cloud Infrastructure',
    category: 'Cloud Services',
    basePrice: 15000,
    status: 'Active',
    description: 'Dedicated Kubernetes nodes, Postgres multi-AZ replica, daily snapshots.',
    variants: [
      { name: 'Single AZ Support', adjustment: 0 },
      { name: 'Multi-AZ High Availability', adjustment: 10000 },
    ],
  },
  {
    id: 'prod-03',
    name: 'Fleet Tracker & Subscriptions',
    category: 'IoT & Telematics',
    basePrice: 20000,
    status: 'Active',
    description: 'GPS telemetry, fuel sensor integration, and automated dispatch routing.',
    variants: [
      { name: 'Basic Telemetry', adjustment: 0 },
      { name: 'Full Telematics & Fuel', adjustment: 4000 },
    ],
  },
  {
    id: 'prod-04',
    name: 'E-Commerce Subscription API',
    category: 'Developer APIs',
    basePrice: 8000,
    status: 'Active',
    description: 'Webhooks, checkout elements, payment gateway orchestration, and billing sync.',
    variants: [
      { name: 'Tier 1 (10,000 req/mo)', adjustment: 0 },
      { name: 'Tier 2 (100,000 req/mo)', adjustment: 7000 },
    ],
  },
];

export default function ProductsPage() {
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
