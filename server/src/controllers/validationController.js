import db from '../db/index.js';
import { getDocumentById } from '../services/documents/documentService.js';
import { validateDocuments } from '../services/validation/crossDocumentValidator.js';

export async function compareDocuments(req, res, next) {
  try {
    const userId = req.user.id;
    const { documentIds, title } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 documents to compare.',
      });
    }

    // Fetch and verify all documents belong to the user
    const fetchedDocs = [];
    for (const id of documentIds) {
      const doc = await getDocumentById(id, userId);
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `Document #${id} not found or access denied.`,
        });
      }
      fetchedDocs.push(doc);
    }

    // Run cross-document validation engine
    const validationResult = await validateDocuments(fetchedDocs);

    const validationTitle = title?.trim() || validationResult.title;

    // Save validation record
    const insertRes = await db.query(
      `INSERT INTO validations (
        user_id, title, document_ids, overall_status, discrepancy_count,
        checks, discrepancies, ai_explanation, recommended_action
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        validationTitle,
        JSON.stringify(documentIds),
        validationResult.overallStatus,
        validationResult.discrepancyCount,
        JSON.stringify(validationResult.checks),
        JSON.stringify(validationResult.discrepancies),
        validationResult.aiExplanation,
        validationResult.recommendedAction,
      ]
    );

    const savedRecord = insertRes.rows[0];

    return res.status(200).json({
      success: true,
      message: 'Cross-document validation completed successfully',
      data: {
        id: savedRecord.id,
        title: savedRecord.title,
        overallStatus: savedRecord.overall_status,
        discrepancyCount: savedRecord.discrepancy_count,
        checks: validationResult.checks,
        discrepancies: validationResult.discrepancies,
        aiExplanation: savedRecord.ai_explanation,
        recommendedAction: savedRecord.recommended_action,
        comparedDocuments: fetchedDocs.map(d => ({
          id: d.id,
          originalName: d.originalName,
          documentType: d.documentType,
          total: d.extracted?.total,
          vendorName: d.extracted?.vendorName,
          documentNumber: d.extracted?.documentNumber,
        })),
        createdAt: savedRecord.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getValidations(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT id, title, document_ids, overall_status, discrepancy_count,
              checks, discrepancies, ai_explanation, recommended_action, created_at
       FROM validations
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const formatted = result.rows.map(r => ({
      id: r.id,
      title: r.title,
      documentIds: typeof r.document_ids === 'string' ? JSON.parse(r.document_ids) : r.document_ids,
      overallStatus: r.overall_status,
      discrepancyCount: r.discrepancy_count,
      checks: typeof r.checks === 'string' ? JSON.parse(r.checks) : r.checks,
      discrepancies: typeof r.discrepancies === 'string' ? JSON.parse(r.discrepancies) : r.discrepancies,
      aiExplanation: r.ai_explanation,
      recommendedAction: r.recommended_action,
      createdAt: r.created_at,
    }));

    return res.status(200).json({
      success: true,
      data: {
        validations: formatted,
        total: formatted.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getValidation(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);

    const result = await db.query(
      `SELECT * FROM validations WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Validation record not found',
      });
    }

    const r = result.rows[0];
    const docIds = typeof r.document_ids === 'string' ? JSON.parse(r.document_ids) : r.document_ids;

    // Fetch details of compared documents
    const docDetails = [];
    for (const dId of docIds) {
      const doc = await getDocumentById(dId, userId);
      if (doc) docDetails.push(doc);
    }

    return res.status(200).json({
      success: true,
      data: {
        validation: {
          id: r.id,
          title: r.title,
          documentIds: docIds,
          overallStatus: r.overall_status,
          discrepancyCount: r.discrepancy_count,
          checks: typeof r.checks === 'string' ? JSON.parse(r.checks) : r.checks,
          discrepancies: typeof r.discrepancies === 'string' ? JSON.parse(r.discrepancies) : r.discrepancies,
          aiExplanation: r.ai_explanation,
          recommendedAction: r.recommended_action,
          createdAt: r.created_at,
          documents: docDetails,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  compareDocuments,
  getValidations,
  getValidation,
};
