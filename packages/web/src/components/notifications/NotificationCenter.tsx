'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function NotificationCenter() {
  const queryClient = useQueryClient();
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => trpc.notifications.findAll.query(),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => trpc.notifications.markAsRead.mutate({ notificationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <div>
      <Bell />
      <span>{notifications.filter(n => !n.read).length}</span>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            <p>{notification.message}</p>
            {!notification.read && (
              <Button onClick={() => markAsReadMutation.mutate(notification.id)}>Mark as Read</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
