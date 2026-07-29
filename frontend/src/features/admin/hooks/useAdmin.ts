import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminStats, generateDiscount } from '../../../shared/api/admin.api';
import { toast } from 'sonner';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    refetchInterval: 10_000,
  });
}

export function useGenerateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateDiscount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(`Discount code generated: ${data.code}`, { duration: 8000 });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}
