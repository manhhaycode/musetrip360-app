/* eslint-disable import/no-extraneous-dependencies */
import { useNotifications, useMarkAsRead, NotificationBell, Notification } from '@musetrip360/shared';
import { toast } from 'sonner';
import get from 'lodash/get';

export function NotificationBellContainer() {
  const { data: notificationsData, isLoading } = useNotifications({
    Page: 1,
    PageSize: 1000,
  });

  const notifications = get(notificationsData, 'list', []) as Notification[];

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

    if (unreadNotifications.length === 0) {
      toast.info('No unread notifications to mark');
      return;
    }

    unreadNotifications.forEach((notification: Notification) => {
      markAsReadMutation.mutate({ notificationId: notification.id, isRead: true });
    });

    toast.success(`Marked ${unreadNotifications.length} notifications as read`);
  };

  const handleRemove = (id: string) => {
    toast.info('Remove notification functionality needs to be implemented in the API');
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
