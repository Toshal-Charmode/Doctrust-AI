# DocuTrust AI — Turn documents into decisions.

> **Intelligent Document Processing (IDP) Platform for Procurement and Commercial Finance.**  
> Built for the 2026 Intelligent Document Processing Hackathon.

DocuTrust AI automates procurement document understanding, classification, structured information extraction, 3-way match cross-document validation, discrepancy detection, actionable AI insights, and grounded conversational knowledge discovery.

---

## 🌟 Key Capabilities & Hackathon Theme Alignment

1. **Document Understanding & Vision Pipeline**: Accepts multi-page PDFs, PNG, and JPG documents. Integrates `@google/genai` (Gemini 2.5 Flash) with fallback rule-based intelligence for 100% offline and demo reliability.
2. **Document Classification**: Distinguishes `PURCHASE_ORDER`, `INVOICE`, `DELIVERY_RECEIPT`, `QUOTATION`, and `OTHER` with explicit confidence scores and justification reasoning.
3. **Structured Information Extraction**: Extracts type-specific procurement fields (Vendor name, address, Document #, PO references, dates, subtotal, tax, grand total, currency, payment terms) and itemized line-item tables with unit pricing and quantities.
4. **Data Validation with Zod**: Every AI output is strictly validated against robust Zod schemas to ensure structural integrity and mathematical consistency.
5. **Cross-Document Reconciliation (3-Way Match)**: Automated audit engine that compares Purchase Orders, Invoices, and Delivery Receipts across 11 key dimensions:
   - Vendor identity verification
   - PO reference validation
   - Invoice numbering audit
   - Currency consistency
   - Quantity reconciliation (PO authorized vs Invoice billed vs Warehouse delivered)
   - Line-item unit price discrepancy checks
   - Financial total variance calculations
   - Date chronology (ensuring invoice follows order date)
   - Physical warehouse delivery intake confirmation
6. **Discrepancy Detection & Severity Classification**: Automatically detects variances and rates them by risk (`HIGH`, `MEDIUM`, `LOW`), showing expected vs. actual values and variance amounts.
7. **Actionable AI Insights**: Generates executive human-readable explanations explaining *why* an invoice requires review and recommends concrete operational actions (`HOLD PAYMENT`, `REQUEST REVISED INVOICE`, `APPROVE FOR ERP`).
8. **AI Knowledge Discovery Chat (Grounded RAG)**: Natural conversational search across your document library. Grounded strictly in uploaded documents with zero hallucinations.
9. **One-Click Demo Experience**: Includes pre-seeded procurement test cases (Acme Supplies PO-1024, Acme Supplies Invoice INV-9042 with quantity discrepancy, and FastTrack Logistics Delivery Receipt DR-5512).
10. **AI Face Recognition & Biometric Authentication**: Enterprise biometric verification module seamlessly integrated into user login and profile settings:
    - **Step-Up Biometric Factor**: Password verification triggers a single-use short-lived challenge (`5 min` expiry) if face authentication is active.
    - **Real Computer Vision AI Engine**: OpenCV-powered face detection, Laplacian sharpness/blur evaluation, multi-scale 128-dimensional normalized facial feature vector extraction, and cosine similarity comparison ($0.96$ calibrated threshold).
    - **Anti-Spoofing & Liveness Detection (PAD)**: Frequency spectrum analysis and chromaticity distribution heuristics detecting printed photographs and screen replay attacks.
    - **Biometric Security & Encryption**: Zero raw image persistence; templates encrypted at rest with authenticated `AES-256-GCM`.
    - **Privacy Controls & Consent**: Explicit informed consent required for enrollment, with one-click disablement, re-enrollment, and complete permanent template purging.
    - **Safe Fallback Authentication**: Secure password fallback pathway ensures authorized users are never locked out if webcam hardware fails.

---

## 🏗️ System Architecture

```
DOCUTRUST AI ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│                 Vite + React 19 Frontend                    │
│   (Tailwind CSS v4 • Lucide Icons • React Router v7)        │
│   • Landing Page • Dashboard • Upload Zone • Document Detail│
│   • 3-Way Match Validation Center • Grounded AI Chat        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API (JWT Auth)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Node.js + Express Backend                     │
│   • JWT Auth & Bcrypt   • Multer Multipart Upload           │
│   • Zod Schema Guard    • Error Handling & CORS             │
└──────┬───────────────────────┬──────────────────────────────┘
       │                       │
       ▼                       ▼
┌──────────────┐      ┌───────────────────────────────────────┐
│  PostgreSQL  │      │        Google Gemini API              │
│  (Supabase / │      │     (Official @google/genai SDK)      │
│  Embedded    │      │  • Multi-modal Gemini 2.5 Flash       │
│  PGlite)     │      │  • Document Vision & OCR Analysis     │
│              │      │  • Grounded RAG Knowledge Discovery   │
└──────────────┘      └───────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Routing**: React Router 7
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) & `bcryptjs`
- **Validation**: Zod 3
- **File Upload**: Multer (PDF, PNG, JPG support up to 15MB)
- **PDF Extraction**: `pdf-parse`

### Database
- **PostgreSQL**: Production-ready PostgreSQL schema with indexes and foreign keys.
- **Embedded PGlite Support**: Native embedded PostgreSQL engine (`@electric-sql/pglite`) for zero-friction local setup without requiring a separate PostgreSQL daemon.
- **External PostgreSQL / Supabase**: Fully supported via `DATABASE_URL` connection string.

### Artificial Intelligence
- **SDK**: Official `@google/genai` SDK
- **Model**: `gemini-2.5-flash`
- **Security**: GEMINI_API_KEY resides strictly on the backend and is never exposed to client code.

---

## 📁 Repository Structure

```
.
├── .env.example               # Root environment configuration guide
├── package.json               # Root scripts (concurrently runner)
├── README.md                  # Comprehensive platform documentation
├── test_e2e.js                # Automated end-to-end integration test suite
├── server/
│   ├── .env.example           # Backend environment template
│   ├── .env                   # Local backend environment
│   ├── package.json           # Server dependencies
│   ├── uploads/               # Stored uploaded files (PDF, PNG, JPG)
│   ├── data/postgres/         # Persistent embedded PostgreSQL storage
│   └── src/
│       ├── config/            # Environment and Gemini SDK configuration
│       ├── db/                # PostgreSQL schema (schema.sql) & connection pool
│       ├── middleware/        # JWT auth, Multer upload, Zod validation, error handler
│       ├── schemas/           # Zod schemas for auth, documents, validations, chat
│       ├── services/
│       │   ├── ai/            # Gemini vision processing, prompts, JSON cleaner
│       │   ├── documents/     # Upload handlers, document persistence, demo seeder
│       │   ├── validation/    # 3-Way match reconciliation & discrepancy detector
│       │   └── chat/          # Grounded conversational discovery service
│       ├── controllers/       # Auth, Document, Validation, Dashboard, Chat controllers
│       ├── routes/            # Express routes mounted under /api
│       ├── app.js             # Express app setup with CORS & static upload serving
│       └── server.js          # Server entrypoint initializing database & listening
└── client/
    ├── index.html             # SEO meta tags, title, Google Fonts (Inter)
    ├── vite.config.js         # Vite configuration with Tailwind plugin & API proxy
    ├── package.json           # Frontend dependencies
    └── src/
        ├── components/
        │   ├── layout/        # Navbar, Sidebar, Footer, Layout, ProtectedRoute
        │   └── ui/            # Status badges, EmptyState, Severity pills
        ├── context/           # AuthContext (JWT) and ToastContext (notifications)
        ├── pages/
        │   ├── LandingPage.jsx          # Public SaaS landing page & visual pipeline
        │   ├── LoginPage.jsx            # Sign in with 1-click demo credentials autofill
        │   ├── RegisterPage.jsx         # Sign up with instant validation
        │   ├── DashboardPage.jsx        # Real-time analytics, attention required, recent docs
        │   ├── DocumentsPage.jsx        # Catalog, multi-select, filters, search
        │   ├── UploadPage.jsx           # Drag-and-drop file upload with progress bar
        │   ├── DocumentDetailsPage.jsx  # Split view metadata, extracted fields, line items
        │   ├── ValidationCenterPage.jsx # 3-way match matrix, discrepancy breakdown, AI actions
        │   ├── ChatPage.jsx             # Grounded AI knowledge discovery chat
        │   └── SettingsPage.jsx         # Gemini API key management & thresholds
        ├── services/          # API clients (auth, documents, validation, dashboard, demo)
        ├── App.jsx            # React Router setup
        └── index.css          # Tailwind CSS v4 styling
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
Run from the repository root:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Default `server/.env` parameters:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=docutrust_secure_jwt_secret_key_hackathon_2026_dev
JWT_EXPIRES_IN=7d
DATABASE_URL=
GEMINI_API_KEY=
CLIENT_URL=http://localhost:3000
```
> **Note on Database**: Leave `DATABASE_URL=` empty to use the embedded PostgreSQL database (stored automatically in `server/data/postgres`). Or provide a standard connection string (e.g., `postgresql://postgres:password@localhost:5432/docutrust` or Supabase).
>
> **Note on Gemini API**: If `GEMINI_API_KEY` is not provided, DocuTrust AI automatically runs an intelligent rule/heuristic engine for sample procurement documents so you can evaluate the complete pipeline immediately.

### 3. Run the Application
From the root directory, start both the frontend and backend concurrently:
```bash
npm run dev
```

Alternatively, run in separate terminals:
```bash
# Terminal 1: Backend API (port 5001)
npm run server

# Terminal 2: Frontend Client (port 3000)
npm run client
```

Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Demo Workflow & Evaluation Guide

To experience the complete end-to-end workflow in under 60 seconds:

1. **Visit the Landing Page**: Open [http://localhost:3000](http://localhost:3000). Inspect the hero, visual workflow pipeline, and procurement feature cards.
2. **One-Click Demo Sign In**: Click **"View Demo"** or **"Sign In"**. Click **"Auto-fill demo user"** to load `admin@docutrust.ai` / `Password123!`, then click **"Sign In"**.
3. **Inspect the Dashboard**:
   - View the 5 real metric cards: Total Documents, Processed, Verified, Need Review, Discrepancies Detected.
   - Review the **Attention Required** alert section highlighting documents with quantity variances.
4. **Inspect Extracted Document Details**:
   - Go to **Documents** in the sidebar.
   - Click **"Details"** on `Acme_Supplies_Invoice_INV-9042.pdf`.
   - Observe the split-view: metadata on the left, structured extracted fields (vendor address, dates, invoice number, PO reference, subtotal, tax, grand total) and itemized line items on the right.
5. **Run 3-Way Match in Validation Center**:
   - Click **Validation Center** in the sidebar.
   - Select:
     - Document A: `Acme_Supplies_PO-1024.pdf` (Purchase Order)
     - Document B: `Acme_Supplies_Invoice_INV-9042.pdf` (Invoice)
     - Document C: `FastTrack_Logistics_Delivery_DR-5512.pdf` (Delivery Receipt)
   - Click **"Run Cross-Document Validation"**.
   - Review the **CRITICAL MISMATCH** banner, the itemized discrepancy breakdown (PO quantity 100 vs Invoice quantity 110, variance: +10 units / +$5,000.00), the 11-point verification matrix, and the executive AI auditor explanation with recommended operational action (`HOLD PAYMENT`).
6. **Query the Grounded AI Knowledge Chat**:
   - Go to **AI Knowledge Chat** in the sidebar.
   - Click suggested queries like:
     - *"Why was Invoice INV-9042 flagged?"*
     - *"What is the total value of processed invoices?"*
     - *"Find all documents related to PO-1024"*
   - Observe the strictly grounded responses referencing exact document numbers and amounts.
7. **Test Real Document Upload**:
   - Go to **Upload Documents** in the sidebar.
   - Drag and drop your own PDF or image invoice.
   - Watch the upload progress bar and live Gemini extraction pipeline.

---

## 🔌 API Reference

All protected endpoints require `Authorization: Bearer <token>`.

### Authentication
- `POST /api/auth/register` — Register a new procurement auditor account
- `POST /api/auth/login` — Sign in and obtain JWT access token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### Biometric Face Authentication
- `POST /api/face-auth/enroll` — Enroll live face capture with explicit informed consent (AES-256-GCM template storage)
- `GET /api/face-auth/status` — Retrieve user's biometric enrollment status and timestamps
- `POST /api/face-auth/challenge` — Create short-lived (5 min), single-use challenge after password validation
- `POST /api/face-auth/verify` — Verify live selfie against enrolled template and issue authenticated session
- `POST /api/face-auth/fallback` — Authenticate using account password if camera or biometric check is unavailable
- `POST /api/face-auth/disable` — Disable face login requirement (requires password confirmation)
- `POST /api/face-auth/reenroll` — Replace enrolled facial profile with new capture (requires password confirmation)
- `POST /api/face-auth/revoke-consent` — Permanently purge biometric template and revoke consent

### Documents
- `POST /api/documents/upload` — Upload multiple documents (multipart/form-data)
- `GET /api/documents` — Query documents with filters (`type`, `status`, `search`)
- `GET /api/documents/:id` — Retrieve single document with full extracted fields & line items
- `POST /api/documents/:id/process` — Trigger Gemini AI re-extraction on an existing document
- `DELETE /api/documents/:id` — Delete document from database and filesystem

### Validation
- `POST /api/validation/compare` — Perform 2-way or 3-way match validation between selected documents
- `GET /api/validation` — List historical validation runs
- `GET /api/validation/:id` — Retrieve specific validation report by ID

### Dashboard & Analytics
- `GET /api/dashboard/stats` — Aggregated metrics, recent files, attention required, and activity timeline

### Grounded Knowledge Chat
- `POST /api/chat` — Submit query to grounded AI chat assistant
- `GET /api/chat/history` — Retrieve chat conversation history

### Demo & System Diagnostics
- `POST /api/demo/seed` — Seed sample procurement documents and auto-run 3-way match validation
- `GET /api/demo/status` — Check Gemini API and PostgreSQL health status
- `POST /api/demo/api-key` — Update Gemini API key for current session

---

## 🛡️ Security & Enterprise Readiness

- **Zero Client-Side Secrets**: `GEMINI_API_KEY` and encryption keys are strictly confined to the backend server.
- **Biometric Cryptography**: Facial templates encrypted at rest with authenticated `AES-256-GCM` using unique 12-byte IVs; zero raw image persistence.
- **Single-Use Challenge Lifecycle**: 5-minute expiration, replay attack prevention, and strict attempt decrement (max 3 failed tries).
- **Strict Password Hashing**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **JWT Authorization**: Strict bearer token validation with configurable expiry.
- **User Document Isolation**: Multi-tenant database design ensures users can only access their own documents, validations, and biometric data.
- **Multi-Layer Validation**: Request payloads validated with Zod schemas on both frontend and backend.
- **Controlled File Uploads**: Multer whitelist restricted to `application/pdf`, `image/png`, and `image/jpeg` with 15MB size caps.

---

## 🚀 Automated Acceptance Tests

Run the complete automated test suites anytime:

```bash
# 1. AI Face Recognition & Biometric Authentication E2E Test (19 acceptance tests)
npm run test:face

# 2. Document Processing & 3-Way Match E2E Test (17 acceptance tests)
npm run test:e2e
```

This script exercises all 17 acceptance criteria from registration, document processing, and extraction to 3-way match discrepancy detection, grounded AI chat, and dashboard analytics.

---

## 📄 License
MIT License. Created for the Intelligent Document Processing Hackathon 2026.
