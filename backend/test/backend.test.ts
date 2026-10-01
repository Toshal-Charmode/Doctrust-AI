import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from '../src/app.js';
import { initDb } from '../src/config/database.js';
import { runMigrations, query } from '../src/db/index.js';
import discrepancyService from '../src/services/validation/discrepancy.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('🧪 Starting DocuTrust AI Backend Test Suite...\n');

  // 1. Initialize DB and migrations
  console.log('▶ [1/12] Initializing Test Database and Migrations...');
  await initDb();
  await runMigrations();
  console.log('✅ Database and schema initialized successfully.\n');

  // Start temporary HTTP server for testing
  const app = createApp();
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  let user1Token = '';
  let user1Id = '';
  let user2Token = '';
  let user2Id = '';
  let poDocId = '';
  let invDocId = '';
  let drDocId = '';
  let mismatchInvDocId = '';

  try {
    // 2. Unit Testing Deterministic Discrepancy Service
    console.log('▶ [2/12] Testing Deterministic Discrepancy & Validation Logic...');

    // Test: Matching PO and Invoice
    const matchingDocs = [
      {
        id: 'po-1',
        filename: 'PO_1024.pdf',
        documentType: 'PURCHASE_ORDER',
        fields: {
          vendorName: 'Acme Industrial Supplies Inc.',
          documentNumber: 'PO-1024',
          total: 50000.0,
          totalQuantity: 100,
          currency: 'USD',
          documentDate: '2026-09-10',
          lineItems: [{ description: 'Ball Bearings', quantity: 100, unitPrice: 500, total: 50000 }],
        },
      },
      {
        id: 'inv-1',
        filename: 'INV_2024_001.pdf',
        documentType: 'INVOICE',
        fields: {
          vendorName: 'Acme Industrial Supplies Inc.',
          poNumber: 'PO-1024',
          documentNumber: 'INV-2024-001',
          total: 50000.0,
          totalQuantity: 100,
          currency: 'USD',
          documentDate: '2026-09-18',
          lineItems: [{ description: 'Ball Bearings', quantity: 100, unitPrice: 500, total: 50000 }],
        },
      },
    ];

    const vendorMatch = discrepancyService.compareVendors(matchingDocs);
    assert.strictEqual(vendorMatch.status, 'MATCH');

    const poMatch = discrepancyService.comparePoNumbers(matchingDocs);
    assert.strictEqual(poMatch.status, 'MATCH');

    const totalMatch = discrepancyService.compareTotals(matchingDocs);
    assert.strictEqual(totalMatch.status, 'MATCH');
    assert.strictEqual(totalMatch.difference, 0);

    const qtyMatches = discrepancyService.compareQuantities(matchingDocs);
    assert.strictEqual(qtyMatches[0].status, 'MATCH');

    // Test: Quantity Mismatch & Amount Mismatch
    const mismatchDocs = [
      matchingDocs[0],
      {
        id: 'inv-mismatch',
        filename: 'INV_9042_Mismatch.pdf',
        documentType: 'INVOICE',
        fields: {
          vendorName: 'Acme Industrial Supplies Inc.',
          poNumber: 'PO-1024',
          documentNumber: 'INV-9042',
          total: 55000.0, // $5,000 over
          totalQuantity: 110, // 10 units over
          currency: 'USD',
          documentDate: '2026-09-18',
          lineItems: [{ description: 'Ball Bearings', quantity: 110, unitPrice: 500, total: 55000 }],
        },
      },
    ];

    const totalMismatch = discrepancyService.compareTotals(mismatchDocs);
    assert.strictEqual(totalMismatch.status, 'MISMATCH');
    assert.strictEqual(totalMismatch.difference, 5000);
    assert.strictEqual(totalMismatch.severity, 'HIGH');

    const qtyMismatch = discrepancyService.compareQuantities(mismatchDocs);
    assert.strictEqual(qtyMismatch[0].status, 'MISMATCH');
    assert.strictEqual(qtyMismatch[0].difference, 10);
    assert.strictEqual(qtyMismatch[0].severity, 'HIGH');

    console.log('✅ Unit tests for discrepancy calculations passed.\n');

    // 3. Health Check
    console.log('▶ [3/12] Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthJson = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthJson.success, true);
    assert.strictEqual(healthJson.data.status, 'healthy');
    console.log('✅ Health check passed.\n');

    // 4. User Registration
    console.log('▶ [4/12] Testing POST /api/auth/register...');
    const uniqueEmail1 = `auditor_${Date.now()}@example.com`;
    const regRes1 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: uniqueEmail1,
        password: 'password123',
      }),
    });
    const regJson1 = await regRes1.json();
    assert.strictEqual(regRes1.status, 201);
    assert.strictEqual(regJson1.success, true);
    assert.ok(regJson1.data.token);
    assert.ok(regJson1.data.user.id);
    assert.strictEqual(regJson1.data.user.email, uniqueEmail1);
    user1Token = regJson1.data.token;
    user1Id = regJson1.data.user.id;

    // Register User 2 for isolation testing
    const uniqueEmail2 = `hacker_${Date.now()}@example.com`;
    const regRes2 = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Vance',
        email: uniqueEmail2,
        password: 'password123',
      }),
    });
    const regJson2 = await regRes2.json();
    user2Token = regJson2.data.token;
    user2Id = regJson2.data.user.id;
    console.log('✅ User registration passed.\n');

    // 5. User Login & Invalid Login
    console.log('▶ [5/12] Testing POST /api/auth/login and invalid login rejection...');
    const invalidLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail1,
        password: 'wrong_password',
      }),
    });
    assert.strictEqual(invalidLoginRes.status, 401);

    const validLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail1,
        password: 'password123',
      }),
    });
    const validLoginJson = await validLoginRes.json();
    assert.strictEqual(validLoginRes.status, 200);
    assert.ok(validLoginJson.data.token);
    console.log('✅ Login and invalid authentication rejection passed.\n');

    // 6. Protected Route /api/auth/me
    console.log('▶ [6/12] Testing GET /api/auth/me...');
    const unauthMe = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(unauthMe.status, 401);

    const authMe = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const authMeJson = await authMe.json();
    assert.strictEqual(authMe.status, 200);
    assert.strictEqual(authMeJson.data.user.id, user1Id);
    console.log('✅ Protected /api/auth/me passed.\n');

    // 7. File Upload
    console.log('▶ [7/12] Testing POST /api/documents/upload with multipart form data...');
    // Create temporary test files
    const testDir = path.join(__dirname, 'test_files');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const poPath = path.join(testDir, 'Purchase_Order_1024.pdf');
    const invPath = path.join(testDir, 'Invoice_2024_001.pdf');
    const drPath = path.join(testDir, 'Delivery_Receipt_5512.pdf');
    const mismatchInvPath = path.join(testDir, 'Invoice_9042_Mismatch.pdf');

    fs.writeFileSync(poPath, '%PDF-1.4 Purchase Order PO-1024 Acme Industrial Supplies Inc $50,000 100 units');
    fs.writeFileSync(invPath, '%PDF-1.4 Invoice INV-2024-001 Acme Industrial Supplies Inc PO-1024 $50,000 100 units');
    fs.writeFileSync(drPath, '%PDF-1.4 Delivery Receipt DR-5512 Acme Industrial Supplies Inc PO-1024 100 units received');
    fs.writeFileSync(mismatchInvPath, '%PDF-1.4 Invoice INV-9042 Acme Industrial Supplies Inc PO-1024 $55,000 110 units');

    // Helper for multipart upload using FormData
    const formData = new FormData();
    formData.append('files', new Blob([fs.readFileSync(poPath)], { type: 'application/pdf' }), 'Purchase_Order_1024.pdf');
    formData.append('files', new Blob([fs.readFileSync(invPath)], { type: 'application/pdf' }), 'Invoice_2024_001.pdf');
    formData.append('files', new Blob([fs.readFileSync(drPath)], { type: 'application/pdf' }), 'Delivery_Receipt_5512.pdf');
    formData.append('files', new Blob([fs.readFileSync(mismatchInvPath)], { type: 'application/pdf' }), 'Invoice_9042_Mismatch.pdf');

    const uploadRes = await fetch(`${baseUrl}/api/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: formData,
    });
    const uploadJson = await uploadRes.json();
    assert.strictEqual(uploadRes.status, 201);
    assert.strictEqual(uploadJson.data.count, 4);

    const docs = uploadJson.data.documents;
    poDocId = docs.find((d: any) => d.originalFilename.includes('Purchase_Order')).id;
    invDocId = docs.find((d: any) => d.originalFilename.includes('Invoice_2024')).id;
    drDocId = docs.find((d: any) => d.originalFilename.includes('Delivery_Receipt')).id;
    mismatchInvDocId = docs.find((d: any) => d.originalFilename.includes('Invoice_9042')).id;

    assert.ok(poDocId);
    assert.ok(invDocId);
    assert.ok(drDocId);
    assert.ok(mismatchInvDocId);
    console.log('✅ Document upload passed.\n');

    // 8. Document Processing & AI Extraction
    console.log('▶ [8/12] Testing POST /api/documents/:id/process...');
    const processPoRes = await fetch(`${baseUrl}/api/documents/${poDocId}/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const processPoJson = await processPoRes.json();
    assert.strictEqual(processPoRes.status, 200);
    assert.strictEqual(processPoJson.data.documentType, 'PURCHASE_ORDER');
    assert.strictEqual(processPoJson.data.extractedData.poNumber, 'PO-1024');

    const processInvRes = await fetch(`${baseUrl}/api/documents/${invDocId}/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const processInvJson = await processInvRes.json();
    assert.strictEqual(processInvRes.status, 200);
    assert.strictEqual(processInvJson.data.documentType, 'INVOICE');

    const processDrRes = await fetch(`${baseUrl}/api/documents/${drDocId}/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const processDrJson = await processDrRes.json();
    assert.strictEqual(processDrRes.status, 200);
    assert.strictEqual(processDrJson.data.documentType, 'DELIVERY_RECEIPT');

    const processMismatchRes = await fetch(`${baseUrl}/api/documents/${mismatchInvDocId}/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const processMismatchJson = await processMismatchRes.json();
    assert.strictEqual(processMismatchRes.status, 200);
    assert.strictEqual(processMismatchJson.data.extractedData.total, 55000);
    console.log('✅ Document AI processing & structured extraction passed.\n');

    // 9. Document Ownership & Security Isolation
    console.log('▶ [9/12] Testing Document Ownership & Security Isolation...');
    // User 2 attempts to view User 1's document
    const user2GetRes = await fetch(`${baseUrl}/api/documents/${poDocId}`, {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert.strictEqual(user2GetRes.status, 404);

    // User 2 attempts to process User 1's document
    const user2ProcessRes = await fetch(`${baseUrl}/api/documents/${poDocId}/process`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert.strictEqual(user2ProcessRes.status, 404);

    // User 2 attempts to delete User 1's document
    const user2DeleteRes = await fetch(`${baseUrl}/api/documents/${poDocId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    assert.strictEqual(user2DeleteRes.status, 404);
    console.log('✅ Multi-tenant document isolation and security verified.\n');

    // 10. Cross-Document Reconciliation API
    console.log('▶ [10/12] Testing POST /api/validation/compare...');
    // 3-way Matching: PO + Matching Invoice + Delivery Receipt
    const matchValRes = await fetch(`${baseUrl}/api/validation/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        documentIds: [poDocId, invDocId, drDocId],
      }),
    });
    const matchValJson = await matchValRes.json();
    assert.strictEqual(matchValRes.status, 201);
    assert.strictEqual(matchValJson.data.overallStatus, 'VERIFIED');
    assert.strictEqual(matchValJson.data.overallSeverity, 'NONE');
    assert.strictEqual(matchValJson.data.discrepancies.length, 0);

    // 3-way Matching with Discrepancy: PO + Mismatch Invoice + Delivery Receipt
    const mismatchValRes = await fetch(`${baseUrl}/api/validation/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        documentIds: [poDocId, mismatchInvDocId, drDocId],
      }),
    });
    const mismatchValJson = await mismatchValRes.json();
    assert.strictEqual(mismatchValRes.status, 201);
    assert.strictEqual(mismatchValJson.data.overallStatus, 'REVIEW_REQUIRED');
    assert.strictEqual(mismatchValJson.data.overallSeverity, 'HIGH');
    assert.ok(mismatchValJson.data.discrepancies.length > 0);

    const validationId = mismatchValJson.data.id;

    // AI Explanation test
    const explainRes = await fetch(`${baseUrl}/api/validation/${validationId}/explain`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const explainJson = await explainRes.json();
    assert.strictEqual(explainRes.status, 200);
    assert.ok(explainJson.data.explanation);
    assert.ok(explainJson.data.recommendedAction);
    console.log('✅ Cross-document validation and AI discrepancy explanation passed.\n');

    // 11. Dashboard Analytics
    console.log('▶ [11/12] Testing GET /api/dashboard/stats...');
    const statsRes = await fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    const statsJson = await statsRes.json();
    assert.strictEqual(statsRes.status, 200);
    assert.strictEqual(statsJson.data.totalDocuments, 4);
    assert.strictEqual(statsJson.data.documentTypes.purchaseOrder, 1);
    assert.strictEqual(statsJson.data.documentTypes.deliveryReceipt, 1);
    assert.strictEqual(statsJson.data.documentTypes.invoice, 2);
    assert.ok(statsJson.data.discrepancies > 0);
    console.log('✅ Real database dashboard analytics passed.\n');

    // 12. AI Knowledge Chat
    console.log('▶ [12/12] Testing POST /api/chat...');
    const chatRes = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1Token}`,
      },
      body: JSON.stringify({
        question: 'Why was INV-9042 flagged during validation?',
      }),
    });
    const chatJson = await chatRes.json();
    assert.strictEqual(chatRes.status, 200);
    assert.ok(chatJson.data.answer);
    console.log(`🤖 AI Chat Answer:\n"${chatJson.data.answer}"\n`);
    console.log('✅ Grounded AI Chat passed.\n');

    console.log('🎉 ALL 12 BACKEND TEST PHASES PASSED WITH 100% SUCCESS!');
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
