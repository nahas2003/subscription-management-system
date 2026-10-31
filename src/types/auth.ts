export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  gstin?: string;
  phone?: string;
}

export interface RoleFeatureVisibility {
  role: UserRole;
  title: string;
  tagline: string;
  badge: string;
  portalPath: string;
  permissionsDescription: string;
  canAccess: string[];
  cannotAccess: string[];
  sampleKpis: {
    label: string;
    value: string;
    sub: string;
  }[];
}

export const ROLE_VISIBILITY_DATA: Record<UserRole, RoleFeatureVisibility> = {
  admin: {
    role: 'admin',
    title: 'Administrator View',
    tagline: 'Executive Control & Company Financial Governance',
    badge: 'Full Platform Clearance',
    portalPath: '/admin/dashboard',
    permissionsDescription:
      'Complete authority over single-company financial settings, recurring billing automation, catalogue configuration, and team permissions.',
    canAccess: [
      'Master product & subscription plan catalogue configuration',
      'Idempotent recurring billing engine trigger & audit logs',
      'Fiscal reconciliation statements, GSTR-1 CSV exports, and MRR tracking',
      'Staff account provisioning and administrative role allocation',
      'Global discount and promotional coupon rule creation',
      'Full cross-customer account directory and subscription lifecycles',
    ],
    cannotAccess: [
      'Zero platform restrictions — Full executive clearance',
    ],
    sampleKpis: [
      { label: 'Total MRR Contracted', value: '₹2,98,000', sub: '+12% this quarter' },
      { label: 'Active Subscriptions', value: '18', sub: 'Across 4 business clients' },
      { label: 'Collection Efficiency', value: '89.2%', sub: 'Reconciled YTD' },
      { label: 'Pending Collections', value: '₹53,100', sub: '2 unpaid invoices' },
    ],
  },
  staff: {
    role: 'staff',
    title: 'Operations Staff View',
    tagline: 'Sales Operations, Order Confirmation & Payment Desk',
    badge: 'Operations Desk Access',
    portalPath: '/staff/dashboard',
    permissionsDescription:
      'Execution-level workspace designed for customer service agents and billing coordinators to process sales quotations, confirm active orders, and record manual payment settlements.',
    canAccess: [
      'Draft sales quotations with automated 18% GST calculation',
      'Confirm customer orders to transition quotations into active subscriptions',
      'Record verified manual NEFT, RTGS, and cheque payments against invoices',
      'Customer communications queue and account contact records',
      'Real-time overdue invoice monitoring and collection reminders',
    ],
    cannotAccess: [
      'Cannot modify master product prices, plans, or discount thresholds',
      'Cannot execute batch automated billing jobs (Admin only)',
      'Cannot invite or modify other staff credentials or roles',
      'Cannot alter company-wide tax rates or bank master configuration',
    ],
    sampleKpis: [
      { label: 'Quotations in Queue', value: '2', sub: '1 draft, 1 confirmed' },
      { label: 'Pending Payment Verification', value: '₹53,100', sub: 'Manual bank allocations' },
      { label: 'Assigned Customer Accounts', value: '4', sub: 'Active relationships' },
      { label: 'Overdue Reminders Due', value: '1', sub: 'Malabar Retailers Ltd' },
    ],
  },
  customer: {
    role: 'customer',
    title: 'Customer Self-Service View',
    tagline: 'Strictly Isolated Client Portal for Invoices & Renewals',
    badge: 'Isolated Customer Privacy',
    portalPath: '/portal',
    permissionsDescription:
      'Isolated, high-trust self-service environment. Customers exclusively see their own company contracts, 18% GST compliant tax statements, and verified receipt records with zero access to other tenants or internal margins.',
    canAccess: [
      'Strictly isolated view of own active and historical subscriptions',
      'Upcoming renewal schedules, billing frequencies, and service tiers',
      'Complete 18% GST tax invoice statements with CGST/SGST line breakdown',
      'Downloadable itemized PDF / print statement view',
      'Payment allocation history and real-time outstanding balance',
      'Company profile self-management (billing email, GSTIN, registered address)',
    ],
    cannotAccess: [
      'Strictly barred from seeing any other business accounts or clients',
      'Cannot view internal cost structures, staff notes, or admin tools',
      'Cannot access platform configuration, catalogue edits, or reports',
    ],
    sampleKpis: [
      { label: 'My Active Services', value: '2', sub: 'Enterprise QMS & Cloud' },
      { label: 'Next Renewal Date', value: '01 Nov', sub: 'Pro Monthly Support' },
      { label: 'Current Balance Due', value: '₹17,700', sub: 'Invoice INV-2026-0042' },
      { label: 'GST Input Credit Available', value: '₹2,700', sub: 'Eligible on current invoice' },
    ],
  },
};
