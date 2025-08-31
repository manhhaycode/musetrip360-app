import { useNotifications, useMarkAsRead } from '@/api';
import { Notification } from '@/types';

import { NotificationBell } from './NotificationBell';
import { toast } from 'sonner';
import get from 'lodash/get';

export function NotificationExample() {
  // Example using your existing hooks
  const { data: notificationsData, isLoading } = useNotifications({
    Page: 1,
    PageSize: 20,
  });

  const notifications = get(notificationsData, 'data', []) as Notification[];

  const markAsReadMutation = useMarkAsRead({
    onSuccess: () => {
      toast.success('Notification marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Mark as read error:', error);
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate({ notificationId: id, isRead: true });
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    unreadNotifications.forEach((notification: Notification) => {
      markAsReadMutation.mutate({ notificationId: notification.id, isRead: true });
    });
  };

  const handleRemove = (id: string) => {
    // You'll need to implement a delete notification API hook
    // For now, just show a toast
    toast.info('Remove notification functionality needs to be implemented');
    console.log('Remove notification:', id);
  };

  return (
    <NotificationBell
      notifications={notifications}
      isLoading={isLoading}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onRemove={handleRemove}
      badgeVariant="default"
    />
  );
}

// Usage in your app:
// import { NotificationExample } from '@musetrip360/shared/ui/components/notification';
// <NotificationExample />
