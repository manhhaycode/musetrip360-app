/* eslint-disable import/no-extraneous-dependencies */
'use client';

import { Feedback, useFeedback } from '@musetrip360/shared';
import { FeedbackSearchParams } from '@musetrip360/shared';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { AlertCircle, Star, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@musetrip360/ui-core/utils';
import get from 'lodash/get';

interface FeedbackListProps {
  targetId: string;
  targetType: string;
  className?: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn('h-4 w-4', index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300')}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function FeedbackList({ targetId, targetType, className }: FeedbackListProps) {
  const feedbackParams: FeedbackSearchParams = {
    targetId,
    targetType,
    Page: 1,
    PageSize: 100,
  };

  const { data: feedbackResponse, isLoading, error } = useFeedback(feedbackParams);

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Không thể tải đánh giá. Vui lòng thử lại sau.</AlertDescription>
      </Alert>
    );
  }

  const feedbacks = get(feedbackResponse, 'list', []) as Feedback[];

  if (feedbacks.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Chưa có đánh giá nào</p>
            <p className="text-sm">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average rating
  const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(averageRating)} />
            </div>
            <div className="text-sm text-gray-600">
              <p>{feedbacks.length} đánh giá</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-3">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id}>
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* User Avatar */}
                <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-primary/10">
                  {feedback.createdByUser?.avatarUrl ? (
                    <Image
                      src={feedback.createdByUser.avatarUrl}
                      alt={feedback.createdByUser.fullName || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-medium">
                      {(
                        feedback.createdByUser?.fullName?.[0] ||
                        feedback.createdByUser?.username?.[0] ||
                        '?'
                      ).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Feedback Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {feedback.createdByUser?.fullName || feedback.createdByUser?.username || 'Người dùng ẩn danh'}
                    </h4>
                    <StarRating rating={feedback.rating} />
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-2">{feedback.comment}</p>

                  <p className="text-xs text-gray-500">{formatDateTime(feedback.updatedAt.toString())}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
