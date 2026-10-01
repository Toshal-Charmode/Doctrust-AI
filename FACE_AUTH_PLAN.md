# AI Face Recognition Login & Profile Verification System - Implementation Plan

## 1. System Architecture Overview

This integrates an enterprise-grade **AI Face Recognition Login & Profile Verification System** into DocuTrust AI without disrupting existing document verification or credential-based authentication.

```mermaid
flowchart TD
    subgraph Client ["Client (React + Framer Motion)"]
        A[Login Page / Standard Login] -->|Email + Password| B{Has Face Auth Enabled?}
        B -->|No| C[Normal Authenticated Session]
        B -->|Yes| D[Step 2: Face Challenge UI]
        D -->|Webcam Capture + Consent| E[Face Verification Modal / Scanner]
        E -->|Captured Selfie + challengeId| F[API: /api/face-auth/verify]
        G[Profile Settings / Register] -->|Enrolls Face + Consent| H[API: /api/face-auth/enroll]
    end

    subgraph Backend ["Backend (Node.js Express + PGlite / PostgreSQL)"]
        F --> I[Challenge Validation & Rate Limiter]
        I --> J[AI Face Engine & Quality Evaluator]
        J --> K[Decrypt Enrolled Face Template (AES-256-GCM)]
        K --> L[Cosine Similarity Comparison & Liveness Analysis]
        L -->|Match >= 0.78| M[Consume Challenge & Issue JWT Token]
        L -->|Mismatch| N[Safe Retry Count Decrement / Fallback Option]
    end

    subgraph BiometricSecurity ["Biometric Security & AI Engine"]
        J -.-> O[OpenCV Face Detection + Haar/DNN Cascades]
        O -.-> P[Image Quality Check: Blur/Laplacian + Lighting + Aspect Ratio]
        P -.-> Q[128-D Normalized Facial Feature Vector Generation]
        Q -.-> R[Liveness & Anti-Spoofing Assessment]
    end
```

## 2. Key Modules & Deliverables

1. **Database Schema Extension**:
   - `biometric_enrollments`: Stores user ID, status, AES-256-GCM encrypted template, model version, threshold, consent timestamp, audit timestamps.
   - `face_auth_challenges`: Stores short-lived single-use challenge IDs, expiration timestamps, and retry counts.
   - `biometric_audit_logs`: Detailed immutable audit trail for security compliance.

2. **AI Face Recognition Engine (`server/src/ai/face_processor.py` & `server/src/ai/faceEngine.js`)**:
   - OpenCV-powered single-face detection with landmark alignment.
   - Image quality checks: resolution, Laplacian variance (blur), mean intensity (lighting), bounding box centering.
   - 128-dimensional normalized facial feature vector extraction.
   - Real cosine similarity metric evaluated against validated threshold (0.78).
   - Multi-layer liveness & anti-spoofing heuristics (frequency distribution, specular highlight analysis) supporting `PASS`, `FAIL`, and `INCONCLUSIVE`.

3. **Backend Face Auth API (`/api/face-auth/`)**:
   - `POST /api/face-auth/enroll`: Explicit consent, quality check, encryption, storage.
   - `POST /api/face-auth/challenge`: Generates single-use challenge after password validation.
   - `POST /api/face-auth/verify`: Validates live capture against enrolled template, consumes challenge, issues full JWT.
   - `GET /api/face-auth/status`: Current enrollment and consent status.
   - `POST /api/face-auth/disable`: Reauthentication requirement, revokes enrollment.
   - `POST /api/face-auth/reenroll`: Re-capture and secure replacement of template.
   - `POST /api/face-auth/revoke-consent`: Permanent purging of biometric data.
   - `POST /api/face-auth/fallback`: Alternative authentication pathway if camera or verification fails.

4. **Frontend UI/UX**:
   - High-end `LiquidBackground` with glowing orbs.
   - Interactive `FaceScannerUI` with live webcam preview, reticle brackets, facial mesh SVG, laser scanner line, and match score counter.
   - Two-step Login: Password verification -> Face ID verification challenge.
   - Settings Page: Comprehensive Face Login card with enrollment status, live setup modal, re-enrollment, and consent revocation.
   - Register Page: Optional post-registration biometric enrollment onboarding.

5. **Automated Verification & Testing**:
   - End-to-end integration tests verifying enrollment, challenge generation, matching accuracy, replay protection, and fallback.
