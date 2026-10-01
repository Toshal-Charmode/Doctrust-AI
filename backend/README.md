# DocuTrust AI — Backend API Engine

> **"Turn documents into decisions."**
> Production-grade Intelligent Document Processing (IDP) and Procurement Reconciliation Backend built with Node.js, Express, TypeScript, PostgreSQL, and Google Gemini 2.5 Flash via `@google/genai`.

---

## 📑 Table of Contents
1. [System Overview](#system-overview)
2. [Key Capabilities](#key-capabilities)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Database & Migrations](#database--migrations)
9. [Running the Backend](#running-the-backend)
10. [Automated Test Suite](#automated-test-suite)
11. [Complete API Documentation](#complete-api-documentation)
    - [Health Check](#health-check)
    - [Authentication Endpoints](#authentication-endpoints)
    - [Document Management & AI Extraction](#document-management--ai-extraction)
    - [Cross-Document Reconciliation & AI Explanations](#cross-document-reconciliation--ai-explanations)
    - [Dashboard & Analytics](#dashboard--analytics)
    - [Grounded AI Knowledge Chat](#grounded-ai-knowledge-chat)
12. [Deterministic Reconciliation Engine](#deterministic-reconciliation-engine)
13. [Security Architecture](#security-architecture)

---

## 🔍 System Overview

**DocuTrust AI** automates accounts payable and procurement auditing across 4 commercial document types:
1. **Purchase Orders (PO)** — Authorized buyer commitment, agreed pricing, and line items.
2. **Invoices (INV)** — Supplier billing records, payment terms, and line items.
3. **Delivery Receipts (DR)** — Warehouse delivery confirmation and received piece counts.
4. **Quotations (QUOTE)** — Commercial price proposals with validity windows.

The backend performs **AI Classification & Extraction** using Google Gemini 2.5 Flash, **Deterministic Mathematical & Relational Variance Analysis** (2-way & 3-way matching), **AI Audit Explanations**, and **Grounded Procurement RAG Q&A**.

---

## 🚀 Key Capabilities

- **Strict Multi-Tenant Isolation**: Uploads stored in `uploads/<userId>/` with directory traversal protection (`resolveUserFilePath`).
- **Zod AI Validation**: All Gemini extraction schemas are validated with Zod, rejecting malformed JSON and applying automated risk warnings.
- **Deterministic Math Engine**: Never trusts LLMs with arithmetic. Variance formulas compute quantity differences, unit price drift, and financial total discrepancies with 0.01 tolerance.
- **AI Audit Explanations**: Gemini 2.5 Flash translates structured reconciliation discrepancies into human-readable CFO/Auditor recommendations.
- **Grounded AI RAG Chat**: Context-limited Q&A restricted exclusively to authenticated user records, preventing hallucination or cross-tenant leaks.
- **Dual PostgreSQL Engine**: Works seamlessly with remote PostgreSQL / Supabase, with automatic fallback to embedded PostgreSQL (`@electric-sql/pglite`) for instant zero-config offline execution.

---

## 🛠 Architecture & Tech Stack

- **Runtime**: Node.js v20+ / v22+
- **Language**: TypeScript (ES Modules, `NodeNext`)
- **Web Framework**: Express.js
- **Database**: PostgreSQL (UUID primary keys, JSONB columns, indexed foreign keys)
- **AI Integration**: Google Gemini API (`@google/genai`, model `gemini-2.5-flash`)
- **Authentication**: JWT (`jsonwebtoken`) + Salted bcrypt password hashing (`bcryptjs`)
- **Schema Validation**: Zod
- **File Upload**: Multer (disk storage, MIME validation, 10MB limit)
- **Security**: Helmet, CORS, Express-Rate-Limit
- **PDF Extraction**: `pdf-parse`

---

## 📁 Folder Structure

```
backend/
├── data/                      # Embedded PostgreSQL storage (when running offline)
├── uploads/                   # Isolated user upload directories: uploads/<userId>/
├── src/
│   ├── config/
│   │   ├── database.ts        # PostgreSQL connection pool & PGlite fallback
│   │   └── env.ts             # Zod environment variable validation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── document.controller.ts
│   │   └── validation.controller.ts
│   ├── db/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql  # Database tables & indexes
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts          # Bearer JWT verification
│   │   ├── error.middleware.ts         # Centralized HTTP error handling
│   │   ├── upload.middleware.ts        # Multer MIME/size enforcement
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── dashboard.routes.ts
│   │   ├── document.routes.ts
│   │   ├── validation.routes.ts
│   │   └── index.ts           # Central router index
│   ├── schemas/
│   │   ├── ai.schema.ts       # Structured Zod extraction schemas
│   │   ├── auth.schema.ts
│   │   ├── chat.schema.ts
│   │   ├── document.schema.ts
│   │   └── validation.schema.ts
│   ├── services/
│   │   ├── ai/
│   │   │   ├── chat.service.ts         # Grounded RAG retrieval
│   │   │   ├── classification.service.ts
│   │   │   ├── explanation.service.ts  # AI audit explanation generator
│   │   │   ├── extraction.service.ts   # Gemini 2.5 Flash document analyzer
│   │   │   └── gemini.service.ts       # Gemini client singleton
│   │   ├── documents/
│   │   │   └── document.service.ts     # Document CRUD & processing lifecycle
│   │   └── validation/
│   │       ├── discrepancy.service.ts  # Deterministic comparison math
│   │       └── validation.service.ts   # Multi-document reconciliation orchestrator
│   ├── types/
│   │   ├── ai.types.ts
│   │   ├── auth.types.ts
│   │   ├── document.types.ts
│   │   └── validation.types.ts
│   ├── utils/
│   │   ├── apiResponse.ts
│   │   ├── fileUtils.ts       # Path traversal guards & directory handlers
│   │   └── logger.ts          # Formatted server logging
│   ├── app.ts                 # Express application builder
│   └── server.ts              # Server startup & DB migration entry point
├── test/
│   └── backend.test.ts        # 12-phase end-to-end integration test suite
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📋 Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* PostgreSQL server (if connecting to external database)
- *(Optional)* Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

---

## ⚙️ Installation & Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your desired configuration (see [Environment Variables](#environment-variables)).

---

## 🔐 Environment Variables

| Variable | Description | Default | Required |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP Server port | `5000` | No |
| `NODE_ENV` | Environment (`development` \| `production` \| `test`) | `development` | No |
| `DATABASE_URL` | PostgreSQL connection URI | Embedded PGlite if empty | No |
| `JWT_SECRET` | Secret key used to sign authentication tokens | Auto-fallback dev secret | **Yes in Production** |
| `JWT_EXPIRES_IN` | JWT token lifetime | `7d` | No |
| `GEMINI_API_KEY` | Google AI Studio API Key for Gemini 2.5 Flash | Optional (uses fallback if omitted) | Recommended |
| `MAX_FILE_SIZE_MB` | Maximum allowed upload size in megabytes | `10` | No |
| `FRONTEND_URL` | CORS origin for React/Vite client | `http://localhost:5173` | No |

---

## 🗄 Database & Migrations

The database schema is defined in [`src/db/migrations/001_initial_schema.sql`](file:///Users/parigupta/cloud%20coders/backend/src/db/migrations/001_initial_schema.sql).

### Tables Created:
1. **`users`**: User identity, email (unique), password hashes.
2. **`documents`**: Document metadata, MIME type, storage path, status, AI classification, confidence, summary.
3. **`extracted_data`**: JSONB structured key-value extraction and line items (Cascade delete).
4. **`validations`**: 2-way and 3-way reconciliation results, discrepancy lists, and severity scores.
5. **`validation_documents`**: Many-to-many junction linking validations to evaluated documents.
6. **`chat_messages`**: Chat history and grounded Q&A responses per user.

*Note: Migrations run automatically on server boot. No manual migration command is needed!*

---

## ▶️ Running the Backend

### Development Mode (with Live Reload):
```bash
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

---

## 🧪 Automated Test Suite

Run the full end-to-end integration and unit test suite:
```bash
npm test
```

### What is tested (12 Phases):
1. Database initialization and migration verification
2. Deterministic mathematical discrepancy logic (amount, quantity, vendor, currency, dates)
3. `GET /api/health`
4. `POST /api/auth/register`
5. `POST /api/auth/login` (and invalid credential rejection)
6. `GET /api/auth/me` (and 401 unauthenticated protection)
7. `POST /api/documents/upload` (multipart PDF upload)
8. `POST /api/documents/:id/process` (structured AI extraction)
9. Multi-tenant document isolation and path traversal security
10. `POST /api/validation/compare` & `POST /api/validation/:id/explain`
11. `GET /api/dashboard/stats` (real PostgreSQL aggregations)
12. `POST /api/chat` (grounded intelligence QA)

---

## 📡 Complete API Documentation

Base URL: `http://localhost:5000/api`

### Health Check

#### `GET /health`
- **Auth Required**: No
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-10-01T05:38:04.252Z",
    "database": "connected",
    "environment": "development"
  }
}
```

---

### Authentication Endpoints

#### `POST /auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Jane Auditor",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "e6a0d249-f5ce-49b0-9519-7bcda238d99c",
      "name": "Jane Auditor",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `POST /auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "e6a0d249-f5ce-49b0-9519-7bcda238d99c",
      "name": "Jane Auditor",
      "email": "jane@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `GET /auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "e6a0d249-f5ce-49b0-9519-7bcda238d99c",
      "name": "Jane Auditor",
      "email": "jane@example.com",
      "created_at": "2026-10-01T05:38:04.252Z"
    }
  }
}
```

---

### Document Management & AI Extraction

#### `POST /documents/upload`
- **Auth Required**: Yes (`Bearer <token>`)
- **Content-Type**: `multipart/form-data`
- **Form Field**: `files` (one or multiple PDF/PNG/JPG files)
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "3 file(s) uploaded successfully",
  "data": {
    "documents": [
      {
        "id": "1b1f4357-65c2-4ba6-b59a-502ea238db9f",
        "filename": "Purchase_Order_1024-1790833084502-15113966.pdf",
        "originalFilename": "Purchase_Order_1024.pdf",
        "mimeType": "application/pdf",
        "fileSize": 104250,
        "status": "UPLOADED",
        "createdAt": "2026-10-01T05:38:04.511Z"
      }
    ],
    "count": 1
  }
}
```

#### `GET /documents`
- **Auth Required**: Yes (`Bearer <token>`)
- **Query Params**: `?page=1&limit=20&status=PROCESSED&type=INVOICE&search=Acme`
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "documents": [...],
    "total": 4,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### `GET /documents/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response**: `200 OK` (returns document metadata, AI classification, extracted data, warnings, and processing status)

#### `POST /documents/:id/process`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Sends file to Gemini 2.5 Flash for classification, structured JSON extraction, and heuristic risk warning evaluation.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "Document processed successfully",
  "data": {
    "documentId": "1b1f4357-65c2-4ba6-b59a-502ea238db9f",
    "documentType": "PURCHASE_ORDER",
    "confidence": 0.97,
    "status": "PROCESSED",
    "summary": "Authorized Purchase Order PO-1024 issued to Acme Industrial Supplies Inc. for 100 units totaling $50,000.00.",
    "extractedData": {
      "vendorName": "Acme Industrial Supplies Inc.",
      "poNumber": "PO-1024",
      "documentDate": "2026-09-10",
      "currency": "USD",
      "total": 50000,
      "totalQuantity": 100,
      "lineItems": [
        {
          "description": "Industrial Precision Ball Bearings (SKU: BB-9902)",
          "quantity": 100,
          "unitPrice": 500,
          "total": 50000
        }
      ]
    },
    "warnings": [],
    "missingFields": []
  }
}
```

#### `DELETE /documents/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Securely deletes database record, extracted JSON, and unlinks file from disk.

---

### Cross-Document Reconciliation & AI Explanations

#### `POST /validation/compare`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
```json
{
  "documentIds": [
    "1b1f4357-65c2-4ba6-b59a-502ea238db9f",
    "f46f0003-7c24-4ccc-bb5c-fa531a40aacc",
    "98137195-4538-409d-b6ef-9c239b784117"
  ]
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "message": "Cross-document reconciliation completed",
  "data": {
    "id": "534915f1-61c3-4814-b46d-6a72f505d161",
    "overallStatus": "REVIEW_REQUIRED",
    "overallSeverity": "HIGH",
    "discrepancies": [
      {
        "field": "totalAmount",
        "status": "MISMATCH",
        "expectedValue": 50000,
        "actualValue": 55000,
        "difference": 5000,
        "severity": "HIGH",
        "message": "Total amount mismatch: Invoice total ($55,000) exceeds PURCHASE_ORDER authorized total ($50,000) by $5,000 (10.0% variance)."
      },
      {
        "field": "quantity",
        "status": "MISMATCH",
        "expectedValue": 100,
        "actualValue": 110,
        "difference": 10,
        "severity": "HIGH",
        "message": "Invoice quantity (110) exceeds authorized purchase order quantity (100) by 10 unit(s)."
      }
    ],
    "checks": [...],
    "summary": "Reconciliation flagged 2 discrepancy(ies) across fields [totalAmount, quantity]. Review required before payment approval."
  }
}
```

#### `POST /validation/:id/explain`
- **Auth Required**: Yes (`Bearer <token>`)
- **Description**: Generates an auditor-ready explanation and recommended course of action via Gemini 2.5 Flash.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "AI audit explanation generated",
  "data": {
    "explanation": "Cross-document reconciliation flagged 2 discrepancies requiring audit. Total amount mismatch: Invoice total ($55,000) exceeds PURCHASE_ORDER authorized total ($50,000) by $5,000 (10.0% variance). Invoiced quantity (110) does not match physical delivery receipt intake (100).",
    "recommendedAction": "HOLD PAYMENT: Issue discrepancy notice to vendor requesting a revised invoice matching approved PO quantities and rates."
  }
}
```

#### `GET /validation`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response**: List of user's past validation records.

#### `GET /validation/:id`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response**: Detailed validation record with linked documents and discrepancies.

---

### Dashboard & Analytics

#### `GET /dashboard/stats`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "totalDocuments": 4,
    "processedDocuments": 4,
    "verifiedDocuments": 1,
    "reviewRequired": 1,
    "failedDocuments": 0,
    "discrepancies": 2,
    "documentTypes": {
      "invoice": 2,
      "purchaseOrder": 1,
      "deliveryReceipt": 1,
      "quotation": 0
    }
  }
}
```

---

### Grounded AI Knowledge Chat

#### `POST /chat`
- **Auth Required**: Yes (`Bearer <token>`)
- **Request Body**:
```json
{
  "question": "Why was INV-9042 flagged during validation?"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "answer": "Documents were flagged under audit check with status 'REVIEW_REQUIRED' (HIGH severity). Discrepancies detected: Total amount mismatch: Invoice total ($55,000) exceeds PURCHASE_ORDER authorized total ($50,000) by $5,000 (10.0% variance); Invoice quantity (110) exceeds authorized purchase order quantity (100) by 10 unit(s)."
  }
}
```

---

## 🛡 Security Architecture

1. **Path Traversal Guard**: Filenames are sanitized with regex and resolved using `path.resolve()`, throwing explicit exceptions if path leaves the designated user folder.
2. **API Key Isolation**: `GEMINI_API_KEY` is exclusively consumed in backend services and is never exposed in any client response.
3. **Database Parameterization**: All SQL queries use parameterized arguments (`$1`, `$2`, ...) to eliminate SQL injection vulnerabilities.
4. **Brute-Force Throttling**: Strict IP rate limiting (100 requests per 15 min for auth, 500 requests per 15 min for general API).
5. **CORS & HTTP Headers**: Protected with Helmet security headers and explicit CORS origin checks.

---

## 🏁 Quickstart Command Summary

```bash
# 1. Install packages
npm install

# 2. Run TypeScript build verification
npm run build

# 3. Execute test suite
npm test

# 4. Launch backend API server
npm run dev
```
