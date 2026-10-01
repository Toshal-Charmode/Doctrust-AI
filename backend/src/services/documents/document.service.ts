import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { query } from '../../db/index.js';
import { analyzeDocument } from '../ai/extraction.service.js';
import { determineDocumentStatus } from '../ai/classification.service.js';
import { DocumentRecord, DocumentStatus, DocumentType } from '../../types/document.types.js';
import { safeUnlink } from '../../utils/fileUtils.js';
import logger from '../../utils/logger.js';

export async function createDocumentRecord(
  userId: string,
  file: Express.Multer.File
): Promise<DocumentRecord> {
  const docId = crypto.randomUUID();

  const res = await query(
    `INSERT INTO documents (
      id, user_id, filename, original_filename, mime_type, file_size, storage_path, status, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'UPLOADED', NOW(), NOW())
    RETURNING *`,
    [
      docId,
      userId,
      file.filename,
      file.originalname,
      file.mimetype,
      file.size,
      file.path,
    ]
  );

  return res.rows[0];
}

export async function getDocumentById(userId: string, documentId: string): Promise<any | null> {
  const res = await query(
    `SELECT d.*, e.data as extracted_data
     FROM documents d
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE d.id = $1 AND d.user_id = $2`,
    [documentId, userId]
  );

  if (!res.rows || res.rows.length === 0) {
    return null;
  }

  const doc = res.rows[0];
  return {
    id: doc.id,
    userId: doc.user_id,
    filename: doc.filename,
    originalFilename: doc.original_filename,
    mimeType: doc.mime_type,
    fileSize: doc.file_size,
    storagePath: doc.storage_path,
    documentType: doc.document_type,
    confidence: doc.confidence ? parseFloat(doc.confidence) : null,
    status: doc.status,
    summary: doc.summary,
    extractedData: doc.extracted_data || null,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  };
}

export async function getUserDocuments(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }
): Promise<{ documents: any[]; total: number; page: number; limit: number; totalPages: number }> {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
  const offset = (page - 1) * limit;

  const conditions: string[] = ['d.user_id = $1'];
  const params: any[] = [userId];
  let paramIdx = 2;

  if (options.status) {
    conditions.push(`d.status = $${paramIdx++}`);
    params.push(options.status.toUpperCase());
  }

  if (options.type) {
    conditions.push(`d.document_type = $${paramIdx++}`);
    params.push(options.type.toUpperCase());
  }

  if (options.search) {
    conditions.push(`(d.original_filename ILIKE $${paramIdx} OR d.summary ILIKE $${paramIdx})`);
    params.push(`%${options.search}%`);
    paramIdx++;
  }

  const whereClause = conditions.join(' AND ');

  // Total count
  const countRes = await query(
    `SELECT COUNT(*) as total FROM documents d WHERE ${whereClause}`,
    params
  );
  const total = parseInt(countRes.rows[0]?.total || '0', 10);

  // Documents list
  const listParams = [...params, limit, offset];
  const listRes = await query(
    `SELECT d.*, e.data as extracted_data
     FROM documents d
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE ${whereClause}
     ORDER BY d.created_at DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    listParams
  );

  const documents = (listRes.rows || []).map((doc: any) => ({
    id: doc.id,
    userId: doc.user_id,
    filename: doc.filename,
    originalFilename: doc.original_filename,
    mimeType: doc.mime_type,
    fileSize: doc.file_size,
    documentType: doc.document_type,
    confidence: doc.confidence ? parseFloat(doc.confidence) : null,
    status: doc.status,
    summary: doc.summary,
    extractedData: doc.extracted_data || null,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
  }));

  return {
    documents,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function processDocument(userId: string, documentId: string): Promise<any> {
  const doc = await getDocumentById(userId, documentId);
  if (!doc) {
    throw new Error('Document not found or unauthorized');
  }

  // Update status to PROCESSING
  await query(
    `UPDATE documents SET status = 'PROCESSING', updated_at = NOW() WHERE id = $1`,
    [documentId]
  );

  try {
    const filePath = doc.storagePath;
    if (!fs.existsSync(filePath)) {
      throw new Error(`Document file on disk does not exist: ${filePath}`);
    }

    // Run AI extraction
    const extractionResult = await analyzeDocument(filePath, doc.mimeType, doc.originalFilename);

    const docType: DocumentType = extractionResult.classification.documentType;
    const confidence = extractionResult.classification.confidence;
    const summary = extractionResult.summary;

    const computedStatus = determineDocumentStatus(
      confidence,
      extractionResult.warnings || [],
      extractionResult.missingFields || []
    );

    // Save/Update extracted_data table
    const existingExt = await query('SELECT id FROM extracted_data WHERE document_id = $1', [documentId]);
    const structuredPayload = {
      ...extractionResult.fields,
      lineItems: extractionResult.lineItems,
      missingFields: extractionResult.missingFields,
      warnings: extractionResult.warnings,
      summary: extractionResult.summary,
      classification: extractionResult.classification,
    };

    if (existingExt.rows && existingExt.rows.length > 0) {
      await query(
        `UPDATE extracted_data SET data = $1, updated_at = NOW() WHERE document_id = $2`,
        [JSON.stringify(structuredPayload), documentId]
      );
    } else {
      const extId = crypto.randomUUID();
      await query(
        `INSERT INTO extracted_data (id, document_id, data, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [extId, documentId, JSON.stringify(structuredPayload)]
      );
    }

    // Update document record
    await query(
      `UPDATE documents
       SET document_type = $1,
           confidence = $2,
           status = $3,
           summary = $4,
           updated_at = NOW()
       WHERE id = $5`,
      [docType, confidence, computedStatus, summary, documentId]
    );

    logger.info(`Successfully processed document ${documentId}: ${docType} (${computedStatus})`);

    return {
      documentId,
      documentType: docType,
      confidence,
      status: computedStatus,
      summary,
      extractedData: structuredPayload,
      warnings: extractionResult.warnings,
      missingFields: extractionResult.missingFields,
    };
  } catch (err: any) {
    logger.error(`Document processing failed for ${documentId}: ${err.message}`);
    await query(
      `UPDATE documents SET status = 'FAILED', summary = $1, updated_at = NOW() WHERE id = $2`,
      [`Processing error: ${err.message}`, documentId]
    );
    throw err;
  }
}

export async function deleteDocument(userId: string, documentId: string): Promise<boolean> {
  const doc = await getDocumentById(userId, documentId);
  if (!doc) {
    return false;
  }

  // Delete physical file safely
  if (doc.storagePath) {
    safeUnlink(doc.storagePath);
  }

  // Delete DB record (CASCADE deletes extracted_data & validation_documents)
  await query('DELETE FROM documents WHERE id = $1 AND user_id = $2', [documentId, userId]);

  logger.info(`Document ${documentId} deleted successfully for user ${userId}`);
  return true;
}

export default {
  createDocumentRecord,
  getDocumentById,
  getUserDocuments,
  processDocument,
  deleteDocument,
};
