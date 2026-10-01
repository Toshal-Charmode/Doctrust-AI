import { z } from 'zod';

export const compareRequestSchema = z.object({
  documentIds: z.array(z.coerce.number().int()).min(2, 'Select at least 2 documents to compare').max(5),
  title: z.string().trim().optional(),
});

export const validationCheckSchema = z.object({
  field: z.string(),
  label: z.string().optional(),
  status: z.enum(['MATCH', 'MISMATCH', 'MISSING', 'NOT_APPLICABLE']),
  details: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  expectedValue: z.any().optional(),
  actualValue: z.any().optional(),
});

export const discrepancySchema = z.object({
  field: z.string(),
  expectedValue: z.any(),
  actualValue: z.any(),
  difference: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  explanation: z.string(),
});

export const validationResultSchema = z.object({
  overallStatus: z.enum(['MATCH', 'REVIEW_REQUIRED', 'CRITICAL_MISMATCH']),
  title: z.string(),
  checks: z.array(validationCheckSchema),
  discrepancies: z.array(discrepancySchema),
  aiExplanation: z.string(),
  recommendedAction: z.string().optional(),
});
