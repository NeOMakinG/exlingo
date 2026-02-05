import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth, setAuthToken } from '../services/api';
import { useStore } from '../store/useStore';

export const authKeys = {
  all: ['auth'] as const,
  verify: () => [...authKeys.all, 'verify'] as const,
};

export const useVerifyAuth = () => {
  return useQuery({
    queryKey: authKeys.verify(),
    queryFn: auth.verify,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGoogleSignIn = () => {
  const queryClient = useQueryClient();
  const setUser = useStore((s) => s.setUser);

  return useMutation({
    mutationFn: auth.signInWithGoogle,
    onSuccess: async (data) => {
      await setAuthToken(data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        nativeLanguage: 'en',
        hasCompletedOnboarding: true,
        subscriptionStatus: 'free',
        createdAt: Date.now(),
      });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useAppleSignIn = () => {
  const queryClient = useQueryClient();
  const setUser = useStore((s) => s.setUser);

  return useMutation({
    mutationFn: ({ idToken, user }: { idToken: string; user?: any }) =>
      auth.signInWithApple(idToken, user),
    onSuccess: async (data) => {
      await setAuthToken(data.token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        nativeLanguage: 'en',
        hasCompletedOnboarding: true,
        subscriptionStatus: 'free',
        createdAt: Date.now(),
      });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const reset = useStore((s) => s.reset);

  return useMutation({
    mutationFn: async () => {
      await setAuthToken(null);
    },
    onSuccess: () => {
      reset();
      queryClient.clear();
    },
  });
};
