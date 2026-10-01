import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import documentRoutes from './document.routes.js';
import validationRoutes from './validation.routes.js';
import chatRoutes from './chat.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import demoRoutes from './demo.routes.js';
import faceAuthRoutes from './faceAuth.routes.js';
import { checkDbHealth } from '../db/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  const isDbHealthy = await checkDbHealth();
  sendSuccess(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: isDbHealthy ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/face-auth', faceAuthRoutes);
router.use('/documents', documentRoutes);
router.use('/validation', validationRoutes);
router.use('/chat', chatRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/demo', demoRoutes);

export default router;
