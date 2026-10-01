import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import { query } from '../config/database.js';
import { sendError } from '../utils/apiResponse.js';
import { AuthPayload, User } from '../types/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      auth?: AuthPayload;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token missing.', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.auth = decoded;

    // Fetch user from database
    const userRes = await query<User>(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userRes.rows.length === 0) {
      return sendError(res, 'User session invalid or user not found.', 401);
    }

    req.user = userRes.rows[0];
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Your session has expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid authentication token.', 401);
  }
}

export const authenticate = requireAuth;
export default requireAuth;
