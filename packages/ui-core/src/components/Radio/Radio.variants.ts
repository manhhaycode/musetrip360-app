import { cva } from 'class-variance-authority';

export const radioVariants = cva(
  [
    'aspect-square h-4 w-4 rounded-full border border-neutral-300 text-primary-500',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      variant: {
        default: '',
        error: 'border-error-500 focus:ring-error-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
