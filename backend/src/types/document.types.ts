export type DocumentType =
  | 'PURCHASE_ORDER'
  | 'INVOICE'
  | 'DELIVERY_RECEIPT'
  | 'QUOTATION'
  | 'OTHER';

export type DocumentStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'REVIEW_REQUIRED'
  | 'FAILED';

export interface LineItem {
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  total: number | null;
}

export interface ExtractedFields {
  vendorName?: string | null;
  vendorAddress?: string | null;
  documentNumber?: string | null;
  invoiceNumber?: string | null;
  poNumber?: string | null;
  receiptNumber?: string | null;
  quotationNumber?: string | null;
  documentDate?: string | null;
  invoiceDate?: string | null;
  orderDate?: string | null;
  deliveryDate?: string | null;
  dueDate?: string | null;
  validityDate?: string | null;
  receivedBy?: string | null;
  currency?: string | null;
  subtotal?: number | null;
  tax?: number | null;
  total?: number | null;
  totalQuantity?: number | null;
  paymentTerms?: string | null;
  lineItems?: LineItem[];
  missingFields?: string[];
  warnings?: string[];
  summary?: string;
  [key: string]: any;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  document_type?: DocumentType;
  confidence?: number;
  status: DocumentStatus;
  summary?: string;
  created_at: Date;
  updated_at: Date;
  extracted_data?: ExtractedFields;
}
