import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@musetrip360/ui-core/popover';
import { Separator } from '@musetrip360/ui-core/separator';
import { cn } from '@musetrip360/ui-core';
import { NotificationList } from './NotificationList';
import { notificationPopoverVariants } from './notification.variants';
import { NotificationPopoverProps } from './notification.types';

export function NotificationPopover({
  notifications,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
  className,
  children,
}: NotificationPopoverProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cn(notificationPopoverVariants(), className)} align="end" sideOffset={4}>
        {/* Popover header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-base">Notifications</h3>
            {unreadCount > 0 && <span className="text-xs text-muted-foreground">({unreadCount} new)</span>}
          </div>
        </div>

        <Separator />

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* Notification list */
          <NotificationList
            notifications={notifications}
            onMarkAsRead={onMarkAsRead}
            onMarkAllAsRead={onMarkAllAsRead}
            onRemove={onRemove}
            maxHeight="350px"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
