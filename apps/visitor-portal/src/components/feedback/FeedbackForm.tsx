/* eslint-disable no-undef */
'use client';

import { useState } from 'react';
import { useCreateFeedback } from '@musetrip360/shared';
import { FeedbackCreate } from '@musetrip360/shared';
import { useAuthStore } from '@musetrip360/auth-system';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Button } from '@musetrip360/ui-core/button';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@musetrip360/ui-core/utils';
import { getQueryClient } from '@musetrip360/query-foundation';

interface FeedbackFormProps {
  targetId: string;
  targetType: string;
  targetName?: string;
  onSuccess?: () => void;
  className?: string;
}

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-6 w-6 cursor-pointer transition-colors',
            index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 hover:text-yellow-400',
            readonly && 'cursor-default'
          )}
          onClick={() => !readonly && onRatingChange?.(index + 1)}
        />
      ))}
    </div>
  );
};

export function FeedbackForm({ targetId, targetType, onSuccess, className }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { accessToken } = useAuthStore();
  const isAuthenticated = !!accessToken;
  const createFeedbackMutation = useCreateFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !content.trim()) return;

    const feedbackData: FeedbackCreate = {
      targetId,
      target: targetType,
      comment: content.trim(),
      rating,
    };

    try {
      await createFeedbackMutation.mutateAsync(feedbackData);
      setIsSubmitted(true);
      setRating(0);
      setContent('');
      onSuccess?.();

      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
      const queryClient = getQueryClient();
      queryClient.invalidateQueries({
        queryKey: ['feedback'],
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const isValid = rating > 0 && content.trim().length > 0;

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>Vui lòng đăng nhập để có thể đánh giá</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Alert className={cn('border-green-200 bg-green-50', className)}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Cảm ơn bạn đã chia sẻ đánh giá! Đánh giá của bạn đã được gửi thành công.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <StarRating rating={rating} onRatingChange={setRating} />
            {rating > 0 && (
              <p className="text-xs text-gray-600">
                {rating === 1 && 'Rất không hài lòng'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Rất hài lòng'}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="feedback-content" className="text-sm font-medium">
              Chia sẻ trải nghiệm của bạn <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="feedback-content"
              placeholder="Hãy chia sẻ những gì bạn nghĩ về trải nghiệm này..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">{content.length}/500 ký tự</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button type="submit" disabled={!isValid || createFeedbackMutation.isPending} className="flex-1">
              {createFeedbackMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Gửi đánh giá
                </>
              )}
            </Button>

            {content && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setContent('');
                  setRating(0);
                }}
              >
                Xóa
              </Button>
            )}
          </div>

          {/* Error Message */}
          {createFeedbackMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
