import { Request, Response, NextFunction } from 'express';
import config from '../config/env.js';
import logger from '../utils/logger.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): any {
  logger.error(`[${req.method} ${req.originalUrl}] ${err.message || err}`);

  // Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `File size exceeds the allowed limit of ${config.maxFileSizeMb}MB.`,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded at once. Maximum is 10 files.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Custom HTTP status codes
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && err.stack ? { stack: err.stack } : {}),
  });
}

export default errorHandler;
