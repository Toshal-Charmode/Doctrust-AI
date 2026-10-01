import { Router } from 'express';
import authRoutes from './authRoutes.js';
import documentRoutes from './documentRoutes.js';
import validationRoutes from './validationRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import chatRoutes from './chatRoutes.js';
import demoRoutes from './demoRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/documents', documentRoutes);
apiRouter.use('/validation', validationRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/demo', demoRoutes);

// Health check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    name: 'DocuTrust AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
