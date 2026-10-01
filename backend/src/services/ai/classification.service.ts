import { ClassificationResult } from '../../types/ai.types.js';
import { DocumentType } from '../../types/document.types.js';

export function determineDocumentStatus(
  confidence: number,
  warnings: string[],
  missingFields: string[],
  confidenceThreshold: number = 0.75
): 'PROCESSED' | 'REVIEW_REQUIRED' | 'FAILED' {
  if (confidence < confidenceThreshold) {
    return 'REVIEW_REQUIRED';
  }
  if (warnings.length > 0 || missingFields.length > 0) {
    return 'REVIEW_REQUIRED';
  }
  return 'PROCESSED';
}

export default {
  determineDocumentStatus,
};
