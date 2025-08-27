import { cva } from 'class-variance-authority';

export const notificationItemVariants = cva(
  'flex items-start gap-2 p-2 transition-colors cursor-pointer hover:bg-accent/50',
  {
    variants: {
      variant: {
        default: 'bg-background border-border',
        unread: 'bg-primary/5 border-primary/20',
        read: 'bg-muted/50 border-border opacity-80',
      },
      size: {
        sm: 'p-1.5 gap-1.5',
        default: 'p-2 gap-2',
        lg: 'p-3 gap-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const notificationListVariants = cva('flex flex-col gap-0.5 w-full', {
  variants: {
    variant: {
      default: '',
      compact: 'gap-0',
      spaced: 'gap-1',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const notificationPopoverVariants = cva('w-80 max-w-sm p-0 overflow-hidden', {
  variants: {
    size: {
      sm: 'w-64',
      default: 'w-80',
      lg: 'w-96',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const notificationBellVariants = cva('relative inline-flex', {
  variants: {
    variant: {
      default: '',
      outline: '',
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const notificationBadgeVariants = cva(
  'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-medium rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-primary text-primary bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
