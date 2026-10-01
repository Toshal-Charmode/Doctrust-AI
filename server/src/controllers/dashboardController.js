import db from '../db/index.js';

export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Total Documents
    const totalDocsRes = await db.query(
      `SELECT COUNT(*)::int as count FROM documents WHERE user_id = $1`,
      [userId]
    );
    const totalDocuments = totalDocsRes.rows[0]?.count || 0;

    // 2. Processed Documents (PROCESSED or REVIEW_REQUIRED)
    const processedDocsRes = await db.query(
      `SELECT COUNT(*)::int as count FROM documents WHERE user_id = $1 AND status IN ('PROCESSED', 'REVIEW_REQUIRED')`,
      [userId]
    );
    const processedDocuments = processedDocsRes.rows[0]?.count || 0;

    // 3. Verified Documents (PROCESSED without warnings and confidence >= 0.80)
    const verifiedDocsRes = await db.query(
      `SELECT COUNT(*)::int as count FROM documents 
       WHERE user_id = $1 AND status = 'PROCESSED' AND confidence >= 0.80`,
      [userId]
    );
    const verifiedDocuments = verifiedDocsRes.rows[0]?.count || 0;

    // 4. Documents Needing Review (status = 'REVIEW_REQUIRED' or confidence < 0.80)
    const reviewDocsRes = await db.query(
      `SELECT COUNT(*)::int as count FROM documents 
       WHERE user_id = $1 AND (status = 'REVIEW_REQUIRED' OR confidence < 0.80 OR status = 'FAILED')`,
      [userId]
    );
    const documentsNeedingReview = reviewDocsRes.rows[0]?.count || 0;

    // 5. Total Discrepancies Detected across all validations
    const discRes = await db.query(
      `SELECT COALESCE(SUM(discrepancy_count), 0)::int as total FROM validations WHERE user_id = $1`,
      [userId]
    );
    const discrepanciesDetected = discRes.rows[0]?.total || 0;

    // 6. Recent Documents Table
    const recentDocsRes = await db.query(
      `SELECT d.id, d.original_name, d.document_type, d.status, d.confidence, d.summary, d.created_at,
              e.vendor_name, e.document_number, e.total, e.currency
       FROM documents d
       LEFT JOIN extracted_data e ON d.id = e.document_id
       WHERE d.user_id = $1
       ORDER BY d.created_at DESC
       LIMIT 8`,
      [userId]
    );

    // 7. Attention Required Section
    // Documents with missing fields, low confidence, or review required
    const attentionRes = await db.query(
      `SELECT d.id, d.original_name, d.document_type, d.status, d.confidence, d.reason, d.warnings, d.created_at,
              e.vendor_name, e.document_number, e.total, e.currency, e.missing_fields
       FROM documents d
       LEFT JOIN extracted_data e ON d.id = e.document_id
       WHERE d.user_id = $1 AND (d.status = 'REVIEW_REQUIRED' OR d.confidence < 0.80 OR d.status = 'FAILED')
       ORDER BY d.created_at DESC
       LIMIT 6`,
      [userId]
    );

    const attentionRequired = attentionRes.rows.map(row => {
      const missing = typeof row.missing_fields === 'string' ? JSON.parse(row.missing_fields) : (row.missing_fields || []);
      const warnings = typeof row.warnings === 'string' ? JSON.parse(row.warnings) : (row.warnings || []);
      
      const reasons = [];
      if (row.confidence < 0.80) reasons.push(`Low AI confidence (${(Number(row.confidence) * 100).toFixed(0)}%)`);
      if (missing.length > 0) reasons.push(`Missing fields: ${missing.join(', ')}`);
      if (warnings.length > 0) reasons.push(...warnings);
      if (reasons.length === 0 && row.reason) reasons.push(row.reason);

      return {
        id: row.id,
        originalName: row.original_name,
        documentType: row.document_type,
        status: row.status,
        confidence: row.confidence ? parseFloat(row.confidence) : 0,
        vendorName: row.vendor_name,
        documentNumber: row.document_number,
        total: row.total,
        currency: row.currency || 'USD',
        reasons,
        createdAt: row.created_at,
      };
    });

    // 8. Processing Activity Section
    const activityRes = await db.query(
      `SELECT 'DOCUMENT_PROCESSED' as type, original_name as title, status, created_at, id
       FROM documents
       WHERE user_id = $1
       UNION ALL
       SELECT 'VALIDATION_COMPLETED' as type, title, overall_status as status, created_at, id
       FROM validations
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 8`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalDocuments,
          processedDocuments,
          verifiedDocuments,
          documentsNeedingReview,
          discrepanciesDetected,
        },
        recentDocuments: recentDocsRes.rows.map(r => ({
          id: r.id,
          originalName: r.original_name,
          documentType: r.document_type,
          status: r.status,
          confidence: r.confidence ? parseFloat(r.confidence) : 0,
          summary: r.summary,
          vendorName: r.vendor_name,
          documentNumber: r.document_number,
          total: r.total,
          currency: r.currency || 'USD',
          createdAt: r.created_at,
        })),
        attentionRequired,
        processingActivity: activityRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  getDashboardStats,
};
