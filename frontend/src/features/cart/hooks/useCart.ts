import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart } from '../../../shared/api/cart.api';
import { checkout } from '../../../shared/api/checkout.api';
import { getUserId } from '../../../shared/utils/helpers';
import { validateDiscount } from '../../../shared/api/admin.api';
import type { CheckoutPayload } from '../../../shared/types/index';
import { toast } from 'sonner';

export function useCart() {
  const userId = getUserId();
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => fetchCart(userId),
    staleTime: 0,
  });
}

export function useCartItemCount() {
  const { data: cart } = useCart();
  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const userId = getUserId();

  return useMutation({
    mutationFn: (discountCode?: string) => {
      const payload: CheckoutPayload = { userId };
      if (discountCode?.trim()) payload.discountCode = discountCode.trim();
      return checkout(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast.success(
        `Order #${data.orderNumber} placed! Saved ${data.discountAmount > 0 ? `₹${data.discountAmount}` : ''}`,
        { duration: 5000 },
      );
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useValidateDiscount() {
  return useMutation({
    mutationFn: (code: string) => validateDiscount(code),
    onSuccess: () => {
      toast.success('Discount code applied!');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
