import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/env.js';
import routes from './routes/index.js';
import errorHandler from './middleware/error.middleware.js';
import logger from './utils/logger.js';

export function createApp(): Express {
  const app = express();

  // Security headers with Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    config.frontendUrl,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || config.nodeEnv === 'development') {
          callback(null, true);
        } else {
          callback(new Error('CORS policy: Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // General Rate Limiter
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
  });
  app.use('/api', generalLimiter);

  // Stricter Rate Limiter for Authentication
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 auth attempts per 15 min
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes.',
    },
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);

  // Request Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP Request Logging
  if (config.nodeEnv !== 'test') {
    app.use(
      morgan(':method :url :status :res[content-length] - :response-time ms', {
        stream: { write: (msg: string) => logger.info(msg.trim()) },
      })
    );
  }

  // Mount API Routes
  app.use('/api', routes);

  // Root welcome endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'DocuTrust AI API Engine',
      version: '1.0.0',
      status: 'operational',
      documentation: '/api/health',
    });
  });

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`,
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
}

export default createApp;
