import { cva } from 'class-variance-authority';

export const spinnerVariants = cva(
  [
    'animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
    'motion-reduce:animate-[spin_1.5s_linear_infinite]',
  ],
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-primary-500',
        secondary: 'text-neutral-400',
        white: 'text-white',
        inherit: 'text-inherit',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);
