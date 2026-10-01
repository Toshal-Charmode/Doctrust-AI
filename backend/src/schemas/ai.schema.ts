import { z } from 'zod';
import { documentTypeSchema } from './document.schema.js';

export const lineItemSchema = z.object({
  description: z.string().default(''),
  quantity: z.number().nullable().optional().default(null),
  unitPrice: z.number().nullable().optional().default(null),
  total: z.number().nullable().optional().default(null),
});

export const classificationSchema = z.object({
  documentType: documentTypeSchema,
  confidence: z.coerce.number().min(0).max(1),
  reason: z.string().default(''),
});

export const structuredExtractionSchema = z.object({
  classification: classificationSchema,
  fields: z.object({
    vendorName: z.string().nullable().optional().default(null),
    vendorAddress: z.string().nullable().optional().default(null),
    documentNumber: z.string().nullable().optional().default(null),
    invoiceNumber: z.string().nullable().optional().default(null),
    poNumber: z.string().nullable().optional().default(null),
    receiptNumber: z.string().nullable().optional().default(null),
    quotationNumber: z.string().nullable().optional().default(null),
    documentDate: z.string().nullable().optional().default(null),
    invoiceDate: z.string().nullable().optional().default(null),
    orderDate: z.string().nullable().optional().default(null),
    deliveryDate: z.string().nullable().optional().default(null),
    quotationDate: z.string().nullable().optional().default(null),
    dueDate: z.string().nullable().optional().default(null),
    validityDate: z.string().nullable().optional().default(null),
    currency: z.string().nullable().optional().default('USD'),
    subtotal: z.coerce.number().nullable().optional().default(null),
    tax: z.coerce.number().nullable().optional().default(null),
    total: z.coerce.number().nullable().optional().default(null),
    totalQuantity: z.coerce.number().nullable().optional().default(null),
    paymentTerms: z.string().nullable().optional().default(null),
    receivedBy: z.string().nullable().optional().default(null),
  }).passthrough().default({}),
  lineItems: z.array(lineItemSchema).default([]),
  missingFields: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  summary: z.string().default(''),
});

export const aiExplanationSchema = z.object({
  explanation: z.string().min(1),
  recommendedAction: z.string().min(1),
});

export type StructuredExtractionOutput = z.infer<typeof structuredExtractionSchema>;
export type ClassificationOutput = z.infer<typeof classificationSchema>;
