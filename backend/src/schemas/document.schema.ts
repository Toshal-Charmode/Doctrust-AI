import { z } from 'zod';

export const documentTypeSchema = z.enum([
  'PURCHASE_ORDER',
  'INVOICE',
  'DELIVERY_RECEIPT',
  'QUOTATION',
  'OTHER',
]);

export const documentStatusSchema = z.enum([
  'UPLOADED',
  'PROCESSING',
  'PROCESSED',
  'REVIEW_REQUIRED',
  'FAILED',
]);

export const queryDocumentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: documentStatusSchema.optional(),
  type: documentTypeSchema.optional(),
  search: z.string().trim().optional(),
});

export type QueryDocumentsInput = z.infer<typeof queryDocumentsSchema>;
