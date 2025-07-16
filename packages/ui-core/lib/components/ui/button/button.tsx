import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button.variants';
import { cn } from '@/libs/utils';

function Button({
  className,
  variant,
  size,
  asChild = false,
  leftIcon,
  rightIcon,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {leftIcon}
      {props.children}
      {rightIcon}
    </Comp>
  );
}

export { Button };
