import { Button } from '@musetrip360/ui-core/button';
import { Bell } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';
import { NotificationPopover } from './NotificationPopover';
import { notificationBellVariants, notificationBadgeVariants } from './notification.variants';
import { NotificationBellProps } from './notification.types';

export function NotificationBell({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  className,
  badgeVariant = 'default',
  showBadgeWhenZero = false,
}: NotificationBellProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const shouldShowBadge = unreadCount > 0 || showBadgeWhenZero;

  return (
    <NotificationPopover
      notifications={notifications}
      isLoading={isLoading}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={onMarkAllAsRead}
      onRemove={onRemove}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(notificationBellVariants(), className)}
        title={`${unreadCount} unread notifications`}
      >
        <>
          <Bell className="h-5 w-5" />
          {shouldShowBadge && (
            <div className={cn(notificationBadgeVariants({ variant: badgeVariant }))}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </>
      </Button>
    </NotificationPopover>
  );
}
