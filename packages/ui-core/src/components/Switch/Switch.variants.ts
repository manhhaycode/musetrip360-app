import { cva } from 'class-variance-authority';

export const switchVariants = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-300',
  ],
  {
    variants: {
      size: {
        sm: 'h-4 w-7',
        md: 'h-5 w-9',
        lg: 'h-6 w-11',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const switchThumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform',
    'data-[state=checked]:translate-x-full data-[state=unchecked]:translate-x-0',
  ],
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
