import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  [
    'peer h-4 w-4 shrink-0 rounded-sm border border-neutral-300',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=checked]:text-white',
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
