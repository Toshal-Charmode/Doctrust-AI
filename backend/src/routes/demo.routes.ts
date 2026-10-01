import { Router } from 'express';
import { getSystemStatus, updateApiKey, seedDemo } from '../controllers/demo.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public system status (used by Navbar and dashboard badges)
router.get('/status', getSystemStatus);

// Authenticated or demo seed endpoints
router.post('/seed', authenticate, seedDemo);
router.post('/api-key', authenticate, updateApiKey);

export default router;
