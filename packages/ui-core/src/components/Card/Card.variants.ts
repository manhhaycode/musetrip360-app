import { cva } from 'class-variance-authority';

// Card variants matching the design system structure
export const cardVariants = cva(
  [
    'rounded-lg border bg-white shadow-sm transition-shadow',
    'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        default: 'border-neutral-200',
        interactive: ['border-neutral-200 hover:border-neutral-300 hover:shadow-md', 'cursor-pointer'],
        elevated: 'border-neutral-200 shadow-lg',
        outlined: 'border-2 border-primary-200 bg-primary-50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);
