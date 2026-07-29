import apiClient from './client';
import type { Cart, AddToCartPayload } from '../types/index';

export async function fetchCart(userId: string): Promise<Cart> {
  const res = await apiClient.get(`/cart/${userId}`);
  return res.data.data;
}

export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
  const res = await apiClient.post('/cart/add', payload);
  return res.data.data;
}
