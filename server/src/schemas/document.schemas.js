import { z } from 'zod';

export const DOCUMENT_TYPES = [
  'PURCHASE_ORDER',
  'INVOICE',
  'DELIVERY_RECEIPT',
  'QUOTATION',
  'OTHER',
];

export const DOCUMENT_STATUSES = [
  'UPLOADED',
  'PROCESSING',
  'PROCESSED',
  'REVIEW_REQUIRED',
  'FAILED',
];

export const lineItemSchema = z.object({
  description: z.string().default(''),
  quantity: z.coerce.number().default(0),
  unitPrice: z.coerce.number().default(0),
  total: z.coerce.number().default(0),
});

export const geminiExtractionSchema = z.object({
  documentType: z.enum([
    'PURCHASE_ORDER',
    'INVOICE',
    'DELIVERY_RECEIPT',
    'QUOTATION',
    'OTHER',
  ]),
  confidence: z.coerce.number().min(0).max(1),
  reason: z.string().default(''),
  summary: z.string().default(''),
  fields: z.object({
    vendorName: z.string().nullable().optional(),
    vendorAddress: z.string().nullable().optional(),
    documentNumber: z.string().nullable().optional(),
    invoiceNumber: z.string().nullable().optional(),
    poNumber: z.string().nullable().optional(),
    receiptNumber: z.string().nullable().optional(),
    quotationNumber: z.string().nullable().optional(),
    documentDate: z.string().nullable().optional(),
    invoiceDate: z.string().nullable().optional(),
    orderDate: z.string().nullable().optional(),
    deliveryDate: z.string().nullable().optional(),
    quotationDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
    validityDate: z.string().nullable().optional(),
    currency: z.string().default('USD'),
    subtotal: z.coerce.number().nullable().optional(),
    tax: z.coerce.number().nullable().optional(),
    total: z.coerce.number().nullable().optional(),
    paymentTerms: z.string().nullable().optional(),
    receivedBy: z.string().nullable().optional(),
    totalQuantity: z.coerce.number().nullable().optional(),
  }).passthrough().default({}),
  lineItems: z.array(lineItemSchema).default([]),
  missingFields: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

export const documentQuerySchema = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});
