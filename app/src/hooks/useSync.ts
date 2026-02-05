import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sync } from '../services/api';
import { useStore } from '../store/useStore';

export const syncKeys = {
  all: ['sync'] as const,
  data: () => [...syncKeys.all, 'data'] as const,
};

export const useSyncData = (enabled = false) => {
  return useQuery({
    queryKey: syncKeys.data(),
    queryFn: sync.get,
    enabled, // Only fetch when user is premium
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePushSync = () => {
  const queryClient = useQueryClient();
  const languageSheets = useStore((s) => s.languageSheets);
  const user = useStore((s) => s.user);

  return useMutation({
    mutationFn: () =>
      sync.push({
        languageSheets,
        settings: { nativeLanguage: user?.nativeLanguage },
        lastLocalUpdate: Date.now(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syncKeys.data() });
    },
  });
};

export const useDeleteSyncData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sync.delete,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: syncKeys.all });
    },
  });
};
