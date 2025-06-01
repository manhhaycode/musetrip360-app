import { cva } from 'class-variance-authority';

// Badge variants matching the design system structure
export const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
    'border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-800 border-primary-200',
        secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
        success: 'bg-success-100 text-success-800 border-success-200',
        warning: 'bg-warning-100 text-warning-800 border-warning-200',
        error: 'bg-error-100 text-error-800 border-error-200',
        neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
        outline: 'bg-transparent text-neutral-700 border-neutral-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
