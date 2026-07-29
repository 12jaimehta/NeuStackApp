import { z } from 'zod';

export const AddToCartSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  productId: z.string().min(1, 'productId is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().int(),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
