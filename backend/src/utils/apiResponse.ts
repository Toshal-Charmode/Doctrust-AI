import { Response } from 'express';

export interface ApiResponseOptions<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

export function sendCreated<T = any>(
  res: Response,
  data?: T,
  message: string = 'Created'
): Response {
  return sendSuccess(res, data, message, 201);
}

export function sendError(
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  error?: any
): Response {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(error !== undefined ? { error } : {}),
  });
}

export default {
  sendSuccess,
  sendError,
};
