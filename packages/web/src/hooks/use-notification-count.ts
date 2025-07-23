'use client';

import { trpc } from '@/lib/trpc';
import { useEffect, useState } from 'react';
import { useWebSocket } from './use-websocket';

interface UseNotificationCountProps {
  userId: string;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useNotificationCount({
  userId,
  enabled = true,
  refetchInterval = 30000, // 30 seconds default
}: UseNotificationCountProps) {
  const [count, setCount] = useState(0);

  // WebSocket for real-time updates
  const { connected } = useWebSocket({
    userId,
    enabled: enabled && !!userId,
    onCountUpdate: () => {
      // Refetch count when WebSocket notifies of updates
      refetch();
    },
    onNewNotification: () => {
      // Increment count optimistically for new notifications
      incrementCount();
    },
  });

  const { data, isLoading, error, refetch } =
    trpc.notification.getUnreadCount.useQuery(
      { userId },
      {
        enabled: enabled && !!userId,
        refetchInterval: connected ? 60000 : refetchInterval, // Longer interval when WebSocket is connected
        refetchOnWindowFocus: true,
        staleTime: connected ? 30000 : 10000, // Longer stale time when WebSocket is connected
      },
    );

  // Function to manually update count (for optimistic updates)
  const updateCount = (newCount: number) => {
    setCount(newCount);
  };

  // Function to increment count (when new notification arrives)
  const incrementCount = (increment = 1) => {
    setCount((prev) => prev + increment);
  };

  // Function to decrement count (when notification is read)
  const decrementCount = (decrement = 1) => {
    setCount((prev) => Math.max(0, prev - decrement));
  };

  // Function to reset count to 0
  const resetCount = () => {
    setCount(0);
  };

  // Sync local state with server data when it changes
  useEffect(() => {
    if (data !== undefined && data !== null) {
      setCount(
        typeof data === 'object' && 'count' in data
          ? (data as any).count
          : (data as number),
      );
    }
  }, [data]);

  return {
    count,
    isLoading,
    error,
    refetch,
    updateCount,
    incrementCount,
    decrementCount,
    resetCount,
    connected, // Add WebSocket connection status
  };
}
