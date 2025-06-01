import { cva } from 'class-variance-authority';

// Button variants matching the design system structure
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: ['bg-primary-500 text-white shadow hover:bg-primary-600', 'focus-visible:ring-primary-500'],
        secondary: [
          'bg-transparent border border-neutral-300 text-neutral-900',
          'hover:bg-neutral-100 focus-visible:ring-neutral-500',
        ],
        ghost: ['bg-transparent text-neutral-700 hover:bg-neutral-100', 'focus-visible:ring-neutral-500'],
        destructive: ['bg-error-500 text-white shadow hover:bg-error-600', 'focus-visible:ring-error-500'],
        outline: [
          'bg-transparent border border-primary-500 text-primary-700',
          'hover:bg-primary-50 focus-visible:ring-primary-500',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);
