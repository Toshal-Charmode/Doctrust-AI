import crypto from 'crypto';
import { query } from '../../db/index.js';
import { ValidationResult, ValidationCheck, Discrepancy, Severity, ValidationStatus } from '../../types/validation.types.js';
import discrepancyService, { DocumentComparisonInput } from './discrepancy.service.js';
import logger from '../../utils/logger.js';

export async function validateDocuments(
  userId: string,
  documentIds: string[]
): Promise<ValidationResult & { id: string; documentIds: string[] }> {
  if (documentIds.length < 2) {
    throw new Error('At least 2 documents are required for cross-document reconciliation.');
  }

  // 1. Fetch documents and ensure ownership
  const placeholders = documentIds.map((_, i) => `$${i + 2}`).join(',');
  const docsRes = await query(
    `SELECT d.id, d.original_filename, d.document_type, d.status, e.data as extracted_data
     FROM documents d
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE d.user_id = $1 AND d.id IN (${placeholders})`,
    [userId, ...documentIds]
  );

  const foundDocs = docsRes.rows || [];
  if (foundDocs.length !== documentIds.length) {
    throw new Error('One or more documents were not found or do not belong to you.');
  }

  // 2. Prepare comparison inputs
  const inputs: DocumentComparisonInput[] = foundDocs.map((doc: any) => ({
    id: doc.id,
    filename: doc.original_filename,
    documentType: doc.document_type || 'OTHER',
    fields: doc.extracted_data || {},
  }));

  // 3. Execute deterministic checks
  const checks: ValidationCheck[] = [];

  // Vendor check
  checks.push(discrepancyService.compareVendors(inputs));

  // PO Number check
  checks.push(discrepancyService.comparePoNumbers(inputs));

  // Currency check
  checks.push(discrepancyService.compareCurrency(inputs));

  // Totals check
  checks.push(discrepancyService.compareTotals(inputs));

  // Quantity checks
  checks.push(...discrepancyService.compareQuantities(inputs));

  // Line items checks
  checks.push(...discrepancyService.compareLineItems(inputs));

  // Date chronology checks
  checks.push(...discrepancyService.compareDates(inputs));

  // 4. Calculate discrepancies and overall status
  const discrepancies: Discrepancy[] = checks
    .filter((c) => c.status === 'MISMATCH' || c.status === 'MISSING')
    .map((c) => ({
      field: c.field,
      status: c.status,
      expectedValue: c.expectedValue,
      actualValue: c.actualValue,
      difference: c.difference,
      severity: c.severity || 'MEDIUM',
      message: c.message,
    }));

  let overallStatus: ValidationStatus = 'VERIFIED';
  let overallSeverity: Severity | 'NONE' = 'NONE';

  if (discrepancies.length > 0) {
    overallStatus = 'REVIEW_REQUIRED';
    if (discrepancies.some((d) => d.severity === 'HIGH')) {
      overallSeverity = 'HIGH';
    } else if (discrepancies.some((d) => d.severity === 'MEDIUM')) {
      overallSeverity = 'MEDIUM';
    } else {
      overallSeverity = 'LOW';
    }
  }

  // 5. Generate summary
  let summary = '';
  if (discrepancies.length === 0) {
    summary = `Reconciliation passed with 100% agreement across ${foundDocs.length} documents. No pricing, quantity, or vendor variances detected.`;
  } else {
    const mismatchFields = discrepancies.map((d) => d.field).join(', ');
    summary = `Reconciliation flagged ${discrepancies.length} discrepancy(ies) across fields [${mismatchFields}]. Review required before payment approval.`;
  }

  const validationResult: ValidationResult = {
    overallStatus,
    overallSeverity,
    checks,
    discrepancies,
    summary,
  };

  // 6. Save to database
  const validationId = crypto.randomUUID();
  await query(
    `INSERT INTO validations (id, user_id, status, overall_severity, summary, results, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [
      validationId,
      userId,
      overallStatus,
      overallSeverity,
      summary,
      JSON.stringify(validationResult),
    ]
  );

  // Link documents in junction table
  for (const docId of documentIds) {
    await query(
      `INSERT INTO validation_documents (validation_id, document_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [validationId, docId]
    );
  }

  logger.info(`Validation ${validationId} completed for user ${userId}. Result: ${overallStatus} (${overallSeverity})`);

  return {
    id: validationId,
    documentIds,
    ...validationResult,
  };
}

export async function getValidationById(userId: string, validationId: string): Promise<any> {
  const val = await query('SELECT * FROM validations WHERE id = $1 AND user_id = $2', [validationId, userId]);
  if (!val.rows || val.rows.length === 0) return null;

  const row = val.rows[0];
  const docLinks = await query(
    `SELECT d.id, d.original_filename, d.document_type, d.status, e.data as extracted_data
     FROM validation_documents vd
     JOIN documents d ON vd.document_id = d.id
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE vd.validation_id = $1`,
    [validationId]
  );

  return {
    id: row.id,
    userId: row.user_id,
    status: row.status,
    overallSeverity: row.overall_severity,
    summary: row.summary,
    results: typeof row.results === 'string' ? JSON.parse(row.results) : row.results,
    documents: docLinks.rows || [],
    createdAt: row.created_at,
  };
}

export async function getUserValidations(userId: string): Promise<any[]> {
  const res = await query(
    `SELECT v.id, v.status, v.overall_severity, v.summary, v.results, v.created_at
     FROM validations v
     WHERE v.user_id = $1
     ORDER BY v.created_at DESC`,
    [userId]
  );

  return (res.rows || []).map((row: any) => ({
    id: row.id,
    status: row.status,
    overallSeverity: row.overall_severity,
    summary: row.summary,
    results: typeof row.results === 'string' ? JSON.parse(row.results) : row.results,
    createdAt: row.created_at,
  }));
}

export default {
  validateDocuments,
  getValidationById,
  getUserValidations,
};
