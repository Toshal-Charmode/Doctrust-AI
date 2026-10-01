import { Request, Response, NextFunction } from 'express';
import { query } from '../db/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;

    // Document status counts
    const statusRes = await query(
      `SELECT
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'PROCESSED') as processed,
         COUNT(*) FILTER (WHERE status = 'REVIEW_REQUIRED') as review_required,
         COUNT(*) FILTER (WHERE status = 'FAILED') as failed,
         COUNT(*) FILTER (WHERE document_type = 'INVOICE') as invoice_count,
         COUNT(*) FILTER (WHERE document_type = 'PURCHASE_ORDER') as po_count,
         COUNT(*) FILTER (WHERE document_type = 'DELIVERY_RECEIPT') as dr_count,
         COUNT(*) FILTER (WHERE document_type = 'QUOTATION') as quote_count
       FROM documents
       WHERE user_id = $1`,
      [userId]
    );

    // Validation discrepancies count
    const valRes = await query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'VERIFIED') as verified,
         COUNT(*) FILTER (WHERE status = 'REVIEW_REQUIRED') as val_review_required,
         results
       FROM validations
       WHERE user_id = $1
       GROUP BY results, status`,
      [userId]
    );

    let totalDiscrepancies = 0;
    let verifiedCount = 0;

    (valRes.rows || []).forEach((row: any) => {
      if (row.status === 'VERIFIED') {
        verifiedCount++;
      }
      try {
        const parsed = typeof row.results === 'string' ? JSON.parse(row.results) : row.results;
        if (parsed?.discrepancies && Array.isArray(parsed.discrepancies)) {
          totalDiscrepancies += parsed.discrepancies.length;
        }
      } catch {
        // ignore parse error
      }
    });

    const counts = statusRes.rows[0] || {};

    const stats = {
      totalDocuments: parseInt(counts.total || '0', 10),
      processedDocuments: parseInt(counts.processed || '0', 10),
      verifiedDocuments: verifiedCount,
      reviewRequired: parseInt(counts.review_required || '0', 10),
      failedDocuments: parseInt(counts.failed || '0', 10),
      discrepancies: totalDiscrepancies,
      documentTypes: {
        invoice: parseInt(counts.invoice_count || '0', 10),
        purchaseOrder: parseInt(counts.po_count || '0', 10),
        deliveryReceipt: parseInt(counts.dr_count || '0', 10),
        quotation: parseInt(counts.quote_count || '0', 10),
      },
    };

    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

export default {
  getStats,
};
