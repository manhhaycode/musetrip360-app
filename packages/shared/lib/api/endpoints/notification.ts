/**
 * @fileoverview notification management
 *
 * API endpoints for notification management.
 */

import { Notification, NotificationSearchParams, UpdateReadNotification } from '@/types';
import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';

export const notificationEndpoints = {
  notification: 'messaging/notifications',
  readNotification: 'messaging/notifications/read',
};

export const getNotifications = async (params: NotificationSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Notification> & { totalUnread: number }>>(
    notificationEndpoints.notification,
    { params }
  );
  return response.data;
};

export const updateReadNotification = async (data: UpdateReadNotification) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Notification>>(notificationEndpoints.readNotification, data);
  return response.data;
};
