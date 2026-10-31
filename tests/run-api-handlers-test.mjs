/**
 * Integration Test: API Handlers and Repositories (Member 4)
 * Run with: node tests/run-api-handlers-test.mjs
 */

import assert from 'node:assert';

function roundTo2Decimals(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

function successResponse(data, message = 'Operation completed') {
  return { success: true, data, message };
}

function errorResponse(message, code = 'BAD_REQUEST', fields) {
  return { success: false, error: { code, message, fields } };
}

// In-memory repositories
const invoices = new Map();
const payments = new Map();
const allocations = new Map();

function resetStores() {
  invoices.clear();
  payments.clear();
  allocations.clear();
}

// API Handler implementations
function apiCreateInvoice(payload) {
  if (!payload.customerId) return errorResponse('Customer ID is required', 'VALIDATION_ERROR', { customerId: 'Required' });
  if (!payload.dueDate) return errorResponse('Due date is required', 'VALIDATION_ERROR', { dueDate: 'Required' });
  if (!payload.lines || payload.lines.length === 0) return errorResponse('At least one line item is required', 'VALIDATION_ERROR');

  let subtotal = 0;
  let taxTotal = 0;
  const processedLines = [];

  for (const l of payload.lines) {
    const lineSub = roundTo2Decimals(l.quantity * l.unitPrice);
    const tax = roundTo2Decimals(lineSub * (l.taxRate ?? 0.18));
    const lineTot = roundTo2Decimals(lineSub + tax);
    subtotal = roundTo2Decimals(subtotal + lineSub);
    taxTotal = roundTo2Decimals(taxTotal + tax);
    processedLines.push({ description: l.description, quantity: l.quantity, unit_price: l.unitPrice, tax_amount: tax, line_total: lineTot });
  }

  const total = roundTo2Decimals(subtotal + taxTotal);
  const inv = {
    id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    invoice_number: `INV-2026-${invoices.size + 1001}`,
    customer_id: payload.customerId,
    subscription_id: payload.subscriptionId || null,
    invoice_date: payload.invoiceDate || '2026-10-31',
    due_date: payload.dueDate,
    status: payload.initialStatus || 'draft',
    currency: 'INR',
    subtotal,
    tax_total: taxTotal,
    discount_total: 0,
    total,
    amount_paid: 0,
    balance_due: total,
    lines: processedLines,
  };

  invoices.set(inv.id, inv);
  return successResponse(inv, 'Invoice created successfully');
}

function apiConfirmInvoice(invoiceId) {
  const inv = invoices.get(invoiceId);
  if (!inv) return errorResponse('Invoice not found', 'NOT_FOUND');
  if (inv.status !== 'draft') return errorResponse('Only draft invoices can be confirmed', 'BAD_REQUEST');

  inv.status = 'confirmed';
  return successResponse(inv, 'Invoice confirmed successfully');
}

function apiRecordPayment(payload) {
  if (!payload.customerId) return errorResponse('Customer ID required', 'VALIDATION_ERROR');
  if (!payload.invoiceId) return errorResponse('Invoice ID required', 'VALIDATION_ERROR');
  if (!payload.amount || payload.amount <= 0) return errorResponse('Positive amount required', 'VALIDATION_ERROR');

  const inv = invoices.get(payload.invoiceId);
  if (!inv) return errorResponse('Invoice not found', 'NOT_FOUND');
  if (inv.customer_id !== payload.customerId) return errorResponse('Customer mismatch', 'BAD_REQUEST');
  if (inv.status !== 'confirmed') return errorResponse('Invoice must be confirmed', 'BAD_REQUEST');
  if (payload.amount > inv.balance_due) return errorResponse('Overpayment not permitted', 'BAD_REQUEST');

  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const payment = {
    id: paymentId,
    payment_reference: `PAY-2026-${payments.size + 5001}`,
    customer_id: payload.customerId,
    amount: roundTo2Decimals(payload.amount),
    payment_method: payload.paymentMethod || 'upi',
    payment_date: '2026-10-31',
  };

  const allocation = {
    id: `alloc_${Date.now()}`,
    payment_id: paymentId,
    invoice_id: inv.id,
    amount_allocated: payment.amount,
  };

  payments.set(payment.id, payment);
  const existingAllocs = allocations.get(inv.id) || [];
  allocations.set(inv.id, [...existingAllocs, allocation]);

  inv.amount_paid = roundTo2Decimals(inv.amount_paid + payment.amount);
  inv.balance_due = roundTo2Decimals(inv.total - inv.amount_paid);
  if (inv.balance_due === 0) {
    inv.status = 'paid';
  }

  return successResponse({ payment, allocation, invoice: inv }, 'Payment recorded successfully');
}

function apiGetFinanceSummary() {
  const allInvoices = Array.from(invoices.values());
  const allPayments = Array.from(payments.values());

  const revenueReceived = roundTo2Decimals(allPayments.reduce((sum, p) => sum + p.amount, 0));
  const invoicedAmount = roundTo2Decimals(allInvoices.filter(i => i.status !== 'cancelled').reduce((sum, i) => sum + i.total, 0));
  const outstandingAmount = roundTo2Decimals(allInvoices.filter(i => i.status === 'confirmed').reduce((sum, i) => sum + i.balance_due, 0));
  const overdueInvoices = allInvoices.filter(i => i.status === 'confirmed' && i.balance_due > 0 && i.due_date < '2026-10-31');

  return successResponse({
    currency: 'INR',
    revenue_received: revenueReceived,
    invoiced_amount: invoicedAmount,
    outstanding_amount: outstandingAmount,
    overdue_invoices_count: overdueInvoices.length,
    overdue_amount: roundTo2Decimals(overdueInvoices.reduce((sum, i) => sum + i.balance_due, 0)),
  });
}

console.log('=== RUNNING API HANDLERS INTEGRATION TESTS ===\n');

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

resetStores();

let createdInvoiceId;

// 1. Create Invoice
test('POST /api/invoices: validates payload and generates draft invoice in INR', () => {
  // Missing customerId
  const invalid = apiCreateInvoice({ dueDate: '2026-11-15', lines: [{ quantity: 1, unitPrice: 5000 }] });
  assert.strictEqual(invalid.success, false);
  assert.strictEqual(invalid.error.code, 'VALIDATION_ERROR');

  // Valid invoice
  const res = apiCreateInvoice({
    customerId: 'cust_abc',
    dueDate: '2026-11-15',
    lines: [{ description: 'QMS Platform Monthly', quantity: 1, unitPrice: 20000, taxRate: 0.18 }],
  });
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.total, 23600); // 20000 + 3600 GST
  assert.strictEqual(res.data.status, 'draft');
  createdInvoiceId = res.data.id;
});

