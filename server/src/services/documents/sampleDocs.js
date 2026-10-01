import fs from 'fs';
import path from 'path';
import config from '../../config/env.js';
import db from '../../db/index.js';
import { validateDocuments } from '../validation/crossDocumentValidator.js';

export const SAMPLE_DOCUMENTS_DATA = [
  {
    originalName: 'Acme_Supplies_PO-1024.pdf',
    documentType: 'PURCHASE_ORDER',
    status: 'PROCESSED',
    confidence: 0.98,
    reason: 'Contains authorized purchase order header, billing reference, approved line items, delivery terms, and authorized signature.',
    summary: 'Official Purchase Order PO-1024 issued to Acme Industrial Supplies Inc. for 100 Industrial Precision Ball Bearings at $500.00/unit ($50,000.00 total) with delivery date Sept 25, 2026.',
    rawText: `PURCHASE ORDER
Order Number: PO-1024
Issue Date: September 10, 2026
Delivery Expected: September 25, 2026
Vendor: Acme Industrial Supplies Inc.
Address: 742 Evergreen Terrace, Industrial Park, Springfield, IL
Payment Terms: Net 30 Days
Currency: USD

Item 1:
Description: Industrial Precision Ball Bearings (SKU: BB-9902)
Quantity: 100
Unit Price: $500.00
Line Total: $50,000.00

Subtotal: $50,000.00
Tax (0%): $0.00
Grand Total: $50,000.00
Authorized By: Elena Rostova (Director of Procurement)`,
    extracted: {
      vendorName: 'Acme Industrial Supplies Inc.',
      vendorAddress: '742 Evergreen Terrace, Industrial Park, Springfield, IL',
      documentNumber: 'PO-1024',
      poNumber: 'PO-1024',
      documentDate: '2026-09-10',
      orderDate: '2026-09-10',
      deliveryDate: '2026-09-25',
      currency: 'USD',
      subtotal: 50000.00,
      tax: 0.00,
      total: 50000.00,
      paymentTerms: 'Net 30 Days',
      totalQuantity: 100,
      lineItems: [
        {
          description: 'Industrial Precision Ball Bearings (SKU: BB-9902)',
          quantity: 100,
          unitPrice: 500.00,
          total: 50000.00,
        },
      ],
      missingFields: [],
      warnings: [],
    },
  },
  {
    originalName: 'Acme_Supplies_Invoice_INV-9042.pdf',
    documentType: 'INVOICE',
    status: 'REVIEW_REQUIRED',
    confidence: 0.96,
    reason: 'Identified invoice header, tax calculation, payment details, and itemized billing for 110 units referencing PO-1024.',
    summary: 'Commercial Invoice INV-9042 from Acme Industrial Supplies Inc. billing for 110 Industrial Precision Ball Bearings totaling $55,000.00. Notice: Bills for 10 more units than authorized on PO-1024.',
    rawText: `COMMERCIAL INVOICE
Invoice Number: INV-9042
Invoice Date: September 18, 2026
Due Date: October 18, 2026
Purchase Order Reference: PO-1024
Vendor: Acme Industrial Supplies Inc.
Address: 742 Evergreen Terrace, Industrial Park, Springfield, IL
Remit To: Wire Transfer / Account #4492-9901
Payment Terms: Net 30 Days
Currency: USD

Item 1:
Description: Industrial Precision Ball Bearings (SKU: BB-9902)
Quantity: 110
Unit Price: $500.00
Line Total: $55,000.00

Subtotal: $55,000.00
Tax: $0.00
Total Balance Due: $55,000.00`,
    extracted: {
      vendorName: 'Acme Industrial Supplies Inc.',
      vendorAddress: '742 Evergreen Terrace, Industrial Park, Springfield, IL',
      documentNumber: 'INV-9042',
      invoiceNumber: 'INV-9042',
      poNumber: 'PO-1024',
      documentDate: '2026-09-18',
      invoiceDate: '2026-09-18',
      dueDate: '2026-10-18',
      currency: 'USD',
      subtotal: 55000.00,
      tax: 0.00,
      total: 55000.00,
      paymentTerms: 'Net 30 Days',
      totalQuantity: 110,
      lineItems: [
        {
          description: 'Industrial Precision Ball Bearings (SKU: BB-9902)',
          quantity: 110,
          unitPrice: 500.00,
          total: 55000.00,
        },
      ],
      missingFields: [],
      warnings: ['Billed quantity (110) exceeds standard PO batch size (100)'],
    },
  },
  {
    originalName: 'FastTrack_Logistics_Delivery_DR-5512.pdf',
    documentType: 'DELIVERY_RECEIPT',
    status: 'PROCESSED',
    confidence: 0.95,
    reason: 'Standard proof of delivery receipt with warehouse intake confirmation, receiving manager signature, and itemized piece count.',
    summary: 'Delivery Receipt DR-5512 confirming receipt of 100 units of Industrial Precision Ball Bearings at Central Warehouse Receiving Bay 4, received by Marcus Vance on September 17, 2026.',
    rawText: `DELIVERY RECEIPT & PACKING LIST
Receipt Number: DR-5512
Delivery Date: September 17, 2026
Carrier: FastTrack Logistics Freight
Vendor: Acme Industrial Supplies Inc.
Customer PO Number: PO-1024
Delivery Destination: Central Warehouse, Bay 4

Received Items:
Description: Industrial Precision Ball Bearings (SKU: BB-9902)
Delivered Quantity: 100 Units
Condition: Sealed / Undamaged

Total Pieces Delivered: 100
Received and Verified By: Marcus Vance (Warehouse Manager)
Signature: [M. Vance - Timestamped]`,
    extracted: {
      vendorName: 'Acme Industrial Supplies Inc.',
      vendorAddress: '742 Evergreen Terrace, Industrial Park, Springfield, IL',
      documentNumber: 'DR-5512',
      receiptNumber: 'DR-5512',
      poNumber: 'PO-1024',
      documentDate: '2026-09-17',
      deliveryDate: '2026-09-17',
      receivedBy: 'Marcus Vance (Warehouse Manager)',
      currency: 'USD',
      totalQuantity: 100,
      total: 50000.00,
      lineItems: [
        {
          description: 'Industrial Precision Ball Bearings (SKU: BB-9902)',
          quantity: 100,
          unitPrice: 500.00,
          total: 50000.00,
        },
      ],
      missingFields: [],
      warnings: [],
    },
  },
  {
    originalName: 'GlobalTech_Quotation_Q-4401.pdf',
    documentType: 'QUOTATION',
    status: 'PROCESSED',
    confidence: 0.94,
    reason: 'Commercial price quotation with validity period, itemized tier pricing, and hardware specification sheets.',
    summary: 'Quotation Q-4401 from Global Tech Solutions for 4 units of Enterprise Server Node Rack Pro ($3,000/unit, total $12,960 including 8% tax) valid through October 31, 2026.',
    rawText: `COMMERCIAL PRICE QUOTATION
Quote Number: Q-4401
Quote Date: September 01, 2026
Valid Through: October 31, 2026
Prepared By: Global Tech Solutions
Address: 100 Silicon Blvd, Suite 400, San Jose, CA
Currency: USD

Item 1:
Description: Enterprise Server Node Rack Pro (Xeon 64-Core, 256GB RAM)
Quantity: 4
Unit Price: $3,000.00
Line Total: $12,000.00

Subtotal: $12,000.00
Estimated Sales Tax (8%): $960.00
Total Quoted Amount: $12,960.00
Payment Terms: 50% Advance, 50% upon delivery`,
    extracted: {
      vendorName: 'Global Tech Solutions',
      vendorAddress: '100 Silicon Blvd, Suite 400, San Jose, CA',
      documentNumber: 'Q-4401',
      quotationNumber: 'Q-4401',
      documentDate: '2026-09-01',
      quotationDate: '2026-09-01',
      validityDate: '2026-10-31',
      currency: 'USD',
      subtotal: 12000.00,
      tax: 960.00,
      total: 12960.00,
      totalQuantity: 4,
      paymentTerms: '50% Advance, 50% Net 30',
      lineItems: [
        {
          description: 'Enterprise Server Node Rack Pro (Xeon 64-Core, 256GB RAM)',
          quantity: 4,
          unitPrice: 3000.00,
          total: 12000.00,
        },
      ],
      missingFields: [],
      warnings: [],
    },
  },
];

