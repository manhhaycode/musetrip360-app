import { cva } from 'class-variance-authority';

export const alertVariants = cva(
  [
    'relative w-full rounded-lg border px-4 py-3 text-sm',
    '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  ],
  {
    variants: {
      variant: {
        default: 'bg-neutral-50 text-neutral-900 border-neutral-200',
        info: 'bg-primary-50 text-primary-900 border-primary-200',
        success: 'bg-success-50 text-success-900 border-success-200',
        warning: 'bg-warning-50 text-warning-900 border-warning-200',
        error: 'bg-error-50 text-error-900 border-error-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
