-- DocuTrust AI PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  document_type TEXT DEFAULT 'OTHER', -- PURCHASE_ORDER, INVOICE, DELIVERY_RECEIPT, QUOTATION, OTHER
  status TEXT DEFAULT 'UPLOADED',    -- UPLOADED, PROCESSING, PROCESSED, REVIEW_REQUIRED, FAILED
  confidence NUMERIC(5, 4) DEFAULT 0.0,
  reason TEXT,
  summary TEXT,
  raw_text TEXT,
  warnings JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS extracted_data (
  id SERIAL PRIMARY KEY,
  document_id INTEGER UNIQUE NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  vendor_name TEXT,
  vendor_address TEXT,
  document_number TEXT,
  po_number TEXT,
  document_date TEXT,
  due_date TEXT,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC(15, 2),
  tax NUMERIC(15, 2),
  total NUMERIC(15, 2),
  payment_terms TEXT,
  received_by TEXT,
  line_items JSONB DEFAULT '[]'::jsonb,
  fields JSONB DEFAULT '{}'::jsonb,
  missing_fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS validations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_ids JSONB NOT NULL,
  overall_status TEXT NOT NULL, -- MATCH, REVIEW_REQUIRED, CRITICAL_MISMATCH
  discrepancy_count INTEGER DEFAULT 0,
  checks JSONB NOT NULL,
  discrepancies JSONB NOT NULL,
  ai_explanation TEXT NOT NULL,
  recommended_action TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  context_document_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_extracted_data_doc_id ON extracted_data(document_id);
CREATE INDEX IF NOT EXISTS idx_validations_user_id ON validations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
