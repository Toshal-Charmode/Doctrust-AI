import { Router } from 'express';
import { seedDemo, getSystemStatus, updateApiKey } from '../controllers/demoController.js';
import authenticate from '../middleware/auth.js';

const router = Router();

router.get('/status', getSystemStatus);
router.post('/seed', authenticate, seedDemo);
router.post('/api-key', authenticate, updateApiKey);

export default router;