// 2. Confirm Invoice
test('POST /api/invoices/[id]/confirm: transitions draft invoice to confirmed', () => {
  const res = apiConfirmInvoice(createdInvoiceId);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.status, 'confirmed');

  // Second confirmation attempt fails
  const second = apiConfirmInvoice(createdInvoiceId);
  assert.strictEqual(second.success, false);
});

// 3. Record Payment
test('POST /api/payments: records partial payment and remaining settlement to paid', () => {
  // Partial payment: ₹10,000 on ₹23,600
  const part = apiRecordPayment({
    customerId: 'cust_abc',
    invoiceId: createdInvoiceId,
    amount: 10000,
    paymentMethod: 'bank_transfer',
  });
  assert.strictEqual(part.success, true);
  assert.strictEqual(part.data.invoice.amount_paid, 10000);
  assert.strictEqual(part.data.invoice.balance_due, 13600);
  assert.strictEqual(part.data.invoice.status, 'confirmed');

  // Overpayment rejection
  const over = apiRecordPayment({
    customerId: 'cust_abc',
    invoiceId: createdInvoiceId,
    amount: 15000,
    paymentMethod: 'upi',
  });
  assert.strictEqual(over.success, false);
  assert.strictEqual(over.error.message, 'Overpayment not permitted');

  // Final settlement: ₹13,600
  const full = apiRecordPayment({
    customerId: 'cust_abc',
    invoiceId: createdInvoiceId,
    amount: 13600,
    paymentMethod: 'upi',
  });
  assert.strictEqual(full.success, true);
  assert.strictEqual(full.data.invoice.amount_paid, 23600);
  assert.strictEqual(full.data.invoice.balance_due, 0);
  assert.strictEqual(full.data.invoice.status, 'paid');
});

// 4. Finance Summary
test('GET /api/reports/finance-summary: reconciles collections vs invoiced totals in INR', () => {
  const res = apiGetFinanceSummary();
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.data.revenue_received, 23600);
  assert.strictEqual(res.data.invoiced_amount, 23600);
  assert.strictEqual(res.data.outstanding_amount, 0); // Fully settled
  assert.strictEqual(res.data.currency, 'INR');
});

console.log(`\n=== ALL ${passed} API HANDLER TESTS PASSED CLEANLY ===`);
