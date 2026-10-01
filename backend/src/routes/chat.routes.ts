import { Router } from 'express';
import chatController from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Protect chat routes
router.use(requireAuth);

router.post('/', chatController.askQuestion);

export default router;
