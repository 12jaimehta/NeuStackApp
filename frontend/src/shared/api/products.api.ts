import apiClient from './client';
import type { Product } from '../types/index';

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiClient.get('/products');
  return res.data.data;
}
