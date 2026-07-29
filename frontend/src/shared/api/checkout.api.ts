import apiClient from './client';
import type { CheckoutPayload, CheckoutResult } from '../types/index';

export async function checkout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const res = await apiClient.post('/checkout', payload);
  return res.data.data;
}
