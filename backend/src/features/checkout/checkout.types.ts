import { z } from 'zod';

export const CheckoutSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  discountCode: z.string().optional(),
});

export type CheckoutDto = z.infer<typeof CheckoutSchema>;

export interface CheckoutResult {
  orderId: string;
  orderNumber: number;
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  discountCode: string | null;
  total: number;
  createdAt: Date;
}
