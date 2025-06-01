import { cva } from 'class-variance-authority';

export const selectVariants = cva(['relative inline-block w-full'], {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const selectTriggerVariants = cva(
  [
    'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors',
    'placeholder:text-neutral-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-neutral-300 bg-white',
          'hover:border-neutral-400 focus:border-primary-500 focus:ring-primary-500',
        ],
        error: ['border-error-500 bg-white', 'focus:border-error-500 focus:ring-error-500'],
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
