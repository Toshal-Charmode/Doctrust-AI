import { getGeminiClient, cleanJsonResponse } from './gemini.service.js';
import { aiExplanationSchema } from '../../schemas/ai.schema.js';
import { ValidationResult } from '../../types/validation.types.js';
import logger from '../../utils/logger.js';

export const EXPLANATION_SYSTEM_PROMPT = `
You are DocuTrust AI's Lead Procurement Auditor.
You are provided with a structured list of deterministic cross-document reconciliation checks and discrepancies.

YOUR TASK:
Explain these findings in clear, professional, human-readable language for accounts payable managers and auditors.
Highlight:
1. Exact matching details (e.g., vendor identity, referenced PO).
2. The specific discrepancies (e.g., invoice billing for more units than authorized, unit price creep, missing delivery receipt).
3. The specific financial risk.
4. Concrete recommended action (e.g. "HOLD PAYMENT: Request corrected credit note or revised invoice from supplier.").

OUTPUT MUST BE VALID RAW JSON:
{
  "explanation": "Clear explanation paragraph...",
  "recommendedAction": "Actionable recommendation..."
}
`;

export async function generateValidationExplanation(
  validation: ValidationResult,
  documentsInfo: any[]
): Promise<{ explanation: string; recommendedAction: string }> {
  const gemini = getGeminiClient();

  if (gemini) {
    try {
      const prompt = `${EXPLANATION_SYSTEM_PROMPT}

DOCUMENTS INVOLVED:
${documentsInfo.map((d) => `- [${d.document_type}] ${d.original_filename} (Doc #${d.extracted_data?.documentNumber || 'N/A'}, Vendor: ${d.extracted_data?.vendorName || 'N/A'}, Total: $${d.extracted_data?.total || 0})`).join('\n')}

VALIDATION SUMMARY:
Overall Status: ${validation.overallStatus}
Overall Severity: ${validation.overallSeverity}
Discrepancies Detected: ${validation.discrepancies.length}

CHECKS MATRIX:
${JSON.stringify(validation.checks, null, 2)}

DISCREPANCIES DETECTED:
${JSON.stringify(validation.discrepancies, null, 2)}
`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const raw = cleanJsonResponse(response.text || '{}');
      const parsed = JSON.parse(raw);
      const validated = aiExplanationSchema.parse(parsed);
      return validated;
    } catch (err: any) {
      logger.error(`Gemini validation explanation generation error: ${err.message}`);
    }
  }

  // Deterministic rule-based fallback explanation
  if (validation.discrepancies.length === 0) {
    return {
      explanation:
        'All cross-document reconciliation checks passed with 100% agreement. The vendor invoice matches the approved purchase order and delivery receipt across vendor name, item quantities, unit prices, and financial amounts.',
      recommendedAction: 'Approve invoice for payment processing and general ledger posting.',
    };
  }

  const issues = validation.discrepancies.map((d) => d.message).join(' ');
  const isHigh = validation.overallSeverity === 'HIGH';

  return {
    explanation: `Cross-document reconciliation flagged ${validation.discrepancies.length} discrepancy(ies) requiring audit. ${issues}`,
    recommendedAction: isHigh
      ? 'HOLD PAYMENT: Issue discrepancy notice to vendor requesting a revised invoice matching approved PO quantities and rates.'
      : 'Route to procurement supervisor for secondary variance approval.',
  };
}

export default {
  generateValidationExplanation,
};
