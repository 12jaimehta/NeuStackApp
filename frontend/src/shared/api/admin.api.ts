import apiClient from './client';
import type { AdminStats, GenerateDiscountResult } from '../types/index';

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await apiClient.get('/admin/stats');
  return res.data.data;
}

export async function generateDiscount(): Promise<GenerateDiscountResult> {
  const res = await apiClient.post('/admin/discount/generate');
  return res.data.data;
}

export async function validateDiscount(code: string): Promise<{ code: string; discountPercent: number }> {
  const res = await apiClient.post('/admin/discount/validate', { code });
  return res.data.data;
}
