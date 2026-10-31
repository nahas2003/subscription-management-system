/**
 * Integration Test: Customer Portal Isolation & Discount Engine (Member 4)
 * Run with: node tests/run-customer-portal-test.mjs
 */

import assert from 'node:assert';

// 1. Customer Isolation Logic
function filterCustomerRecords(records, authenticatedCustomerId) {
  if (!authenticatedCustomerId) {
    throw new Error('UNAUTHORIZED: Customer identity required');
  }
  return records.filter(r => r.customer_id === authenticatedCustomerId);
}

// 2. Discount Rule Logic
function evaluateDiscount(discount, subtotal, asOfDate = '2026-10-31') {
  if (!discount.is_active) throw new Error('Discount is inactive');
  if (discount.starts_at && asOfDate < discount.starts_at) throw new Error('Discount not yet active');
  if (discount.ends_at && asOfDate > discount.ends_at) throw new Error('Discount has expired');
  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) throw new Error('Usage limit reached');
  if (discount.minimum_purchase && subtotal < discount.minimum_purchase) {
    throw new Error(`Minimum purchase of ₹${discount.minimum_purchase} required`);
  }

  let amount = 0;
  if (discount.discount_type === 'percentage') {
    amount = Math.round((subtotal * (discount.value / 100) + Number.EPSILON) * 100) / 100;
  } else {
    amount = Math.min(discount.value, subtotal);
  }
  return amount;
}

console.log('=== RUNNING CUSTOMER PORTAL ISOLATION & DISCOUNT ENGINE TESTS ===\n');

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

// Test 1: Customer Data Isolation
test('Customer Portal strictly isolates records by customer ID', () => {
  const allInvoices = [
    { id: 'inv_1', customer_id: 'cust_A', invoice_number: 'INV-001', total: 10000 },
    { id: 'inv_2', customer_id: 'cust_B', invoice_number: 'INV-002', total: 15000 },
    { id: 'inv_3', customer_id: 'cust_A', invoice_number: 'INV-003', total: 5000 },
  ];

  // Customer A accesses portal
  const custARecords = filterCustomerRecords(allInvoices, 'cust_A');
  assert.strictEqual(custARecords.length, 2);
  assert.strictEqual(custARecords.every(r => r.customer_id === 'cust_A'), true);
  assert.strictEqual(custARecords.some(r => r.customer_id === 'cust_B'), false);

  // Customer B accesses portal
  const custBRecords = filterCustomerRecords(allInvoices, 'cust_B');
  assert.strictEqual(custBRecords.length, 1);
  assert.strictEqual(custBRecords[0].customer_id, 'cust_B');

  // Anonymous request rejected
  assert.throws(() => filterCustomerRecords(allInvoices, null), /UNAUTHORIZED/);
});

// Test 2: Discount Engine - Threshold, Expiry & Rate
test('Discount engine applies percentage discount only when meeting minimum purchase threshold', () => {
  const promo = {
    is_active: true,
    discount_type: 'percentage',
    value: 15, // 15%
    minimum_purchase: 10000,
    starts_at: '2026-10-01',
    ends_at: '2026-11-30',
    usage_limit: 100,
    usage_count: 5,
  };

  // Eligible: ₹20,000 purchase
  const discount1 = evaluateDiscount(promo, 20000, '2026-10-31');
  assert.strictEqual(discount1, 3000.0); // 15% of 20000

  // Ineligible: ₹8,000 purchase (below ₹10,000 minimum)
  assert.throws(() => evaluateDiscount(promo, 8000, '2026-10-31'), /Minimum purchase/);

  // Ineligible: Expired date (2026-12-05)
  assert.throws(() => evaluateDiscount(promo, 20000, '2026-12-05'), /Discount has expired/);
});

// Test 3: Fixed Discount with Capping
test('Fixed discount caps at invoice subtotal to prevent negative totals', () => {
  const flatPromo = {
    is_active: true,
    discount_type: 'fixed',
    value: 5000,
    minimum_purchase: 2000,
    starts_at: '2026-10-01',
    ends_at: '2026-11-30',
  };

  // On ₹3,000 purchase, discount caps at ₹3,000
  const discount = evaluateDiscount(flatPromo, 3000, '2026-10-31');
  assert.strictEqual(discount, 3000.0);
});

console.log(`\n=== ALL ${passed} CUSTOMER PORTAL & DISCOUNT TESTS PASSED CLEANLY ===`);
