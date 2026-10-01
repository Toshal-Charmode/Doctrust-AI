import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import config from '../config/env.js';
import faceEngine from '../ai/faceEngine.js';
import {
  encryptFaceTemplate,
  decryptFaceTemplate,
  generateChallengeId,
} from '../services/biometricSecurity.js';

/**
 * Log biometric security audit events safely without leaking sensitive biometrics.
 */
async function recordAuditEvent(userId, eventType, similarityScore = null, livenessResult = null, req = null) {
  try {
    const ip = req?.ip || req?.headers['x-forwarded-for'] || null;
    const ua = req?.headers['user-agent'] || null;
    await db.query(
      `INSERT INTO biometric_audit_logs (user_id, event_type, similarity_score, liveness_result, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, eventType, similarityScore, livenessResult, ip, ua]
    );
  } catch (err) {
    console.error('Failed to write biometric audit log:', err.message);
  }
}

/**
 * POST /api/face-auth/enroll
 * Enrolls a user's facial profile after validating explicit consent and image quality.
 */
export async function enrollFace(req, res, next) {
  try {
    const userId = req.user.id;
    const { image, consent } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        error_code: 'CONSENT_REQUIRED',
        message: 'Explicit informed consent is required to enroll biometric facial data.',
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        error_code: 'IMAGE_REQUIRED',
        message: 'A live facial capture image is required for enrollment.',
      });
    }

    // Process image through AI engine
    const detectionResult = await faceEngine.detectAndExtractEmbedding(image);

    if (!detectionResult.success) {
      return res.status(400).json({
        success: false,
        error_code: detectionResult.error_code || 'PROCESSING_FAILED',
        message: detectionResult.message || 'Face detection and quality check failed.',
        quality: detectionResult.quality,
      });
    }

    // Check liveness
    if (detectionResult.liveness?.status === 'FAIL') {
      return res.status(400).json({
        success: false,
        error_code: 'LIVENESS_FAILED',
        message: 'Presentation attack detected. Enrollment requires a live camera selfie.',
        details: detectionResult.liveness.reason,
      });
    }

    // Encrypt the 128-dimensional embedding securely with AES-256-GCM
    const encryptedTemplate = encryptFaceTemplate(detectionResult.embedding);

    // Save to database
    const upsertRes = await db.query(
      `INSERT INTO biometric_enrollments (
         user_id, enrollment_status, encrypted_face_template, model_version, threshold_version, consent_timestamp, enrollment_timestamp, failed_attempts, locked_until
       )
       VALUES ($1, 'ACTIVE', $2, 'docutrust-cv-facenet-v1.0', 'cosine-0.96', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, NULL)
       ON CONFLICT (user_id) DO UPDATE SET
         enrollment_status = 'ACTIVE',
         encrypted_face_template = EXCLUDED.encrypted_face_template,
         model_version = EXCLUDED.model_version,
         threshold_version = EXCLUDED.threshold_version,
         consent_timestamp = CURRENT_TIMESTAMP,
         enrollment_timestamp = CURRENT_TIMESTAMP,
         failed_attempts = 0,
         locked_until = NULL,
         updated_at = CURRENT_TIMESTAMP
       RETURNING id, enrollment_status, model_version, threshold_version, enrollment_timestamp`,
      [userId, encryptedTemplate]
    );

    const enrollment = upsertRes.rows[0];
    await recordAuditEvent(userId, 'ENROLL', null, detectionResult.liveness?.status, req);

    return res.status(200).json({
      success: true,
      message: 'Facial profile enrolled successfully. Face authentication is now active.',
      data: {
        enrollmentStatus: enrollment.enrollment_status,
        modelVersion: enrollment.model_version,
        enrolledAt: enrollment.enrollment_timestamp,
        livenessCheck: detectionResult.liveness?.status,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/challenge
 * Creates a short-lived single-use authentication challenge for a pending login.
 */
export async function createChallenge(req, res, next) {
  try {
    const { userId, email } = req.body;

    let targetUserId = userId;
    if (!targetUserId && email) {
      const userRes = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (userRes.rows.length > 0) targetUserId = userRes.rows[0].id;
    }

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Valid user identifier is required to create an authentication challenge.',
      });
    }

    // Verify enrollment
    const enrolRes = await db.query(
      `SELECT enrollment_status, locked_until FROM biometric_enrollments WHERE user_id = $1`,
      [targetUserId]
    );

    if (enrolRes.rows.length === 0 || enrolRes.rows[0].enrollment_status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Face authentication is not active for this account.',
      });
    }

    const { locked_until } = enrolRes.rows[0];
    if (locked_until && new Date(locked_until) > new Date()) {
      return res.status(429).json({
        success: false,
        message: 'Account temporarily locked due to excessive failed biometric attempts. Please use fallback authentication.',
      });
    }

    const challengeId = generateChallengeId();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    await db.query(
      `INSERT INTO face_auth_challenges (id, user_id, status, attempts_left, expires_at)
       VALUES ($1, $2, 'PENDING', 3, $3)`,
      [challengeId, targetUserId, expiresAt]
    );

    return res.status(200).json({
      success: true,
      challengeId,
      expiresAt: expiresAt.toISOString(),
      attemptsLeft: 3,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/verify
 * Validates a live selfie against the enrolled profile for a pending challenge.
 * Issues full JWT session upon successful verification.
 */
export async function verifyFace(req, res, next) {
  try {
    const { challengeId, image } = req.body;

    if (!challengeId || !image) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID and live camera image capture are required.',
      });
    }

    // 1. Retrieve challenge
    const chalRes = await db.query(
      `SELECT id, user_id, status, attempts_left, expires_at FROM face_auth_challenges WHERE id = $1`,
      [challengeId]
    );

    if (chalRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or unrecognized authentication challenge.',
      });
    }

    const challenge = chalRes.rows[0];

    // Check status & expiry
    if (challenge.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `Challenge already ${challenge.status.toLowerCase()}. Please initiate a new login.`,
      });
    }

    if (new Date(challenge.expires_at) < new Date()) {
      await db.query(`UPDATE face_auth_challenges SET status = 'EXPIRED' WHERE id = $1`, [challengeId]);
      return res.status(400).json({
        success: false,
        message: 'Authentication challenge has expired. Please sign in again.',
      });
    }

    if (challenge.attempts_left <= 0) {
      await db.query(`UPDATE face_auth_challenges SET status = 'FAILED' WHERE id = $1`, [challengeId]);
      return res.status(403).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please use alternative authentication.',
      });
    }

    // 2. Retrieve user & enrolled template
    const enrolRes = await db.query(
      `SELECT encrypted_face_template, enrollment_status, failed_attempts, locked_until
       FROM biometric_enrollments WHERE user_id = $1`,
      [challenge.user_id]
    );

    if (enrolRes.rows.length === 0 || enrolRes.rows[0].enrollment_status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'No active biometric enrollment found for this account.',
      });
    }

    const enrollment = enrolRes.rows[0];
    if (enrollment.locked_until && new Date(enrollment.locked_until) > new Date()) {
      return res.status(429).json({
        success: false,
        message: 'Account temporarily locked. Please use password fallback authentication.',
      });
    }

    // 3. Process live image through AI face engine
    const detectionResult = await faceEngine.detectAndExtractEmbedding(image);

    if (!detectionResult.success) {
      return res.status(400).json({
        success: false,
        error_code: detectionResult.error_code || 'FACE_DETECTION_FAILED',
        message: detectionResult.message || 'Could not verify face. Please ensure your face is well-lit and centered.',
        quality: detectionResult.quality,
        attemptsLeft: challenge.attempts_left,
      });
    }

    // Check anti-spoofing
    const livenessResult = detectionResult.liveness?.status || 'INCONCLUSIVE';
    if (livenessResult === 'FAIL') {
      const remainingAttempts = challenge.attempts_left - 1;
      await db.query(
        `UPDATE face_auth_challenges SET attempts_left = $1, status = CASE WHEN $1 <= 0 THEN 'FAILED' ELSE 'PENDING' END WHERE id = $2`,
        [remainingAttempts, challengeId]
      );
      await recordAuditEvent(challenge.user_id, 'VERIFY_FAILURE', null, 'FAIL', req);
      return res.status(401).json({
        success: false,
        verified: false,
        message: 'Presentation attack detected. Verification rejected.',
        attemptsLeft: remainingAttempts,
        fallbackAvailable: true,
      });
    }

    // 4. Decrypt enrolled template in-memory
    const enrolledEmbedding = decryptFaceTemplate(enrollment.encrypted_face_template);

    // 5. Compare embeddings via cosine similarity
    const comparison = await faceEngine.compareEmbeddings(detectionResult.embedding, enrolledEmbedding);

    if (!comparison.match) {
      const remainingAttempts = challenge.attempts_left - 1;
      const newFailedCount = (enrollment.failed_attempts || 0) + 1;
      const shouldLock = newFailedCount >= 5;

      await db.query(
        `UPDATE face_auth_challenges
         SET attempts_left = $1, status = CASE WHEN $1 <= 0 THEN 'FAILED' ELSE 'PENDING' END
         WHERE id = $2`,
        [remainingAttempts, challengeId]
      );

      await db.query(
        `UPDATE biometric_enrollments
         SET failed_attempts = $1,
             locked_until = CASE WHEN $2 THEN CURRENT_TIMESTAMP + INTERVAL '10 minutes' ELSE locked_until END
         WHERE user_id = $3`,
        [newFailedCount, shouldLock, challenge.user_id]
      );

      await recordAuditEvent(challenge.user_id, 'VERIFY_FAILURE', comparison.score, livenessResult, req);

      return res.status(401).json({
        success: false,
        verified: false,
        message: 'Facial profile does not match the enrolled profile for this account.',
        attemptsLeft: remainingAttempts,
        fallbackAvailable: true,
      });
    }

    // 6. Match succeeded! Complete challenge and issue session
    await db.query(
      `UPDATE face_auth_challenges SET status = 'COMPLETED' WHERE id = $1`,
      [challengeId]
    );

    await db.query(
      `UPDATE biometric_enrollments
       SET last_successful_authentication = CURRENT_TIMESTAMP, failed_attempts = 0, locked_until = NULL
       WHERE user_id = $1`,
      [challenge.user_id]
    );

    await recordAuditEvent(challenge.user_id, 'VERIFY_SUCCESS', comparison.score, livenessResult, req);

    // Fetch user details to sign full JWT token
    const userRes = await db.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
      [challenge.user_id]
    );
    const user = userRes.rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.status(200).json({
      success: true,
      verified: true,
      message: 'Biometric identity verified successfully.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
        similarityScore: comparison.score,
        livenessCheck: livenessResult,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/face-auth/status
 * Returns current biometric enrollment status for the authenticated user.
 */
export async function getStatus(req, res, next) {
  try {
    const userId = req.user.id;

    const enrolRes = await db.query(
      `SELECT enrollment_status, model_version, threshold_version, consent_timestamp, enrollment_timestamp, last_successful_authentication
       FROM biometric_enrollments WHERE user_id = $1`,
      [userId]
    );

    if (enrolRes.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          isEnrolled: false,
          status: 'NONE',
          consentGiven: false,
          enrolledAt: null,
          lastAuthAt: null,
          modelVersion: 'docutrust-cv-facenet-v1.0',
        },
      });
    }

    const row = enrolRes.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        isEnrolled: row.enrollment_status === 'ACTIVE',
        status: row.enrollment_status,
        consentGiven: true,
        enrolledAt: row.enrollment_timestamp,
        lastAuthAt: row.last_successful_authentication,
        modelVersion: row.model_version,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/disable
 * Disables face authentication for the user after verifying password.
 */
export async function disableFace(req, res, next) {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Account password is required to disable face authentication.',
      });
    }

    const userRes = await db.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
    const isMatch = await bcrypt.compare(password, userRes.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Face authentication was not disabled.',
      });
    }

    await db.query(
      `UPDATE biometric_enrollments
       SET enrollment_status = 'DISABLED', updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId]
    );

    // Cancel pending challenges
    await db.query(
      `UPDATE face_auth_challenges SET status = 'EXPIRED' WHERE user_id = $1 AND status = 'PENDING'`,
      [userId]
    );

    await recordAuditEvent(userId, 'DISABLE', null, null, req);

    return res.status(200).json({
      success: true,
      message: 'Face authentication has been disabled.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/reenroll
 * Replaces existing facial profile with a new capture after verifying password.
 */
export async function reenrollFace(req, res, next) {
  try {
    const userId = req.user.id;
    const { password, image, consent } = req.body;

    if (!password || !image || !consent) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation, consent, and new face capture are required.',
      });
    }

    const userRes = await db.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
    const isMatch = await bcrypt.compare(password, userRes.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password confirmation.',
      });
    }

    const detectionResult = await faceEngine.detectAndExtractEmbedding(image);
    if (!detectionResult.success) {
      return res.status(400).json({
        success: false,
        error_code: detectionResult.error_code,
        message: detectionResult.message,
        quality: detectionResult.quality,
      });
    }

    const encryptedTemplate = encryptFaceTemplate(detectionResult.embedding);

    await db.query(
      `UPDATE biometric_enrollments
       SET encrypted_face_template = $1,
           enrollment_status = 'ACTIVE',
           enrollment_timestamp = CURRENT_TIMESTAMP,
           failed_attempts = 0,
           locked_until = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2`,
      [encryptedTemplate, userId]
    );

    await recordAuditEvent(userId, 'RE_ENROLL', null, detectionResult.liveness?.status, req);

    return res.status(200).json({
      success: true,
      message: 'Face profile successfully updated.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/revoke-consent
 * Completely purges stored biometric templates and revokes consent.
 */
export async function revokeConsent(req, res, next) {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password confirmation is required to revoke biometric consent.',
      });
    }

    const userRes = await db.query(`SELECT password_hash FROM users WHERE id = $1`, [userId]);
    const isMatch = await bcrypt.compare(password, userRes.rows[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password.',
      });
    }

    await db.query(`DELETE FROM biometric_enrollments WHERE user_id = $1`, [userId]);
    await db.query(`UPDATE face_auth_challenges SET status = 'EXPIRED' WHERE user_id = $1`, [userId]);
    await recordAuditEvent(userId, 'REVOKE_CONSENT', null, null, req);

    return res.status(200).json({
      success: true,
      message: 'Biometric consent revoked and all facial templates permanently deleted.',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/face-auth/fallback
 * Fallback authentication pathway using password if camera or face matching fails.
 */
export async function fallbackAuth(req, res, next) {
  try {
    const { challengeId, password } = req.body;

    if (!challengeId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Challenge ID and password are required for fallback authentication.',
      });
    }

    const chalRes = await db.query(
      `SELECT id, user_id, status, expires_at FROM face_auth_challenges WHERE id = $1`,
      [challengeId]
    );

    if (chalRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid authentication challenge.',
      });
    }

    const challenge = chalRes.rows[0];
    if (challenge.status !== 'PENDING' && challenge.status !== 'FAILED') {
      return res.status(400).json({
        success: false,
        message: 'Challenge is no longer valid.',
      });
    }

    const userRes = await db.query(
      `SELECT id, name, email, password_hash, role, created_at FROM users WHERE id = $1`,
      [challenge.user_id]
    );

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid fallback password.',
      });
    }

    await db.query(`UPDATE face_auth_challenges SET status = 'COMPLETED' WHERE id = $1`, [challengeId]);
    await recordAuditEvent(user.id, 'FALLBACK_USED', null, null, req);

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Fallback authentication successful.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  enrollFace,
  createChallenge,
  verifyFace,
  getStatus,
  disableFace,
  reenrollFace,
  revokeConsent,
  fallbackAuth,
};
