import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'placeholder:text-neutral-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-none',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-neutral-300 bg-white',
          'hover:border-neutral-400 focus-visible:border-primary-500 focus-visible:ring-primary-500',
        ],
        error: [
          'border-error-500 bg-white text-error-900',
          'focus-visible:border-error-500 focus-visible:ring-error-500',
        ],
        success: [
          'border-success-500 bg-white text-success-900',
          'focus-visible:border-success-500 focus-visible:ring-success-500',
        ],
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      resize: 'vertical',
    },
  }
);
