import { cva } from 'class-variance-authority';

export const progressVariants = cva(['relative h-2 w-full overflow-hidden rounded-full bg-neutral-200'], {
  variants: {
    size: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
    },
    variant: {
      default: 'bg-neutral-200',
      success: 'bg-success-200',
      warning: 'bg-warning-200',
      error: 'bg-error-200',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

export const progressIndicatorVariants = cva(
  ['h-full w-full flex-1 bg-primary-500 transition-all duration-300 ease-in-out'],
  {
    variants: {
      variant: {
        default: 'bg-primary-500',
        success: 'bg-success-500',
        warning: 'bg-warning-500',
        error: 'bg-error-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
