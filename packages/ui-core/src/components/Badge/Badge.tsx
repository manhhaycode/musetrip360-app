import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { badgeVariants } from './Badge.variants';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, size, ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
));

Badge.displayName = 'Badge';

export { Badge };
