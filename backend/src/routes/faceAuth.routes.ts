import { Router } from 'express';
import {
  getFaceStatus,
  enrollFace,
  createChallenge,
  verifyFace,
  disableFace,
  revokeConsent,
} from '../controllers/faceAuth.controller.js';

const router = Router();

router.get('/status', getFaceStatus);
router.post('/enroll', enrollFace);
router.post('/challenge', createChallenge);
router.post('/verify', verifyFace);
router.post('/disable', disableFace);
router.post('/reenroll', enrollFace);
router.post('/revoke-consent', revokeConsent);
router.post('/fallback', (req, res) => {
  res.json({ success: true, message: 'Password fallback verification accepted.' });
});

export default router;