/**
 * Seed sample demo documents for a user
 */
export async function seedDemoDataForUser(userId) {
  const createdDocs = [];

  for (const sample of SAMPLE_DOCUMENTS_DATA) {
    const filename = `demo-${Date.now()}-${sample.originalName}`;
    const filePath = path.join(config.uploadDir, filename);

    // Write sample text/pdf representation to uploads folder
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, sample.rawText, 'utf8');
    }

    const docRes = await db.query(
      `INSERT INTO documents (
        user_id, filename, original_name, file_path, mime_type, file_size,
        document_type, status, confidence, reason, summary, raw_text, warnings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        userId,
        filename,
        sample.originalName,
        filePath,
        'application/pdf',
        Buffer.byteLength(sample.rawText, 'utf8'),
        sample.documentType,
        sample.status,
        sample.confidence,
        sample.reason,
        sample.summary,
        sample.rawText,
        JSON.stringify(sample.extracted.warnings || []),
      ]
    );

    const doc = docRes.rows[0];

    // Insert extracted_data
    await db.query(
      `INSERT INTO extracted_data (
        document_id, document_type, vendor_name, vendor_address, document_number,
        po_number, document_date, due_date, currency, subtotal, tax, total,
        payment_terms, received_by, line_items, fields, missing_fields
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        doc.id,
        sample.documentType,
        sample.extracted.vendorName,
        sample.extracted.vendorAddress,
        sample.extracted.documentNumber,
        sample.extracted.poNumber,
        sample.extracted.documentDate,
        sample.extracted.dueDate || null,
        sample.extracted.currency || 'USD',
        sample.extracted.subtotal || sample.extracted.total,
        sample.extracted.tax || 0,
        sample.extracted.total,
        sample.extracted.paymentTerms || null,
        sample.extracted.receivedBy || null,
        JSON.stringify(sample.extracted.lineItems || []),
        JSON.stringify(sample.extracted),
        JSON.stringify(sample.extracted.missingFields || []),
      ]
    );

    createdDocs.push({
      ...doc,
      extracted: sample.extracted,
    });
  }

  // Also auto-run an initial 3-way match validation between PO-1024, Invoice INV-9042, and Delivery DR-5512
  const po = createdDocs.find(d => d.document_type === 'PURCHASE_ORDER');
  const inv = createdDocs.find(d => d.document_type === 'INVOICE');
  const dr = createdDocs.find(d => d.document_type === 'DELIVERY_RECEIPT');

  if (po && inv && dr) {
    const valResult = await validateDocuments([po, inv, dr]);

    await db.query(
      `INSERT INTO validations (
        user_id, title, document_ids, overall_status, discrepancy_count,
        checks, discrepancies, ai_explanation, recommended_action
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        valResult.title,
        JSON.stringify([po.id, inv.id, dr.id]),
        valResult.overallStatus,
        valResult.discrepancyCount,
        JSON.stringify(valResult.checks),
        JSON.stringify(valResult.discrepancies),
        valResult.aiExplanation,
        valResult.recommendedAction,
      ]
    );
  }

  return createdDocs;
}

export default {
  SAMPLE_DOCUMENTS_DATA,
  seedDemoDataForUser,
};
