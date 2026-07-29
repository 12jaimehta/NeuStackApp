import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../constants';
import { sendError } from '../utils/apiResponse';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    const detail = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', detail);
    return;
  }

  if (err.isOperational && err.statusCode) {
    sendError(res, err.statusCode, err.message);
    return;
  }
  console.error('[Unhandled Error]', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
  });
  sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
}
