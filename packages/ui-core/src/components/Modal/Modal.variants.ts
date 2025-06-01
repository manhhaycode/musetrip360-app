import { cva } from 'class-variance-authority';

export const modalVariants = cva(
  ['relative w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl', 'transform transition-all'],
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-none mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
