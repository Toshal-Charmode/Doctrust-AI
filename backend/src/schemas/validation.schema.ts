import { z } from 'zod';

export const compareRequestSchema = z.object({
  documentIds: z
    .array(z.string().uuid('Each document ID must be a valid UUID'))
    .min(2, 'At least 2 documents are required for cross-document comparison')
    .max(5, 'Maximum 5 documents can be compared at once'),
});

export type CompareRequestInput = z.infer<typeof compareRequestSchema>;
export const validationCompareSchema = compareRequestSchema;

