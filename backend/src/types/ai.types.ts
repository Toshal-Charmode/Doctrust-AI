import { DocumentType, ExtractedFields } from './document.types.js';

export interface ClassificationResult {
  documentType: DocumentType;
  confidence: number;
  reason: string;
}

export interface ExtractionResult {
  classification: ClassificationResult;
  extractedFields: ExtractedFields;
  missingFields: string[];
  warnings: string[];
  summary: string;
}

export interface AiExplanationResult {
  explanation: string;
  recommendedAction: string;
}
