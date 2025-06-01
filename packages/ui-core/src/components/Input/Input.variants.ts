import { cva } from 'class-variance-authority';

// Input variants matching the design system structure
export const inputVariants = cva(
  [
    'flex w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'placeholder:text-neutral-500',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
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
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
