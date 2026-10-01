import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return sendError(res, `Validation error: ${issues}`, 400, error.errors);
      }
      return sendError(res, 'Invalid request body payload', 400);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): any => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return sendError(res, `Query validation error: ${issues}`, 400, error.errors);
      }
      return sendError(res, 'Invalid query parameters', 400);
    }
  };
}

export default {
  validateBody,
  validateQuery,
};
