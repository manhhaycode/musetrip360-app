import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Separator } from '@musetrip360/ui-core/separator';
import { CheckCheck, Bell } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';
import { NotificationItem } from './NotificationItem';
import { notificationListVariants } from './notification.variants';
import { NotificationListProps } from './notification.types';

export function NotificationList({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  className,
  emptyMessage = 'No notifications',
  maxHeight = '400px',
}: NotificationListProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasNotifications = notifications.length > 0;
  const hasUnreadNotifications = unreadCount > 0;

  if (!hasNotifications) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header with mark all as read */}
      {hasUnreadNotifications && onMarkAllAsRead && (
        <>
          <div className="flex items-center justify-between p-3 pb-2">
            <span className="text-sm font-medium text-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAllAsRead}>
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          </div>
          <Separator />
        </>
      )}

      {/* Notification list */}
      <ScrollArea className="flex-1 overflow-y-auto mr-0" style={{ maxHeight }}>
        <div className={cn(notificationListVariants(), className)}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <NotificationItem notification={notification} onMarkAsRead={onMarkAsRead} onRemove={onRemove} />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
