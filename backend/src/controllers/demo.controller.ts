import { Request, Response, NextFunction } from 'express';
import config from '../config/env.js';
import { getGeminiClient } from '../services/ai/gemini.service.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { query } from '../db/index.js';
import crypto from 'crypto';

export async function getSystemStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const isConfigured = Boolean(getGeminiClient());
    
    let totalDocs = 0;
    try {
      const countRes = await query('SELECT count(*)::int as count FROM documents');
      totalDocs = countRes.rows[0]?.count || 0;
    } catch {
      // ignore
    }

    sendSuccess(res, {
      geminiConfigured: isConfigured,
      confidenceThreshold: config.confidenceThreshold,
      model: 'gemini-2.5-flash',
      storage: 'Supabase PostgreSQL (SSL)',
      environment: config.nodeEnv,
      totalDocuments: totalDocs,
      status: 'operational',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateApiKey(req: Request, res: Response, next: NextFunction) {
  try {
    const { apiKey } = req.body;
    if (apiKey && typeof apiKey === 'string') {
      config.geminiApiKey = apiKey.trim();
    }

    sendSuccess(res, {
      geminiConfigured: Boolean(getGeminiClient()),
    }, 'Gemini API key updated for the active server session');
  } catch (error) {
    next(error);
  }
}

export async function seedDemo(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000001';
    
    // Create demo PO
    const poId = crypto.randomUUID();
    await query(
      `INSERT INTO documents (id, user_id, filename, original_name, mime_type, file_size, document_type, status, confidence_score, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        poId,
        userId,
        'demo_po_1024.pdf',
        'Purchase_Order_PO-1024.pdf',
        'application/pdf',
        45230,
        'PURCHASE_ORDER',
        'PROCESSED',
        0.99,
        JSON.stringify({
          poNumber: 'PO-1024',
          vendor: 'Apex Industrial Supply',
          items: [{ description: 'High-Torque Actuator', quantity: 100, unitPrice: 500, total: 50000 }],
          total: 50000,
        }),
      ]
    );

    // Create demo Invoice
    const invId = crypto.randomUUID();
    await query(
      `INSERT INTO documents (id, user_id, filename, original_name, mime_type, file_size, document_type, status, confidence_score, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO NOTHING`,
      [
        invId,
        userId,
        'demo_inv_9042.pdf',
        'Invoice_Acme_INV-9042.pdf',
        'application/pdf',
        38120,
        'INVOICE',
        'PROCESSED',
        0.98,
        JSON.stringify({
          invoiceNumber: 'INV-9042',
          vendor: 'Apex Industrial Supply',
          poReference: 'PO-1024',
          items: [{ description: 'High-Torque Actuator', quantity: 100, unitPrice: 500, total: 50000 }],
          total: 50000,
        }),
      ]
    );

    sendCreated(res, {
      documents: [
        { id: poId, type: 'PURCHASE_ORDER', number: 'PO-1024' },
        { id: invId, type: 'INVOICE', number: 'INV-9042' },
      ],
    }, 'Demo procurement documents loaded and ready for reconciliation');
  } catch (error) {
    next(error);
  }
}

export default {
  getSystemStatus,
  updateApiKey,
  seedDemo,
};
