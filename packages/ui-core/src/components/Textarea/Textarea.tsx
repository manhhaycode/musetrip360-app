import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { textareaVariants } from './Textarea.variants';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      resize,
      label,
      error,
      helperText,
      maxLength,
      showCharacterCount = false,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const actualVariant = hasError ? 'error' : variant;
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-neutral-900">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            className={cn(textareaVariants({ variant: actualVariant, size, resize }), className)}
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            {...props}
          />

          {showCharacterCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-neutral-500 bg-white px-1 rounded">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mt-1">
          <div>
            {(error || helperText) && (
              <p className={cn('text-xs', hasError ? 'text-error-600' : 'text-neutral-600')}>{error || helperText}</p>
            )}
          </div>

          {showCharacterCount && !maxLength && <p className="text-xs text-neutral-500">{currentLength} characters</p>}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
