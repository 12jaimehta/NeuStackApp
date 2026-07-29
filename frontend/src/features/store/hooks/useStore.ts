import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts } from '../../../shared/api/products.api';
import { addToCart } from '../../../shared/api/cart.api';
import { getUserId } from '../../../shared/utils/helpers';
import type { Product } from '../../../shared/types/index';
import { toast } from 'sonner';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const userId = getUserId();

  return useMutation({
    mutationFn: (product: Product) =>
      addToCart({
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      toast.success('Added to cart!');
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

// Separate hook for cart quantity adjustments (+1 / -1 / full remove)
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  const userId = getUserId();

  return useMutation({
    mutationFn: ({ productId, name, price, delta }: { productId: string; name: string; price: number; delta: number }) =>
      addToCart({ userId, productId, name, price, quantity: delta }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
