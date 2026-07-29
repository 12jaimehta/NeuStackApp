import { Response } from 'express';
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  status: number,
  message: string,
  data: T,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  message: string,
  error?: string,
): Response {
  const body: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    ...(error ? { error } : {}),
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(body);
}
