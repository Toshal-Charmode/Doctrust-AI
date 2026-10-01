import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config/env.js';
import { query } from '../db/index.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = registerSchema.parse(req.body);
    const normalizedEmail = validatedData.email.toLowerCase().trim();

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows && existing.rows.length > 0) {
      sendError(res, 'A user with this email address already exists.', 409);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);
    const userId = crypto.randomUUID();

    const insertRes = await query(
      `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, created_at`,
      [userId, validatedData.name.trim(), normalizedEmail, passwordHash]
    );

    const user = insertRes.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    logger.info(`New user registered: ${user.email} (${user.id})`);

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      'Registration successful',
      201
    );
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = loginSchema.parse(req.body);
    const normalizedEmail = validatedData.email.toLowerCase().trim();

    const userRes = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
    if (!userRes.rows || userRes.rows.length === 0) {
      sendError(res, 'Invalid email or password credentials.', 401);
      return;
    }

    const user = userRes.rows[0];
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password_hash);

    if (!isPasswordValid) {
      sendError(res, 'Invalid email or password credentials.', 401);
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    );

    logger.info(`User logged in: ${user.email}`);

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, 'Unauthorized access', 401);
      return;
    }

    const userRes = await query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!userRes.rows || userRes.rows.length === 0) {
      sendError(res, 'User record not found', 404);
      return;
    }

    sendSuccess(res, { user: userRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

export default {
  register,
  login,
  getMe,
};
