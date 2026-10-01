import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import {
  enrollFace,
  createChallenge,
  verifyFace,
  getStatus,
  disableFace,
  reenrollFace,
  revokeConsent,
  fallbackAuth,
} from '../controllers/faceAuthController.js';

const router = Router();

// Biometric enrollment (requires authenticated user session)
router.post('/enroll', authenticate, enrollFace);

// Status of biometric enrollment for authenticated user
router.get('/status', authenticate, getStatus);

// Disable face login (requires user reauthentication)
router.post('/disable', authenticate, disableFace);

// Re-enroll face (requires user reauthentication)
router.post('/reenroll', authenticate, reenrollFace);

// Revoke consent and purge biometric template
router.post('/revoke-consent', authenticate, revokeConsent);

// Challenge creation (called during 2-step login)
router.post('/challenge', createChallenge);

// Live face verification for pending challenge
router.post('/verify', verifyFace);

// Fallback password authentication when face factor fails or is unavailable
router.post('/fallback', fallbackAuth);

export default router;
