import express from 'express';
import cors from 'cors';
import path from 'path';
import config from './config/env.js';
import apiRouter from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Security and CORS configuration
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(config.uploadDir));

// Mount main API routes
app.use('/api', apiRouter);

// Fallback 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler middleware
app.use(errorHandler);

export default app;
