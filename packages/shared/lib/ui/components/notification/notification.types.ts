import { Notification } from '@/types';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onRemove?: (id: string) => void;
  className?: string;
  emptyMessage?: string;
  maxHeight?: string;
}

export interface NotificationPopoverProps {
  notifications: Notification[];
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onRemove?: (id: string) => void;
  className?: string;
  children: React.ReactNode;
}

export interface NotificationBellProps {
  notifications: Notification[];
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onRemove?: (id: string) => void;
  className?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  showBadgeWhenZero?: boolean;
}
