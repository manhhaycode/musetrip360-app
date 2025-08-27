import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Badge } from '@musetrip360/ui-core/badge';
import { Check, X, Dot, Clock } from 'lucide-react';
import { cn } from '@musetrip360/ui-core';
import { notificationItemVariants } from './notification.variants';
import { NotificationItemProps } from './notification.types';

export function NotificationItem({ notification, onMarkAsRead, onRemove, className }: NotificationItemProps) {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(notification.id);
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div
      className={cn(
        notificationItemVariants({
          variant: notification.isRead ? 'read' : 'unread',
        }),
        className
      )}
    >
      {/* Status indicator */}
      <div className="flex-shrink-0 mt-1">
        {!notification.isRead ? <Dot className="h-3 w-3 text-primary" /> : <div className="h-3 w-3" />}
      </div>

      {/* Notification content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-xs font-medium text-foreground truncate leading-tight">{notification.title}</h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge
              variant="outline"
              className={cn('text-xs h-4 px-1 py-0', getNotificationTypeColor(notification.type))}
            >
              {notification.type}
            </Badge>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-1 leading-tight">{notification.message}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span className="text-xs">{formatTimeAgo(new Date(notification.createdAt))}</span>
            {notification.readAt && <span className="text-xs text-green-600 ml-1">✓</span>}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-0.5">
            {!notification.isRead && onMarkAsRead && (
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={handleMarkAsRead} title="Mark as read">
                <Check className="h-2.5 w-2.5" />
              </Button>
            )}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                onClick={handleRemove}
                title="Remove notification"
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
