import fs from 'fs';
import db from '../../db/index.js';
import { processDocumentWithGemini } from '../ai/geminiService.js';

export async function createDocumentRecord(userId, file) {
  const result = await db.query(
    `INSERT INTO documents (
      user_id, filename, original_name, file_path, mime_type, file_size, status
    ) VALUES ($1, $2, $3, $4, $5, $6, 'UPLOADED')
    RETURNING *`,
    [
      userId,
      file.filename,
      file.originalname,
      file.path,
      file.mimetype,
      file.size,
    ]
  );

  return result.rows[0];
}

export async function processDocument(documentId, userId) {
  // Verify document ownership
  const docRes = await db.query(
    `SELECT * FROM documents WHERE id = $1 AND user_id = $2`,
    [documentId, userId]
  );

  if (docRes.rows.length === 0) {
    throw new Error('Document not found or access denied');
  }

  const document = docRes.rows[0];

  // Set status to PROCESSING
  await db.query(
    `UPDATE documents SET status = 'PROCESSING', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [documentId]
  );

  try {
    // Process with Gemini AI pipeline
    const aiResult = await processDocumentWithGemini(
      document.file_path,
      document.mime_type,
      document.original_name
    );

    const { data: extracted, rawText, status } = aiResult;
    const fields = extracted.fields || {};

    // Upsert into extracted_data
    await db.query(
      `INSERT INTO extracted_data (
        document_id, document_type, vendor_name, vendor_address, document_number,
        po_number, document_date, due_date, currency, subtotal, tax, total,
        payment_terms, received_by, line_items, fields, missing_fields, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
      ON CONFLICT (document_id) DO UPDATE SET
        document_type = EXCLUDED.document_type,
        vendor_name = EXCLUDED.vendor_name,
        vendor_address = EXCLUDED.vendor_address,
        document_number = EXCLUDED.document_number,
        po_number = EXCLUDED.po_number,
        document_date = EXCLUDED.document_date,
        due_date = EXCLUDED.due_date,
        currency = EXCLUDED.currency,
        subtotal = EXCLUDED.subtotal,
        tax = EXCLUDED.tax,
        total = EXCLUDED.total,
        payment_terms = EXCLUDED.payment_terms,
        received_by = EXCLUDED.received_by,
        line_items = EXCLUDED.line_items,
        fields = EXCLUDED.fields,
        missing_fields = EXCLUDED.missing_fields,
        updated_at = CURRENT_TIMESTAMP`,
      [
        documentId,
        extracted.documentType,
        fields.vendorName || null,
        fields.vendorAddress || null,
        fields.documentNumber || fields.invoiceNumber || fields.poNumber || fields.receiptNumber || fields.quotationNumber || null,
        fields.poNumber || null,
        fields.documentDate || fields.invoiceDate || fields.orderDate || null,
        fields.dueDate || fields.validityDate || null,
        fields.currency || 'USD',
        fields.subtotal ? parseFloat(fields.subtotal) : null,
        fields.tax ? parseFloat(fields.tax) : null,
        fields.total ? parseFloat(fields.total) : null,
        fields.paymentTerms || null,
        fields.receivedBy || null,
        JSON.stringify(extracted.lineItems || []),
        JSON.stringify(fields),
        JSON.stringify(extracted.missingFields || []),
      ]
    );

    // Update document record
    const updatedDocRes = await db.query(
      `UPDATE documents SET
        document_type = $1,
        status = $2,
        confidence = $3,
        reason = $4,
        summary = $5,
        raw_text = $6,
        warnings = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *`,
      [
        extracted.documentType,
        status,
        extracted.confidence,
        extracted.reason,
        extracted.summary,
        rawText,
        JSON.stringify(extracted.warnings || []),
        documentId,
      ]
    );

    return {
      ...updatedDocRes.rows[0],
      extracted,
    };
  } catch (error) {
    console.error(`Error processing document #${documentId}:`, error);
    await db.query(
      `UPDATE documents SET status = 'FAILED', reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [error.message, documentId]
    );
    throw error;
  }
}

export async function getUserDocuments(userId, filters = {}) {
  let queryText = `
    SELECT d.id, d.user_id, d.filename, d.original_name, d.mime_type, d.file_size,
           d.document_type, d.status, d.confidence, d.reason, d.summary, d.warnings,
           d.created_at, d.updated_at,
           e.vendor_name, e.document_number, e.po_number, e.document_date, e.total, e.currency
    FROM documents d
    LEFT JOIN extracted_data e ON d.id = e.document_id
    WHERE d.user_id = $1
  `;

  const params = [userId];
  let paramIdx = 2;

  if (filters.type && filters.type !== 'ALL') {
    queryText += ` AND d.document_type = $${paramIdx++}`;
    params.push(filters.type);
  }

  if (filters.status && filters.status !== 'ALL') {
    queryText += ` AND d.status = $${paramIdx++}`;
    params.push(filters.status);
  }

  if (filters.search) {
    queryText += ` AND (d.original_name ILIKE $${paramIdx} OR e.vendor_name ILIKE $${paramIdx} OR e.document_number ILIKE $${paramIdx})`;
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  queryText += ` ORDER BY d.created_at DESC`;

  const result = await db.query(queryText, params);
  return result.rows;
}

export async function getDocumentById(documentId, userId) {
  const result = await db.query(
    `SELECT d.*, 
            e.vendor_name, e.vendor_address, e.document_number, e.po_number,
            e.document_date, e.due_date, e.currency, e.subtotal, e.tax, e.total,
            e.payment_terms, e.received_by, e.line_items, e.fields, e.missing_fields
     FROM documents d
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE d.id = $1 AND d.user_id = $2`,
    [documentId, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    userId: row.user_id,
    filename: row.filename,
    originalName: row.original_name,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    documentType: row.document_type,
    status: row.status,
    confidence: row.confidence ? parseFloat(row.confidence) : 0,
    reason: row.reason,
    summary: row.summary,
    rawText: row.raw_text,
    warnings: typeof row.warnings === 'string' ? JSON.parse(row.warnings) : (row.warnings || []),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    extracted: {
      vendorName: row.vendor_name,
      vendorAddress: row.vendor_address,
      documentNumber: row.document_number,
      poNumber: row.po_number,
      documentDate: row.document_date,
      dueDate: row.due_date,
      currency: row.currency || 'USD',
      subtotal: row.subtotal ? parseFloat(row.subtotal) : null,
      tax: row.tax ? parseFloat(row.tax) : null,
      total: row.total ? parseFloat(row.total) : null,
      paymentTerms: row.payment_terms,
      receivedBy: row.received_by,
      lineItems: typeof row.line_items === 'string' ? JSON.parse(row.line_items) : (row.line_items || []),
      fields: typeof row.fields === 'string' ? JSON.parse(row.fields) : (row.fields || {}),
      missingFields: typeof row.missing_fields === 'string' ? JSON.parse(row.missing_fields) : (row.missing_fields || []),
    },
  };
}

export async function deleteDocument(documentId, userId) {
  const doc = await getDocumentById(documentId, userId);
  if (!doc) {
    throw new Error('Document not found or unauthorized');
  }

  // Remove file from disk if exists
  const fullPath = doc.filePath;
  if (fullPath && fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (e) {
      console.warn('Could not remove file from disk:', e.message);
    }
  }

  await db.query(`DELETE FROM documents WHERE id = $1 AND user_id = $2`, [documentId, userId]);
  return true;
}

export default {
  createDocumentRecord,
  processDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
};
