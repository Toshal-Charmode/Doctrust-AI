import { getGeminiClient, cleanJsonResponse } from './gemini.service.js';
import { query } from '../../db/index.js';
import logger from '../../utils/logger.js';
import crypto from 'crypto';

export const CHAT_SYSTEM_PROMPT = `
You are DocuTrust AI's procurement intelligence assistant.
Your job is to answer user questions about their business documents, purchase orders, invoices, delivery receipts, quotations, and cross-document reconciliation discrepancies.

CRITICAL RULES:
1. Ground every answer STRICTLY in the provided context.
2. If the answer cannot be determined from the documents provided, state clearly: "Based on your uploaded documents, this information is not available."
3. Never invent invoice numbers, PO numbers, prices, or vendor names.
4. Keep answers concise, factual, and actionable.
5. If the user asks why a document or validation was flagged, cite the exact discrepancy and numerical differences (e.g. quantity variance, price mismatch).
`;

export async function askAiAssistant(userId: string, question: string): Promise<string> {
  // 1. Retrieve user's documents with extracted data
  const docsRes = await query(
    `SELECT d.id, d.original_filename, d.document_type, d.confidence, d.status, d.summary,
            e.data as extracted_data
     FROM documents d
     LEFT JOIN extracted_data e ON d.id = e.document_id
     WHERE d.user_id = $1
     ORDER BY d.created_at DESC
     LIMIT 20`,
    [userId]
  );

  // 2. Retrieve recent validations
  const valRes = await query(
    `SELECT id, status, overall_severity, summary, results, created_at
     FROM validations
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [userId]
  );

  const documents = docsRes.rows || [];
  const validations = valRes.rows || [];

  // 3. Build grounded context safely
  const docContext = documents.map((doc: any) => {
    const data = doc.extracted_data || {};
    return {
      id: doc.id,
      filename: doc.original_filename,
      type: doc.document_type,
      status: doc.status,
      vendor: data.vendorName || 'N/A',
      documentNumber: data.documentNumber || data.invoiceNumber || data.poNumber || 'N/A',
      date: data.documentDate || data.invoiceDate || data.orderDate || 'N/A',
      total: data.total,
      currency: data.currency || 'USD',
      lineItems: data.lineItems || [],
      warnings: data.warnings || [],
      summary: doc.summary || data.summary || '',
    };
  });

  const valContext = validations.map((val: any) => ({
    id: val.id,
    status: val.status,
    severity: val.overall_severity,
    summary: val.summary,
    discrepancies: val.results?.discrepancies || [],
  }));

  const gemini = getGeminiClient();
  let answer = '';

  if (gemini) {
    try {
      const prompt = `${CHAT_SYSTEM_PROMPT}

USER'S DOCUMENT CONTEXT:
${JSON.stringify(docContext, null, 2)}

RECENT RECONCILIATION VALIDATIONS:
${JSON.stringify(valContext, null, 2)}

USER QUESTION:
"${question}"

ANSWER:`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      answer = (response.text || '').trim();
    } catch (err: any) {
      logger.error(`Gemini chat failure: ${err.message}. Using grounded fallback reasoning.`);
    }
  }

  // Grounded heuristic fallback if Gemini is offline/unconfigured
  if (!answer) {
    answer = generateFallbackGroundedAnswer(question, docContext, valContext);
  }

  // 4. Save chat message to database
  try {
    const messageId = crypto.randomUUID();
    await query(
      `INSERT INTO chat_messages (id, user_id, question, answer, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [messageId, userId, question, answer]
    );
  } catch (err: any) {
    logger.error(`Failed to save chat message: ${err.message}`);
  }

  return answer;
}

function generateFallbackGroundedAnswer(
  question: string,
  docs: any[],
  validations: any[]
): string {
  const q = question.toLowerCase();

  // Flagged / Discrepancy question
  if (q.includes('flag') || q.includes('discrepancy') || q.includes('mismatch') || q.includes('issue') || q.includes('why')) {
    const flaggedVals = validations.filter((v) => v.status === 'REVIEW_REQUIRED' || v.discrepancies?.length > 0);
    if (flaggedVals.length > 0) {
      const firstVal = flaggedVals[0];
      const issues = firstVal.discrepancies.map((d: any) => d.message).join('; ');
      return `Documents were flagged under audit check with status "${firstVal.status}" (${firstVal.severity} severity). Discrepancies detected: ${issues || firstVal.summary}`;
    }

    const flaggedDocs = docs.filter((d) => d.status === 'REVIEW_REQUIRED' || d.warnings?.length > 0);
    if (flaggedDocs.length > 0) {
      const d = flaggedDocs[0];
      return `Document ${d.filename} (${d.documentNumber}) is marked ${d.status}. Warnings: ${d.warnings.join(', ')}.`;
    }

    return 'No active discrepancies or warnings were detected in your uploaded documents. All documents currently pass standard reconciliation rules.';
  }

  // Count / How many documents
  if (q.includes('how many') || q.includes('count') || q.includes('total document')) {
    const invoices = docs.filter((d) => d.type === 'INVOICE').length;
    const pos = docs.filter((d) => d.type === 'PURCHASE_ORDER').length;
    const drs = docs.filter((d) => d.type === 'DELIVERY_RECEIPT').length;
    const quotes = docs.filter((d) => d.type === 'QUOTATION').length;
    return `You have ${docs.length} total document(s) uploaded: ${invoices} Invoice(s), ${pos} Purchase Order(s), ${drs} Delivery Receipt(s), and ${quotes} Quotation(s).`;
  }

  // Invoice query
  if (q.includes('invoice') || q.includes('inv')) {
    const invoices = docs.filter((d) => d.type === 'INVOICE');
    if (invoices.length > 0) {
      return `Found ${invoices.length} invoice(s): ${invoices.map((i) => `${i.documentNumber || i.filename} from ${i.vendor} for $${i.total?.toLocaleString() || '0'}`).join(', ')}.`;
    }
  }

  // Purchase Order query
  if (q.includes('po') || q.includes('purchase order')) {
    const pos = docs.filter((d) => d.type === 'PURCHASE_ORDER');
    if (pos.length > 0) {
      return `Found ${pos.length} purchase order(s): ${pos.map((p) => `${p.documentNumber || p.filename} issued to ${p.vendor} for $${p.total?.toLocaleString() || '0'}`).join(', ')}.`;
    }
  }

  // Default grounded response
  if (docs.length === 0) {
    return 'You have not uploaded any procurement documents yet. Please upload Purchase Orders, Invoices, Delivery Receipts, or Quotations to enable intelligence queries.';
  }

  return `Based on your ${docs.length} uploaded document(s), DocuTrust AI is tracking items from vendors including ${Array.from(new Set(docs.map((d) => d.vendor).filter((v) => v !== 'N/A'))).join(', ') || 'N/A'}. Let me know if you need specific field reconciliation or discrepancy explanations.`;
}

export default {
  askAiAssistant,
};
