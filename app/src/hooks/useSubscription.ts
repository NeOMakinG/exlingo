import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscription } from '../services/api';
import { useStore } from '../store/useStore';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  status: () => [...subscriptionKeys.all, 'status'] as const,
};

export const useSubscriptionStatus = (enabled = true) => {
  const updateUser = useStore((s) => s.updateUser);

  return useQuery({
    queryKey: subscriptionKeys.status(),
    queryFn: subscription.status,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      // Update local store when we get subscription status
      if (data.status) {
        updateUser({ subscriptionStatus: data.status });
      }
      return data;
    },
  });
};

export const useVerifyPurchase = () => {
  const queryClient = useQueryClient();
  const updateUser = useStore((s) => s.updateUser);

  return useMutation({
    mutationFn: ({
      platform,
      receipt,
      productId,
    }: {
      platform: 'ios' | 'android';
      receipt: string;
      productId: string;
    }) => subscription.verify(platform, receipt, productId),
    onSuccess: (data) => {
      if (data.subscription?.status === 'premium') {
        updateUser({
          subscriptionStatus: 'premium',
          subscriptionExpiresAt: data.subscription.expiresAt,
        });
      }
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.status() });
    },
  });
};
