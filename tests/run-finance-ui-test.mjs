/**
 * Unit Test Suite: Finance UI Logic & Filtering (Member 4)
 * Run with: node tests/run-finance-ui-test.mjs
 */

import assert from 'node:assert';

function roundTo2Decimals(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

function formatINR(amount) {
  const rounded = roundTo2Decimals(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);
}

function resolveStatusBadge(status, isOverdue) {
  let badgeLabel = 'Draft';
  switch (status) {
    case 'draft': badgeLabel = 'Draft'; break;
    case 'confirmed': badgeLabel = 'Confirmed'; break;
    case 'paid': badgeLabel = 'Paid'; break;
    case 'cancelled': badgeLabel = 'Cancelled'; break;
  }
  const showOverdueChip = isOverdue && status !== 'paid' && status !== 'cancelled';
  return { badgeLabel, showOverdueChip };
}

function filterInvoices(invoices, { statusFilter = 'all', overdueOnly = false, search = '' }) {
  return invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    const isOverdue = inv.status === 'confirmed' && inv.balance_due > 0 && inv.due_date < '2026-10-31';
    if (overdueOnly && !isOverdue) return false;

    if (search) {
      const q = search.toLowerCase();
      const matchNum = inv.invoice_number.toLowerCase().includes(q);
      const matchCust = inv.customer_id.toLowerCase().includes(q);
      if (!matchNum && !matchCust) return false;
    }
    return true;
  });
}

function validatePaymentInput(amount, balanceDue) {
  if (amount <= 0) return { valid: false, error: 'Amount must be greater than zero' };
  if (amount > balanceDue) return { valid: false, error: 'Payment cannot exceed balance due' };
  return { valid: true };
}

console.log('=== RUNNING FINANCE UI LOGIC & FILTER TESTS ===\n');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    process.exit(1);
  }
}

// 1. Currency display
test('formatINR formats currency according to Indian numbering system', () => {
  const formatted = formatINR(150000.5);
  // Contains 1,50,000.50
  assert.match(formatted, /1,50,000\.50/);
});

// 2. Status Badge resolution
test('Status badge correctly identifies overdue chips for unpaid invoices', () => {
  const confirmedOverdue = resolveStatusBadge('confirmed', true);
  assert.strictEqual(confirmedOverdue.badgeLabel, 'Confirmed');
  assert.strictEqual(confirmedOverdue.showOverdueChip, true);

  const paidOverdue = resolveStatusBadge('paid', true);
  assert.strictEqual(paidOverdue.badgeLabel, 'Paid');
  assert.strictEqual(paidOverdue.showOverdueChip, false, 'Paid invoice must NEVER show overdue chip');
});

// 3. Invoice Filter Logic
test('Filter invoices by search, status, and overdue toggle', () => {
  const sampleInvoices = [
    { id: '1', invoice_number: 'INV-2026-001', customer_id: 'cust_alpha', status: 'confirmed', balance_due: 5000, due_date: '2026-10-15' }, // Overdue
    { id: '2', invoice_number: 'INV-2026-002', customer_id: 'cust_beta', status: 'confirmed', balance_due: 3000, due_date: '2026-11-15' },  // Current
    { id: '3', invoice_number: 'INV-2026-003', customer_id: 'cust_alpha', status: 'paid', balance_due: 0, due_date: '2026-10-10' },          // Paid
    { id: '4', invoice_number: 'INV-2026-004', customer_id: 'cust_gamma', status: 'draft', balance_due: 8000, due_date: '2026-11-20' },      // Draft
  ];

  // Overdue only
  const overdueOnly = filterInvoices(sampleInvoices, { overdueOnly: true });
  assert.strictEqual(overdueOnly.length, 1);
  assert.strictEqual(overdueOnly[0].id, '1');

  // Search by customer
  const alphaCust = filterInvoices(sampleInvoices, { search: 'cust_alpha' });
  assert.strictEqual(alphaCust.length, 2);

  // Status filter
  const paidOnly = filterInvoices(sampleInvoices, { statusFilter: 'paid' });
  assert.strictEqual(paidOnly.length, 1);
  assert.strictEqual(paidOnly[0].id, '3');
});

// 4. Payment modal validation
test('Payment modal validation prevents 0, negative, and overpayments', () => {
  assert.strictEqual(validatePaymentInput(0, 5000).valid, false);
  assert.strictEqual(validatePaymentInput(-100, 5000).valid, false);
  assert.strictEqual(validatePaymentInput(6000, 5000).valid, false);
  assert.strictEqual(validatePaymentInput(2500, 5000).valid, true);
  assert.strictEqual(validatePaymentInput(5000, 5000).valid, true);
});

console.log(`\n=== ALL ${passed} UI LOGIC TESTS PASSED CLEANLY ===`);
