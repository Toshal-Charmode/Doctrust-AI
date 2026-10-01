import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Protect dashboard routes
router.use(requireAuth);

router.get('/stats', dashboardController.getStats);

export default router;
